import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { tryConnectToDatabase } from '../../../lib/db';
import { UserModel, type UserRecord } from '../../../lib/models';
import { PlansWizard } from './client-wizard';

export default async function PlansPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) {
    return <div className="p-6 text-white text-center">Database unavailable. Please configure MongoDB.</div>;
  }

  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) {
    redirect('/onboarding');
  }

  const initialProfile = {
    age: user.age ?? 30,
    gender: user.gender ?? 'prefer_not_to_say',
    heightCm: user.heightCm ?? 175,
    weightKg: user.weightKg ?? 75,
    goal: user.goal ?? 'maintenance',
    activityLevel: user.activityLevel ?? 'moderately_active'
  };

  return <PlansWizard initialProfile={initialProfile} />;
}
