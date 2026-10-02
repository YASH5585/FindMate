import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'lost' | 'found' | 'neutral' | 'success' | 'warning';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-subtle text-text-muted border',
  primary: 'bg-brand/10 text-brand border-brand/20',
  lost: 'bg-lost-bg text-lost border-lost-border',
  found: 'bg-found-bg text-found border-found-border',
  neutral: 'bg-surface-subtle text-text-muted border',
  success: 'bg-found-bg text-found border-found-border',
  warning: 'bg-lost-bg text-lost border-lost-border',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-0.5 text-xs font-medium',
  md: 'px-3 py-1 text-sm font-semibold',
};

export const Badge = ({ children, variant = 'default', size = 'sm', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border font-mono tracking-widest uppercase',
      variantStyles[variant],
      sizeStyles[size],
      className
    )}
  >
    {children}
  </span>
);
