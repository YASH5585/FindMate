import { apiClient } from './client';

export interface SafeUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: SafeUser;
}

export interface LogoutResponse {
  success: boolean;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/register', { name, email, password });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/login', { email, password });
}

export async function logout(): Promise<LogoutResponse> {
  return apiClient.post<LogoutResponse>('/auth/logout', {});
}

export async function getMe(): Promise<AuthResponse> {
  return apiClient.get<AuthResponse>('/auth/me');
}

export function toSafeUser(user: SafeUser): SafeUser {
  return { id: user.id, email: user.email, name: user.name };
}
