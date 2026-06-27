'use client';

import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';

export function AiDailyBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await fetch('/api/dashboard/insight');
        const data = await res.json();
        setBriefing(data.text);
        setIsCached(data.cached);
      } catch (err) {
        setBriefing("Keep pushing towards your goals today!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="mb-8">
      <div className="relative rounded-2xl border border-slate-200 dark:border-white/[0.04] bg-white dark:bg-slate-900/30 p-5 backdrop-blur-xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 shadow-sm dark:shadow-none">
        
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 dark:bg-white/[0.03] text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-white/[0.05]">
            {isLoading ? (
              <Sparkles className="h-4 w-4 animate-pulse opacity-50" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>
          
          <div className="flex-1 z-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Insight</h2>
              {isLoading ? (
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  Thinking...
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-500/80">
                  <CheckCircle2 className="h-3 w-3" /> {isCached ? 'Cached' : 'Just updated'}
                </span>
              )}
            </div>
            
            <div className="min-h-[44px] flex items-center">
              {isLoading ? (
                <div className="space-y-3 w-full mt-2">
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800/50 rounded animate-pulse" />
                  <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-800/50 rounded animate-pulse" />
                </div>
              ) : (
                <p className="text-[14px] font-light text-slate-700 dark:text-slate-300 leading-relaxed tracking-wide animate-in fade-in duration-700">
                  {briefing}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
