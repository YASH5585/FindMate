import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export const FinalCTA = () => (
  <Section id="final-cta" className="py-16 md:py-24 bg-brand">
    <Container>
      <div className="max-w-3xl mx-auto text-center">
        <Heading level={2} size="display" weight="extrabold" className="tracking-tight text-white mb-6">
          YOUR NEXT SEARCH STARTS HERE.
        </Heading>
        <Text size="lg" color="muted" className="mb-10 max-w-lg mx-auto leading-relaxed text-brand/80">
          Report what you lost. Share what you found.
        </Text>
        <Button variant="pink" size="lg">
          Get Started
        </Button>
      </div>
    </Container>
  </Section>
);