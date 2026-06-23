import { z } from 'zod';

export const onboardingSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().int().min(13).max(100),
  gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say']),
  heightCm: z.coerce.number().min(80).max(250),
  weightKg: z.coerce.number().min(25).max(400),
  goal: z.enum(['weight_loss', 'muscle_gain', 'body_recomposition', 'maintenance']),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete'])
});

export const foodLogSchema = z.object({
  rawInput: z.string().min(2),
  mealLabel: z.string().optional()
});

export const hydrationSchema = z.object({
  ounces: z.coerce.number().positive().max(300)
});

export const progressSchema = z.object({
  weightKg: z.coerce.number().optional(),
  chestCm: z.coerce.number().optional(),
  waistCm: z.coerce.number().optional(),
  armsCm: z.coerce.number().optional(),
  hipsCm: z.coerce.number().optional(),
  note: z.string().optional()
});
