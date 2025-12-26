import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';
import { ResumeListItem } from '../types';

/**
 * Custom hook for fetching resumes using TanStack Query
 *
 * Features:
 * - Waits for auth to be ready before fetching (solves race conditions)
 * - Automatic retry with exponential backoff (except auth errors)
 * - Request deduplication (solves React StrictMode double-fetch)
 * - Automatic refetch on window focus
 * - Built-in loading and error states
 * - Cache management with 2-minute stale time
 */
export function useResumes() {
  const { session, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['resumes', session?.user?.id],
    queryFn: async (): Promise<ResumeListItem[]> => {
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Use centralized API client (handles auth, 401/403 interceptor)
      const result = await apiClient.get('/api/resumes?limit=50');

      return result.resumes || [];
    },
    enabled: !authLoading && !!session, // Only run when auth is ready
    staleTime: 2 * 60 * 1000, // 2 minutes
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
