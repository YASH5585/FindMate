import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { useFilters } from '@/hooks/useFilters';
import { useSort } from '@/hooks/useSort';
import Image from 'next/image';
import { Item } from '@/types/item';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/browse/EmptyState';
import { LoadingState } from '@/components/browse/LoadingState';
import styles from '@/styles/BrowsePage.module.css';
import { cn } from '@/lib/utils';

export const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<'createdAt'>('createdAt');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    const f = searchParams.get('filters');
    if (f) setFilters(JSON.parse(f));
    const s = searchParams.get('sort');
    if (s) setSortBy(s);
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters({});
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const query = searchParams.get('q') ?? searchQuery;
      const result = await fetch(`/api/items?search=${query}&filters=${JSON.stringify(filters)}&sort=${sortBy}`);
      if (!result.ok) throw new Error('Failed to fetch items');
      const data = await result.json();
      setItems(data.items);
    } catch (err) {
      setError('Unable to load items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Browse Lost & Found</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </header>

      <section className={styles.filters}>
        <select
          name="category"
          value={filters.category ?? ''}
          onChange={handleFilterChange}
          className={styles.select}
        >
          <option value="">All Categories</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>

        <select
          name="dateRange"
          value={filters.dateRange ?? ''}
          onChange={handleFilterChange}
          className={styles.select}
        >
          <option value="">Any Date</option>
          <option value="today">Today</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>

        <select
          name="sort"
          value={sortBy}
          onChange={handleSortChange}
          className={styles.select}
        >
          <option value="createdAt">Newest</option>
          <option value="name">A‑Z</option>
          <option value="date">Oldest</option>
        </select>
      </section>

      {loading && <LoadingState />}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <div className={styles.grid}>
          {items.length ? (
            items.map(item => (
              <div key={item.id} className={styles.card}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={200}
                  height={150}
                  className={styles.thumbnail}
                />
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.desc}>{item.description}</p>
                <p className={styles.meta}>
                  <strong>Category:</strong> {item.category}{' '}
                  <strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <EmptyState message="No items found." />
          )}
        </div>
      )}
    </div>
  );
};