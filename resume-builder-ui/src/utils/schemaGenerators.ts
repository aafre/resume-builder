/**
 * Schema generator utilities
 * Factory functions for creating structured data (JSON-LD)
 * Follows DRY principle - single source of truth for schema generation
 */

import type { FAQConfig, BreadcrumbConfig, StructuredDataConfig } from '../types/seo';

const BASE_URL = 'https://easyfreeresume.com';

/**
 * Generate SoftwareApplication schema
 * Used for: actual-free, no-sign-up, reddit pages
 */
export function generateSoftwareApplicationSchema(): StructuredDataConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EasyFreeResume',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: BASE_URL,
  };
}

/**
 * Generate WebSite schema
 * Used for: home page
 */
export function generateWebSiteSchema(): StructuredDataConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EasyFreeResume',
    url: BASE_URL,
  };
}

/**
 * Generate ItemList schema
 * Used for: template hub, keywords hub
 */
export function generateItemListSchema(
  items: Array<{ name: string; url: string; description?: string }>
): StructuredDataConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${BASE_URL}${item.url}`,
      description: item.description,
    })),
  };
}

/**
 * Generate CreativeWork schema
 * Used for: ATS template page, keyword pages
 */
export function generateCreativeWorkSchema(
  name: string,
  description: string,
  url: string
): StructuredDataConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: `${BASE_URL}${url}`,
    author: {
      '@type': 'Organization',
      name: 'EasyFreeResume',
    },
  };
}

/**
 * Generate FAQPage schema
 * Used for: all landing pages
 */
export function generateFAQPageSchema(faqs: FAQConfig[]): StructuredDataConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema
 * Used for: pages with breadcrumb navigation
 */
export function generateBreadcrumbSchema(
  breadcrumbs: BreadcrumbConfig[]
): StructuredDataConfig {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${BASE_URL}${crumb.href}`,
    })),
  };
}

/**
 * Combine multiple schemas into an array
 * Use when a page needs multiple schema types
 */
export function combineSchemas(
  ...schemas: StructuredDataConfig[]
): StructuredDataConfig[] {
  return schemas;
}
