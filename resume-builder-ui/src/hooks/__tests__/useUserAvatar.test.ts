import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserAvatar } from '../useUserAvatar';
import type { User } from '@supabase/supabase-js';

describe('useUserAvatar', () => {
  // Mock user object factory
  const createMockUser = (avatarUrl?: string, updatedAt?: string): User => ({
    id: 'test-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: updatedAt || '2024-01-01T00:00:00Z',
    user_metadata: avatarUrl ? { avatar_url: avatarUrl } : {},
    app_metadata: {},
  } as User);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Avatar URL Generation', () => {
    it('should return null when user is null', () => {
      const { result } = renderHook(() => useUserAvatar(null));

      expect(result.current.avatarUrl).toBeNull();
      expect(result.current.hasError).toBe(false);
    });

    it('should return null when user.user_metadata is undefined', () => {
      const userWithoutMetadata = {
        ...createMockUser(),
        user_metadata: undefined,
      } as User;

      const { result } = renderHook(() => useUserAvatar(userWithoutMetadata));

      expect(result.current.avatarUrl).toBeNull();
    });

    it('should return null when avatar_url is missing from user_metadata', () => {
      const user = createMockUser(); // No avatar_url

      const { result } = renderHook(() => useUserAvatar(user));

      expect(result.current.avatarUrl).toBeNull();
    });

    it('should return avatar URL with cache-busting timestamp when avatar_url exists', () => {
      const baseUrl = 'https://example.com/avatar.jpg';
      const user = createMockUser(baseUrl, '2024-01-15T10:30:00Z');

      const { result } = renderHook(() => useUserAvatar(user));

      expect(result.current.avatarUrl).not.toBeNull();
      expect(result.current.avatarUrl).toContain(baseUrl);
      expect(result.current.avatarUrl).toMatch(/\?t=\d+-0$/); // Ends with timestamp-0 (retry count)
    });

    it('should append cache-busting with & if URL already has query parameters', () => {
      const baseUrl = 'https://example.com/avatar.jpg?size=200';
      const user = createMockUser(baseUrl);

      const { result } = renderHook(() => useUserAvatar(user));

      expect(result.current.avatarUrl).toContain('&t='); // Should use & not ?
      expect(result.current.avatarUrl).toMatch(/size=200&t=\d+-0$/);
    });

    it('should use user.updated_at for cache-busting timestamp', () => {
      const baseUrl = 'https://example.com/avatar.jpg';
      const updatedAt = '2024-01-15T10:30:00Z';
      const expectedTimestamp = new Date(updatedAt).getTime();

      const user = createMockUser(baseUrl, updatedAt);

      const { result } = renderHook(() => useUserAvatar(user));

      expect(result.current.avatarUrl).toContain(`t=${expectedTimestamp}-0`);
    });

    it('should update avatar URL when user.updated_at changes', () => {
      const baseUrl = 'https://example.com/avatar.jpg';
      const user1 = createMockUser(baseUrl, '2024-01-01T00:00:00Z');
      const user2 = createMockUser(baseUrl, '2024-01-15T00:00:00Z');

      const { result, rerender } = renderHook(
        ({ user }) => useUserAvatar(user),
        { initialProps: { user: user1 } }
      );

      const url1 = result.current.avatarUrl;
      const timestamp1 = new Date(user1.updated_at).getTime();
      expect(url1).toContain(`t=${timestamp1}-0`);

      // Update user with new updated_at
      rerender({ user: user2 });

      const url2 = result.current.avatarUrl;
      const timestamp2 = new Date(user2.updated_at).getTime();
      expect(url2).toContain(`t=${timestamp2}-0`);
      expect(url1).not.toBe(url2); // URLs should be different
    });
  });

  describe('Error Handling', () => {
    it('should set hasError to true when handleError is called', () => {
      const user = createMockUser('https://example.com/avatar.jpg');

      const { result } = renderHook(() => useUserAvatar(user));

      expect(result.current.hasError).toBe(false);

      act(() => {
        result.current.handleError();
      });

      expect(result.current.hasError).toBe(true);
    });

    it('should reset hasError when user changes', () => {
      const user1 = createMockUser('https://example.com/avatar1.jpg');
      const user2 = { ...createMockUser('https://example.com/avatar2.jpg'), id: 'different-user-id' };

      const { result, rerender } = renderHook(
        ({ user }) => useUserAvatar(user),
        { initialProps: { user: user1 } }
      );

      // Trigger error
      act(() => {
        result.current.handleError();
      });

      expect(result.current.hasError).toBe(true);

      // Change user
      rerender({ user: user2 });

      // Error should be reset
      expect(result.current.hasError).toBe(false);
    });

    it('should NOT reset hasError if user object changes but ID is the same', () => {
      const user1 = createMockUser('https://example.com/avatar.jpg');
      const user2 = { ...user1, updated_at: '2024-02-01T00:00:00Z' };

      const { result, rerender } = renderHook(
        ({ user }) => useUserAvatar(user),
        { initialProps: { user: user1 } }
      );

      // Trigger error
      act(() => {
        result.current.handleError();
      });

      expect(result.current.hasError).toBe(true);

      // Update user with same ID (e.g., metadata update)
      rerender({ user: user2 });

      // Error should remain (only resets when user.id changes)
      expect(result.current.hasError).toBe(true);
    });
  });

  describe('Retry Mechanism', () => {
    it('should reset hasError when retry is called', () => {
      const user = createMockUser('https://example.com/avatar.jpg');

      const { result } = renderHook(() => useUserAvatar(user));

      // Trigger error
      act(() => {
        result.current.handleError();
      });

      expect(result.current.hasError).toBe(true);

      // Retry
      act(() => {
        result.current.retry();
      });

      expect(result.current.hasError).toBe(false);
    });

    it('should increment retry count in URL when retry is called', () => {
      const user = createMockUser('https://example.com/avatar.jpg');

      const { result } = renderHook(() => useUserAvatar(user));

      const url1 = result.current.avatarUrl;
      expect(url1).toMatch(/-0$/); // Initial retry count is 0

      // Retry once
      act(() => {
        result.current.retry();
      });

      const url2 = result.current.avatarUrl;
      expect(url2).toMatch(/-1$/); // Retry count incremented to 1
      expect(url1).not.toBe(url2); // URLs should be different

      // Retry again
      act(() => {
        result.current.retry();
      });

      const url3 = result.current.avatarUrl;
      expect(url3).toMatch(/-2$/); // Retry count incremented to 2
      expect(url2).not.toBe(url3);
    });

    it('should reset retry count when user changes', () => {
      const user1 = createMockUser('https://example.com/avatar1.jpg');
      const user2 = { ...createMockUser('https://example.com/avatar2.jpg'), id: 'different-user-id' };

      const { result, rerender } = renderHook(
        ({ user }) => useUserAvatar(user),
        { initialProps: { user: user1 } }
      );

      // Retry to increment count
      act(() => {
        result.current.retry();
      });

      expect(result.current.avatarUrl).toMatch(/-1$/);

      // Change user
      rerender({ user: user2 });

      // Retry count should be reset to 0
      expect(result.current.avatarUrl).toMatch(/-0$/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle avatar_url with special characters', () => {
      const baseUrl = 'https://example.com/avatar.jpg?name=John%20Doe&id=123';
      const user = createMockUser(baseUrl);

      const { result } = renderHook(() => useUserAvatar(user));

      expect(result.current.avatarUrl).toContain(baseUrl);
      expect(result.current.avatarUrl).toContain('&t='); // Should append with &
    });

    it('should handle user without updated_at field', () => {
      const user = {
        ...createMockUser('https://example.com/avatar.jpg'),
        updated_at: undefined,
      } as User;

      const { result } = renderHook(() => useUserAvatar(user));

      // Should still return URL with timestamp (falls back to current time)
      expect(result.current.avatarUrl).not.toBeNull();
      expect(result.current.avatarUrl).toMatch(/\?t=\d+-0$/);
    });

    it('should handle transition from user with avatar to user without avatar', () => {
      const user1 = createMockUser('https://example.com/avatar.jpg');
      const user2 = createMockUser(); // No avatar

      const { result, rerender } = renderHook(
        ({ user }) => useUserAvatar(user),
        { initialProps: { user: user1 } }
      );

      expect(result.current.avatarUrl).not.toBeNull();

      // Change to user without avatar
      rerender({ user: user2 });

      expect(result.current.avatarUrl).toBeNull();
      expect(result.current.hasError).toBe(false); // Error should be reset
    });

    it('should handle transition from null user to user with avatar', () => {
      const user = createMockUser('https://example.com/avatar.jpg');

      const { result, rerender } = renderHook(
        ({ user }) => useUserAvatar(user),
        { initialProps: { user: null } }
      );

      expect(result.current.avatarUrl).toBeNull();

      // Change to user with avatar
      rerender({ user });

      expect(result.current.avatarUrl).not.toBeNull();
      expect(result.current.avatarUrl).toContain('https://example.com/avatar.jpg');
    });
  });
});
