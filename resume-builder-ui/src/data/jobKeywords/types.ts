/**
 * TypeScript interfaces for programmatic SEO job keywords pages
 */

import type { FAQConfig } from '../../types/seo';

export interface JobKeywordsData {
  // URL and identification
  slug: string; // URL slug: "software-engineer"
  title: string; // Display title: "Software Engineer"

  // SEO metadata
  metaTitle: string; // SEO title tag
  metaDescription: string; // SEO meta description
  category: 'technology' | 'healthcare' | 'business' | 'creative' | 'trades' | 'education';
  priority: number; // Sitemap priority (0.7-0.9)
  lastmod?: string; // Last modified date (YYYY-MM-DD)

  // Consolidation (B5, 2026-09): true when this role's keyword content has been
  // migrated into a matching /examples/<role> page. The route stays live and
  // internally linked; it is excluded from the generated sitemap here, and the
  // actual index-time noindex directive is requested in app.py NOINDEX_ROUTES
  // (X-Robots-Tag — survives non-JS crawlers, see Mistake #10/#11 in
  // seo-tracking/mistakes-learned.md). Do not set this without matching evidence.
  noindex?: boolean;

  // Override default H1 if needed
  h1?: string;

  // Optional intro explaining what hiring teams mean by keywords for this role
  roleIntro?: string;

  // Keyword categories
  keywords: {
    core: string[]; // Soft skills and core competencies
    technical: string[]; // Technical skills, tools, software
    certifications?: string[]; // Industry certifications
    metrics?: string[]; // KPIs and measurable outcomes
    processes?: string[]; // Methodologies and frameworks
  };

  // Multi-word keyword phrases (2-5 words) that ATS systems look for
  phrases?: string[];

  // Optional: Detailed tool breakdown by category
  tools?: ToolCategory[];

  // Before/After example showing keyword integration
  example: {
    before: string; // Generic, un-optimized resume bullet
    after: string; // Keyword-optimized bullet with specific skills
  };

  // Optional: Additional example resume bullets using keywords with metrics
  exampleBullets?: string[];

  // Optional: Common mistakes job seekers make with this role's resume
  commonMistakes?: {
    mistake: string;
    fix: string;
  }[];

  // Optional: Custom FAQs (overrides auto-generated)
  customFaqs?: FAQConfig[];
}

export interface ToolCategory {
  category: string; // e.g., "Programming Languages", "Frameworks"
  items: string[]; // e.g., ["Python", "JavaScript", "Java"]
}
