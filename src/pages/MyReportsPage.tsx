import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Item } from '@/types/item';
import { getMyReports } from '@/lib/api/items';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const MyReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMyReports()
      .then((data) => {
        if (!cancelled) {
          setReports(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load your reports.');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  if (!user) {
    return (
      <div className="w-full py-8">
        <Container>
          <LoginPrompt message="You need to be signed in to view your reports." />
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <header className="border-b border-border mb-8">
        <Container>
          <Heading level={1} size="h1" className="mb-1">
            My Reports
          </Heading>
          <Text color="muted" size="sm">
            Items you have reported.
          </Text>
        </Container>
      </header>

      <Container>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div role="alert" className="py-12 text-center">
            <Text color="muted" className="mb-4 block">{error}</Text>
            <Button variant="ghost" size="sm" onClick={() => fetchReports()}>
              Retry
            </Button>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 md:py-24">
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
              NO REPORTS YET
            </Heading>
            <Text color="muted" className="mb-8 max-w-sm mx-auto leading-relaxed">
              You have not reported any items yet.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button variant="secondary" size="lg">
                  Browse Items
                </Button>
              </Link>
              <Link to="/report-lost">
                <Button variant="primary" size="lg">
                  Report an Item
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <Text color="muted" size="sm">
                {reports.length} report{reports.length !== 1 ? 's' : ''}
              </Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reports.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="group block no-underline text-current outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-card"
                >
                  <article className="border border-border bg-surface-card rounded-card overflow-hidden transition-all duration-300 ease-out group-hover:shadow-strong group-hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-surface-subtle overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-grey-light">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="M21 15l-5-5L15 15" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 space-y-3">
                      <Heading level={3} size="h4" className="group-hover:text-brand transition-colors truncate">
                        {item.name}
                      </Heading>
                      <Text size="sm" color="muted" className="line-clamp-2">
                        {item.description}
                      </Text>
                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <Text size="sm" color="muted">{item.location}</Text>
                        <Text size="sm" color="muted">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};