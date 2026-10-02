import { Link } from 'react-router-dom';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export const FinalCTA = () => (
  <Section id="final-cta" className="relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark" />
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-accent/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-found/20 rounded-full blur-3xl" aria-hidden="true" />
    </div>

    <Container className="relative z-10 text-center">
      <div className="max-w-3xl mx-auto">
        <Text size="sm" color="muted" className="mb-4 tracking-widest uppercase text-white/80">
          Campus lost & found, simplified
        </Text>
        <Heading level={2} size="display" weight="extrabold" className="text-white mb-6">
          LOST IT?
        </Heading>
        <Heading level={2} size="display" weight="extrabold" className="text-white mb-8">
          LET'S FIND IT.
        </Heading>
        <Text size="lg" className="mb-12 max-w-xl mx-auto leading-relaxed text-white/85">
          Whether you lost something or found something, FindMate helps reconnect it with the right person.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/report-lost">
            <Button size="lg" className="w-full sm:w-auto">
              Report an Item
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Browse Lost & Found
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  </Section>
);
