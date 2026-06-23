import { ACTIVITY_MULTIPLIERS, FAT_CALORIE_SHARE, FIBER_GRAMS_PER_1000_CALORIES, GOAL_CALORIE_MODIFIERS, PROTEIN_GRAMS_PER_KG } from './constants';

export type Goal = 'weight_loss' | 'muscle_gain' | 'body_recomposition' | 'maintenance';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';
export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export type UserProfileInput = {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
};

export function calculateBmi(weightKg: number, heightCm: number) {
  return weightKg / Math.pow(heightCm / 100, 2);
}

export function calculateBmr(profile: UserProfileInput) {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  if (profile.gender === 'male') return base + 5;
  if (profile.gender === 'female') return base - 161;
  return base - 78;
}

export function calculateTdee(profile: UserProfileInput) {
  return calculateBmr(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel];
}

export function calculateNutritionTargets(profile: UserProfileInput) {
  const tdee = calculateTdee(profile);
  const calorieTarget = Math.round(tdee * (1 + GOAL_CALORIE_MODIFIERS[profile.goal]));
  const proteinTarget = Math.round(profile.weightKg * PROTEIN_GRAMS_PER_KG[profile.goal]);
  const fatTarget = Math.round((calorieTarget * FAT_CALORIE_SHARE[profile.goal]) / 9);
  const remainingCaloriesAfterProteinFat = Math.max(calorieTarget - proteinTarget * 4 - fatTarget * 9, 0);
  const carbohydrateTarget = Math.round(remainingCaloriesAfterProteinFat / 4);
  const fiberTarget = Math.round((calorieTarget / 1000) * FIBER_GRAMS_PER_1000_CALORIES);

  return {
    bmi: Number(calculateBmi(profile.weightKg, profile.heightCm).toFixed(1)),
    bmr: Math.round(calculateBmr(profile)),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinTarget,
    carbohydrateTarget,
    fatTarget,
    fiberTarget
  };
}

export function summarizeNutritionIntake(targets: ReturnType<typeof calculateNutritionTargets>, intake: { calories?: number; protein?: number; carbohydrates?: number; fat?: number; fiber?: number }) {
  const consumedCalories = intake.calories ?? 0;
  const consumedProtein = intake.protein ?? 0;
  const consumedCarbohydrates = intake.carbohydrates ?? 0;
  const consumedFat = intake.fat ?? 0;
  const consumedFiber = intake.fiber ?? 0;

  return {
    calories: {
      consumed: consumedCalories,
      target: targets.calorieTarget,
      remaining: targets.calorieTarget - consumedCalories,
      completion: Math.min((consumedCalories / targets.calorieTarget) * 100, 100)
    },
    protein: {
      consumed: consumedProtein,
      target: targets.proteinTarget,
      remaining: targets.proteinTarget - consumedProtein,
      completion: Math.min((consumedProtein / targets.proteinTarget) * 100, 100)
    },
    carbohydrates: {
      consumed: consumedCarbohydrates,
      target: targets.carbohydrateTarget,
      remaining: targets.carbohydrateTarget - consumedCarbohydrates,
      completion: Math.min((consumedCarbohydrates / targets.carbohydrateTarget) * 100, 100)
    },
    fat: {
      consumed: consumedFat,
      target: targets.fatTarget,
      remaining: targets.fatTarget - consumedFat,
      completion: Math.min((consumedFat / targets.fatTarget) * 100, 100)
    },
    fiber: {
      consumed: consumedFiber,
      target: targets.fiberTarget,
      remaining: targets.fiberTarget - consumedFiber,
      completion: Math.min((consumedFiber / targets.fiberTarget) * 100, 100)
    }
  };
}
