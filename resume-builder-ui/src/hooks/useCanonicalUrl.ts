/**
 * Custom hook for generating canonical URLs
 * Ensures proper SEO canonical links
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://easyfreeresume.com';

/**
 * Get the canonical URL for the current page
 * Combines base URL with current path, removing trailing slashes
 */
export function useCanonicalUrl(customPath?: string): string {
  const location = useLocation();

  return useMemo(() => {
    const path = customPath || location.pathname;
    // Remove trailing slash and ensure proper formatting
    const cleanPath = path.replace(/\/+$/, '') || '/';
    return `${BASE_URL}${cleanPath}`;
  }, [location.pathname, customPath]);
}
