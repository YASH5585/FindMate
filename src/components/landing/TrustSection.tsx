import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';

export const TrustSection = () => (
  <Section id="trust" className="bg-white">
    <Container>
      <div className="max-w-4xl mx-auto text-center">
        <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase text-brand font-semibold">
          BUILT FOR CAMPUS
        </Text>
        <Heading level={2} size="h1" weight="extrabold" className="mb-6">
          One place for every lost thing.
        </Heading>
        <Text size="lg" color="muted" className="max-w-2xl mx-auto leading-relaxed">
          FindMate brings lost and found reports into one searchable place, so students spend less
          time asking around and more time finding what matters.
        </Text>
      </div>
    </Container>
  </Section>
);
