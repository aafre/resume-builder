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
        // Simulate INITIAL_SESSION with no session (triggers anonymous sign-in)
        setTimeout(() => callback('INITIAL_SESSION', null), 0);
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
});
