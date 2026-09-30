import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';

interface LoginPromptProps {
  message?: string;
}

export const LoginPrompt = ({ message = 'You need to be signed in to continue.' }: LoginPromptProps) => (
  <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
    <div className="mb-6">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto text-grey-light"
        aria-hidden="true"
      >
        <path d="M12 17h.01M12 14a3 3 0 0 0 0-6 3 3 0 0 0-3 3" />
        <path d="M1 21l20-1" />
        <circle cx="9.5" cy="10.5" r="3" />
      </svg>
    </div>
    <Heading level={2} size="h2" weight="extrabold" className="tracking-tight mb-3">
      Authentication Required
    </Heading>
    <Text color="muted" className="mb-2 max-w-sm mx-auto leading-relaxed">
      {message}
    </Text>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/login">
        <Button variant="primary" size="lg">
          Sign In
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="secondary" size="lg">
          Create Account
        </Button>
      </Link>
    </div>
  </div>
);
