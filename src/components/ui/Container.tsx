import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Container = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('mx-auto w-full max-w-7xl px-6 md:px-8', className)} {...props} />
);