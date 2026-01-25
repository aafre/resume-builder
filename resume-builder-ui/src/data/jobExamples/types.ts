/**
 * TypeScript interfaces for programmatic SEO job example pages
 * These types define the structure of YAML files in samples/examples/
 */

import type { FAQConfig } from '../../types/seo';

/**
 * Job category for organizing examples in the hub page
 */
export type JobCategory =
  | 'operations'      // Customer service, admin, warehouse
  | 'corporate'       // Business analyst, project manager, HR
  | 'healthcare'      // Nurses, medical assistants, dental
  | 'education'       // Teachers, tutors, research assistants
  | 'tech'            // Software engineers, data analysts, DevOps
  | 'creative'        // Designers, marketing, social media
  | 'entry-level'     // Students, interns, first jobs
  | 'trades';         // Skilled trades and labor

/**
 * Resume template type
 */
export type TemplateType = 'modern' | 'classic' | 'minimal' | 'professional';

/**
 * SEO metadata for the job example page
 */
export interface JobExampleMeta {
  slug: string;                    // URL slug: "customer-service-representative"
  title: string;                   // Display title: "Customer Service Representative"
  metaTitle: string;               // SEO title tag
  metaDescription: string;         // SEO meta description
  category: JobCategory;           // For hub page organization
  priority: number;                // Sitemap priority (0.6-0.8)
  lastmod?: string;                // Last modified date (YYYY-MM-DD)
}

/**
 * Contact information for the example resume
 */
export interface ResumeContact {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

/**
 * Work experience entry
 */
export interface ExperienceEntry {
  company: string;
  title: string;
  dates: string;
  location?: string;
  bullets: string[];
}

/**
 * Education entry
 */
export interface EducationEntry {
  school: string;
  degree: string;
  year: string;
  gpa?: string;
  honors?: string;
}

/**
 * Resume content that can be loaded into the builder
 */
export interface ResumeContent {
  template: TemplateType;
  contact: ResumeContact;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications?: string[];
  projects?: {
    name: string;
    description: string;
    technologies?: string[];
  }[];
}

/**
 * Bullet point bank category for copy-paste functionality
 */
export interface BulletCategory {
  category: string;
  bullets: string[];
}

/**
 * Complete job example data structure (matches YAML file format)
 */
export interface JobExampleData {
  meta: JobExampleMeta;
  resume: ResumeContent;
  bulletBank: BulletCategory[];
  relatedJobs: string[];           // Slugs of related job examples
  customFaqs?: FAQConfig[];        // Optional custom FAQs
}

/**
 * Simplified job info for the hub page listing
 */
export interface JobExampleInfo {
  slug: string;
  title: string;
  category: JobCategory;
  priority: number;
  metaDescription: string;
}

/**
 * Job examples organized by category for the hub page
 */
export interface JobExamplesByCategory {
  operations: JobExampleInfo[];
  corporate: JobExampleInfo[];
  healthcare: JobExampleInfo[];
  education: JobExampleInfo[];
  tech: JobExampleInfo[];
  creative: JobExampleInfo[];
  'entry-level': JobExampleInfo[];
  trades: JobExampleInfo[];
}

/**
 * Category display information for the hub page
 */
export interface CategoryInfo {
  id: JobCategory;
  title: string;
  description: string;
  icon: string;
}

/**
 * All category display information
 */
export const JOB_CATEGORIES: CategoryInfo[] = [
  {
    id: 'operations',
    title: 'Customer Service & Operations',
    description: 'Customer-facing roles, administrative positions, and operations',
    icon: '💼',
  },
  {
    id: 'corporate',
    title: 'Business & Corporate',
    description: 'Management, analysis, HR, and professional services',
    icon: '📊',
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Medical',
    description: 'Nursing, medical assistants, and healthcare professionals',
    icon: '🏥',
  },
  {
    id: 'education',
    title: 'Education & Teaching',
    description: 'Teachers, tutors, and academic professionals',
    icon: '📚',
  },
  {
    id: 'tech',
    title: 'Technology & Engineering',
    description: 'Software developers, data scientists, and IT professionals',
    icon: '💻',
  },
  {
    id: 'creative',
    title: 'Creative & Marketing',
    description: 'Designers, marketers, and content creators',
    icon: '🎨',
  },
  {
    id: 'entry-level',
    title: 'Students & Entry Level',
    description: 'First jobs, internships, and student positions',
    icon: '🎓',
  },
  {
    id: 'trades',
    title: 'Trades & Labor',
    description: 'Skilled trades and hands-on professions',
    icon: '🔧',
  },
];
