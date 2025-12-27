import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserMenu from '../components/UserMenu';
import { renderWithProviders, createMockUser, createMockAuthContext, createMockAnonymousAuthContext } from '../test-utils';
import type { User } from '@supabase/supabase-js';

// Mock the useUserAvatar hook
vi.mock('../hooks/useUserAvatar', () => ({
  useUserAvatar: vi.fn((user) => {
    if (!user?.user_metadata?.avatar_url) {
      return {
        avatarUrl: null,
        hasError: false,
        handleError: vi.fn(),
        retry: vi.fn(),
      };
    }
    return {
      avatarUrl: `${user.user_metadata.avatar_url}?t=123-0`,
      hasError: false,
      handleError: vi.fn(),
      retry: vi.fn(),
    };
  }),
}));

describe('UserMenu', () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Anonymous Users', () => {
    it('should show gradient fallback with "G" for Guest user', () => {
      const anonymousUser = {
        ...createMockUser(),
        is_anonymous: true,
        user_metadata: {},
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAnonymousAuthContext({
          user: anonymousUser,
          signOut: mockSignOut,
        }),
      });

      // Should show "G" for Guest
      expect(screen.getByText('G')).toBeInTheDocument();
      expect(screen.getByText('Guest')).toBeInTheDocument();

      // Should NOT render an img tag
      const images = screen.queryAllByRole('img');
      expect(images).toHaveLength(0);
    });
  });

  describe('Authenticated Users Without Avatar', () => {
    it('should show gradient fallback with user initial when avatar_url is missing', () => {
      const userWithoutAvatar = {
        ...createMockUser(),
        user_metadata: {
          full_name: 'John Doe',
        },
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user: userWithoutAvatar,
          session: { user: userWithoutAvatar },
          signOut: mockSignOut,
        }),
      });

      // Should show "J" for John
      expect(screen.getByText('J')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Should NOT render an img tag
      const images = screen.queryAllByRole('img');
      expect(images).toHaveLength(0);
    });

    it('should show initial from email when full_name is missing', () => {
      const userWithEmail = {
        ...createMockUser(),
        email: 'sarah@example.com',
        user_metadata: {},
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user: userWithEmail,
          session: { user: userWithEmail },
          signOut: mockSignOut,
        }),
      });

      // Should show "S" for sarah (from email)
      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByText('sarah')).toBeInTheDocument();
    });
  });

  describe('Authenticated Users With Avatar', () => {
    it('should render img tag with correct src and attributes', () => {
      const user = createMockUser({
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      });

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      const img = screen.getByRole('img', { name: 'Test User' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', expect.stringContaining('https://example.com/avatar.jpg'));
      expect(img).toHaveAttribute('alt', 'Test User');
    });

    it('should have referrerPolicy="no-referrer" attribute', () => {
      const user = createMockUser({
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      });

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('referrerpolicy', 'no-referrer');
    });

    it('should have crossOrigin="anonymous" attribute', () => {
      const user = createMockUser({
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      });

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('crossorigin', 'anonymous');
    });
  });

  describe('Error Handling', () => {
    it('should show fallback when hasError is true', async () => {
      const { useUserAvatar: mockUseUserAvatar } = await import('../hooks/useUserAvatar');

      // Mock the hook to return hasError: true
      vi.mocked(mockUseUserAvatar).mockReturnValueOnce({
        avatarUrl: 'https://example.com/avatar.jpg?t=123-0',
        hasError: true,
        handleError: vi.fn(),
        retry: vi.fn(),
      });

      const user = createMockUser({
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      });

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      // Should show fallback (initial) instead of image
      expect(screen.getByText('T')).toBeInTheDocument(); // "T" for "Test User"
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('User Menu Interactions', () => {
    it('should open dropdown menu when clicked', async () => {
      const user = createMockUser();

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      // Find and click the user menu button
      const menuButton = screen.getByLabelText('User menu');
      fireEvent.click(menuButton);

      // Dropdown should be visible
      await waitFor(() => {
        expect(screen.getByText('My Resumes')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });

    it('should call signOut when Sign Out is clicked', async () => {
      const user = createMockUser();

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      // Open menu
      const menuButton = screen.getByLabelText('User menu');
      fireEvent.click(menuButton);

      // Click Sign Out
      const signOutButton = await screen.findByText('Sign Out');
      fireEvent.click(signOutButton);

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('should show "Start Fresh" instead of "Sign Out" for anonymous users', async () => {
      const anonymousUser = {
        ...createMockUser(),
        is_anonymous: true,
        user_metadata: {},
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAnonymousAuthContext({
          user: anonymousUser,
          signOut: mockSignOut,
        }),
      });

      // Open menu
      const menuButton = screen.getByLabelText('User menu');
      fireEvent.click(menuButton);

      // Should show "Start Fresh" not "Sign Out"
      await waitFor(() => {
        expect(screen.getByText('Start Fresh')).toBeInTheDocument();
        expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
      });
    });

    it('should not show "My Resumes" for anonymous users', async () => {
      const anonymousUser = {
        ...createMockUser(),
        is_anonymous: true,
        user_metadata: {},
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAnonymousAuthContext({
          user: anonymousUser,
          signOut: mockSignOut,
        }),
      });

      // Open menu
      const menuButton = screen.getByLabelText('User menu');
      fireEvent.click(menuButton);

      // Should NOT show "My Resumes" for anonymous users
      await waitFor(() => {
        expect(screen.queryByText('My Resumes')).not.toBeInTheDocument();
      });
    });
  });

  describe('Display Name Logic', () => {
    it('should show full_name when available', () => {
      const user = {
        ...createMockUser(),
        user_metadata: {
          full_name: 'Jane Smith',
        },
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('J')).toBeInTheDocument(); // Initial
    });

    it('should fall back to email username when full_name is missing', () => {
      const user = {
        ...createMockUser(),
        email: 'bob.jones@example.com',
        user_metadata: {},
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      expect(screen.getByText('bob.jones')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument(); // Initial
    });

    it('should fall back to "User" when both full_name and email are missing', () => {
      const user = {
        ...createMockUser(),
        email: undefined,
        user_metadata: {},
      };

      renderWithProviders(<UserMenu />, {
        authContext: createMockAuthContext({
          user,
          session: { user },
          signOut: mockSignOut,
        }),
      });

      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('U')).toBeInTheDocument(); // Initial
    });
  });
});
