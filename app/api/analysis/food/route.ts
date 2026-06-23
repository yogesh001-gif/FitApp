import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../../lib/db';
import { foodLogSchema } from '../../../../lib/validators';
import { buildFoodAnalysisPrompt } from '../../../../lib/prompts';
import { generateJsonFromGemini } from '../../../../lib/gemini';
import { nutritionAnalysisSchema } from '../../../../lib/ai-schemas';
import { FoodLogModel, UserModel, type UserRecord } from '../../../../lib/models';
import { calculateNutritionTargets, summarizeNutritionIntake } from '../../../../lib/metrics';
import { buildNutritionRecommendations } from '../../../../lib/services/recommendations';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const parsed = foodLogSchema.parse({
    rawInput: formData.get('rawInput'),
    mealLabel: formData.get('mealLabel') || undefined
  });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable', details: dbStatus.error }, { status: 503 });
  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const profile = {
    age: user.age ?? 30,
    gender: (user.gender ?? 'prefer_not_to_say') as 'male' | 'female' | 'non_binary' | 'prefer_not_to_say',
    heightCm: user.heightCm ?? 175,
    weightKg: user.weightKg ?? 75,
    goal: (user.goal ?? 'maintenance') as 'weight_loss' | 'muscle_gain' | 'body_recomposition' | 'maintenance',
    activityLevel: (user.activityLevel ?? 'moderately_active') as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete'
  };

  const targets = calculateNutritionTargets(profile);
  const profileSummary = `Age ${profile.age}, gender ${profile.gender}, height ${profile.heightCm}cm, weight ${profile.weightKg}kg, goal ${profile.goal}, activity ${profile.activityLevel}, targets ${JSON.stringify(targets)}`;
  const prompt = buildFoodAnalysisPrompt({ rawInput: parsed.rawInput, profileSummary });
  const analysis = await generateJsonFromGemini(prompt, (value) => nutritionAnalysisSchema.parse(value));
  const totals = summarizeNutritionIntake(targets, analysis.summary);
  const recommendations = buildNutritionRecommendations({ goal: profile.goal, targets: totals });

  const stored = await FoodLogModel.create({
    userId: user._id,
    rawInput: parsed.rawInput,
    mealLabel: parsed.mealLabel,
    items: analysis.items,
    summary: analysis.summary,
    confidence: analysis.confidence,
    assumptions: analysis.assumptions
  });

  return Response.json({
    log: stored,
    analysis,
    targets,
    progress: totals,
    recommendations
  });
}
