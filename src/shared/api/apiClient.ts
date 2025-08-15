import { authFetch, apiUrl } from '../utils/api';

export const apiClient = {
  get: async (path: string, options?: { params?: Record<string, unknown> }) => {
    const url = new URL(apiUrl(path));
    
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await authFetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  },

  post: async (path: string, data?: unknown) => {
    const response = await authFetch(apiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  },

  put: async (path: string, data?: unknown) => {
    const response = await authFetch(apiUrl(path), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  },

  delete: async (path: string) => {
    const response = await authFetch(apiUrl(path), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  },
};