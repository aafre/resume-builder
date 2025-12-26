import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

/**
 * Custom error class for authentication failures
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuth?: boolean; // Skip Authorization header (for public endpoints)
}

/**
 * Centralized API client with automatic auth token attachment and error handling
 *
 * Features:
 * - Automatic Bearer token attachment from Supabase session
 * - Global 401/403 interceptor with automatic sign-out
 * - Type-safe request/response handling
 * - Consistent error messages and toast notifications
 * - Prevents manual Authorization header construction
 *
 * Usage:
 * ```typescript
 * import { apiClient } from './lib/api-client';
 *
 * // GET request
 * const resumes = await apiClient.get('/api/resumes');
 *
 * // POST request
 * const result = await apiClient.post('/api/resumes', { title: 'My Resume', ... });
 *
 * // DELETE request
 * await apiClient.delete(`/api/resumes/${resumeId}`);
 * ```
 */
class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new AuthError('No active session');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`
    };
  }

  private async handleResponse(response: Response): Promise<any> {
    // Handle 401/403 auth errors globally
    if (response.status === 401 || response.status === 403) {
      console.error(`❌ Auth error: ${response.status} ${response.statusText}`);

      toast.error('Session expired. Please sign in again.', {
        duration: 5000,
        id: 'session-expired', // Prevent duplicate toasts
      });

      // Sign out user and clear session
      try {
        await supabase?.auth.signOut();
      } catch (signOutError) {
        console.error('Failed to sign out after auth error:', signOutError);
      }

      throw new AuthError('Session expired or unauthorized');
    }

    // Try to parse JSON response
    let data: any;
    try {
      data = await response.json();
    } catch (parseError) {
      // Response is not JSON (could be empty or different content type)
      if (!response.ok) {
        throw new ApiError(
          `Request failed: ${response.statusText}`,
          response.status
        );
      }
      return null;
    }

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  }

  /**
   * Perform GET request
   */
  async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.skipAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: options.signal,
    });

    return this.handleResponse(response);
  }

  /**
   * Perform POST request
   */
  async post<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.skipAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: options.signal,
    });

    return this.handleResponse(response);
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.skipAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      signal: options.signal,
    });

    return this.handleResponse(response);
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.skipAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      signal: options.signal,
    });

    return this.handleResponse(response);
  }

  /**
   * Perform multipart/form-data POST request (for file uploads)
   * Note: Don't set Content-Type header - browser will set it with boundary
   */
  async postFormData<T = any>(url: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...options.headers,
      // Don't set Content-Type for FormData - browser sets it with boundary
    };

    if (!options.skipAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      signal: options.signal,
    });

    return this.handleResponse(response);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
