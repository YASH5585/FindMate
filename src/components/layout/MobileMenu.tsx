import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import type { SafeUser } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SafeUser | null;
  onLogout: () => Promise<void>;
}

const publicNavLinks = [
  { label: 'Browse', to: '/browse' },
  { label: 'Report Lost', to: '/report-lost' },
  { label: 'Report Found', to: '/report-found' },
  { label: 'How It Works', to: '#how-it-works' },
] as const;

const authNavLinks = [
  { label: 'Browse', to: '/browse' },
  { label: 'My Reports', to: '/my-reports' },
  { label: 'Contact Requests', to: '/contact-requests' },
  { label: 'How It Works', to: '#how-it-works' },
] as const;

export const MobileMenu = ({ isOpen, onClose, user, onLogout }: MobileMenuProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => contentRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent<Document>) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        const focusableElements = contentRef.current?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements?.length) return;
        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    return () => document.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = user ? authNavLinks : publicNavLinks;

  const handleLinkClick = () => onClose();
  const handleLogoutClick = async () => {
    await onLogout();
    onClose();
    navigate('/login');
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-surface border-l border-border p-6 flex flex-col h-full shadow-strong"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-brand transition-colors p-2"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={cn(
                'text-xl sm:text-2xl font-medium text-text-secondary',
                'hover:text-brand transition-colors duration-150'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="pt-8 border-t border-border">
          {user ? (
            <Button variant="secondary" size="lg" className="w-full" onClick={handleLogoutClick}>
              Logout
            </Button>
          ) : (
            <Link to="/report-lost" onClick={handleLinkClick} className="inline-flex w-full items-center justify-center gap-2 h-12 px-5 text-base font-semibold rounded-card bg-brand text-white hover:bg-brand/90 active:bg-brand/80 transition-colors">
              Report an Item
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
