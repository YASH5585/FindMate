import type { Item } from '@/types/item';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { categoryLabels, locationLabels } from '@/lib/labels';
import { ItemImage } from '@/components/browse/ItemImage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';

interface ItemDetailViewProps {
  item: Item;
}

export const ItemDetailView = ({ item }: ItemDetailViewProps) => {
  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-surface-subtle border border-border">
            <ItemImage src={item.image} alt={item.name} />
            <div className="absolute top-4 left-4 z-10">
              <StatusBadge status={item.status} size="md" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-start justify-between gap-4 mb-6">
            <Heading level={1} size="h2" className="text-wrap">
              {item.name}
            </Heading>
            <Badge variant="neutral" size="md">
              {categoryLabels[item.category] ?? item.category}
            </Badge>
          </div>

          <Text color="muted" size="sm" className="mb-6">
            Reported by {item.reporterName} on{' '}
            {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <Text size="xs" color="muted" className="uppercase tracking-widest">
                Location
              </Text>
              <Text weight="medium">{locationLabels[item.location] ?? item.location}</Text>
            </div>
            <div className="space-y-1">
              <Text size="xs" color="muted" className="uppercase tracking-widest">
                Date Reported
              </Text>
              <Text weight="medium">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </div>
          </div>

          {item.image && (
            <div className="mb-8 space-y-1">
              <Text size="xs" color="muted" className="uppercase tracking-widest">
                Image
              </Text>
              <Text weight="medium" size="sm" className="break-all">
                {item.image}
              </Text>
            </div>
          )}

          <div className="border-t border-border pt-6">
            <Heading level={3} size="h3" className="mb-4">
              Description
            </Heading>
            <Text className="leading-relaxed max-w-2xl">{item.description}</Text>
          </div>
        </div>
      </div>
    </Container>
  );
};
