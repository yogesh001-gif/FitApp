import { ReactNode } from 'react';
import { BentoCard } from './bento-card';
import { CircularProgress } from './circular-progress';

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  description: string;
  progress?: number; // 0-100
  icon?: ReactNode;
  delay?: number;
  gradient?: 'primary' | 'secondary' | 'none';
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, description, progress, icon, delay = 0, gradient = 'none', trend }: StatCardProps) {
  return (
    <BentoCard delay={delay} gradient={gradient} className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-muted-foreground bg-white/5 p-2 rounded-xl border border-white/5">{icon}</div>}
      </div>
      
      <div className="mt-auto space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-display font-bold text-white tracking-tighter">
            {value}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {typeof progress === 'number' && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Progress</span>
              <span className="text-xs font-semibold text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
