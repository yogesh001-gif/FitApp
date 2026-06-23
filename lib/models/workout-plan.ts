import { Schema, model, models } from 'mongoose';

const WorkoutPlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    input: Schema.Types.Mixed,
    payload: Schema.Types.Mixed,
    regeneratedFromId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan' }
  },
  { timestamps: true }
);

export const WorkoutPlanModel = models.WorkoutPlan || model('WorkoutPlan', WorkoutPlanSchema);
