/**
 * SEO Page Layout Component
 * Main wrapper for SEO landing pages (NOT blog posts)
 * Provides consistent structure with SEO optimization
 */

import { ReactNode } from 'react';
import SEOHead from '../SEOHead';
import type { SEOConfig, StructuredDataConfig } from '../../types/seo';
import { wrapInGraph } from '../../utils/schemaGenerators';

interface SEOPageLayoutProps {
  children: ReactNode;
  seoConfig: SEOConfig;
  schemas?: StructuredDataConfig[];
  className?: string;
}

export default function SEOPageLayout({
  children,
  seoConfig,
  schemas = [],
  className = '',
}: SEOPageLayoutProps) {
  return (
    <>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords.join(', ')}
        canonicalUrl={
          seoConfig.canonicalUrl
            ? `https://easyfreeresume.com${seoConfig.canonicalUrl}`
            : undefined
        }
        ogImage={seoConfig.ogImage}
        structuredData={schemas.length === 1 ? schemas[0] : wrapInGraph(schemas)}
        hreflangLinks={seoConfig.hreflangLinks}
        ogLocale={seoConfig.ogLocale}
      />
      <div
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 ${className}`}
      >
        <div className="container mx-auto px-4 py-12 max-w-7xl">{children}</div>
      </div>
    </>
  );
}
