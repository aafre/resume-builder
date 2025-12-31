import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';

interface ResumeCountResponse {
  success: boolean;
  count: number;
}

/**
 * Custom hook for fetching resume count using TanStack Query
 *
 * Lightweight alternative to useResumes() when only the count is needed.
 * Used in Header.tsx for the mobile badge to avoid fetching 50 full resume objects.
 *
 * Features:
 * - Waits for auth to be ready before fetching
 * - Automatic retry with exponential backoff (except auth errors)
 * - Request deduplication
 * - Automatic refetch on window focus
 * - Built-in loading and error states
 * - Stale-while-revalidate caching (always fetches fresh data in background)
 * - Separate query key from useResumes() to prevent cache conflicts
 */
export function useResumeCount() {
  const { session, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['resume-count', session?.user?.id],
    queryFn: async (): Promise<number> => {
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Use centralized API client (handles auth, 401/403 interceptor)
      const result: ResumeCountResponse = await apiClient.get('/api/resumes/count');

      return result.count ?? 0;
    },
    enabled: !authLoading && !!session, // Only run when auth is ready
    staleTime: 0, // Always consider data stale, refetch in background (matches useResumes)
    retry: (failureCount, error) => {
      // Don't retry auth errors - they won't resolve with retries
      if (error instanceof Error && error.message === 'Not authenticated') {
        return false;
      }
      // Retry network/server errors up to 2 times
      return failureCount < 2;
    },
  });
}
