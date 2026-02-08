/**
 * Breadcrumbs with Schema Component
 * Navigation breadcrumbs with JSON-LD structured data
 * Single responsibility: Breadcrumb navigation
 */

import { Link } from 'react-router-dom';
import type { BreadcrumbConfig } from '../../types/seo';

interface BreadcrumbsWithSchemaProps {
  breadcrumbs: BreadcrumbConfig[];
  className?: string;
}

export default function BreadcrumbsWithSchema({
  breadcrumbs,
  className = '',
}: BreadcrumbsWithSchemaProps) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-8 ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.href}
                className="hover:text-accent transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
