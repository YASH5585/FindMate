import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

interface NotFoundProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const NotFound = ({
  title = 'Not Found',
  description = 'The page or item you are looking for does not exist.',
  actionLabel = 'Go Home',
  onAction,
  className,
}: NotFoundProps) => (
  <div className={cn('flex flex-col items-center justify-center text-center py-16 md:py-24', className)} role="alert">
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
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="14" x2="16" y2="14" />
        <line x1="14" y1="8" x2="16" y2="8" />
        <line x1="14" y1="16" x2="16" y2="16" />
      </svg>
    </div>
    <Heading level={2} size="h2" weight="extrabold" className="tracking-tight mb-3">
      {title}
    </Heading>
    <Text color="muted" className="mb-8 max-w-sm mx-auto leading-relaxed">
      {description}
    </Text>
    {onAction && (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
