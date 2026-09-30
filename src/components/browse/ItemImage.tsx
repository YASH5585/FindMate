import { cn } from '@/lib/utils';

interface ItemImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export const ItemImage = ({ src, alt, className }: ItemImageProps) => {
  if (!src) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center bg-surface-subtle text-grey-light',
          className
        )}
        aria-label="No image available"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L15 15" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('w-full h-full object-cover', className)}
      loading="lazy"
    />
  );
};
