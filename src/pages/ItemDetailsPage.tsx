import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Item } from '@/types/item';
import { getItemById as fetchItemById } from '@/lib/api/items';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { NotFound } from '@/components/browse/NotFound';
import { ItemDetailView } from '@/components/browse/ItemDetailView';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { ContactRequestForm } from '@/components/contact/ContactRequestForm';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const ItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchItemById(id)
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setItem(undefined);
        } else {
          setError('Could not load this item. Please try again.');
        }
        setLoading(false);
      });
  }, [id]);

  const isOwner = !!item && !!user && item.userId === user.id;
  const contactActionLabel = item?.status === 'lost' ? 'Contact Owner' : 'Contact Reporter';

  if (loading || !id) {
    return (
      <Container className="py-12 sm:py-16 md:py-24">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12 sm:py-16 md:py-24">
        <div role="alert" className="text-center py-12">
          <Text color="muted" className="mb-4 block">{error}</Text>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container className="py-12 sm:py-16 md:py-24">
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
      <header className="border-b border-border py-4 sm:py-6 mb-8">
        <Container>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium text-text-secondary',
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

      <footer className="border-t border-border py-8 sm:py-12 mt-12 sm:mt-16">
        <Container>
          <div className="max-w-2xl">
            {!user ? (
              <div>
                <div className="mb-6">
                  <StatusBadge status={item.status} size="md" />
                  <Text weight="semibold" className="mt-2 block text-xl">
                    Want to get in touch?
                  </Text>
                </div>
                <Text color="muted" className="mb-6 max-w-md">
                  Sign in to send a secure message to {item.reporterName}. Your contact
                  details stay private.
                </Text>
                <div className="max-w-xs">
                  <LoginPrompt message="Sign in to contact this item's owner." />
                </div>
              </div>
            ) : isOwner ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Text color="muted" size="sm">
                  This is your own report.
                </Text>
                <Link to="/report-found" className="sm:ml-auto">
                  <Button variant="secondary" size="md">
                    Report a Found Item
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Text weight="semibold" size="lg">
                    {contactActionLabel}
                  </Text>
                  <Link to="/report-found">
                    <Button variant="secondary" size="md" className="sm:ml-auto">
                      Report a Found Item
                    </Button>
                  </Link>
                </div>
                <Text color="muted" size="sm">
                  Send a message to {item.reporterName}. Your email and phone number stay
                  private until you choose to share them.
                </Text>
                <ContactRequestForm
                  itemId={item.id}
                  variant={item.status === 'lost' ? 'primary' : 'pink'}
                />
              </div>
            )}
          </div>
        </Container>
      </footer>
    </article>
  );
};
