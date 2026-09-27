import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Typography';

const steps = [
  {
    number: '01',
    label: 'REPORT',
    copy: 'Tell us what you lost or found.',
  },
  {
    number: '02',
    label: 'SEARCH',
    copy: 'Browse items reported across campus.',
  },
  {
    number: '03',
    label: 'CONNECT',
    copy: 'Reach the person who can help.',
  },
  {
    number: '04',
    label: 'RETURN',
    copy: 'Get the item back where it belongs.',
  },
] as const;

export const HowItWorks = () => (
  <Section id="how-it-works" className="py-16 md:py-24 bg-surface-subtle">
    <Container>
      <div className="mb-16 md:mb-20 text-center">
        <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
          HOW IT WORKS
        </Text>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {steps.map((step) => (
          <article
            key={step.number}
            className="flex flex-col items-start gap-4 text-left"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl md:text-3xl font-bold text-grey-medium">
                {step.number}
              </span>
              <span className="text-xs font-medium tracking-widest uppercase text-grey">
                {step.label}
              </span>
            </div>
            <Text color="muted" className="text-base md:text-lg leading-relaxed">
              {step.copy}
            </Text>
            <div className="mt-auto w-full h-px bg-black/10" />
          </article>
        ))}
      </div>
    </Container>
  </Section>
);