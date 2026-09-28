import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

interface ReportSuccessProps {
  mode: 'lost' | 'found';
  onReportAnother: () => void;
  onViewReports: () => void;
}

export const ReportSuccess = ({ mode, onReportAnother, onViewReports }: ReportSuccessProps) => {
  const isLost = mode === 'lost';
  
  return (
    <div className="w-full max-w-xl mx-auto text-center py-12 md:py-16" role="status" aria-live="polite">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand/10 mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <Heading level={1} size="h2" weight="extrabold" className="tracking-tight mb-3">
          {isLost ? 'Lost Item Reported' : 'Found Item Reported'}
        </Heading>
        <Text size="lg" color="muted" className="max-w-lg mx-auto leading-relaxed">
          Your item has been added to your reports. Someone may already be looking for it.
        </Text>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="ghost" size="lg" onClick={onReportAnother} className="w-full sm:w-auto">
          Report Another Item
        </Button>
        <Button size="lg" onClick={onViewReports} className="w-full sm:w-auto">
          View My Reports
        </Button>
      </div>
    </div>
  );
};