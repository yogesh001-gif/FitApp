import { auth, currentUser } from '@clerk/nextjs/server';
import { connectToDatabase } from '../db';
import { calculateNutritionTargets } from '../metrics';
import { UserModel } from '../models';

export async function ensureUserRecord() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error('User not found');

  await connectToDatabase();

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@placeholder.local`;
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || email;

  return UserModel.findOneAndUpdate(
    { clerkUserId: userId },
    {
      clerkUserId: userId,
      email,
      name
    },
    { new: true, upsert: true }
  );
}

export async function syncOnboardingTargets(profile: {
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  heightCm: number;
  weightKg: number;
  goal: 'weight_loss' | 'muscle_gain' | 'body_recomposition' | 'maintenance';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';
  name: string;
  waterGoalOz?: number;
}) {
  const user = await ensureUserRecord();
  const targets = calculateNutritionTargets(profile);

  return UserModel.findByIdAndUpdate(
    user._id,
    {
      ...profile,
      onboardingComplete: true,
      bmi: targets.bmi,
      bmr: targets.bmr,
      tdee: targets.tdee,
      calorieTarget: targets.calorieTarget,
      proteinTarget: targets.proteinTarget,
      carbohydrateTarget: targets.carbohydrateTarget,
      fatTarget: targets.fatTarget,
      fiberTarget: targets.fiberTarget,
      waterGoalOz: profile.waterGoalOz ?? Math.round(profile.weightKg * 0.67)
    },
    { new: true }
  );
}
