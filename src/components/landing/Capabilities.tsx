import { Section } from '@/components/layout/Section';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

const capabilities = [
  {
    title: 'Campus Search',
    copy: 'Search reports from every corner of campus in one place.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    color: 'text-brand',
    bg: 'bg-brand/5',
  },
  {
    title: 'Secure Contact',
    copy: 'Messages stay private until you choose to share.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    color: 'text-found',
    bg: 'bg-found-bg',
  },
  {
    title: 'Location-based Discovery',
    copy: 'Filter by library, cafeteria, hostel and other campus spots.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    color: 'text-accent',
    bg: 'bg-accent-bg',
  },
  {
    title: 'Personal Reports',
    copy: 'All your reports and conversations in one personal space.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M8 2h8a2 2 0 0 1 2 2v2H6V4a2 2 0 0 1 2-2z" />
        <path d="M8 14h8M8 10h8" />
      </svg>
    ),
    color: 'text-lost',
    bg: 'bg-lost-bg',
  },
];

export const Capabilities = () => (
  <Section id="capabilities" className="bg-surface-subtle">
    <Container>
      <div className="text-center mb-12">
        <Text size="sm" color="muted" className="mb-3 tracking-widest uppercase">
          WHAT FINDMATE DOES
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {capabilities.map((cap) => (
          <div
            key={cap.title}
            className={cn(
              'rounded-card p-6 sm:p-8 text-center',
              'border border-border bg-surface-card',
              'transition-all duration-300 ease-out',
              'group hover:shadow-strong hover:-translate-y-1'
            )}
          >
            <div className={cn('w-16 h-16 mx-auto mb-6 rounded-lg flex items-center justify-center', cap.bg, cap.color)}>
              {cap.icon}
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-brand transition-colors">
              {cap.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">{cap.copy}</p>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);