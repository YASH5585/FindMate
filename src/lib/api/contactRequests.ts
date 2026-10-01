import { apiClient } from './client';
import type { ContactRequest } from '@/types/contactRequest';

export interface CreateContactRequest {
  itemId: string;
  message: string;
}

export interface UpdateContactRequest {
  status: ContactRequest['status'];
}

export async function createContactRequest(data: CreateContactRequest): Promise<ContactRequest> {
  return apiClient.post<ContactRequest>('/contact-requests', data);
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  return apiClient.get<ContactRequest[]>('/contact-requests');
}

export async function getContactRequest(id: string): Promise<ContactRequest> {
  return apiClient.get<ContactRequest>(`/contact-requests/${encodeURIComponent(id)}`);
}

export async function updateContactRequest(id: string, data: UpdateContactRequest): Promise<ContactRequest> {
  return apiClient.patch<ContactRequest>(`/contact-requests/${encodeURIComponent(id)}`, data);
}
