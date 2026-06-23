import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../lib/db';
import { hydrationSchema } from '../../../lib/validators';
import { WaterLogModel, UserModel, type UserRecord } from '../../../lib/models';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const parsed = hydrationSchema.parse({ ounces: formData.get('ounces') });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable', details: dbStatus.error }, { status: 503 });
  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const entry = await WaterLogModel.create({ userId: user._id, ounces: parsed.ounces });
  return Response.json({ water: entry });
}
