import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'pink' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base = 'inline-flex items-center justify-center gap-2 rounded-card font-medium outline-none transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50';
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90 active:bg-brand/80',
  pink: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
  secondary: 'bg-white text-black border border-black/10 hover:bg-surface-subtle active:bg-grey-light/40',
  ghost: 'text-brand hover:bg-brand/5 active:bg-brand/10',
};
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base font-semibold',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={cn(base, variantStyles[variant], sizeStyles[size], className)}
    disabled={disabled}
    {...props}
  />
);