import { summarizeNutritionIntake } from '../metrics';

export function buildNutritionRecommendations(params: {
  goal: string;
  targets: ReturnType<typeof summarizeNutritionIntake>;
}) {
  const recommendations: string[] = [];

  if (params.targets.protein.completion < 80) {
    recommendations.push(`Protein intake is behind target. Add lean protein or a higher-protein meal to close the ${Math.round(params.targets.protein.remaining)}g gap.`);
  }

  if (params.targets.fiber.completion < 70) {
    recommendations.push(`Fiber is low relative to target. Increase vegetables, legumes, berries, and whole grains to move toward ${params.targets.fiber.target}g.`);
  }

  if (params.targets.calories.remaining > 0 && params.goal === 'weight_loss') {
    recommendations.push('You still have room in your calorie budget; prioritize high-satiety foods that help control hunger without overshooting intake.');
  }

  if (params.targets.calories.remaining < 0 && params.goal !== 'muscle_gain') {
    recommendations.push('Calories are above target. Shift the next meal toward lean protein, vegetables, and lower-calorie volume foods.');
  }

  if (!recommendations.length) {
    recommendations.push('Current intake is balanced against your targets. Maintain meal quality and keep hydration and recovery consistent.');
  }

  return recommendations;
}
