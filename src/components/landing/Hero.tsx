import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), prefersReducedMotion ? 0 : 100);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (_e: MediaQueryListEvent) => {};
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className={cn(
        'relative min-h-[90svh] max-h-[100svh] flex items-center justify-center',
        'overflow-hidden',
        'bg-white'
      )}
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmax] h-[80vmax] rounded-full bg-brand/5 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      <Container className="relative z-10 flex flex-col items-center justify-center px-6 md:px-8">
        <div
          className={cn(
            'flex flex-col items-center text-center max-w-4xl',
            'transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <Heading
            id="hero-heading"
            level={1}
            size="display"
            weight="extrabold"
            className="tracking-tight mb-6"
          >
            LOST SOMETHING?
          </Heading>
          <Text size="xl" color="muted" className="mb-10 max-w-2xl leading-relaxed">
            Find it faster. Return it easier. Keep campus connected.
          </Text>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/report-lost">
              <Button size="lg" className="w-full sm:w-auto">
                Report an Item
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Browse Lost & Found
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2',
          'transition-opacity duration-500',
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grey animate-bounce" style={{ animationDelay: '2s' }}>
          <path d="M12 5v14M19 12H5" />
        </svg>
        <Text size="sm" color="muted">Scroll to explore</Text>
      </div>
    </section>
  );
};