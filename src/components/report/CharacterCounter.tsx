import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export const CharacterCounter = ({ current, max, className }: CharacterCounterProps) => (
  <div
    className={cn(
      'flex justify-end text-xs font-mono mt-1.5',
      current > max ? 'text-brand' : 'text-grey-medium',
      className
    )}
    aria-live="polite"
    aria-atomic="true"
  >
    <span className={current > max ? 'font-semibold' : ''}>
      {Math.min(current, max)}
    </span>
    <span className="text-grey-light mx-1">/</span>
    <span>{max}</span>
  </div>
);