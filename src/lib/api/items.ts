import { apiClient } from './client';
import type { Item, ItemCategory, ItemStatus } from '@/types/item';
import type { ReportFormData } from '@/types/report';

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

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const query = params.toString();
  const path = `/items${query ? `?${query}` : ''}`;
  return apiClient.get<Item[]>(path);
}

export async function getItemById(id: string): Promise<Item> {
  return apiClient.get<Item>(`/items/${encodeURIComponent(id)}`);
}

export async function createItem(data: CreateItemRequest): Promise<Item> {
  return apiClient.post<Item>('/items', data);
}

export async function getReportsForUser(userIdentifier: string): Promise<Item[]> {
  return apiClient.get<Item[]>(`/items?reporterName=${encodeURIComponent(userIdentifier)}&sortOrder=desc`);
}

export function toCreateItemRequest(formData: ReportFormData, reporterName: string, status: ItemStatus, contact: string): CreateItemRequest {
  const image = formData.imagePreview ?? null;
  return {
    name: formData.name,
    status,
    category: formData.category,
    description: formData.description,
    location: formData.location,
    date: formData.date,
    image,
    reporterName,
    contact,
  };
}
