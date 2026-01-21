/**
 * Job Examples Database
 * Single source of truth for all job example pages
 * Used for sitemap generation, hub page, and navigation
 */

import type { JobExampleInfo, JobCategory, JobExamplesByCategory } from './types';
export { JOB_CATEGORIES } from './types';
export type { JobExampleInfo, JobExampleData, JobCategory, JobExamplesByCategory } from './types';

/**
 * Database of all job examples
 * Organized by priority tiers as defined in the SEO plan
 */
export const JOB_EXAMPLES_DATABASE: JobExampleInfo[] = [
  // Tier 1: High Volume (Operations)
  {
    slug: 'customer-service-representative',
    title: 'Customer Service Representative',
    category: 'operations',
    priority: 0.8,
    metaDescription: 'Professional customer service representative resume example with bullet points and skills. Edit instantly in our free builder.',
  },
  {
    slug: 'administrative-assistant',
    title: 'Administrative Assistant',
    category: 'operations',
    priority: 0.8,
    metaDescription: 'Administrative assistant resume example with office skills and experience. Free template ready to customize.',
  },
  {
    slug: 'receptionist',
    title: 'Receptionist',
    category: 'operations',
    priority: 0.7,
    metaDescription: 'Receptionist resume example highlighting front desk skills and customer interaction. Free to edit and download.',
  },
  {
    slug: 'retail-sales-associate',
    title: 'Retail Sales Associate',
    category: 'operations',
    priority: 0.7,
    metaDescription: 'Retail sales associate resume example with sales achievements and customer service skills.',
  },
  {
    slug: 'warehouse-worker',
    title: 'Warehouse Worker',
    category: 'operations',
    priority: 0.7,
    metaDescription: 'Warehouse worker resume example with inventory management and logistics experience.',
  },

  // Tier 2: Corporate / Business
  {
    slug: 'project-manager',
    title: 'Project Manager',
    category: 'corporate',
    priority: 0.8,
    metaDescription: 'Project manager resume example with leadership and methodology expertise. Includes PMP-ready format.',
  },
  {
    slug: 'business-analyst',
    title: 'Business Analyst',
    category: 'corporate',
    priority: 0.8,
    metaDescription: 'Business analyst resume example with data analysis and requirements gathering skills.',
  },
  {
    slug: 'human-resources-generalist',
    title: 'Human Resources Generalist',
    category: 'corporate',
    priority: 0.7,
    metaDescription: 'HR generalist resume example covering recruitment, benefits, and employee relations.',
  },
  {
    slug: 'marketing-coordinator',
    title: 'Marketing Coordinator',
    category: 'corporate',
    priority: 0.7,
    metaDescription: 'Marketing coordinator resume example with campaign management and digital marketing skills.',
  },
  {
    slug: 'accountant',
    title: 'Accountant',
    category: 'corporate',
    priority: 0.7,
    metaDescription: 'Accountant resume example with financial reporting and accounting software expertise.',
  },

  // Tier 3: Healthcare
  {
    slug: 'registered-nurse',
    title: 'Registered Nurse',
    category: 'healthcare',
    priority: 0.8,
    metaDescription: 'Registered nurse resume example with clinical skills and patient care experience.',
  },
  {
    slug: 'medical-assistant',
    title: 'Medical Assistant',
    category: 'healthcare',
    priority: 0.7,
    metaDescription: 'Medical assistant resume example with clinical and administrative healthcare skills.',
  },
  {
    slug: 'dental-assistant',
    title: 'Dental Assistant',
    category: 'healthcare',
    priority: 0.7,
    metaDescription: 'Dental assistant resume example with chairside assistance and patient care skills.',
  },

  // Tier 4: Education
  {
    slug: 'teacher',
    title: 'Teacher',
    category: 'education',
    priority: 0.8,
    metaDescription: 'Teacher resume example with curriculum development and classroom management experience.',
  },
  {
    slug: 'tutor',
    title: 'Tutor',
    category: 'education',
    priority: 0.7,
    metaDescription: 'Tutor resume example highlighting subject expertise and student success metrics.',
  },

  // Tier 5: Technology
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    category: 'tech',
    priority: 0.8,
    metaDescription: 'Software engineer resume example with programming skills and project achievements.',
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    category: 'tech',
    priority: 0.8,
    metaDescription: 'Data analyst resume example with SQL, Python, and visualization tool expertise.',
  },
  {
    slug: 'front-end-developer',
    title: 'Front-End Developer',
    category: 'tech',
    priority: 0.7,
    metaDescription: 'Front-end developer resume example with React, JavaScript, and CSS skills.',
  },

  // Tier 6: Creative
  {
    slug: 'graphic-designer',
    title: 'Graphic Designer',
    category: 'creative',
    priority: 0.7,
    metaDescription: 'Graphic designer resume example with design software skills and portfolio highlights.',
  },
  {
    slug: 'social-media-manager',
    title: 'Social Media Manager',
    category: 'creative',
    priority: 0.7,
    metaDescription: 'Social media manager resume example with platform expertise and engagement metrics.',
  },

  // Tier 7: Entry Level / Students
  {
    slug: 'college-student',
    title: 'College Student',
    category: 'entry-level',
    priority: 0.8,
    metaDescription: 'College student resume example for internships and first jobs. Education-focused format.',
  },
  {
    slug: 'high-school-student',
    title: 'High School Student',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'High school student resume example for part-time jobs and volunteer experience.',
  },
  {
    slug: 'internship',
    title: 'Internship Resume',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'Internship resume example highlighting academic projects and relevant coursework.',
  },
  {
    slug: 'entry-level-marketing',
    title: 'Entry Level Marketing',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'Entry level marketing resume example for recent graduates starting their career.',
  },

  // Tier 8: Trades
  {
    slug: 'electrician',
    title: 'Electrician',
    category: 'trades',
    priority: 0.7,
    metaDescription: 'Electrician resume example with certifications and installation experience.',
  },
  {
    slug: 'hvac-technician',
    title: 'HVAC Technician',
    category: 'trades',
    priority: 0.7,
    metaDescription: 'HVAC technician resume example with system maintenance and repair expertise.',
  },
];

/**
 * Get all job examples organized by category
 */
export function getJobExamplesByCategory(): JobExamplesByCategory {
  const byCategory: JobExamplesByCategory = {
    operations: [],
    corporate: [],
    healthcare: [],
    education: [],
    tech: [],
    creative: [],
    'entry-level': [],
    trades: [],
  };

  JOB_EXAMPLES_DATABASE.forEach(job => {
    byCategory[job.category].push(job);
  });

  // Sort each category by priority (highest first)
  Object.keys(byCategory).forEach(key => {
    byCategory[key as JobCategory].sort((a, b) => b.priority - a.priority);
  });

  return byCategory;
}

/**
 * Get a job example by slug
 */
export function getJobExampleBySlug(slug: string): JobExampleInfo | undefined {
  return JOB_EXAMPLES_DATABASE.find(job => job.slug === slug);
}

/**
 * Get related jobs for a given slug
 */
export function getRelatedJobs(slug: string, limit = 4): JobExampleInfo[] {
  const currentJob = getJobExampleBySlug(slug);
  if (!currentJob) return [];

  // Get jobs from the same category, excluding current job
  const sameCategory = JOB_EXAMPLES_DATABASE
    .filter(job => job.category === currentJob.category && job.slug !== slug)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);

  // If not enough, add from other categories
  if (sameCategory.length < limit) {
    const others = JOB_EXAMPLES_DATABASE
      .filter(job => job.category !== currentJob.category && job.slug !== slug)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit - sameCategory.length);

    return [...sameCategory, ...others];
  }

  return sameCategory;
}

/**
 * Get all slugs for sitemap generation
 */
export function getAllJobExampleSlugs(): string[] {
  return JOB_EXAMPLES_DATABASE.map(job => job.slug);
}

/**
 * Get job count by category
 */
export function getJobCountByCategory(): Record<JobCategory, number> {
  const counts: Record<JobCategory, number> = {
    operations: 0,
    corporate: 0,
    healthcare: 0,
    education: 0,
    tech: 0,
    creative: 0,
    'entry-level': 0,
    trades: 0,
  };

  JOB_EXAMPLES_DATABASE.forEach(job => {
    counts[job.category]++;
  });

  return counts;
}
