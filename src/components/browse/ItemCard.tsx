import type { Item } from '@/types/item';
import { Link } from 'react-router-dom';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ItemImage } from '@/components/browse/ItemImage';

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
          'group-hover:shadow-strong group-hover:-translate-y-1',
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-surface-subtle">
          <ItemImage src={item.image} alt={item.name} />
          <div
            className={cn(
              'absolute top-3 left-3 z-10',
              'transition-transform duration-300 ease-out group-hover:scale-105'
            )}
          >
            <StatusBadge status={item.status} size="sm" />
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          <Heading level={3} size="h4" className="group-hover:text-brand transition-colors line-clamp-1">
            {item.name}
          </Heading>
          <Text size="sm" color="muted" className="line-clamp-2">
            {item.description}
          </Text>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Text size="xs" color="muted" className="uppercase tracking-widest">
                {item.category}
              </Text>
              <Text size="sm" color="muted" className="capitalize">
                {item.location}
              </Text>
            </div>
            <Text size="sm" color="muted" className="text-right">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </div>
        </div>
      </article>
    </Link>
  );
};
