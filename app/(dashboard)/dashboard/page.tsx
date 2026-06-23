import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { tryConnectToDatabase } from '../../../lib/db';
import { getDashboardData } from '../../../lib/services/dashboard-service';
import { getDashboardMetrics } from '../../../lib/dashboard-metrics';
import { StatCard } from '../../../components/dashboard/stat-card';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { CircularProgress } from '../../../components/dashboard/circular-progress';
import { AiDailyBriefing } from '../../../components/dashboard/ai-daily-briefing';
import { Flame, Droplets, Target, Activity, Dumbbell, Utensils, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const dbStatus = await tryConnectToDatabase();

  if (!dbStatus.ok) {
    return (
      <div className="space-y-6">
        <BentoCard>
          <div className="flex flex-col items-center justify-center text-center p-10">
            <Activity className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-display font-semibold text-white mb-2">Fitapp is running in UI-only mode</h2>
            <p className="text-muted-foreground max-w-md">
              MongoDB authentication is failing right now. Fix the Atlas credentials in <span className="font-medium text-white px-2 py-1 bg-white/10 rounded">.env.local</span> and reload the server to restore full functionality.
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
      <AiDailyBriefing 
        userName={user.name ?? 'Athlete'} 
        targets={targets} 
        dailyTotals={dailyTotals} 
        weightDelta={weightDelta} 
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-[minmax(180px,auto)]">
      
      {/* Hero Calorie Card - Spans 2 rows and 4 cols on Desktop */}
      <div className="md:col-span-6 lg:col-span-5 lg:row-span-2">
        <BentoCard gradient="primary" delay={0.1} className="h-full flex flex-col justify-center items-center text-center">
          <div className="mb-6 flex items-center justify-center bg-primary/20 p-4 rounded-full shadow-neon-primary">
            <Flame className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-medium text-muted-foreground uppercase tracking-widest mb-6">Daily Calories</h2>
          
          <CircularProgress 
            value={progress.calories.completion} 
            max={100} 
            size={220} 
            strokeWidth={14}
            colorClass="text-primary"
            label={`${Math.round(dailyTotals.calories)}`}
            sublabel={`/ ${targets.calorieTarget} kcal`}
          />
          
          <p className="mt-8 text-sm text-muted-foreground max-w-[200px]">
            You have <span className="text-white font-medium">{progress.calories.remaining} kcal</span> remaining today based on your goal.
          </p>
        </BentoCard>
      </div>

      {/* Primary Stats */}
      <div className="md:col-span-3 lg:col-span-3">
        <StatCard 
          title="Current Weight" 
          value={`${latestWeight.toFixed(1)} kg`} 
          description={`${weightDelta > 0 ? '+' : ''}${weightDelta.toFixed(1)} kg since last log`}
          icon={<Activity className="h-5 w-5 text-accent" />}
          delay={0.2}
        />
      </div>
      
      <div className="md:col-span-3 lg:col-span-4">
        <StatCard 
          title="Daily Goal" 
          value={<span className="capitalize">{String(user.goal).replace(/_/g, ' ')}</span>} 
          description="Your adaptive targets adjust based on this objective."
          icon={<Target className="h-5 w-5 text-primary" />}
          delay={0.3}
        />
      </div>

      <div className="md:col-span-6 lg:col-span-7">
        <BentoCard delay={0.4} className="h-full flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Macros Breakdown</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Protein</p>
              <p className="text-2xl font-display font-bold text-white">{Math.round(progress.protein.consumed)}<span className="text-sm font-normal text-muted-foreground ml-1">g</span></p>
              <div className="w-full bg-white/10 h-1 mt-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: `${Math.min((progress.protein.consumed/progress.protein.target)*100, 100)}%`}}></div></div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Carbs</p>
              <p className="text-2xl font-display font-bold text-white">{Math.round(progress.carbohydrates.consumed)}<span className="text-sm font-normal text-muted-foreground ml-1">g</span></p>
              <div className="w-full bg-white/10 h-1 mt-2 rounded-full"><div className="bg-secondary h-full rounded-full" style={{width: `${Math.min((progress.carbohydrates.consumed/progress.carbohydrates.target)*100, 100)}%`}}></div></div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Fat</p>
              <p className="text-2xl font-display font-bold text-white">{Math.round(progress.fat.consumed)}<span className="text-sm font-normal text-muted-foreground ml-1">g</span></p>
              <div className="w-full bg-white/10 h-1 mt-2 rounded-full"><div className="bg-accent h-full rounded-full" style={{width: `${Math.min((progress.fat.consumed/progress.fat.target)*100, 100)}%`}}></div></div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Fiber</p>
              <p className="text-2xl font-display font-bold text-white">{Math.round(progress.fiber.consumed)}<span className="text-sm font-normal text-muted-foreground ml-1">g</span></p>
              <div className="w-full bg-white/10 h-1 mt-2 rounded-full"><div className="bg-muted-foreground h-full rounded-full" style={{width: `${Math.min((progress.fiber.consumed/progress.fiber.target)*100, 100)}%`}}></div></div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Water Tracking Card */}
      <div className="md:col-span-3 lg:col-span-4">
        <BentoCard gradient="secondary" delay={0.5} className="h-full flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="h-5 w-5 text-secondary" />
            <h3 className="text-sm font-medium text-secondary uppercase tracking-wider">Hydration</h3>
          </div>
          <div className="flex items-baseline gap-1 mt-2 mb-4">
            <span className="text-5xl font-display font-bold text-white tracking-tighter">{waterTotal}</span>
            <span className="text-lg text-muted-foreground">/ {user.waterGoalOz ?? 100} oz</span>
          </div>
          <div className="w-full px-6">
            <div className="w-full bg-black/40 h-2 mt-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-secondary h-full rounded-full transition-all duration-1000" 
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
            <Dumbbell className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Metrics</h3>
          </div>
          
          <div className="space-y-4 mt-auto">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-muted-foreground">BMI</span>
              <span className="text-lg font-medium text-white">{targets.bmi}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-muted-foreground">BMR</span>
              <span className="text-lg font-medium text-white">{targets.bmr}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-muted-foreground">TDEE</span>
              <span className="text-lg font-medium text-white">{targets.tdee}</span>
            </div>
          </div>
        </BentoCard>
      </div>
      
      </div>
    </div>
  );
}
