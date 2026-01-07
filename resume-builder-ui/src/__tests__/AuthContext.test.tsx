import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Mock Supabase client
const mockSignInWithOAuth = vi.fn();
const mockSignInWithOtp = vi.fn();
const mockSignOut = vi.fn();
const mockSignInAnonymously = vi.fn();
const mockGetUser = vi.fn();
const mockRefreshSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

// Session to simulate in onAuthStateChange - can be overridden per test
let mockInitialSession: Session | null = null;

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: (...args: any[]) => mockSignInWithOAuth(...args),
      signInWithOtp: (...args: any[]) => mockSignInWithOtp(...args),
      signOut: (...args: any[]) => mockSignOut(...args),
      signInAnonymously: (...args: any[]) => mockSignInAnonymously(...args),
      getUser: (...args: any[]) => mockGetUser(...args),
      refreshSession: (...args: any[]) => mockRefreshSession(...args),
      onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        mockOnAuthStateChange(callback);
        // Use mockInitialSession which can be set per-test
        setTimeout(() => callback('INITIAL_SESSION', mockInitialSession), 0);
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      },
    },
  },
}));

// Mock api-client
vi.mock('../lib/api-client', () => ({
  apiClient: {
    setSession: vi.fn(),
    post: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number;
    data: any;
    constructor(message: string, status: number, data?: any) {
      super(message);
      this.status = status;
      this.data = data;
    }
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AuthContext - OAuth redirects', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    // Reset initial session to null (triggers anonymous sign-in by default)
    mockInitialSession = null;

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://easyfreeresume.com',
        pathname: '/editor/abc-123',
        search: '?foo=bar',
        href: 'https://easyfreeresume.com/editor/abc-123?foo=bar',
      },
      writable: true,
    });

    // Default mock implementations
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    mockSignInWithOtp.mockResolvedValue({ data: {}, error: null });
    mockSignInAnonymously.mockResolvedValue({ data: { user: { id: 'anon-123' } }, error: null });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    sessionStorage.clear();
  });

  const renderAuthHook = () => {
    return renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
  };

  describe('signInWithGoogle', () => {
    it('stores current path in sessionStorage before Google OAuth', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(sessionStorage.getItem('auth-return-to')).toBe('/editor/abc-123?foo=bar');
    });

    it('uses /auth/callback as redirectTo for Google OAuth', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'https://easyfreeresume.com/auth/callback',
        },
      });
    });
  });

  describe('signInWithLinkedIn', () => {
    it('stores current path in sessionStorage before LinkedIn OAuth', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithLinkedIn();
      });

      expect(sessionStorage.getItem('auth-return-to')).toBe('/editor/abc-123?foo=bar');
    });

    it('uses /auth/callback as redirectTo for LinkedIn OAuth', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithLinkedIn();
      });

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: 'https://easyfreeresume.com/auth/callback',
        },
      });
    });
  });

  describe('signInWithEmail (magic link)', () => {
    it('stores current path in sessionStorage before magic link', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithEmail('test@example.com');
      });

      expect(sessionStorage.getItem('auth-return-to')).toBe('/editor/abc-123?foo=bar');
    });

    it('uses /auth/callback as emailRedirectTo for magic link', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithEmail('test@example.com');
      });

      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: 'https://easyfreeresume.com/auth/callback',
        },
      });
    });
  });

  describe('signOut', () => {
    it('clears auth-return-to from sessionStorage on sign out', async () => {
      sessionStorage.setItem('auth-return-to', '/my-resumes');
      mockSignOut.mockResolvedValue({ error: null });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(sessionStorage.getItem('auth-return-to')).toBeNull();
    });
  });

  describe('authInProgress state', () => {
    it('sets authInProgress to true during Google OAuth', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.authInProgress).toBe(false);

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(result.current.authInProgress).toBe(true);
    });

    it('sets authInProgress to true during LinkedIn OAuth', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.authInProgress).toBe(false);

      await act(async () => {
        await result.current.signInWithLinkedIn();
      });

      expect(result.current.authInProgress).toBe(true);
    });

    it('resets authInProgress to false on OAuth error', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: new Error('OAuth failed') });

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.signInWithGoogle();
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.authInProgress).toBe(false);
    });

    it('does NOT set authInProgress for magic link', async () => {
      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signInWithEmail('test@example.com');
      });

      // Magic link doesn't redirect immediately, so authInProgress stays false
      expect(result.current.authInProgress).toBe(false);
    });
  });

  describe('proactive token refresh', () => {
    it('refreshes token when tab becomes visible and token expires in <5 min', async () => {
      const newSession = {
        access_token: 'new-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { id: 'user-123', is_anonymous: false },
      };

      mockRefreshSession.mockResolvedValue({ data: { session: newSession }, error: null });

      // Set initial session with token expiring in 1 minute
      mockInitialSession = {
        access_token: 'old-token',
        expires_at: Math.floor(Date.now() / 1000) + 60,
        user: { id: 'user-123', is_anonymous: false },
      } as Session;

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.session).not.toBeNull();
      });

      // Simulate tab becoming visible
      await act(async () => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        // Wait for async refresh
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(mockRefreshSession).toHaveBeenCalled();
    });

    it('does not refresh when token has >5 min remaining', async () => {
      // Set initial session with token expiring in 10 minutes
      mockInitialSession = {
        access_token: 'valid-token',
        expires_at: Math.floor(Date.now() / 1000) + 600,
        user: { id: 'user-123', is_anonymous: false },
      } as Session;

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.session).not.toBeNull();
      });

      // Simulate tab becoming visible
      await act(async () => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(mockRefreshSession).not.toHaveBeenCalled();
    });

    it('handles refresh errors gracefully', async () => {
      mockRefreshSession.mockRejectedValue(new Error('Refresh failed'));

      // Set initial session with token expiring in 1 minute
      mockInitialSession = {
        access_token: 'old-token',
        expires_at: Math.floor(Date.now() / 1000) + 60,
        user: { id: 'user-123', is_anonymous: false },
      } as Session;

      const { result } = renderAuthHook();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.session).not.toBeNull();
      });

      // Should not throw
      await act(async () => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Hook should still be functional
      expect(result.current.loading).toBe(false);
    });
  });
});
