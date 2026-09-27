export function cssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export interface ColorToken {
  name: string;
  variable: string;
  label: string;
}

export const colorTokens: ColorToken[] = [
  { name: 'white', variable: '--color-white', label: 'White' },
  { name: 'black', variable: '--color-black', label: 'Black' },
  { name: 'brand', variable: '--color-brand', label: 'Brand — Dark Blue' },
  { name: 'brand-secondary', variable: '--color-brand-secondary', label: 'Brand Secondary — Blue' },
  { name: 'accent', variable: '--color-accent', label: 'Accent — Pink' },
  { name: 'grey', variable: '--color-grey', label: 'Grey' },
  { name: 'grey-medium', variable: '--color-grey-medium', label: 'Medium Grey' },
  { name: 'grey-light', variable: '--color-grey-light', label: 'Light Grey' },
  { name: 'surface-subtle', variable: '--color-surface-subtle', label: 'Surface Subtle' },
];

export const spacingScale = [
  { label: '8', cls: 'h-2' },
  { label: '16', cls: 'h-4' },
  { label: '24', cls: 'h-6' },
  { label: '32', cls: 'h-8' },
  { label: '48', cls: 'h-12' },
  { label: '64', cls: 'h-16' },
  { label: '96', cls: 'h-24' },
  { label: '128', cls: 'h-32' },
];

export const typeScale = [
  { label: 'Display', cls: 'text-5xl md:text-6xl font-display font-extrabold' },
  { label: 'H1', cls: 'text-4xl font-display font-bold' },
  { label: 'H2', cls: 'text-3xl font-display font-bold' },
  { label: 'H3', cls: 'text-2xl font-display font-bold' },
  { label: 'H4', cls: 'text-xl font-display font-bold' },
  { label: 'H5', cls: 'text-lg font-display font-bold' },
  { label: 'H6', cls: 'text-base font-display font-bold' },
  { label: 'Body', cls: 'text-base font-sans font-normal' },
  { label: 'Caption', cls: 'text-sm font-sans' },
];