import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../../lib/db';
import { FoodLogModel, UserModel, type UserRecord } from '../../../../lib/models';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const recentFood = await FoodLogModel.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return Response.json({ recentFood });
}
