import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  label: string;
  options: readonly FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const FilterGroup = ({ label, options, value, onChange, className }: FilterGroupProps) => (
  <fieldset className={cn('min-w-[160px] flex-1', className)}>
    <legend className="text-xs font-medium tracking-widest uppercase text-grey mb-2">{label}</legend>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full px-3 py-2.5 text-sm',
        'bg-white border border-black/10 rounded-card',
        'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
        'transition-colors duration-150 ease-out',
        'appearance-none bg-no-repeat bg-right',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23606060%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%27")] bg-center pr-8'
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </fieldset>
);

interface FilterControlsProps {
  status: string;
  category: string;
  location: string;
  date: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
] as const satisfies readonly FilterOption[];

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'id-card', label: 'ID / Cards' },
  { value: 'bags', label: 'Bags' },
  { value: 'books', label: 'Books' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
] as const satisfies readonly FilterOption[];

const locationOptions = [
  { value: 'all', label: 'All' },
  { value: 'library', label: 'Library' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'academic-block', label: 'Academic Block' },
  { value: 'sports-complex', label: 'Sports Complex' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'other', label: 'Other' },
] as const satisfies readonly FilterOption[];

const dateOptions = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recent' },
  { value: 'older', label: 'Older' },
] as const satisfies readonly FilterOption[];

export const FilterControls = ({
  status,
  category,
  location,
  date,
  onStatusChange,
  onCategoryChange,
  onLocationChange,
  onDateChange,
  onClearAll,
  hasActiveFilters,
}: FilterControlsProps) => (
  <div className="w-full">
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <FilterGroup
        label="STATUS"
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
      />
      <FilterGroup
        label="CATEGORY"
        options={categoryOptions}
        value={category}
        onChange={onCategoryChange}
      />
      <FilterGroup
        label="LOCATION"
        options={locationOptions}
        value={location}
        onChange={onLocationChange}
      />
      <FilterGroup
        label="DATE"
        options={dateOptions}
        value={date}
        onChange={onDateChange}
      />
    </div>

    {hasActiveFilters && (
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-brand hover:text-brand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded transition-colors"
      >
        Clear all filters
      </button>
    )}
  </div>
);