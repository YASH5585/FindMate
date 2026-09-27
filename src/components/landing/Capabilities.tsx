import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Typography';
import { capabilities } from '@/data/landing';

export const Capabilities = () => (
  <Section id="capabilities" className="py-16 md:py-24 bg-surface-subtle">
    <Container>
      <div className="mb-12 md:mb-16 text-center">
        <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
          WHAT FINDMATE DOES
        </Text>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {capabilities.map((capability, index) => (
          <li
            key={capability}
            className="group relative pl-12 py-4 text-left"
          >
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-2xl font-bold text-grey-medium group-hover:text-brand transition-colors">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Text size="lg" weight="medium" className="group-hover:text-brand transition-colors">
              {capability}
            </Text>
          </li>
        ))}
      </ul>
    </Container>
  </Section>
);