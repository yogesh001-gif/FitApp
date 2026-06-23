import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../lib/db';
import { progressSchema } from '../../../lib/validators';
import { ProgressLogModel, UserModel, type UserRecord } from '../../../lib/models';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const parsed = progressSchema.parse({
    weightKg: formData.get('weightKg') || undefined,
    chestCm: formData.get('chestCm') || undefined,
    waistCm: formData.get('waistCm') || undefined,
    armsCm: formData.get('armsCm') || undefined,
    hipsCm: formData.get('hipsCm') || undefined,
    note: formData.get('note') || undefined
  });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable', details: dbStatus.error }, { status: 503 });
  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const entry = await ProgressLogModel.create({ userId: user._id, ...parsed });
  return Response.json({ progress: entry });
}
