import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthCallback from '../components/AuthCallback';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Helper to render AuthCallback with router and auth context
const renderAuthCallback = (
  initialPath: string,
  authOverrides: Partial<{
    isAuthenticated: boolean;
    loading: boolean;
  }> = {}
) => {
  const mockAuthContext = {
    user: null,
    session: null,
    loading: false,
    signingOut: false,
    isAuthenticated: false,
    isAnonymous: true,
    hasMigrated: false,
    migrationInProgress: false,
    anonMigrationInProgress: false,
    migratedResumeCount: 0,
    showAuthModal: vi.fn(),
    hideAuthModal: vi.fn(),
    authModalOpen: false,
    signInWithGoogle: vi.fn(),
    signInWithLinkedIn: vi.fn(),
    signInWithEmail: vi.fn(),
    signOut: vi.fn(),
    ...authOverrides,
  };

  // Track navigation
  let navigatedTo: string | null = null;

  const TestWrapper = () => {
    return (
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/"
              element={<div data-testid="home-page">Home</div>}
            />
            <Route
              path="/editor/:id"
              element={<div data-testid="editor-page">Editor</div>}
            />
            <Route
              path="/my-resumes"
              element={<div data-testid="my-resumes-page">My Resumes</div>}
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  return {
    ...render(<TestWrapper />),
    mockAuthContext,
  };
};

describe('AuthCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('Error Handling', () => {
    it('redirects to home on bad_oauth_state error', async () => {
      renderAuthCallback('/auth/callback?error=invalid_request&error_code=bad_oauth_state');

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('shows toast message for bad_oauth_state error', async () => {
      renderAuthCallback('/auth/callback?error=invalid_request&error_code=bad_oauth_state');

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Sign-in link expired or already used. Please try signing in again.',
          expect.objectContaining({ duration: 6000, id: 'auth-error' })
        );
      });
    });

    it('shows toast message for access_denied error', async () => {
      renderAuthCallback('/auth/callback?error=access_denied&error_code=access_denied');

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Sign-in was cancelled. Please try again.',
          expect.objectContaining({ duration: 5000, id: 'auth-error' })
        );
      });
    });

    it('shows generic error message for unknown errors', async () => {
      renderAuthCallback('/auth/callback?error=server_error&error_code=unknown');

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Sign-in failed. Please try again.',
          expect.objectContaining({ duration: 5000, id: 'auth-error' })
        );
      });
    });

    it('cleans up sessionStorage on error', async () => {
      sessionStorage.setItem('auth-return-to', '/editor/123');

      renderAuthCallback('/auth/callback?error=invalid_request&error_code=bad_oauth_state');

      await waitFor(() => {
        expect(sessionStorage.getItem('auth-return-to')).toBeNull();
      });
    });
  });

  describe('Success Handling', () => {
    it('redirects to stored returnTo path on success', async () => {
      sessionStorage.setItem('auth-return-to', '/my-resumes');

      renderAuthCallback('/auth/callback', { isAuthenticated: true, loading: false });

      await waitFor(() => {
        expect(screen.getByTestId('my-resumes-page')).toBeInTheDocument();
      });
    });

    it('defaults to / when no returnTo is stored', async () => {
      renderAuthCallback('/auth/callback', { isAuthenticated: true, loading: false });

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('cleans up sessionStorage after successful redirect', async () => {
      sessionStorage.setItem('auth-return-to', '/editor/123');

      renderAuthCallback('/auth/callback', { isAuthenticated: true, loading: false });

      await waitFor(() => {
        expect(sessionStorage.getItem('auth-return-to')).toBeNull();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner while processing', () => {
      renderAuthCallback('/auth/callback', { isAuthenticated: false, loading: true });

      expect(screen.getByText('Completing sign-in...')).toBeInTheDocument();
    });

    it('does not redirect while loading', async () => {
      sessionStorage.setItem('auth-return-to', '/my-resumes');

      renderAuthCallback('/auth/callback', { isAuthenticated: false, loading: true });

      // Should still show loading, not redirect
      expect(screen.getByText('Completing sign-in...')).toBeInTheDocument();
      expect(screen.queryByTestId('my-resumes-page')).not.toBeInTheDocument();
    });
  });
});
