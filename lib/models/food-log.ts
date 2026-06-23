import { Schema, model, models } from 'mongoose';

const FoodItemSchema = new Schema(
  {
    name: String,
    quantity: String,
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number
  },
  { _id: false }
);

const FoodLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rawInput: { type: String, required: true },
    mealLabel: String,
    items: [FoodItemSchema],
    summary: {
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number
    },
    confidence: String,
    assumptions: [String],
    analysisModel: { type: String, default: 'gemini-1.5-flash' }
  },
  { timestamps: true }
);

export const FoodLogModel = models.FoodLog || model('FoodLog', FoodLogSchema);
