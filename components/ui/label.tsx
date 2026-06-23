import { cn } from '../../lib/utils';

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium text-slate-200', props.className)} {...props} />;
}
