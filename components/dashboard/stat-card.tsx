import { ReactNode } from 'react';
import { BentoCard } from './bento-card';

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  description: string;
  progress?: number; // 0-100
  icon?: ReactNode;
  delay?: number;
  gradient?: 'primary' | 'secondary' | 'none'; // Kept for API compatibility
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, description, progress, icon, delay = 0 }: StatCardProps) {
  return (
    <BentoCard delay={delay} className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-slate-400 opacity-80">{icon}</div>}
      </div>
      
      <div className="mt-auto space-y-1">
        <div className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed">
          {description}
        </p>
        
        {typeof progress === 'number' && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.04]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Progress</span>
              <span className="text-xs font-medium text-slate-900 dark:text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
