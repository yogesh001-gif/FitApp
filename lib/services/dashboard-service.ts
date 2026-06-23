import { unstable_cache } from 'next/cache';
import { tryConnectToDatabase } from '../db';
import { FoodLogModel, WaterLogModel, ProgressLogModel, UserModel, type UserRecord } from '../models';

export async function getDashboardData(userId: string) {
  // Try connecting to DB outside cache just to ensure connection is ready
  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) throw new Error('Database unavailable');

  // We fetch user first, as we need their objectId to query logs
  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return null;

  // Cache the heavy log aggregation queries
  // We use unstable_cache to cache this query per user per day basically,
  // or we can revalidate it via tags when they log something new.
  // For now, revalidate every 60 seconds.
  const fetchLogs = unstable_cache(
    async (mongoUserId: string) => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [foodLogs, waterLogs, progressLogs] = await Promise.all([
        FoodLogModel.find({ userId: mongoUserId, createdAt: { $gte: todayStart } }).lean(),
        WaterLogModel.find({ userId: mongoUserId, createdAt: { $gte: todayStart } }).lean(),
        ProgressLogModel.find({ userId: mongoUserId }).sort({ createdAt: -1 }).limit(2).lean()
      ]);

      return {
        // serialize objects carefully for the cache since lean() returns BSON ObjectIds
        foodLogs: JSON.parse(JSON.stringify(foodLogs)),
        waterLogs: JSON.parse(JSON.stringify(waterLogs)),
        progressLogs: JSON.parse(JSON.stringify(progressLogs))
      };
    },
    ['dashboard-logs', userId],
    { revalidate: 60, tags: [`dashboard-${userId}`] }
  );

  const logs = await fetchLogs((user as any)._id.toString());

  return {
    user,
    ...logs
  };
}
