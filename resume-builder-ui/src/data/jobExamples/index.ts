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
    careerOutlook: 'Customer service representatives are in growing demand, with the BLS projecting steady openings driven by e-commerce and remote support roles. Median pay ranges from $30,000 to $45,000, and many employers now offer fully remote positions, making this an accessible career path with clear advancement into team lead and management roles.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'administrative-assistant',
    title: 'Administrative Assistant',
    category: 'operations',
    priority: 0.8,
    metaDescription: 'Administrative assistant resume example with office skills and experience. Free template ready to customize.',
    careerOutlook: 'Administrative assistants are needed in virtually every industry, making this one of the most versatile career paths available. With experience, many admins advance to office manager or executive assistant roles, where salaries can reach $55,000-$75,000 depending on the sector and location.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'receptionist',
    title: 'Receptionist',
    category: 'operations',
    priority: 0.7,
    metaDescription: 'Receptionist resume example highlighting front desk skills and customer interaction. Free to edit and download.',
    lastmod: '2026-09-22',
  },
  {
    slug: 'retail-sales-associate',
    title: 'Retail Sales Associate',
    category: 'operations',
    priority: 0.7,
    metaDescription: 'Retail sales associate resume example with sales achievements and customer service skills.',
    lastmod: '2026-09-23',
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
    careerOutlook: 'Project management is one of the fastest-growing professions, with PMI reporting that employers will need 25 million new project managers by 2030. PMP-certified professionals earn a median salary of $120,000, and the role applies across tech, construction, healthcare, and finance.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'business-analyst',
    title: 'Business Analyst',
    category: 'corporate',
    priority: 0.8,
    metaDescription: 'Business analyst resume example with data analysis and requirements gathering skills.',
    careerOutlook: 'Business analysts are in high demand as companies invest in digital transformation and data-driven strategies. The role bridges business needs and technical solutions, with median salaries ranging from $75,000 to $110,000. Strong growth is expected in tech, finance, and consulting sectors.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'human-resources-generalist',
    title: 'Human Resources Generalist',
    category: 'corporate',
    priority: 0.7,
    metaDescription: 'HR generalist resume example covering recruitment, benefits, and employee relations.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'marketing-coordinator',
    title: 'Marketing Coordinator',
    category: 'corporate',
    priority: 0.7,
    metaDescription: 'Marketing coordinator resume example with campaign management and digital marketing skills.',
    careerOutlook: 'Marketing coordinators serve as the entry point into one of the fastest-growing career tracks in business. Digital marketing skills are in especially high demand, and coordinators who develop SEO, analytics, and campaign management expertise often advance to marketing manager roles earning $65,000-$95,000 within a few years.',
    lastmod: '2026-09-23',
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
    careerOutlook: 'Nursing faces a nationwide shortage projected to continue through 2030, giving RNs exceptional job security and bargaining power. Median pay is around $81,000, with specialty paths in ICU, OR, and nurse practitioner roles pushing compensation well above $100,000.',
    lastmod: '2026-09-22',
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
    careerOutlook: 'Dental assisting is one of the fastest-growing healthcare occupations, with the BLS projecting 8% growth through 2032. Earning a Certified Dental Assistant (CDA) credential can boost starting salaries from $38,000 to over $45,000 and opens doors to expanded-function and dental hygienist career paths.',
    lastmod: '2026-09-23',
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
    careerOutlook: 'The tutoring industry has been transformed by EdTech, with platforms like Wyzant, Varsity Tutors, and Chegg creating flexible online opportunities that pay $25-$80 per hour depending on subject expertise. Demand is especially strong for STEM and test-prep tutors, and the global online tutoring market is expected to exceed $25 billion by 2028.',
    lastmod: '2026-09-23',
  },

  // Tier 5: Technology
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    category: 'tech',
    priority: 0.8,
    metaDescription: 'Software engineer resume example with programming skills and project achievements.',
    lastmod: '2026-09-22',
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    category: 'tech',
    priority: 0.8,
    metaDescription: 'Data analyst resume example with SQL, Python, and visualization tool expertise.',
    careerOutlook: 'Data analysts are among the most sought-after professionals as organizations increasingly rely on data-driven decision making. The BLS projects 36% growth for data-related roles through 2033, with median salaries around $100,000. Skills in SQL, Python, and BI tools like Tableau open doors across virtually every industry.',
    lastmod: '2026-09-23',
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
    lastmod: '2026-09-23',
  },
  {
    slug: 'social-media-manager',
    title: 'Social Media Manager',
    category: 'creative',
    priority: 0.7,
    metaDescription: 'Social media manager resume example with platform expertise and engagement metrics.',
    careerOutlook: 'Brands of all sizes now require dedicated social media management, making this one of the most in-demand marketing roles. The creator economy and short-form video boom have pushed median salaries to $55,000-$80,000, with senior and director-level positions exceeding $100,000 at mid-size and enterprise companies.',
  },

  // Tier 7: Entry Level / Students
  {
    slug: 'college-student',
    title: 'College Student',
    category: 'entry-level',
    priority: 0.8,
    metaDescription: 'Free college student resume example with ATS-friendly formatting. Includes coursework, projects, and extracurricular examples. No experience needed.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'high-school-student',
    title: 'High School Student',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'High school student resume example for part-time jobs and volunteer experience.',
    careerOutlook: 'A well-crafted first resume can make all the difference when applying for part-time jobs, internships, and volunteer positions. Retail, food service, and tutoring roles actively seek high school students, and early work experience builds skills and references that strengthen future college and career applications.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'internship',
    title: 'Internship Resume',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'Internship resume example highlighting academic projects and relevant coursework.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'no-experience',
    title: 'No Work Experience',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'Free resume example for job seekers with zero paid work history — any age, any stage. Turns volunteer, caregiving, and self-taught skills into a hireable resume.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'entry-level-marketing',
    title: 'Entry Level Marketing',
    category: 'entry-level',
    priority: 0.7,
    metaDescription: 'Entry level marketing resume example for recent graduates starting their career.',
    lastmod: '2026-09-23',
  },

  // Tier 8: Trades
  {
    slug: 'electrician',
    title: 'Electrician',
    category: 'trades',
    priority: 0.7,
    metaDescription: 'Electrician resume example with certifications and installation experience.',
    careerOutlook: 'The skilled trades face a significant labor shortage, and electricians are among the most in-demand. Median pay is around $61,000, with master electricians and those specializing in renewable energy or EV infrastructure earning $80,000 or more. Apprenticeship programs offer a debt-free path into the profession.',
    lastmod: '2026-09-23',
  },
  {
    slug: 'hvac-technician',
    title: 'HVAC Technician',
    category: 'trades',
    priority: 0.7,
    metaDescription: 'HVAC technician resume example with system maintenance and repair expertise.',
    careerOutlook: 'HVAC technicians benefit from strong demand driven by new construction, aging infrastructure, and the green energy transition to heat pumps and high-efficiency systems. The BLS projects 6% job growth through 2032, with median earnings around $57,000 and experienced technicians in high-cost markets earning $75,000 or more.',
    lastmod: '2026-09-23',
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
 * Get related jobs for a given slug.
 *
 * `explicitSlugs` is the YAML's own `relatedJobs` field (curated per role).
 * When it resolves to at least one known slug, it wins outright — it is a
 * deliberate editorial choice, not a fallback to blend with the algorithm.
 * Unknown slugs are dropped silently rather than failing the page.
 */
export function getRelatedJobs(slug: string, limit = 4, explicitSlugs?: string[]): JobExampleInfo[] {
  if (explicitSlugs && explicitSlugs.length > 0) {
    const explicit = explicitSlugs
      .filter(s => s !== slug)
      .map(s => getJobExampleBySlug(s))
      .filter((job): job is JobExampleInfo => !!job)
      .slice(0, limit);
    if (explicit.length > 0) return explicit;
  }

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
