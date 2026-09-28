import { cn } from '@/lib/utils';

interface SortControlProps {
  value: 'newest' | 'oldest';
  onChange: (value: 'newest' | 'oldest') => void;
}

const sortOptions = [
  { value: 'newest' as const, label: 'Newest first' },
  { value: 'oldest' as const, label: 'Oldest first' },
] as const;

export const SortControl = ({ value, onChange }: SortControlProps) => (
  <div className="flex items-center gap-2">
    <label htmlFor="sort-select" className="text-xs font-medium tracking-widest uppercase text-grey">
      SORT
    </label>
    <select
      id="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value as 'newest' | 'oldest')}
      className={cn(
        'px-3 py-2 text-sm',
        'bg-white border border-black/10 rounded-card',
        'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
        'transition-colors duration-150 ease-out',
        'appearance-none bg-no-repeat bg-right',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23606060%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%27")] bg-center pr-8'
      )}
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);