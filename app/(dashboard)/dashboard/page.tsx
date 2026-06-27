import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { tryConnectToDatabase } from '../../../lib/db';
import { getDashboardData } from '../../../lib/services/dashboard-service';
import { getDashboardMetrics } from '../../../lib/dashboard-metrics';
import { StatCard } from '../../../components/dashboard/stat-card';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { CircularProgress } from '../../../components/dashboard/circular-progress';
import { AiDailyBriefing } from '../../../components/dashboard/ai-daily-briefing';
import { Flame, Droplets, Target, Activity, Dumbbell, Utensils } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbStatus = await tryConnectToDatabase();

  if (!dbStatus.ok) {
    return (
      <div className="space-y-6">
        <BentoCard>
          <div className="flex flex-col items-center justify-center text-center p-10">
            <Activity className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">FitMitra is running in UI-only mode</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm">
              MongoDB authentication is failing right now. Fix the Atlas credentials in <span className="font-medium text-slate-700 dark:text-slate-300 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md">.env.local</span> and reload the server to restore full functionality.
            </p>
          </div>
        </BentoCard>
      </div>
    );
  }

  const dashboardData = await getDashboardData(userId);
  if (!dashboardData) {
    redirect('/onboarding');
  }

  const { user, foodLogs, waterLogs, progressLogs } = dashboardData;

  const profile = {
    age: user.age ?? 30,
    gender: (user.gender ?? 'prefer_not_to_say') as 'male' | 'female' | 'non_binary' | 'prefer_not_to_say',
    heightCm: user.heightCm ?? 175,
    weightKg: user.weightKg ?? 75,
    goal: (user.goal ?? 'maintenance') as 'weight_loss' | 'muscle_gain' | 'body_recomposition' | 'maintenance',
    activityLevel: (user.activityLevel ?? 'moderately_active') as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete'
  };

  const { targets, dailyTotals, progress, waterTotal, latestWeight, weightDelta } = getDashboardMetrics(
    profile,
    foodLogs,
    waterLogs,
    progressLogs
  );

  return (
    <div className="space-y-6">
      <AiDailyBriefing />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-[minmax(180px,auto)]">
      
      {/* Hero Calorie Card */}
      <div className="md:col-span-6 lg:col-span-5 lg:row-span-2">
        <BentoCard delay={0.1} className="h-full flex flex-col justify-center items-center text-center">
          <div className="mb-6 flex items-center justify-center bg-emerald-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-emerald-100 dark:border-white/[0.06]">
            <Flame className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Daily Calories</h2>
          
          <CircularProgress 
            value={progress.calories.completion} 
            max={100} 
            size={220} 
            strokeWidth={10}
            colorClass="text-emerald-500 dark:text-emerald-400"
            label={`${Math.round(dailyTotals.calories)}`}
            sublabel={`/ ${targets.calorieTarget} kcal`}
          />
          
          <p className="mt-8 text-sm text-slate-500 max-w-[200px]">
            <span className="text-slate-900 dark:text-white font-medium">{progress.calories.remaining} kcal</span> remaining today.
          </p>
        </BentoCard>
      </div>

      {/* Primary Stats */}
      <div className="md:col-span-3 lg:col-span-3">
        <StatCard 
          title="Current Weight" 
          value={`${latestWeight.toFixed(1)} kg`} 
          description={`${weightDelta > 0 ? '+' : ''}${weightDelta.toFixed(1)} kg since last log`}
          icon={<Activity className="h-4 w-4" />}
          delay={0.2}
        />
      </div>
      
      <div className="md:col-span-3 lg:col-span-4">
        <StatCard 
          title="Daily Goal" 
          value={<span className="capitalize">{String(user.goal).replace(/_/g, ' ')}</span>} 
          description="Adaptive targets based on goal."
          icon={<Target className="h-4 w-4" />}
          delay={0.3}
        />
      </div>

      <div className="md:col-span-6 lg:col-span-7">
        <BentoCard delay={0.4} className="h-full flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Macros</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
            <div className="flex flex-col">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">Protein</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">{Math.round(progress.protein.consumed)}</p>
                <span className="text-xs text-slate-500">g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 dark:bg-emerald-400/80 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min((progress.protein.consumed/progress.protein.target)*100, 100)}%`}}></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">Carbs</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">{Math.round(progress.carbohydrates.consumed)}</p>
                <span className="text-xs text-slate-500">g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 dark:bg-blue-400/80 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min((progress.carbohydrates.consumed/progress.carbohydrates.target)*100, 100)}%`}}></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">Fat</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">{Math.round(progress.fat.consumed)}</p>
                <span className="text-xs text-slate-500">g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 dark:bg-amber-400/80 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min((progress.fat.consumed/progress.fat.target)*100, 100)}%`}}></div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">Fiber</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">{Math.round(progress.fiber.consumed)}</p>
                <span className="text-xs text-slate-500">g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 dark:bg-slate-400/80 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min((progress.fiber.consumed/progress.fiber.target)*100, 100)}%`}}></div>
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Water Tracking Card */}
      <div className="md:col-span-3 lg:col-span-4">
        <BentoCard delay={0.5} className="h-full flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hydration</h3>
          </div>
          <div className="flex items-baseline gap-1 mt-2 mb-6">
            <span className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tighter">{waterTotal}</span>
            <span className="text-sm text-slate-500">/ {user.waterGoalOz ?? 100} oz</span>
          </div>
          <div className="w-full px-6">
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all duration-1000" 
                style={{width: `${Math.min((waterTotal/(user.waterGoalOz ?? 100))*100, 100)}%`}}
              ></div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Calculated Metrics */}
      <div className="md:col-span-3 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:row-span-2">
        <BentoCard delay={0.6} className="h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Dumbbell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Metrics</h3>
          </div>
          
          <div className="space-y-4 mt-auto">
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/[0.04]">
              <span className="text-sm text-slate-500 dark:text-slate-400">BMI</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{targets.bmi}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-white/[0.04]">
              <span className="text-sm text-slate-500 dark:text-slate-400">BMR</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{targets.bmr}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">TDEE</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{targets.tdee}</span>
            </div>
          </div>
        </BentoCard>
      </div>
      
      </div>
    </div>
  );
}
