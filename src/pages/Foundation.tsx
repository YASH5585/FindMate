import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { colorTokens, spacingScale, typeScale, cssVar } from '@/lib/tokens';

export const Foundation = () => (
  <>
    <Section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <Heading level={1} size="display" weight="extrabold" className="tracking-tight">
            FindMate
          </Heading>
          <Text color="muted" className="mt-4 max-w-lg mx-auto text-lg">
            A campus lost & found app built around bold type, clean surfaces, and confident interaction.
          </Text>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">Explore items</Button>
            <Button variant="ghost" size="lg">
              How it works
            </Button>
          </div>
        </div>
      </Container>
    </Section>

    <Section id="typography">
      <Container>
        <div className="mb-12">
          <Heading level={2} size="h2">Typography</Heading>
          <Text color="muted" className="mt-2 max-w-2xl">
            Inter for headings, DM Sans for body. Scale driven by size, weight, and whitespace.
          </Text>
        </div>
        <div className="space-y-8">
          {typeScale.map((t) => (
            <div key={t.label} className="flex flex-col gap-2">
              <div className={t.cls}>
                {t.label}
              </div>
              <Text color="muted" size="sm">
                {t.cls}
              </Text>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    <Section id="colors">
      <Container>
        <div className="mb-12">
          <Heading level={2} size="h2">Color</Heading>
          <Text color="muted" className="mt-2 max-w-2xl">
            Restrained palette. Pink and blue used as intentional accents. Black typography on white surfaces.
          </Text>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {colorTokens.map((t) => (
            <div key={t.name} className="flex flex-col items-center gap-2">
              <div
                className={[
                  'w-16 h-16 rounded-sm border border-black/10',
                  `bg-${t.name}`,
                ].join(' ')}
              />
              <span className="text-sm font-medium text-black">{t.label}</span>
              <span className="font-mono text-xs text-grey-medium">
                {cssVar(t.variable) || t.variable}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    <Section id="spacing">
      <Container>
        <div className="mb-12">
          <Heading level={2} size="h2">Spacing</Heading>
          <Text color="muted" className="mt-2 max-w-2xl">
            8px base system: 8, 16, 24, 32, 48, 64, 96, 128. Bars show height at each step.
          </Text>
        </div>
        <div className="flex items-end justify-center gap-2 md:gap-4 flex-wrap">
          {spacingScale.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <div className={['w-2 rounded-sm bg-brand', s.cls].join(' ')} />
              <span className="text-xs text-grey">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    <Section id="components">
      <Container>
        <div className="mb-12">
          <Heading level={2} size="h2">Components</Heading>
          <Text color="muted" className="mt-2 max-w-2xl">
            Buttons with four variants and three sizes. All states: default, hover, active, focus-visible, disabled.
          </Text>
        </div>
        <div className="space-y-8">
          <div>
            <Text size="sm" color="muted" className="mb-3">Variants</Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="pink">Pink accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>
          <div>
            <Text size="sm" color="muted" className="mb-3">Sizes</Text>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <Text color="muted" size="sm">
            Each button supports default, hover, active, focus-visible, and disabled states. Try Tab navigation.
          </Text>
        </div>
      </Container>
    </Section>

    <Section id="surfaces">
      <Container>
        <div className="mb-12">
          <Heading level={2} size="h2">Borders & Surfaces</Heading>
          <Text color="muted" className="mt-2 max-w-2xl">
            Thin borders over shadows. White surface, subtle surface (#f0f0f0), and default border (rgba(0,0,0,0.10)).
          </Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-black/10 bg-white rounded-card p-6">
            <Heading level={3} size="h4" className="mb-2">Elevated card</Heading>
            <Text size="sm" color="muted">
              1px border, white surface, 20px radius. Use for content that needs visual separation.
            </Text>
          </div>
          <div className="border border-black/10 rounded-card p-6">
            <Heading level={3} size="h4" className="mb-2">Bordered surface</Heading>
            <Text size="sm" color="muted">
              Border on a transparent background. Useful for inline separators or grouped inputs.
            </Text>
          </div>
          <div className="bg-surface-subtle rounded-card p-6">
            <Heading level={3} size="h4" className="mb-2">Subtle surface</Heading>
            <Text size="sm" color="muted">
              Very light grey (#f0f0f0). Use for secondary panels or hover backgrounds.
            </Text>
          </div>
        </div>
      </Container>
    </Section>

    <Section id="responsive">
      <Container>
        <div className="mb-12">
          <Heading level={2} size="h2">Responsive</Heading>
          <Text color="muted" className="mt-2 max-w-2xl">
            Mobile-first. Below 768px, multi-column layouts stack. Minimum touch target 44px. Navigation defers to a full-screen menu in later phases.
          </Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-black/10 bg-white rounded-card p-6">
            <Heading level={3} size="h4" className="mb-2">Column 1</Heading>
            <Text size="sm" color="muted">Responsive grid collapses to single column on mobile.</Text>
          </div>
          <div className="border border-black/10 bg-white rounded-card p-6">
            <Heading level={3} size="h4" className="mb-2">Column 2</Heading>
            <Text size="sm" color="muted">Same component, stacked on narrow viewports.</Text>
          </div>
        </div>
      </Container>
    </Section>
  </>
);