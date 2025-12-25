import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

interface UseUserAvatarReturn {
  avatarUrl: string | null;
  hasError: boolean;
  handleError: () => void;
  retry: () => void;
}

/**
 * Custom hook to manage user avatar with error handling and cache-busting
 *
 * Features:
 * - Extracts avatar URL from OAuth user metadata
 * - Adds cache-busting timestamp to prevent stale cached images
 * - Tracks error state to show fallback on load failure
 * - Provides retry mechanism for failed avatar loads
 *
 * @param user - Supabase user object (can be null)
 * @returns Avatar URL with cache-busting, error state, and handlers
 */
export function useUserAvatar(user: User | null): UseUserAvatarReturn {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset error state when user changes
  useEffect(() => {
    setHasError(false);
    setRetryCount(0);
  }, [user?.id]);

  // Handle image load error
  const handleError = () => {
    setHasError(true);
  };

  // Retry loading avatar (increments retry count to bust cache)
  const retry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  // Generate avatar URL with cache-busting
  const avatarUrl = (() => {
    if (!user?.user_metadata?.avatar_url) {
      return null;
    }

    const baseUrl = user.user_metadata.avatar_url;

    // Use user.updated_at for cache-busting (changes when user profile updates)
    // Fall back to current timestamp if updated_at is not available
    // Also include retry count to force refresh on manual retry
    const timestamp = user.updated_at || new Date().toISOString();
    const cacheBuster = `t=${new Date(timestamp).getTime()}-${retryCount}`;

    // Check if URL already has query parameters
    const separator = baseUrl.includes('?') ? '&' : '?';

    return `${baseUrl}${separator}${cacheBuster}`;
  })();

  return {
    avatarUrl,
    hasError,
    handleError,
    retry
  };
}
