/**
 * Type definitions for SEO pages and components
 * Centralized types following Single Responsibility Principle
 */

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  hreflangLinks?: HreflangLink[];
  ogLocale?: string;
}

export interface HeroConfig {
  h1: string;
  subtitle: string;
  description?: string;
  eyebrow?: string;
  primaryCTA?: CTAConfig;
  secondaryCTA?: CTAConfig;
}

export interface CTAConfig {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  openInNewTab?: boolean;
}

export interface FeatureConfig {
  icon: string; // Icon name or emoji
  title: string;
  description: string;
}

export interface FAQConfig {
  question: string;
  answer: string;
}

export interface BreadcrumbConfig {
  label: string;
  href: string;
}

export interface MetricConfig {
  value: string | number;
  label: string;
  suffix?: string;
  icon?: string;
}

export interface ComparisonItem {
  name: string;
  features: {
    [key: string]: boolean | string;
  };
  highlight?: boolean;
}

export interface StepConfig {
  number: number;
  title: string;
  description: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export interface HowToConfig {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}

export interface ProductConfig {
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  price?: string;
  rating?: number;
}

export interface PageConfig {
  seo: SEOConfig;
  hero: HeroConfig;
  features?: FeatureConfig[];
  faqs: FAQConfig[];
  breadcrumbs?: BreadcrumbConfig[];
  cta?: CTAConfig;
  metrics?: MetricConfig[];
  steps?: StepConfig[];
  comparison?: ComparisonItem[];
}

// Schema types
export type SchemaType =
  | 'SoftwareApplication'
  | 'ItemList'
  | 'CreativeWork'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'WebSite'
  | 'HowTo'
  | 'Product';

export interface StructuredDataConfig {
  '@context': string;
  '@type': SchemaType | SchemaType[];
  [key: string]: any;
}
