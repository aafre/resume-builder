/**
 * Custom hook for generating page structured data
 * Simplifies schema generation in page components
 */

import { useMemo } from 'react';
import type { FAQConfig, BreadcrumbConfig, StructuredDataConfig } from '../types/seo';
import {
  generateSoftwareApplicationSchema,
  generateWebSiteSchema,
  generateItemListSchema,
  generateCreativeWorkSchema,
  generateFAQPageSchema,
  generateBreadcrumbSchema,
} from '../utils/schemaGenerators';

type SchemaType = 'software' | 'website' | 'itemList' | 'creativeWork';

interface UsePageSchemaOptions {
  type: SchemaType;
  faqs?: FAQConfig[];
  breadcrumbs?: BreadcrumbConfig[];
  // For itemList schema
  items?: Array<{ name: string; url: string; description?: string }>;
  // For creativeWork schema
  name?: string;
  description?: string;
  url?: string;
}

/**
 * Generate structured data for a page
 * Automatically combines multiple schema types (e.g., SoftwareApplication + FAQPage)
 */
export function usePageSchema(options: UsePageSchemaOptions): StructuredDataConfig[] {
  return useMemo(() => {
    const schemas: StructuredDataConfig[] = [];

    // Add primary schema based on type
    switch (options.type) {
      case 'software':
        schemas.push(generateSoftwareApplicationSchema());
        break;
      case 'website':
        schemas.push(generateWebSiteSchema());
        break;
      case 'itemList':
        if (options.items) {
          schemas.push(generateItemListSchema(options.items));
        }
        break;
      case 'creativeWork':
        if (options.name && options.description && options.url) {
          schemas.push(
            generateCreativeWorkSchema(options.name, options.description, options.url)
          );
        }
        break;
    }

    // Add FAQ schema if FAQs provided
    if (options.faqs && options.faqs.length > 0) {
      schemas.push(generateFAQPageSchema(options.faqs));
    }

    // Add breadcrumb schema if breadcrumbs provided
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(options.breadcrumbs));
    }

    return schemas;
  }, [options]);
}
