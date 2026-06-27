import { Schema, model, models } from 'mongoose';

export type UserRecord = {
  _id: unknown;
  clerkUserId: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  goal?: string;
  activityLevel?: string;
  onboardingComplete?: boolean;
  waterGoalOz?: number;
  bmi?: number;
  bmr?: number;
  tdee?: number;
  calorieTarget?: number;
  proteinTarget?: number;
  carbohydrateTarget?: number;
  fatTarget?: number;
  fiberTarget?: number;
  cachedBriefing?: string;
  lastBriefingGeneratedAt?: Date;
};

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    name: { type: String, required: true },
    age: Number,
    gender: String,
    heightCm: Number,
    weightKg: Number,
    goal: String,
    activityLevel: String,
    onboardingComplete: { type: Boolean, default: false },
    waterGoalOz: { type: Number, default: 0 },
    bmi: Number,
    bmr: Number,
    tdee: Number,
    calorieTarget: Number,
    proteinTarget: Number,
    carbohydrateTarget: Number,
    fatTarget: Number,
    fiberTarget: Number,
    cachedBriefing: String,
    lastBriefingGeneratedAt: Date
  },
  { timestamps: true }
);

export const UserModel = models.User || model('User', UserSchema);
