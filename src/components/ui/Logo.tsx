import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: ComponentProps<'div'>) => (
  <div className={cn('flex items-center gap-3', className)}>
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <rect x="1" y="1" width="38" height="38" rx="9" fill="#00204f" />
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        fontFamily="'Inter', ui-sans, system-ui, sans-serif"
        fontWeight={700}
        fontSize="15"
        fill="#ffffff"
      >
        FM
      </text>
      <rect x="9" y="28" width="22" height="2" fill="#ff0072" rx="1" />
    </svg>
    <span className="font-display text-xl font-bold tracking-tight text-black">FindMate</span>
  </div>
);