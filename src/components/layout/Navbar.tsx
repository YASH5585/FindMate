import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = (path: string) =>
    cn(
      'text-sm font-medium transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
      isActive(path)
        ? 'text-brand'
        : 'text-text-secondary hover:text-brand'
    );

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16 sm:h-20',
          'transition-all duration-300 ease-out',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-border shadow-card'
            : 'bg-transparent'
        )}
        role="banner"
      >
        <Container className="flex h-full items-center justify-between">
          <Logo className="flex-shrink-0" />
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <Link to="/browse" aria-current={isActive('/browse') ? 'page' : undefined} className={navLinkClass('/browse')}>
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/my-reports" aria-current={isActive('/my-reports') ? 'page' : undefined} className={navLinkClass('/my-reports')}>
                  My Reports
                </Link>
                <Link to="/contact-requests" aria-current={isActive('/contact-requests') ? 'page' : undefined} className={navLinkClass('/contact-requests')}>
                  Contact Requests
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" aria-current={isActive('/login') ? 'page' : undefined} className={navLinkClass('/login')}>
                  Login
                </Link>
                <Link to="/report-lost">
                  <Button variant="primary" size="sm">
                    Report Item
                  </Button>
                </Link>
              </>
            )}
          </nav>
          <button
            type="button"
            className={cn(
              'md:hidden inline-flex items-center justify-center p-2 rounded-md',
              'text-text-secondary hover:text-brand',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              'transition-colors duration-150'
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
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};
