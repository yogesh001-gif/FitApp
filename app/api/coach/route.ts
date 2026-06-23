import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../lib/db';
import { ChatHistoryModel, FoodLogModel, ProgressLogModel, UserModel, WorkoutPlanModel, type UserRecord } from '../../../lib/models';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

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

  const latestMessage = messages[messages.length - 1];

  // Save the user's message immediately
  await ChatHistoryModel.create({
    userId: user._id,
    role: 'user',
    message: latestMessage.content,
    contextSnapshot: { recentFood, recentWorkouts, recentProgress }
  });

  const systemPrompt = `You are the FITAPP AI Coach. You are speaking to ${user.name}.
Their goal is: ${user.goal}. Current weight: ${user.weightKg}kg.
Recent activity context:
Food Logs: ${JSON.stringify(recentFood)}
Workouts: ${JSON.stringify(recentWorkouts)}
Progress: ${JSON.stringify(recentProgress)}

Be extremely concise, professional, and act as a highly paid fitness coach. Use markdown formatting.`;

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
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

