export interface ApiClientOptions {
  baseURL: string;
}

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  private baseURL: string;

  constructor(options: ApiClientOptions) {
    this.baseURL = options.baseURL.replace(/\/$/, '');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      let details: unknown;
      try {
        const errorBody = await response.json();
        errorMessage =
          (errorBody as { message?: string; error?: string }).message ??
          (errorBody as { message?: string; error?: string }).error ??
          errorMessage;
        details = errorBody;
      } catch {
        // ignore non-JSON error bodies
      }
      throw new ApiError(errorMessage, response.status, details);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      throw new ApiError(
        `Expected JSON response but received ${contentType || 'no content-type'}`,
        response.status
      );
    }
    return (await response.json()) as T;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = new ApiClient({ baseURL: API_URL });
