import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    label: 'REPORT',
    title: 'Add a Report',
    copy: 'Tell us what you lost or found. Include a photo, category, and where it happened.',
  },
  {
    number: '02',
    label: 'DISCOVER',
    title: 'Search Across Campus',
    copy: 'Browse reports by category, location, or status. Find what matters fast.',
  },
  {
    number: '03',
    label: 'RECOVER',
    title: 'Connect & Reconnect',
    copy: 'Send a secure message to the owner or finder. Keep your contact details private.',
  },
] as const;

export const HowItWorks = () => (
  <Section id="how-it-works" className="bg-white">
    <Container>
      <div className="text-center mb-16">
        <Text size="sm" color="muted" className="mb-4 tracking-widest uppercase">
          HOW IT WORKS
        </Text>
        <Heading level={2} size="h2" weight="extrabold" className="mb-4">
          Three steps to get it back
        </Heading>
        <Text size="lg" color="muted" className="max-w-2xl mx-auto leading-relaxed">
          Reporting a lost or found item is quick, and connects you with the right person on campus.
        </Text>
      </div>

      <div className="relative">
        <div
          className="hidden absolute top-0 bottom-0 w-px bg-border-strong left-1/2 -translate-x-1/2 md:block"
          aria-hidden="true"
        />

        <div className="space-y-12 md:space-y-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.number}
                className={cn(
                  'relative flex flex-col md:flex-row items-center md:items-start',
                  !isEven && 'md:flex-row-reverse',
                  !isLast && 'mb-12 md:mb-0'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0 md:relative md:top-0 z-10',
                    'flex items-center justify-center w-12 h-12 rounded-full',
                    'bg-brand text-white font-mono text-lg font-bold',
                    'border-4 border-white shadow-card',
                    isEven ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0',
                    'md:self-start'
                  )}
                >
                  {step.number}
                </div>

                <div
                  className={cn(
                    'mt-16 md:mt-0 md:max-w-md',
                    'text-center md:text-left',
                    isEven ? 'md:mr-12' : 'md:ml-12'
                  )}
                >
                  <Text size="sm" color="muted" className="mb-2 tracking-widest uppercase">
                    {step.label}
                  </Text>
                  <Heading level={3} size="h3" weight="semibold" className="mb-3">
                    {step.title}
                  </Heading>
                  <Text color="muted" className="leading-relaxed">
                    {step.copy}
                  </Text>
                </div>

                <div
                  className={cn(
                    'mt-8 md:mt-0 md:flex-1',
                    'flex justify-center md:justify-end',
                    !isEven && 'md:justify-start'
                  )}
                >
                  <StepVisual number={step.number} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  </Section>
);

function StepVisual({ number }: { number: string }) {
  const visuals = {
    '01': (
      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-card bg-surface-subtle border border-border flex items-center justify-center p-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden="true">
          <path d="M14.5 21a3.5 3.5 0 0 1-7 0" />
          <path d="M14.5 21a3.5 3.5 0 0 0 7 0" />
          <path d="M3 21h18" />
          <path d="M9 12h6" />
          <path d="M17 3a4 4 0 1 0 0 8H7a4 4 0 1 0 0-8" />
        </svg>
      </div>
    ),
    '02': (
      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-card bg-surface-subtle border border-border flex items-center justify-center p-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="12" y1="12" x2="12" y2="12" />
        </svg>
      </div>
    ),
    '03': (
      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-card bg-surface-subtle border border-border flex items-center justify-center p-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7a2 2 0 0 1 0-4h14z" />
          <path d="M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      </div>
    ),
  };

  return visuals[number as keyof typeof visuals] ?? null;
}
