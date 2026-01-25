import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions using vi.hoisted so they're available during vi.mock hoisting
const { mockRefreshSession, mockGetSession, mockSignOut } = vi.hoisted(() => ({
  mockRefreshSession: vi.fn(),
  mockGetSession: vi.fn(),
  mockSignOut: vi.fn(),
}));

// Mock Supabase before importing api-client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      refreshSession: mockRefreshSession,
      getSession: mockGetSession,
      signOut: mockSignOut,
    },
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Import after mocks are set up
import { apiClient, AuthError } from '../lib/api-client';
import { supabase } from '../lib/supabase';

// Helper to create mock sessions with unique identifiers
const createSession = (id: string, expiresInSeconds: number) => ({
  access_token: `token-${id}`,
  refresh_token: `refresh-${id}`,
  expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  user: { id: `user-${id}`, email: `${id}@test.com` },
});

describe('ApiClient - Proactive Token Refresh', () => {
  let originalFetch: typeof global.fetch;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    mockRefreshSession.mockReset();
    mockGetSession.mockReset();
    mockSignOut.mockReset();

    // Default mock implementations
    mockRefreshSession.mockResolvedValue({ data: { session: null }, error: null });
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignOut.mockResolvedValue({ error: null });

    // Mock fetch for API calls
    originalFetch = global.fetch;
    global.fetch = vi.fn();

    // Suppress console.warn for cleaner test output
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Clear cached session
    apiClient.setSession(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    consoleSpy.mockRestore();
  });

  describe('isTokenExpiredOrExpiring (via getAuthHeaders behavior)', () => {
    it('triggers refresh when token expires within 60 seconds', async () => {
      // Session that expires in 30 seconds (within the 60-second buffer)
      const expiringSession = createSession('expiring', 30);
      apiClient.setSession(expiringSession);

      // Set up refresh to return a fresh session
      const freshSession = createSession('fresh', 3600);
      mockRefreshSession.mockResolvedValueOnce({
        data: { session: freshSession },
        error: null,
      });

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test');

      // Should have called refreshSession
      expect(mockRefreshSession).toHaveBeenCalled();

      // The request should use the fresh token
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[0]).toBe('/api/test');
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-fresh');
    });

    it('does not trigger refresh when token has more than 60 seconds remaining', async () => {
      // Session that expires in 10 minutes (well outside the buffer)
      const validSession = createSession('valid', 600);
      apiClient.setSession(validSession);

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test');

      // Should NOT have called refreshSession
      expect(mockRefreshSession).not.toHaveBeenCalled();

      // Should use the original token
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[0]).toBe('/api/test');
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-valid');
    });

    it('handles missing expires_at gracefully (no refresh triggered)', async () => {
      // Session without expires_at
      const sessionWithoutExpiry = {
        access_token: 'token-no-expiry',
        user: { id: 'test-user-id' },
      };
      apiClient.setSession(sessionWithoutExpiry);

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test');

      // Should NOT have called refreshSession
      expect(mockRefreshSession).not.toHaveBeenCalled();
    });
  });

  describe('proactiveRefresh deduplication', () => {
    it('deduplicates concurrent refresh calls', async () => {
      // Session that expires in 30 seconds
      const expiringSession = createSession('expiring-dedup', 30);
      apiClient.setSession(expiringSession);

      // Set up refresh with a delay to simulate network latency
      const freshSession = createSession('fresh-dedup', 3600);
      let refreshCallCount = 0;
      mockRefreshSession.mockImplementation(
        () =>
          new Promise((resolve) => {
            refreshCallCount++;
            setTimeout(() => {
              resolve({ data: { session: freshSession }, error: null });
            }, 50);
          })
      );

      // Mock successful API responses
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      // Fire multiple requests concurrently
      const requests = Promise.all([
        apiClient.get('/api/test1'),
        apiClient.get('/api/test2'),
        apiClient.get('/api/test3'),
      ]);

      await requests;

      // refreshSession should only be called once despite 3 concurrent requests
      expect(refreshCallCount).toBe(1);
    });

    it('clears refreshPromise after completion, allowing future refreshes', async () => {
      // First request with expiring session
      const expiringSession1 = createSession('expiring1', 30);
      apiClient.setSession(expiringSession1);

      const freshSession1 = createSession('fresh1', 60); // Still expiring soon
      mockRefreshSession.mockResolvedValueOnce({
        data: { session: freshSession1 },
        error: null,
      });

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test1');
      expect(mockRefreshSession).toHaveBeenCalledTimes(1);

      // Clear mocks for second round
      vi.clearAllMocks();

      // Update cached session to simulate it expiring again
      apiClient.setSession(createSession('expiring2', 30));
      const freshSession2 = createSession('fresh2', 3600);
      mockRefreshSession.mockResolvedValueOnce({
        data: { session: freshSession2 },
        error: null,
      });

      await apiClient.get('/api/test2');

      // Should have called refreshSession again
      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('proactiveRefresh error handling', () => {
    it('falls back to current token when refresh fails', async () => {
      // Session that expires in 30 seconds with unique token
      const expiringSession = createSession('fallback-test', 30);
      apiClient.setSession(expiringSession);

      // Refresh fails
      mockRefreshSession.mockResolvedValueOnce({
        data: { session: null },
        error: new Error('Refresh failed'),
      });

      // Mock successful API response (backend accepts the old token)
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      // Should not throw, should proceed with existing token
      await apiClient.get('/api/test');

      // Should have called refreshSession (attempted refresh)
      expect(mockRefreshSession).toHaveBeenCalled();

      // Should still make the request with the original token (fallback)
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[0]).toBe('/api/test');
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-fallback-test');

      // Should have logged a warning
      expect(consoleSpy).toHaveBeenCalledWith(
        'Proactive token refresh failed:',
        'Refresh failed'
      );
    });

    it('handles refresh exceptions gracefully', async () => {
      // Session that expires in 30 seconds
      const expiringSession = createSession('exception-test', 30);
      apiClient.setSession(expiringSession);

      // Refresh throws
      mockRefreshSession.mockRejectedValueOnce(new Error('Network error'));

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      // Should not throw
      await apiClient.get('/api/test');

      // Should still make the request with original token
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-exception-test');

      // Should have logged a warning
      expect(consoleSpy).toHaveBeenCalledWith(
        'Proactive token refresh error:',
        expect.any(Error)
      );
    });
  });

  describe('getAuthHeaders fallback behavior', () => {
    it('falls back to getSession when no cached session', async () => {
      // No cached session
      apiClient.setSession(null);

      // getSession returns a valid session
      const freshSession = createSession('from-getSession', 3600);
      mockGetSession.mockResolvedValueOnce({ data: { session: freshSession } });

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test');

      expect(mockGetSession).toHaveBeenCalled();
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-from-getSession');
    });

    it('throws AuthError when no session is available', async () => {
      // No cached session
      apiClient.setSession(null);

      // getSession returns null
      mockGetSession.mockResolvedValue({ data: { session: null } });

      await expect(apiClient.get('/api/test')).rejects.toThrow(AuthError);
      await expect(apiClient.get('/api/test')).rejects.toThrow('No active session');
    });
  });

  describe('providedSession takes precedence', () => {
    it('uses provided session instead of cached session', async () => {
      // Cached session
      const cachedSession = createSession('cached', 3600);
      apiClient.setSession(cachedSession);

      // Provided session via options
      const providedSession = createSession('provided', 3600);

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test', { session: providedSession });

      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-provided');
    });

    it('proactively refreshes provided session if expiring', async () => {
      // Provided session that's expiring
      const providedSession = createSession('provided-expiring', 30);

      // Fresh session from refresh
      const freshSession = createSession('fresh-from-refresh', 3600);
      mockRefreshSession.mockResolvedValueOnce({
        data: { session: freshSession },
        error: null,
      });

      // Mock successful API response
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await apiClient.get('/api/test', { session: providedSession });

      // Should have refreshed
      expect(mockRefreshSession).toHaveBeenCalled();

      // Should use the fresh token
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[0]).toBe('/api/test');
      expect(fetchCall[1].headers.Authorization).toBe('Bearer token-fresh-from-refresh');
    });
  });
});
