import { Schema, model, models } from 'mongoose';

const WaterLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ounces: { type: Number, required: true },
    loggedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const WaterLogModel = models.WaterLog || model('WaterLog', WaterLogSchema);
