/**
 * Custom hook for generating breadcrumbs from current route
 * Automatically creates breadcrumb trail for nested pages
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { BreadcrumbConfig } from '../types/seo';

// Map of paths to readable labels
const PATH_LABELS: Record<string, string> = {
  '': 'Home',
  templates: 'Templates',
  'ats-friendly': 'ATS-Friendly',
  'resume-keywords': 'Resume Keywords',
  'customer-service': 'Customer Service',
  blog: 'Blog',
};

/**
 * Generate breadcrumbs from current URL path
 * Example: /templates/ats-friendly → [Home, Templates, ATS-Friendly]
 */
export function useBreadcrumbs(customBreadcrumbs?: BreadcrumbConfig[]): BreadcrumbConfig[] {
  const location = useLocation();

  return useMemo(() => {
    // If custom breadcrumbs provided, use those
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs;
    }

    // Auto-generate from path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbConfig[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const label = PATH_LABELS[segment] || segment.replace(/-/g, ' ');
      breadcrumbs.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href: currentPath,
      });
    }

    return breadcrumbs;
  }, [location.pathname, customBreadcrumbs]);
}
