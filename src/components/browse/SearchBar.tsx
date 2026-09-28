import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search items, categories, or locations',
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value && inputRef.current) {
      inputRef.current.focus();
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={cn('relative w-full', isFocused && 'ring-2 ring-brand ring-offset-2')}>
      <label htmlFor="search-input" className="sr-only">
        Search items
      </label>
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-12 pr-12 py-3 text-base',
          'bg-white border border-black/10 rounded-card',
          'placeholder:text-grey-medium',
          'focus:outline-none focus:border-brand',
          'transition-colors duration-150 ease-out'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-grey-medium hover:text-black hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors"
          aria-label="Clear search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};