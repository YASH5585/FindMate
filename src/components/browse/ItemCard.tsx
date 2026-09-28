import type { Item } from '@/types/item';
import { Link } from 'react-router-dom';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

const statusStyles = {
  lost: 'bg-brand/10 text-brand border-brand/20',
  found: 'bg-accent/10 text-accent border-accent/20',
} as const;

const categoryIcons: Record<string, React.ReactNode> = {
  electronics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  'id-card': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 9h12M6 13h8M16 9v8" />
    </svg>
  ),
  bags: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12v8M14 12v8" />
    </svg>
  ),
  books: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 17H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a2.5 2.5 0 0 1 0 5H6.5" />
    </svg>
  ),
  accessories: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  clothing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <path d="M12 7v6" />
      <path d="M8 13h8" />
    </svg>
  ),
  other: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const categoryLabels: Record<string, string> = {
  electronics: 'Electronics',
  'id-card': 'ID / Cards',
  bags: 'Bags',
  books: 'Books',
  accessories: 'Accessories',
  clothing: 'Clothing',
  other: 'Other',
};

const locationLabels: Record<string, string> = {
  library: 'Library',
  cafeteria: 'Cafeteria',
  'academic-block': 'Academic Block',
  'sports-complex': 'Sports Complex',
  hostel: 'Hostel',
  other: 'Other',
};

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const statusClass = statusStyles[item.status];
  const icon = categoryIcons[item.category] || categoryIcons.other;

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
          'relative border border-black/10 bg-white rounded-card overflow-hidden',
          'transition-all duration-300 ease-out',
          'hover:border-brand/30 hover:bg-brand/5'
        )}
      >
        <div className="relative aspect-[4/3] bg-surface-subtle overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-grey-light group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 ease-out">
            {icon}
          </div>
          <div
            className={cn(
              'absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full border',
              statusClass
            )}
          >
            {item.status === 'lost' ? 'LOST' : 'FOUND'}
          </div>
        </div>
        <div className="p-5 space-y-3">
          <Heading level={3} size="h4" className="group-hover:text-brand transition-colors">
            {item.name}
          </Heading>
          <Text size="sm" color="muted" className="line-clamp-2">
            {item.description}
          </Text>
          <div className="flex flex-wrap items-center gap-2 text-sm text-grey">
            <span className="flex items-center gap-1.5">
              {icon}
              <span>{categoryLabels[item.category] || item.category}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{locationLabels[item.location] || item.location}</span>
            </span>
          </div>
          <div className="pt-2 border-t border-black/10 flex items-center justify-between">
            <Text size="sm" color="muted">
              Reported {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            <Text size="sm" color="muted">
              by {item.reporterName}
            </Text>
          </div>
        </div>
      </article>
    </Link>
  );
};