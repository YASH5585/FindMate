import { cn } from '@/lib/utils';
import { Badge } from './Badge';

export type StatusType = 'lost' | 'found';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge = ({ status, size = 'md', className }: StatusBadgeProps) => (
  <Badge variant={status === 'lost' ? 'lost' : 'found'} size={size} className={cn(className)}>
    {status === 'lost' ? 'LOST' : 'FOUND'}
  </Badge>
);
