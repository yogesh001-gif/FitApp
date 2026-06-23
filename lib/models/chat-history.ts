import { Schema, model, models } from 'mongoose';

const ChatHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    message: { type: String, required: true },
    contextSnapshot: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const ChatHistoryModel = models.ChatHistory || model('ChatHistory', ChatHistorySchema);
