import { createElement } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const headingSizes = {
  display: 'text-4xl sm:text-5xl md:text-6xl',
  h1: 'text-3xl sm:text-4xl md:text-5xl',
  h2: 'text-2xl sm:text-3xl md:text-4xl',
  h3: 'text-xl sm:text-2xl md:text-3xl',
  h4: 'text-lg sm:text-xl md:text-2xl',
  h5: 'text-base sm:text-lg',
  h6: 'text-sm sm:text-base',
} as const;

const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends ComponentProps<'h1'> {
  level?: HeadingLevel;
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  weight?: keyof typeof weights;
}

export const Heading = ({
  level = 2,
  size,
  weight = 'bold',
  className,
  ...props
}: HeadingProps) => {
  const Tag = `h${level}` as const;
  const sizeKey = size ?? `h${level}`;
  return createElement(
    Tag,
    {
      className: cn(
        'font-display font-bold text-black tracking-tight',
        headingSizes[sizeKey],
        weights[weight],
        className,
      ),
      ...props,
    }
  );
};

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  caption: 'text-sm',
} as const;
const textWeights = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
} as const;
const textColors = {
  default: 'text-text-primary',
  muted: 'text-text-muted',
  secondary: 'text-text-secondary',
  disabled: 'text-text-disabled',
  brand: 'text-brand',
  lost: 'text-lost',
  found: 'text-found',
} as const;

export interface TextProps extends ComponentProps<'p'> {
  size?: keyof typeof textSizes;
  weight?: keyof typeof textWeights;
  color?: keyof typeof textColors;
}

export const Text = ({
  size = 'base',
  weight = 'regular',
  color = 'default',
  className,
  ...props
}: TextProps) => (
  <p className={cn('font-sans', textSizes[size], textWeights[weight], textColors[color], className)} {...props} />
);
