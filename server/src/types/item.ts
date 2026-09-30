import type { ItemStatus, ItemCategory } from './index';

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  image: string | null;
  reporterName: string;
  contact: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  status: ItemStatus;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  image: string | null;
  reporterName: string;
  contact: string;
  userId: string;
}

export interface ItemFilters {
  status?: string;
  category?: string;
  location?: string;
  search?: string;
  sortBy?: 'createdAt' | 'name' | 'date';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export type { ItemStatus, ItemCategory };
