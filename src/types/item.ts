export type ItemStatus = 'lost' | 'found';
export type ItemCategory = 'electronics' | 'id-card' | 'bags' | 'books' | 'accessories' | 'clothing' | 'other';

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  image?: string | null;
  reporterName: string;
  contact?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}