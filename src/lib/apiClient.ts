import { env } from './env';
import { getToken } from './auth-token';

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const token = skipAuth ? undefined : getToken();
  if (token) {
    (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Request failed: ${res.status}`);
  }

  // Handles 204 No Content responses (e.g. some DELETE endpoints)
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', ...(body ? { body: JSON.stringify(body) } : {}) }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', ...(body ? { body: JSON.stringify(body) } : {}) }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', ...(body ? { body: JSON.stringify(body) } : {}) }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
