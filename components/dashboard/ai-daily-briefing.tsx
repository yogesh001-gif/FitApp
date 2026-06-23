'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BentoCard } from './bento-card';

interface BriefingProps {
  userName: string;
  targets: any;
  dailyTotals: any;
  weightDelta: number;
}

export function AiDailyBriefing({ userName, targets, dailyTotals, weightDelta }: BriefingProps) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would call an API route to generate the briefing using Gemini.
    // For performance and avoiding unnecessary API costs on every dashboard load,
    // we'll generate a smart localized "AI-like" insight based on the props.
    
    setTimeout(() => {
      let insight = `Good morning, ${userName || 'Athlete'}! `;
      
      const caloriesRemaining = targets.calorieTarget - dailyTotals.calories;
      const proteinPercent = Math.min(100, Math.round((dailyTotals.protein / targets.proteinTarget) * 100)) || 0;

      if (caloriesRemaining > 500) {
        insight += `You have ${caloriesRemaining} kcal remaining today. You're well on track. `;
      } else if (caloriesRemaining < 0) {
        insight += `You're slightly over your calorie target by ${Math.abs(caloriesRemaining)} kcal. No stress, just adjust tomorrow! `;
      } else {
        insight += `You are perfectly on track with your calories today. `;
      }

      if (proteinPercent < 50) {
        insight += `Try to prioritize protein in your next meal; you're at ${proteinPercent}% of your daily goal.`;
      } else if (proteinPercent >= 100) {
        insight += `Excellent job hitting your protein target! Muscle recovery is optimized.`;
      } else {
        insight += `You're making steady progress on your protein intake (${proteinPercent}%).`;
      }

      if (weightDelta < 0) {
        insight += ` Also, great job! You're down ${Math.abs(weightDelta)}kg from your previous weigh-in.`;
      } else if (weightDelta > 0) {
        insight += ` Your weight is up ${weightDelta}kg from your last log, which might be normal fluctuation or muscle gain.`;
      }

      setBriefing(insight);
      setIsLoading(false);
    }, 1500); // Simulate AI generation delay

  }, [userName, targets, dailyTotals, weightDelta]);

  return (
    <BentoCard gradient="primary" className="mb-6 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white border border-white/30 shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">AI Daily Briefing</h2>
            {isLoading ? (
              <span className="flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70 animate-pulse">
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>
          
          <div className="min-h-[48px] flex items-center">
            {isLoading ? (
              <div className="space-y-2 w-full mt-2">
                <div className="h-3 w-3/4 bg-white/20 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-white/20 rounded animate-pulse" />
              </div>
            ) : (
              <p className="text-sm text-white/90 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                {briefing}
              </p>
            )}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
