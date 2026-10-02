import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ItemGrid } from '@/components/browse/ItemGrid';
import { mockItems } from '@/data/mockItems';

export const RecentItems = () => (
  <Section id="recently-reported" className="bg-white">
    <Container>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <Text size="sm" color="muted" className="mb-2 tracking-widest uppercase text-brand font-semibold">
            RECENTLY REPORTED
          </Text>
          <Heading level={2} size="h2" weight="extrabold">
            Items reported across campus
          </Heading>
        </div>
        <Link to="/browse">
          <Button variant="ghost" size="sm">
            View All Reports
          </Button>
        </Link>
      </div>

      <ItemGrid items={mockItems} />
    </Container>
  </Section>
);
