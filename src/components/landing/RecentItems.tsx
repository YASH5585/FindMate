import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ItemCard } from './ItemCard';
import { mockItems } from '@/data/landing';

export const RecentItems = () => (
  <Section id="recently-reported" className="py-16 md:py-24 bg-white">
    <Container>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
        <div>
          <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
            RECENTLY REPORTED
          </Text>
        </div>
        <Button variant="ghost" size="sm" className="md:ml-auto">
          View All Reports
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </Container>
  </Section>
);