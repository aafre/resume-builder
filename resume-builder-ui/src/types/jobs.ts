/** TypeScript interfaces for pSEO job pages. */

export type PseoPageType =
  | 'role_location'
  | 'role_hub'
  | 'location_hub'
  | 'category_hub'
  | 'company_page'
  | 'filter_page'
  | 'seniority_page'
  | 'main_hub';

export interface SalaryStats {
  min: number;
  max: number;
  median: number;
  sample_size: number;
  currency: string;
  source: 'verified' | 'estimated' | 'none';
}

export interface RelatedLink {
  slug: string;
  name: string;
  url: string;
  category?: string;
}

export interface InternalLinks {
  parent?: { url: string; label: string };
  siblings?: { url: string; label: string }[];
  cta?: { url: string; label: string };
}

export interface BreadcrumbItem {
  name: string;
  url: string | null;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PseoJob {
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_is_predicted: boolean;
  url: string;
  created: string;
  description?: string;
}

export interface PseoPageData {
  page_type: PseoPageType;
  role_slug: string | null;
  role_display: string | null;
  location_slug: string | null;
  location_display: string | null;
  modifier: string | null;
  modifier_label: string | null;
  seniority: string | null;
  category: string | null;
  company: string | null;
  jobs: PseoJob[];
  total_count: number;
  salary_stats: SalaryStats;
  top_skills: string[];
  related_roles: RelatedLink[];
  related_locations: RelatedLink[];
  internal_links: InternalLinks;
  intro_copy: string;
  faqs: FAQ[];
  noindex: boolean;
  cached_at: string;
  title: string;
  meta_description: string;
  canonical_url: string;
  breadcrumbs: BreadcrumbItem[];
  prev_url: string | null;
  next_url: string | null;
  page_num: number;
}
