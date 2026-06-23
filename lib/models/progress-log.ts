import { Schema, model, models } from 'mongoose';

const ProgressLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weightKg: Number,
    chestCm: Number,
    waistCm: Number,
    armsCm: Number,
    hipsCm: Number,
    note: String,
    loggedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ProgressLogModel = models.ProgressLog || model('ProgressLog', ProgressLogSchema);
