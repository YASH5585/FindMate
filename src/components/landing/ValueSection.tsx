import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { valueSections } from '@/data/landing';

export const ValueSection = () => (
  <>
    {valueSections.map((section) => {
      const sectionClass = cn(
        'py-16 md:py-24',
        section.number === '02' ? 'bg-surface-subtle' : 'bg-white'
      );

      return (
        <Section key={section.number} className={sectionClass}>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className={cn(section.reverse && 'lg:order-2')}>
                <Text size="sm" color="muted" className="mb-4 tracking-widest uppercase text-brand font-semibold">
                  {section.eyebrow}
                </Text>
                <div className="flex items-baseline gap-4 mb-6 flex-wrap">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-grey-light">
                    {section.number}
                  </span>
                  <Heading level={2} size="h2" weight="extrabold">
                    {section.heading}
                  </Heading>
                </div>
                <Text size="lg" color="muted" className="max-w-lg leading-relaxed">
                  {section.copy}
                </Text>
              </div>
              <div
                className={cn(
                  'relative aspect-square lg:aspect-auto lg:aspect-[4/3]',
                  section.reverse && 'lg:order-1'
                )}
              >
                <div className="absolute inset-0 bg-brand/5 rounded-card" aria-hidden="true" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-mono font-extrabold text-7xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-brand via-brand-dark to-accent"
                  >
                    {section.number}
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      );
    })}
  </>
);
