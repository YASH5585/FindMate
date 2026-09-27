import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Browse', href: '#recently-reported' },
  { label: 'Report Lost', href: '#report-lost' },
  { label: 'Report Found', href: '#report-found' },
  { label: 'How It Works', href: '#how-it-works' },
] as const;

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ease-out',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-black/10'
            : 'bg-transparent'
        )}
        role="banner"
      >
        <Container className="flex h-full items-center justify-between">
          <Logo className="flex-shrink-0" />
          <nav className="hidden gap-8 md:flex items-center" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium text-black/70',
                  'hover:text-brand',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                  'active:text-brand/70',
                  'transition-colors duration-150 ease-out'
                )}
              >
                {link.label}
              </a>
            ))}
            <Button variant="secondary" size="sm" className="ml-4 md:ml-0">
              Report an Item
            </Button>
          </nav>
          <button
            type="button"
            className={cn(
              'md:hidden inline-flex items-center justify-center p-2 rounded-md',
              'text-black/70 hover:text-brand',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              'active:text-brand/70',
              'transition-colors duration-150 ease-out'
            )}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </Container>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};