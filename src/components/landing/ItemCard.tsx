import type { Item } from '@/data/landing';
import { Link } from 'react-router-dom';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Link
      to={`/item/${item.id}`}
      className={cn(
        'group block no-underline text-current outline-none',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-card'
      )}
    >
      <article
        className={cn(
          'flex flex-col border border-border bg-surface-card rounded-card overflow-hidden',
          'transition-all duration-300 ease-out',
          'group-hover:shadow-strong group-hover:-translate-y-1'
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-grey-light">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L15 15" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3 z-10 transition-transform duration-300 ease-out group-hover:scale-105">
            <StatusBadge status={item.status} size="sm" />
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          <Heading level={3} size="h4" className="group-hover:text-brand transition-colors">
            {item.name}
          </Heading>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="capitalize">{item.category}</span>
            <span className="w-1 h-1 rounded-full bg-border-strong" />
            <span>{item.location}</span>
          </div>
          <div className="pt-2 border-t border-border">
            <Text size="sm" color="muted">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </div>
        </div>
      </article>
    </Link>
  );
};
