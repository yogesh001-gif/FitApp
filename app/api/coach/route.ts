import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../lib/db';
import { ChatHistoryModel, FoodLogModel, ProgressLogModel, UserModel, WorkoutPlanModel, type UserRecord } from '../../../lib/models';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { messages } = await req.json() as { messages: any[] };
  if (!messages || messages.length === 0) return Response.json({ error: 'Messages are required' }, { status: 400 });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  // Get Context
  const [recentFood, recentWorkouts, recentProgress] = await Promise.all([
    FoodLogModel.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3).lean(),
    WorkoutPlanModel.find({ userId: user._id }).sort({ createdAt: -1 }).limit(2).lean(),
    ProgressLogModel.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3).lean()
  ]);

  const extractText = (msg: any) => {
    if (typeof msg.content === 'string' && msg.content.trim() !== '') return msg.content;
    if (Array.isArray(msg.parts) && msg.parts.length > 0) {
      return msg.parts.map((p: any) => p.text || '').join('');
    }
    if (typeof msg.text === 'string' && msg.text.trim() !== '') return msg.text;
    if (typeof msg.message === 'string' && msg.message.trim() !== '') return msg.message;
    return 'Empty message';
  };

  const latestMessage = messages[messages.length - 1];
  const userMessageText = extractText(latestMessage);

  // Save the user's message immediately
  await ChatHistoryModel.create({
    userId: user._id,
    role: 'user',
    message: userMessageText,
    contextSnapshot: { recentFood, recentWorkouts, recentProgress }
  });

  const systemPrompt = `You are the FITMITRA AI Coach, a highly sought-after, elite personal trainer and nutritionist. 
You are speaking directly to your client, ${user.name || 'Athlete'}. 
Their current goal is: ${user.goal?.replace(/_/g, ' ')}.
Their current weight is: ${user.weightKg}kg.

Here is their recent activity context to help you give highly personalized advice:
- Recent Food Logs: ${recentFood.length ? JSON.stringify(recentFood.map(f => ({ meal: f.mealLabel || 'Meal', calories: f.summary?.calories, protein: f.summary?.protein, fat: f.summary?.fat, carbs: f.summary?.carbs }))) : 'No recent food logs.'}
- Recent Workouts: ${recentWorkouts.length ? JSON.stringify(recentWorkouts.map(w => ({ type: w.type, completed: w.completed }))) : 'No recent workouts logged.'}
- Recent Progress (Weight/Measurements): ${recentProgress.length ? JSON.stringify(recentProgress.map(p => ({ date: p.createdAt, weight: p.weightKg }))) : 'No recent progress logged.'}

Instructions for your persona:
1. Act like a real, top-tier human coach. Be encouraging, highly knowledgeable, and direct. 
2. Use a conversational, motivational, yet professional tone. 
3. Reference their recent data organically if it makes sense.
4. PROACTIVE MACRO ADVICE: Carefully analyze their recent food logs. If you notice they consumed too much fat, carbs, or missed their protein target relative to their goal, proactively advise them on how to adjust their NEXT meal (e.g., "Your last meal was a bit high in fat, so let's keep the next one leaner with chicken and veggies").
5. Keep your responses concise and punchy. No long essays unless specifically asked.
6. Use markdown formatting (bolding key terms, bullet points for steps).
7. Never break character. You are their dedicated human-like coach inside the FitMitra workspace.`;

  const coreMessages = messages.map((m: any) => ({
    role: m.role,
    content: extractText(m),
  }));

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: coreMessages,
    async onFinish({ text }) {
      // Save the AI's response to the database after the stream completes
      try {
        await tryConnectToDatabase();
        await ChatHistoryModel.create({
          userId: user._id,
          role: 'assistant',
          message: text,
        });
      } catch (err) {
        console.error("Failed to save coach response:", err);
      }
    },
  });

  return (result as any).toDataStreamResponse ? (result as any).toDataStreamResponse() : result.toTextStreamResponse();
}

