type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

const BASE_URL = 'http://localhost:8080/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }
  return await response.json();
}

export const api = {
  get: <T>(endpoint: string, headers?: any) =>
    apiRequest<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: any, headers?: any) =>
    apiRequest<T>(endpoint, { method: 'POST', body, headers }),

  put: <T>(endpoint: string, body?: any, headers?: any) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, headers }),

  delete: <T>(endpoint: string, headers?: any) =>
    apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};
