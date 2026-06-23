import { calculateNutritionTargets, summarizeNutritionIntake, type UserProfileInput } from './metrics';

export function calculateDailyTotals(foodLogs: any[]) {
  return foodLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.summary?.calories ?? 0),
      protein: acc.protein + (log.summary?.protein ?? 0),
      carbohydrates: acc.carbohydrates + (log.summary?.carbohydrates ?? 0),
      fat: acc.fat + (log.summary?.fat ?? 0),
      fiber: acc.fiber + (log.summary?.fiber ?? 0)
    }),
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }
  );
}

export function getDashboardMetrics(
  profile: UserProfileInput,
  foodLogs: any[],
  waterLogs: any[],
  progressLogs: any[]
) {
  const targets = calculateNutritionTargets(profile);
  const dailyTotals = calculateDailyTotals(foodLogs);
  const progress = summarizeNutritionIntake(targets, dailyTotals);
  
  const waterTotal = waterLogs.reduce((sum, entry) => sum + (entry.ounces ?? 0), 0);
  const latestWeight = progressLogs[0]?.weightKg ?? profile.weightKg ?? 0;
  const previousWeight = progressLogs[1]?.weightKg ?? latestWeight;
  const weightDelta = latestWeight - previousWeight;

  return {
    targets,
    dailyTotals,
    progress,
    waterTotal,
    latestWeight,
    weightDelta
  };
}
