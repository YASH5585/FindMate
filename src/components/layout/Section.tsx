import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Section = ({ className, ...props }: ComponentProps<'section'>) => (
  <section className={cn('w-full py-12 md:py-16', className)} {...props} />
);