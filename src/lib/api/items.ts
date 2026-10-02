import { apiClient, ApiError } from './client';
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

export interface UploadResponse {
  url: string;
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

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);

  const response = await fetch(`${apiClient.getBaseURL()}/upload/image`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  if (!response.ok) {
    let errorMessage = `Upload failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage =
        (errorBody as { message?: string; error?: string }).message ??
        (errorBody as { message?: string; error?: string }).error ??
        errorMessage;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(errorMessage, response.status);
  }

  const result = (await response.json()) as UploadResponse;
  return result.url;
}

export async function getReportsForUser(_userIdentifier: string): Promise<Item[]> {
  return getMyReports();
}

export async function getMyReports(): Promise<Item[]> {
  return apiClient.get<Item[]>('/items/mine');
}

export function toCreateItemRequest(
  formData: ReportFormData,
  reporterName: string,
  status: ItemStatus,
  contact: string,
  imageUrl: string | null = null
): CreateItemRequest {
  return {
    name: formData.name,
    status,
    category: formData.category,
    description: formData.description,
    location: formData.location,
    date: formData.date,
    image: imageUrl,
    reporterName,
    contact,
  };
}
