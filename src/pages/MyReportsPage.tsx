import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Item } from '@/types/item';
import { mockItems } from '@/data/mockItems';
import { getReportsForUser } from '@/lib/api/items';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';
import { ItemGrid } from '@/components/browse/ItemGrid';

const DEMO_USER = 'Alex Chen';

export const MyReportsPage = () => {
  const [reports, setReports] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getReportsForUser(DEMO_USER)
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        const fallback = mockItems.filter((item: Item) => item.reporterName === DEMO_USER);
        setReports(fallback);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full py-8">
      <header className="border-b border-black/10 mb-8">
        <Container>
          <Heading level={1} size="h1" className="mb-1">
            My Reports
          </Heading>
          <Text color="muted" size="sm">
            Demo user: {DEMO_USER}. Items you have reported.
          </Text>
        </Container>
      </header>

      <Container>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : reports.length === 0 ? (
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
            <div className="mb-4">
              <Text color="muted" size="sm">
                {reports.length} report{reports.length !== 1 ? 's' : ''}
              </Text>
            </div>
            <ItemGrid items={reports} />
          </>
        )}
      </Container>
    </div>
  );
};
