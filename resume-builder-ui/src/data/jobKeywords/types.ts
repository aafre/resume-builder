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
  category: 'technology' | 'healthcare' | 'business' | 'creative' | 'trades';
  priority: number; // Sitemap priority (0.7-0.9)
  lastmod?: string; // Last modified date (YYYY-MM-DD)

  // Override default H1 if needed
  h1?: string;

  // Keyword categories
  keywords: {
    core: string[]; // Soft skills and core competencies
    technical: string[]; // Technical skills, tools, software
    certifications?: string[]; // Industry certifications
    metrics?: string[]; // KPIs and measurable outcomes
    processes?: string[]; // Methodologies and frameworks
  };

  // Optional: Detailed tool breakdown by category
  tools?: ToolCategory[];

  // Optional: Custom FAQs (overrides auto-generated)
  customFaqs?: FAQConfig[];
}

export interface ToolCategory {
  category: string; // e.g., "Programming Languages", "Frameworks"
  items: string[]; // e.g., ["Python", "JavaScript", "Java"]
}
