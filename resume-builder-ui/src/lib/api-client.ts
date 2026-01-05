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

/**
 * Custom error class to signal that a request should be retried with a fresh token
 */
class RetryRequestError extends Error {
  public readonly shouldRetry = true;

  constructor() {
    super('RETRY_WITH_FRESH_TOKEN');
    this.name = 'RetryRequestError';
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuth?: boolean; // Skip Authorization header (for public endpoints)
  session?: any; // Pass session directly to avoid slow getSession() calls
  responseType?: 'json' | 'blob' | 'text' | 'raw'; // Response parsing strategy
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
 * import { useAuth } from './contexts/AuthContext';
 *
 * const { session } = useAuth();
 *
 * // Pass session to avoid slow getSession() calls after hard refresh
 * const resumes = await apiClient.get('/api/resumes', { session });
 *
 * // Or use setSession() to cache session globally
 * apiClient.setSession(session);
 * const resumes = await apiClient.get('/api/resumes');
 * ```
 */
class ApiClient {
  private cachedSession: any = null;

  /**
   * Set the current session to avoid calling getSession() on every request.
   * This prevents 30s hangs after hard refresh (Ctrl+F5).
   *
   * Call this from AuthContext whenever session changes.
   */
  setSession(session: any) {
    this.cachedSession = session;
  }

  private async getAuthHeaders(providedSession?: any): Promise<Record<string, string>> {
    // Use provided session first (from request options)
    if (providedSession) {
      return {
        'Authorization': `Bearer ${providedSession.access_token}`
      };
    }

    // Use cached session second (set by setSession())
    if (this.cachedSession) {
      return {
        'Authorization': `Bearer ${this.cachedSession.access_token}`
      };
    }

    // Fallback to getSession() (slow after hard refresh)
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

  /**
   * Handle fatal authentication errors by clearing session, showing toast, and signing out
   */
  private async _handleFatalAuthError(): Promise<never> {
    this.cachedSession = null;

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

  private async handleResponse<T = any>(
    response: Response,
    isRetry: boolean = false,
    responseType: 'json' | 'blob' | 'text' | 'raw' = 'json'
  ): Promise<T> {
    // Handle 401/403 auth errors globally
    if (response.status === 401 || response.status === 403) {
      console.error(`❌ Auth error: ${response.status} ${response.statusText}`);

      // If this is already a retry, or if there's no Supabase client, give up
      if (isRetry || !supabase) {
        await this._handleFatalAuthError();
      }

      // First 401: try to refresh the token and signal retry needed
      console.log('🔄 Token expired, will retry with fresh token...');

      // Clear cached session to force fresh token fetch
      this.cachedSession = null;

      // Let Supabase SDK refresh the token (supabase is guaranteed non-null here)
      try {
        const { data: { session }, error } = await supabase!.auth.refreshSession();
        if (error || !session) {
          throw new Error('Token refresh failed');
        }

        // Update cached session with fresh token
        this.cachedSession = session;
        console.log('✅ Token refreshed successfully');

        // Throw error to signal retry is needed
        throw new RetryRequestError();
      } catch (refreshError: any) {
        // If refresh failed, proceed to sign out
        if (!(refreshError instanceof RetryRequestError)) {
          console.error('❌ Token refresh failed:', refreshError);
          await this._handleFatalAuthError();
        }

        // Re-throw retry signal
        throw refreshError;
      }
    }

    // Handle different response types
    if (responseType === 'blob') {
      if (!response.ok) {
        // For errors, read the body as text, then try to parse as JSON
        const errorText = await response.text();
        let errorMessage = errorText || `Request failed: ${response.statusText}`;
        let errorData;

        try {
          errorData = JSON.parse(errorText);
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch (e) {
          // Not a JSON response, use the raw text as the error message
        }

        throw new ApiError(errorMessage, response.status, errorData);
      }
      return (await response.blob()) as T;
    }

    if (responseType === 'text') {
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(
          errorText || `Request failed: ${response.statusText}`,
          response.status
        );
      }
      return (await response.text()) as T;
    }

    if (responseType === 'raw') {
      // Return raw Response object for custom handling
      return response as T;
    }

    // Default: 'json' (existing logic)
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
      return null as T;
    }

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  }

  /**
   * Common request handler with automatic retry logic
   */
  private async _request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    options: RequestOptions = {},
    data?: any
  ): Promise<T> {
    const makeRequest = async (isRetry: boolean = false) => {
      const headers: Record<string, string> = {
        ...options.headers,
      };

      // Don't set Content-Type for FormData - browser sets it with boundary
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      if (!options.skipAuth) {
        const authHeaders = await this.getAuthHeaders(options.session);
        Object.assign(headers, authHeaders);
      }

      const response = await fetch(url, {
        method,
        headers,
        body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
        signal: options.signal,
      });

      return this.handleResponse<T>(response, isRetry, options.responseType || 'json');
    };

    try {
      return await makeRequest(false);
    } catch (error: any) {
      // Retry once if token was refreshed
      if (error instanceof RetryRequestError) {
        console.log(`🔁 Retrying ${method} request with fresh token...`);
        return await makeRequest(true);
      }
      throw error;
    }
  }

  /**
   * Perform GET request
   */
  async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>('GET', url, options);
  }

  /**
   * Perform POST request
   */
  async post<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this._request<T>('POST', url, options, data);
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this._request<T>('PUT', url, options, data);
  }

  /**
   * Perform PATCH request
   */
  async patch<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this._request<T>('PATCH', url, options, data);
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>('DELETE', url, options);
  }

  /**
   * Perform multipart/form-data POST request (for file uploads)
   * Note: Don't set Content-Type header - browser will set it with boundary
   */
  async postFormData<T = any>(url: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    return this._request<T>('POST', url, options, formData);
  }

  /**
   * Perform POST request expecting blob/binary response (e.g., PDF)
   */
  async postBlob(url: string, data?: any, options: RequestOptions = {}): Promise<Blob> {
    return this._request<Blob>('POST', url, { ...options, responseType: 'blob' }, data);
  }

  /**
   * Perform GET request expecting blob/binary response
   */
  async getBlob(url: string, options: RequestOptions = {}): Promise<Blob> {
    return this._request<Blob>('GET', url, { ...options, responseType: 'blob' });
  }

  /**
   * Perform POST request expecting text response
   */
  async postText(url: string, data?: any, options: RequestOptions = {}): Promise<string> {
    return this._request<string>('POST', url, { ...options, responseType: 'text' }, data);
  }

  /**
   * Perform GET request expecting text response
   */
  async getText(url: string, options: RequestOptions = {}): Promise<string> {
    return this._request<string>('GET', url, { ...options, responseType: 'text' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
