import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { mockItems } from '@/data/landing';

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const recentItems = mockItems.slice(0, 4);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-surface"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-found/5" aria-hidden="true" />

      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-lost/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-brand/5 rounded-full blur-3xl" aria-hidden="true" />

      <Container className="relative z-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div
            className={cn(
              'flex flex-col text-center sm:text-left',
              'transition-all duration-700 ease-out',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <Text size="sm" color="muted" className="mb-4 tracking-widest uppercase text-brand font-semibold">
              CAMPUS LOST & FOUND
            </Text>
            <Heading level={1} size="display" weight="extrabold" className="mb-6 text-wrap">
              LOST SOMETHING?
            </Heading>
            <Heading level={1} size="display" weight="extrabold" className="mb-8 text-brand">
              FIND IT ON CAMPUS.
            </Heading>
            <Text size="lg" color="secondary" className="mb-10 max-w-md leading-relaxed mx-auto sm:mx-0">
              Find lost belongings, report what you've found, and reconnect items with the people looking for them.
            </Text>
            <div className={cn(
              'flex flex-col sm:flex-row gap-4',
              !isVisible && 'opacity-0'
            )} style={{ transitionDelay: '200ms' }}>
              <Link to="/report-lost">
                <Button size="lg" className="w-full sm:w-auto">
                  Report Lost Item
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Lost & Found
                </Button>
              </Link>
            </div>
          </div>

          <div
            className={cn(
              'relative transition-all duration-700 ease-out',
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            )}
            style={{ transitionDelay: '150ms' }}
          >
            <CampusVisual items={recentItems} />
          </div>
        </div>
      </Container>
    </section>
  );
};

function CampusVisual({ items }: { items: typeof mockItems }) {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand/10 rounded-full" aria-hidden="true" />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-found/10 rounded-full" aria-hidden="true" />

      <div className="relative grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'relative rounded-card overflow-hidden border border-border bg-surface-card shadow-card',
              'transition-all duration-300 ease-out',
              'hover:shadow-strong hover:-translate-y-1'
            )}
          >
            <div className="aspect-[4/3] bg-surface-subtle flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey-light" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-5-5L15 15" />
                </svg>
              )}
            </div>
            <div className="p-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-brand">
                {item.status === 'lost' ? 'LOST' : 'FOUND'}
              </span>
              <p className="font-display font-bold text-sm text-text-primary mt-1 truncate">{item.name}</p>
              <p className="text-xs text-text-muted">{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
