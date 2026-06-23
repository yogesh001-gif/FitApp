import { Schema, model, models } from 'mongoose';

const DietPlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    input: Schema.Types.Mixed,
    payload: Schema.Types.Mixed,
    regeneratedFromId: { type: Schema.Types.ObjectId, ref: 'DietPlan' }
  },
  { timestamps: true }
);

export const DietPlanModel = models.DietPlan || model('DietPlan', DietPlanSchema);
