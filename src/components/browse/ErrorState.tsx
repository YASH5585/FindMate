import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  className?: string;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry, className }: ErrorStateProps) => (
  <div className={cn('flex flex-col items-center justify-center py-16 md:py-24 text-center', className)}>
    <div className="mb-6">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-grey-light">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </div>
    <Heading level={2} size="h2" weight="extrabold" className="tracking-tight mb-3">
      UNABLE TO LOAD
    </Heading>
    <Text color="muted" className="mb-8 max-w-sm mx-auto leading-relaxed">
      {message}
    </Text>
    <Button variant="primary" onClick={onRetry}>
      Try Again
    </Button>
  </div>
);