'use server';

import { onboardingSchema } from '../../lib/validators';
import { syncOnboardingTargets } from '../../lib/services/user-service';
import { redirect } from 'next/navigation';

export async function submitOnboarding(formData: FormData) {
  const result = onboardingSchema.safeParse({
    name: formData.get('name'),
    age: formData.get('age'),
    gender: formData.get('gender'),
    heightCm: formData.get('heightCm'),
    weightKg: formData.get('weightKg'),
    goal: formData.get('goal'),
    activityLevel: formData.get('activityLevel')
  });

  if (!result.success) {
    return { error: 'Validation failed. Please check your inputs.' };
  }

  await syncOnboardingTargets(result.data);
  redirect('/dashboard');
}
