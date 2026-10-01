import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import type { SafeUser } from '@/lib/api/auth';

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
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
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = user ? authNavLinks : publicNavLinks;

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
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white border-l border-black/10 p-8 md:p-12 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between mb-12">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="text-black hover:text-grey transition-colors p-2"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="text-2xl md:text-3xl font-display font-bold text-black hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="pt-8 border-t border-black/10">
          {user ? (
            <Button variant="secondary" size="lg" className="w-full" onClick={async () => { await onLogout(); onClose(); }}>
              Logout
            </Button>
          ) : (
            <Link to="/report-lost" onClick={onClose} className="inline-flex w-full items-center justify-center gap-2 h-12 px-5 text-base font-semibold rounded-card bg-brand text-white hover:bg-brand/90 active:bg-brand/80 transition-colors">
              Report an Item
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
