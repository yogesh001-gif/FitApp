import { calculateNutritionTargets, summarizeNutritionIntake, type UserProfileInput } from '../metrics';

export function buildDashboardSummary(profile: UserProfileInput, intake: { calories?: number; protein?: number; carbohydrates?: number; fat?: number; fiber?: number }) {
  const targets = calculateNutritionTargets(profile);
  const progress = summarizeNutritionIntake(targets, intake);

  return {
    targets,
    progress
  };
}
