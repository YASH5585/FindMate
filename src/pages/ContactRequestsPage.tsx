import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ContactRequest, ContactRequestStatus } from '@/types/contactRequest';
import {
  getContactRequests,
  updateContactRequest,
} from '@/lib/api/contactRequests';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';
import { LoginPrompt } from '@/components/auth/LoginPrompt';

const statusColors: Record<ContactRequestStatus, string> = {
  pending: 'bg-brand/10 text-brand',
  accepted: 'bg-accent/10 text-accent',
  declined: 'text-grey-medium',
  closed: 'text-grey-medium',
};

const statusLabels: Record<ContactRequestStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  closed: 'Closed',
};

export const ContactRequestsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    setError(null);
    getContactRequests()
      .then((data) => {
        if (!cancelled) {
          setRequests(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load your contact requests.');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [user]);

  const handleUpdate = async (id: string, status: ContactRequestStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateContactRequest(id, { status });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update request.';
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <div className="w-full py-8">
        <Container>
          <LoginPrompt message="You need to be signed in to view your contact requests." />
        </Container>
      </div>
    );
  }

  const incoming = requests.filter((r) => r.role === 'receiver');
  const outgoing = requests.filter((r) => r.role === 'sender');

  const IncomingCard = ({ r }: { r: ContactRequest }) => (
    <div className="rounded-card border border-black/10 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Text weight="medium">{r.itemName ?? 'Item'}</Text>
          <Text color="muted" size="sm">
            From {r.senderName ?? 'Someone'} · {formatDate(r.createdAt)}
          </Text>
          <Text size="sm" className="mt-2 line-clamp-2">
            {r.message}
          </Text>
        </div>
        <span
          className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[r.status]}`}
        >
          {statusLabels[r.status]}
        </span>
      </div>
      {r.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={updatingId === r.id}
            onClick={() => handleUpdate(r.id, 'accepted')}
          >
            {updatingId === r.id ? <Spinner size="sm" /> : 'Accept'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={updatingId === r.id}
            onClick={() => handleUpdate(r.id, 'declined')}
          >
            {updatingId === r.id ? <Spinner size="sm" /> : 'Decline'}
          </Button>
        </div>
      )}
    </div>
  );

  const OutgoingCard = ({ r }: { r: ContactRequest }) => (
    <div className="rounded-card border border-black/10 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Text weight="medium">{r.itemName ?? 'Item'}</Text>
          <Text color="muted" size="sm">
            To {r.receiverName ?? 'the owner'} · {formatDate(r.createdAt)}
          </Text>
          <Text size="sm" className="mt-2 line-clamp-2">
            {r.message}
          </Text>
        </div>
        <span
          className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[r.status]}`}
        >
          {statusLabels[r.status]}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full py-8">
      <header className="border-b border-black/10 mb-8">
        <Container>
          <Heading level={1} size="h1" className="mb-1">
            Contact Requests
          </Heading>
          <Text color="muted" size="sm">
            Messages you've sent and received about lost and found items.
          </Text>
        </Container>
      </header>

      <Container>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div role="alert" className="py-12 text-center">
            <Text color="muted" className="text-center">{error}</Text>
          </div>
        ) : requests.length === 0 ? (
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <Heading level={2} size="h2" weight="extrabold" className="tracking-tight mb-3">
              NO MESSAGES YET
            </Heading>
            <Text color="muted" className="mb-6 max-w-sm mx-auto leading-relaxed">
              When someone contacts you about an item, or you reach out to an owner,
              you'll find those conversations here.
            </Text>
            <Link to="/browse">
              <Button variant="primary" size="lg">
                Browse Items
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <Heading level={2} size="h3" className="mb-4">
                Incoming
              </Heading>
              {incoming.length === 0 ? (
                <Text color="muted" size="sm">
                  No incoming messages.
                </Text>
              ) : (
                <div className="space-y-4">
                  {incoming.map((r) => (
                    <IncomingCard key={r.id} r={r} />
                  ))}
                </div>
              )}
            </section>
            <section>
              <Heading level={2} size="h3" className="mb-4">
                Outgoing
              </Heading>
              {outgoing.length === 0 ? (
                <Text color="muted" size="sm">
                  No outgoing messages.
                </Text>
              ) : (
                <div className="space-y-4">
                  {outgoing.map((r) => (
                    <OutgoingCard key={r.id} r={r} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </Container>
    </div>
  );
};

function formatDate(createdAt?: string): string {
  if (!createdAt) return '';
  return new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
