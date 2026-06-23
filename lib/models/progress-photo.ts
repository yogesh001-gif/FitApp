import { Schema, model, models } from 'mongoose';

const ProgressPhotoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    angle: { type: String, enum: ['front', 'side', 'back'], required: true },
    url: { type: String, required: true },
    publicId: String,
    caption: String,
    takenAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ProgressPhotoModel = models.ProgressPhoto || model('ProgressPhoto', ProgressPhotoSchema);
