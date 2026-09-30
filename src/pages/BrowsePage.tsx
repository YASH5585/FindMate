import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Item } from '@/types/item';
import { mockItems } from '@/data/mockItems';
import { getItems } from '@/lib/api/items';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';
import { SearchBar } from '@/components/browse/SearchBar';
import { FilterControls } from '@/components/browse/FilterControls';
import { SortControl } from '@/components/browse/SortControl';
import { ItemGrid } from '@/components/browse/ItemGrid';
import { EmptyState } from '@/components/browse/EmptyState';

type SortOption = 'newest' | 'oldest';

const dateToNumber = (dateString: string): number => {
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

const isRecent = (dateString: string, days: number): boolean => {
  const itemDate = new Date(dateString);
  if (isNaN(itemDate.getTime())) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return itemDate >= cutoff;
};

const normalize = (value: string): string => value.toLowerCase().trim();

export const BrowsePage = () => {
  const [, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [date, setDate] = useState('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getItems()
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems(mockItems);
          setError('Could not load items from server; showing demo data.');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const hasActiveFilters =
    status !== 'all' ||
    category !== 'all' ||
    locationFilter !== 'all' ||
    date !== 'all' ||
    searchQuery !== '';

   const filtered = useMemo(() => {
    const query = normalize(searchQuery);

    return items.filter((item: Item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (locationFilter !== 'all' && normalize(item.location) !== normalize(locationFilter)) {
        return false;
      }

      if (date === 'recent' && !isRecent(item.date, 7)) return false;
      if (date === 'older' && isRecent(item.date, 7)) return false;

      if (query) {
        const text = normalize(`${item.name} ${item.description} ${item.category} ${item.location} ${item.reporterName}`);
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [items, searchQuery, status, category, locationFilter, date]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    items.sort((a, b) => {
      const aTime = dateToNumber(a.date);
      const bTime = dateToNumber(b.date);
      return sort === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return items;
  }, [filtered, sort]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatus('all');
    setCategory('all');
    setLocationFilter('all');
    setDate('all');
    setSort('newest');
    setSearchParams({});
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value !== 'all') {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <Container>
          <Heading level={1} size="h1" className="mb-2">
            Browse Lost & Found
          </Heading>
          <Text color="muted">
            {sorted.length} item{sorted.length !== 1 ? 's' : ''} found
          </Text>
        </Container>
      </header>

      <Container>
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} />
        </div>

        <div className="mb-6">
          <FilterControls
            status={status}
            category={category}
            location={locationFilter}
            date={date}
            onStatusChange={setStatus}
            onCategoryChange={handleCategoryChange}
            onLocationChange={setLocationFilter}
            onDateChange={setDate}
            onClearAll={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

          <div className="flex items-center justify-between mb-6">
          <SortControl value={sort} onChange={setSort} />
        </div>

        {error && (
          <Text color="muted" size="sm" className="mb-4">
            {error}
          </Text>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState onClearFilters={handleClearFilters} />
        ) : (
          <ItemGrid items={sorted} />
        )}
      </Container>
    </div>
  );
};