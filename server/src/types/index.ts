export type ItemStatus = 'lost' | 'found';
export type ItemCategory =
  | 'electronics'
  | 'id-card'
  | 'bags'
  | 'books'
  | 'accessories'
  | 'clothing'
  | 'other';

export const ITEM_CATEGORIES: ItemCategory[] = [
  'electronics',
  'id-card',
  'bags',
  'books',
  'accessories',
  'clothing',
  'other',
];

export const ITEM_STATUSES: ItemStatus[] = ['lost', 'found'];

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}
