import { cn } from '../../lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const variantClasses = {
    default: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
    secondary: 'bg-white/10 text-white hover:bg-white/15',
    ghost: 'bg-transparent text-white hover:bg-white/10'
  };

  return <button className={cn('inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50', variantClasses[variant], className)} {...props} />;
}
