/**
 * Centralized API Client
 * Handles all HTTP requests with error handling, authentication, and response standardization
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  body?: unknown;
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  /**
   * Get token from sessionStorage to avoid circular imports
   */
  private getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
   * Build headers with authorization if available
   */
  private buildHeaders(config?: ApiRequestConfig): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    if (!config?.skipAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response, endpoint: string): Promise<never> {
    // Try to parse error message from response first
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default error message
    }

    // Handle 401 Unauthorized - but preserve login error messages
    if (response.status === 401 && endpoint !== '/auth/login') {
      // Dynamically import to avoid circular dependency
      import('@/stores/authStore.js').then(module => {
        module.useAuthStore().logout();
      });
      throw new Error('Unauthorized - please log in again');
    }

    throw new Error(errorMessage);
  }

  /**
   * Make an API request
   */
  async request<T>(
    method: HttpMethod,
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(config);

    const fetchConfig: RequestInit = {
      method,
      headers,
    };

    if (config?.body) {
      fetchConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        await this.handleErrorResponse(response, endpoint);
      }

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      // Re-throw known errors
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, config);
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, { ...config, body });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...config, body });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, config);
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...config, body });
  }
}

export const apiClient = new ApiClient();
