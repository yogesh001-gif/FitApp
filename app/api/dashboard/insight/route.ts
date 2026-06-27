import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../../lib/db';
import { FoodLogModel, ProgressLogModel, UserModel, WaterLogModel, WorkoutPlanModel } from '../../../../lib/models';
import { getDashboardData } from '../../../../lib/services/dashboard-service';
import { getDashboardMetrics } from '../../../../lib/dashboard-metrics';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const user = await UserModel.findOne({ clerkUserId: userId });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // 1. Find the latest activity timestamp
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [latestFood, latestWater, latestProgress, latestWorkout] = await Promise.all([
    FoodLogModel.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('createdAt').lean() as Promise<{ createdAt?: Date } | null>,
    WaterLogModel.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('createdAt').lean() as Promise<{ createdAt?: Date } | null>,
    ProgressLogModel.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('createdAt').lean() as Promise<{ createdAt?: Date } | null>,
    WorkoutPlanModel.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('createdAt').lean() as Promise<{ createdAt?: Date } | null>
  ]);

  const dates = [
    latestFood?.createdAt,
    latestWater?.createdAt,
    latestProgress?.createdAt,
    latestWorkout?.createdAt
  ].filter(Boolean) as Date[];

  const latestActivityDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date(0);

  // 2. Check Cache
  const lastGenerated = user.lastBriefingGeneratedAt ? new Date(user.lastBriefingGeneratedAt) : new Date(0);
  
  if (user.cachedBriefing && lastGenerated >= latestActivityDate) {
    return NextResponse.json({ text: user.cachedBriefing, cached: true });
  }

  // 3. Generate New Insight if no cache or activity is newer
  const dashboardData = await getDashboardData(userId);
  if (!dashboardData) return NextResponse.json({ error: 'No data' }, { status: 404 });

  const { foodLogs, waterLogs, progressLogs } = dashboardData;
  
  const profile = {
    age: user.age ?? 30,
    gender: (user.gender ?? 'prefer_not_to_say') as any,
    heightCm: user.heightCm ?? 175,
    weightKg: user.weightKg ?? 75,
    goal: (user.goal ?? 'maintenance') as any,
    activityLevel: (user.activityLevel ?? 'moderately_active') as any
  };

  const { targets, dailyTotals, progress } = getDashboardMetrics(profile, foodLogs, waterLogs, progressLogs);

  const prompt = `You are the user's elite AI fitness coach. Write a punchy, engaging 2-sentence daily briefing for their dashboard.
User: ${user.name || 'Athlete'}
Goal: ${user.goal?.replace(/_/g, ' ')}

Today's Macros (Consumed / Target):
Calories: ${Math.round(dailyTotals.calories)} / ${targets.calorieTarget}
Protein: ${Math.round(dailyTotals.protein)}g / ${targets.proteinTarget}g
Fat: ${Math.round(dailyTotals.fat)}g / ${targets.fatTarget}g
Carbs: ${Math.round(dailyTotals.carbohydrates)}g / ${targets.carbohydrateTarget}g

Rules:
1. First sentence: A short, motivational greeting.
2. Second sentence: A highly specific, actionable tip based on their macros so far today. If they ate too much fat, warn them. If they need protein, tell them to prioritize it. If they are on track, praise them.
3. Keep it to exactly 2 sentences. No formatting, just raw text.
4. Tone: Premium, expert coach, supportive but direct.`;

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    });

    const newInsight = result.text.trim();

    // Cache it
    await UserModel.updateOne(
      { _id: user._id },
      { 
        $set: { 
          cachedBriefing: newInsight,
          lastBriefingGeneratedAt: new Date()
        } 
      }
    );

    return NextResponse.json({ text: newInsight, cached: false });
  } catch (error) {
    console.error("Insight generation failed:", error);
    // Fallback if AI fails
    return NextResponse.json({ text: `Good to see you, ${user.name || 'Athlete'}! Keep pushing towards your ${user.goal?.replace(/_/g, ' ')} goal today.`, cached: false });
  }
}
