import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { Text } from '@/components/ui/Typography';

const footerLinks = [
  { label: 'Browse', to: '/browse' },
  { label: 'Report Lost', to: '/report-lost' },
  { label: 'Report Found', to: '/report-found' },
  { label: 'How It Works', to: '#how-it-works' },
] as const;

export const Footer = () => (
  <footer className="border-t border-black/10 py-12 md:py-16 bg-white">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <Logo />
          <Text size="sm" color="muted" className="mt-4 max-w-xs">
            Campus Lost & Found
          </Text>
        </div>
        <nav className="flex flex-col gap-3" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-black/70 hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 text-sm text-grey">
          <p>&copy; {new Date().getFullYear()} FindMate. All rights reserved.</p>
          <p>Not affiliated with any educational institution.</p>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-black/10 text-center">
        <Text size="sm" color="muted">
          Built for students, by students.
        </Text>
      </div>
    </Container>
  </footer>
);