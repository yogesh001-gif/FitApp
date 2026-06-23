export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  athlete: 1.9
} as const;

export const GOAL_CALORIE_MODIFIERS = {
  weight_loss: -0.18,
  muscle_gain: 0.12,
  body_recomposition: -0.05,
  maintenance: 0
} as const;

export const PROTEIN_GRAMS_PER_KG = {
  weight_loss: 2.2,
  muscle_gain: 2.0,
  body_recomposition: 2.1,
  maintenance: 1.6
} as const;

export const FAT_CALORIE_SHARE = {
  weight_loss: 0.28,
  muscle_gain: 0.25,
  body_recomposition: 0.27,
  maintenance: 0.3
} as const;

export const FIBER_GRAMS_PER_1000_CALORIES = 14;
