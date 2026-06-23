import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../../lib/db';
import { UserModel, WorkoutPlanModel, type UserRecord } from '../../../../lib/models';
import { buildPlanPrompt } from '../../../../lib/prompts';
import { generateJsonFromGemini } from '../../../../lib/gemini';
import { workoutPlanSchema } from '../../../../lib/ai-schemas';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable', details: dbStatus.error }, { status: 503 });
  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const input = Object.fromEntries(formData.entries());
  const prompt = buildPlanPrompt('workout', `Profile: ${JSON.stringify(user)}\nRequest: ${JSON.stringify(input)}`);
  const payload = await generateJsonFromGemini(prompt, (value) => workoutPlanSchema.parse(value));
  const stored = await WorkoutPlanModel.create({ userId: user._id, input, payload });
  return Response.json({ plan: stored, payload });
}
