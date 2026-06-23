import { z } from 'zod';

export const nutritionAnalysisSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      calories: z.number().nonnegative(),
      protein: z.number().nonnegative(),
      carbohydrates: z.number().nonnegative(),
      fat: z.number().nonnegative(),
      fiber: z.number().nonnegative()
    })
  ),
  summary: z.object({
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbohydrates: z.number().nonnegative(),
    fat: z.number().nonnegative(),
    fiber: z.number().nonnegative()
  }),
  assumptions: z.array(z.string()),
  confidence: z.enum(['low', 'medium', 'high'])
});

export const dietPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  days: z.array(
    z.object({
      day: z.string(),
      meals: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          estimatedNutrition: z.object({
            calories: z.number().nonnegative(),
            protein: z.number().nonnegative(),
            carbohydrates: z.number().nonnegative(),
            fat: z.number().nonnegative(),
            fiber: z.number().nonnegative()
          })
        })
      )
    })
  ),
  totals: z.object({
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbohydrates: z.number().nonnegative(),
    fat: z.number().nonnegative(),
    fiber: z.number().nonnegative()
  })
});

export const workoutPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  weeks: z.array(
    z.object({
      week: z.string(),
      sessions: z.array(
        z.object({
          day: z.string(),
          focus: z.string(),
          exercises: z.array(
            z.object({
              name: z.string(),
              sets: z.number().int().positive(),
              reps: z.string(),
              restSeconds: z.number().int().nonnegative()
            })
          )
        })
      )
    })
  )
});
