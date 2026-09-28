import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '@/lib/items';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';
import { NotFound } from '@/components/browse/NotFound';
import { ItemDetailView } from '@/components/browse/ItemDetailView';

export const ItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = id ? getItemById(id) : undefined;

  if (!item) {
    return (
      <Container className="py-12">
        <NotFound
          title="Item not found"
          description="The item you're looking for doesn't exist or has been removed."
          actionLabel="Back to Browse"
          onAction={() => navigate('/browse')}
        />
      </Container>
    );
  }

  return (
    <article className="w-full">
      <header className="border-b border-black/10 py-6 mb-8">
        <Container>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium text-black/70',
              'hover:text-brand focus-visible:text-brand',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              'transition-colors'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Browse
          </button>
        </Container>
      </header>

      <ItemDetailView item={item} />

      <footer className="border-t border-black/10 py-6 mt-12">
        <Container>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <Heading level={3} size="h4" className="mb-1">
                Found this item?
              </Heading>
              <Text color="muted" size="sm">
                Contact {item.reporterName} at the email provided during reporting.
              </Text>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/report-found')}
              className="w-full sm:w-auto"
            >
              Report a Found Item
            </Button>
          </div>
        </Container>
      </footer>
    </article>
  );
};
