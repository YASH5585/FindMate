import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { valueSections } from '@/data/landing';
import { cn } from '@/lib/utils';

export const ValueSection = () => (
  <>
    {valueSections.map((section) => {
      const sectionClass = cn(
        'py-16 md:py-24',
        section.number === '02' ? 'bg-surface-subtle' : 'bg-white'
      );
      const gridClass = cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center',
        section.reverse && 'lg:grid-flow-dense'
      );
      const contentOrderClass = cn(section.reverse ? 'lg:order-2' : '');
      const visualOrderClass = cn('relative aspect-square', section.reverse ? 'lg:order-1' : '');

      return (
        <Section key={section.number} className={sectionClass}>
          <Container>
            <div className={gridClass}>
              <div className={contentOrderClass}>
                <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
                  {section.eyebrow}
                </Text>
                <Heading level={2} size="h2" weight="extrabold" className="tracking-tight mb-6">
                  {section.heading}
                </Heading>
                <Text size="lg" color="muted" className="max-w-lg leading-relaxed">
                  {section.copy}
                </Text>
              </div>
              <div className={visualOrderClass}>
                <div className="absolute inset-0 bg-brand/5 rounded-[2rem] blur-2xl opacity-50" />
                <div className="relative h-full w-full max-w-md mx-auto flex items-center justify-center">
                  <span className="font-mono text-8xl md:text-9xl font-extrabold text-grey-light/50">
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