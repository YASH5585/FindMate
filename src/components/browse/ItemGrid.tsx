import { cn } from '@/lib/utils';
import { ItemCard } from './ItemCard';
import type { Item } from '@/types/item';

interface ItemGridProps {
  items: Item[];
  isLoading?: boolean;
}

export const ItemGrid = ({ items, isLoading = false }: ItemGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="status" aria-label="Loading items">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border border-border bg-surface-card rounded-card overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-surface-subtle" />
            <div className="p-5 space-y-3">
              <div className="h-6 w-3/4 bg-surface-subtle rounded" />
              <div className="h-4 w-full bg-surface-subtle rounded" />
              <div className="h-4 w-2/3 bg-surface-subtle rounded" />
              <div className="h-4 w-1/2 bg-surface-subtle rounded" />
              <div className="pt-2 border-t border-border h-4 w-1/3 bg-surface-subtle rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-6',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4'
    )} role="list" aria-label="Items">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
