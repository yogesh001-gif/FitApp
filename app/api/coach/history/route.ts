import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../../lib/db';
import { ChatHistoryModel, UserModel, type UserRecord } from '../../../../lib/models';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  // Fetch the last 50 messages for this user, sorted chronologically
  const messages = await ChatHistoryModel.find({ userId: user._id })
    .sort({ createdAt: 1 })
    .limit(50)
    .lean();

  // Format into the structure the frontend expects: { role: 'user' | 'assistant', content: string }
  const formattedHistory = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.message,
    createdAt: msg.createdAt
  }));

  return Response.json({ messages: formattedHistory });
}
