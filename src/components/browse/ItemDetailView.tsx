import type { Item } from '@/types/item';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { categoryLabels, locationLabels } from '@/lib/labels';
import { ItemImage } from '@/components/browse/ItemImage';

const statusStyles = {
  lost: 'bg-brand/10 text-brand border-brand/20',
  found: 'bg-accent/10 text-accent border-accent/20',
} as const;

interface ItemDetailViewProps {
  item: Item;
}

export const ItemDetailView = ({ item }: ItemDetailViewProps) => {
  const statusStyle = statusStyles[item.status];

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-surface-subtle">
            <ItemImage src={item.image} alt={item.name} />
            <div
              className={cn(
                'absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full border',
                statusStyle
              )}
              aria-label={item.status === 'lost' ? 'Status: Lost' : 'Status: Found'}
            >
              {item.status === 'lost' ? 'LOST' : 'FOUND'}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Heading level={1} size="h2" className="mb-2">
            {item.name}
          </Heading>

          <Text color="muted" size="sm" className="mb-6">
            Reported by {item.reporterName} on {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <div className="space-y-4 mb-8">
            <div>
              <Text size="sm" color="muted" className="uppercase tracking-widest">
                Category
              </Text>
              <Text weight="medium">{categoryLabels[item.category] ?? item.category}</Text>
            </div>

            <div>
              <Text size="sm" color="muted" className="uppercase tracking-widest">
                Location
              </Text>
              <Text weight="medium">{locationLabels[item.location] ?? item.location}</Text>
            </div>

            <div>
              <Text size="sm" color="muted" className="uppercase tracking-widest">
                Date
              </Text>
              <Text weight="medium">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </div>

            {item.image && (
              <div>
                <Text size="sm" color="muted" className="uppercase tracking-widest">
                  Image
                </Text>
                <Text weight="medium" size="sm">
                  {item.image}
                </Text>
              </div>
            )}
          </div>

          <div className="border-t border-black/10 pt-6">
            <Heading level={3} size="h4" className="mb-3">
              Description
            </Heading>
            <Text className="leading-relaxed">{item.description}</Text>
          </div>
        </div>
      </div>
    </Container>
  );
};
