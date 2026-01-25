/**
 * Job Examples Configuration for YAML Generation
 * Organized by tier for strategic SEO targeting
 * Synced with src/data/jobExamples/index.ts
 */

export interface JobConfig {
  slug: string;
  title: string;
  category: 'service' | 'corporate' | 'healthcare' | 'tech' | 'student' | 'trades' | 'creative' | 'education';
  template: 'modern' | 'classic' | 'minimal' | 'professional';
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'student';
  priority: number;
}

// ============================================
// Tier 1: High Volume / High-Churn (Operations)
// The "I need a resume NOW" crowd
// ============================================
const tier1Jobs: JobConfig[] = [
  { slug: 'customer-service-representative', title: 'Customer Service Representative', category: 'service', template: 'modern', tier: 1, experienceLevel: 'entry', priority: 0.8 },
  { slug: 'administrative-assistant', title: 'Administrative Assistant', category: 'corporate', template: 'classic', tier: 1, experienceLevel: 'entry', priority: 0.8 },
  { slug: 'warehouse-worker', title: 'Warehouse Worker', category: 'service', template: 'minimal', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'receptionist', title: 'Receptionist', category: 'service', template: 'classic', tier: 1, experienceLevel: 'entry', priority: 0.8 },
  { slug: 'retail-sales-associate', title: 'Retail Sales Associate', category: 'service', template: 'modern', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'server-waitress', title: 'Server / Waitress', category: 'service', template: 'minimal', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'bartender', title: 'Bartender', category: 'service', template: 'modern', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'cashier', title: 'Cashier', category: 'service', template: 'minimal', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'delivery-driver', title: 'Delivery Driver', category: 'service', template: 'minimal', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'security-guard', title: 'Security Guard', category: 'service', template: 'classic', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'housekeeper', title: 'Housekeeper', category: 'service', template: 'minimal', tier: 1, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'call-center-representative', title: 'Call Center Representative', category: 'service', template: 'modern', tier: 1, experienceLevel: 'entry', priority: 0.7 },
];

// ============================================
// Tier 2: Corporate Core (Business)
// Steady traffic, higher conversion
// ============================================
const tier2Jobs: JobConfig[] = [
  { slug: 'project-manager', title: 'Project Manager', category: 'corporate', template: 'professional', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'executive-assistant', title: 'Executive Assistant', category: 'corporate', template: 'professional', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'office-manager', title: 'Office Manager', category: 'corporate', template: 'classic', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'operations-manager', title: 'Operations Manager', category: 'corporate', template: 'professional', tier: 2, experienceLevel: 'senior', priority: 0.8 },
  { slug: 'human-resources-generalist', title: 'Human Resources Generalist', category: 'corporate', template: 'classic', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'sales-representative', title: 'Sales Representative', category: 'corporate', template: 'modern', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'account-executive', title: 'Account Executive', category: 'corporate', template: 'modern', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'business-analyst', title: 'Business Analyst', category: 'corporate', template: 'professional', tier: 2, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'marketing-manager', title: 'Marketing Manager', category: 'corporate', template: 'modern', tier: 2, experienceLevel: 'senior', priority: 0.8 },
  { slug: 'recruiter', title: 'Recruiter', category: 'corporate', template: 'modern', tier: 2, experienceLevel: 'mid', priority: 0.7 },
];

// ============================================
// Tier 3: Healthcare & Specialized
// High intent, format-specific
// ============================================
const tier3Jobs: JobConfig[] = [
  { slug: 'registered-nurse', title: 'Registered Nurse (RN)', category: 'healthcare', template: 'classic', tier: 3, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'medical-assistant', title: 'Medical Assistant', category: 'healthcare', template: 'classic', tier: 3, experienceLevel: 'entry', priority: 0.8 },
  { slug: 'certified-nursing-assistant', title: 'Certified Nursing Assistant (CNA)', category: 'healthcare', template: 'classic', tier: 3, experienceLevel: 'entry', priority: 0.8 },
  { slug: 'dental-assistant', title: 'Dental Assistant', category: 'healthcare', template: 'classic', tier: 3, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'pharmacist', title: 'Pharmacist', category: 'healthcare', template: 'professional', tier: 3, experienceLevel: 'senior', priority: 0.7 },
  { slug: 'physical-therapist', title: 'Physical Therapist', category: 'healthcare', template: 'professional', tier: 3, experienceLevel: 'senior', priority: 0.7 },
  { slug: 'teacher', title: 'Teacher', category: 'education', template: 'classic', tier: 3, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'tutor', title: 'Tutor', category: 'education', template: 'minimal', tier: 3, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'paralegal', title: 'Paralegal', category: 'corporate', template: 'professional', tier: 3, experienceLevel: 'mid', priority: 0.7 },
  { slug: 'graphic-designer', title: 'Graphic Designer', category: 'creative', template: 'modern', tier: 3, experienceLevel: 'mid', priority: 0.8 },
];

// ============================================
// Tier 4: Finance & Tech
// High value users
// ============================================
const tier4Jobs: JobConfig[] = [
  { slug: 'staff-accountant', title: 'Staff Accountant', category: 'corporate', template: 'professional', tier: 4, experienceLevel: 'entry', priority: 0.8 },
  { slug: 'senior-accountant', title: 'Senior Accountant', category: 'corporate', template: 'professional', tier: 4, experienceLevel: 'senior', priority: 0.8 },
  { slug: 'financial-analyst', title: 'Financial Analyst', category: 'corporate', template: 'professional', tier: 4, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'bookkeeper', title: 'Bookkeeper', category: 'corporate', template: 'classic', tier: 4, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'bank-teller', title: 'Bank Teller', category: 'corporate', template: 'classic', tier: 4, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'software-engineer', title: 'Software Engineer', category: 'tech', template: 'modern', tier: 4, experienceLevel: 'mid', priority: 0.9 },
  { slug: 'front-end-developer', title: 'Front-End Developer', category: 'tech', template: 'modern', tier: 4, experienceLevel: 'mid', priority: 0.8 },
  { slug: 'product-manager', title: 'Product Manager', category: 'tech', template: 'modern', tier: 4, experienceLevel: 'senior', priority: 0.8 },
  { slug: 'it-support-specialist', title: 'IT Support Specialist', category: 'tech', template: 'modern', tier: 4, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'data-analyst', title: 'Data Analyst', category: 'tech', template: 'modern', tier: 4, experienceLevel: 'mid', priority: 0.8 },
];

// ============================================
// Tier 5: Student & Entry Level
// The "Lifetime User" Acquisition
// ============================================
const tier5Jobs: JobConfig[] = [
  { slug: 'college-student', title: 'College Student', category: 'student', template: 'minimal', tier: 5, experienceLevel: 'student', priority: 0.8 },
  { slug: 'high-school-student', title: 'High School Student', category: 'student', template: 'minimal', tier: 5, experienceLevel: 'student', priority: 0.7 },
  { slug: 'internship', title: 'Internship Resume', category: 'student', template: 'minimal', tier: 5, experienceLevel: 'student', priority: 0.8 },
  { slug: 'entry-level-marketing', title: 'Entry Level Marketing', category: 'student', template: 'modern', tier: 5, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'entry-level-sales', title: 'Entry Level Sales', category: 'student', template: 'modern', tier: 5, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'recent-graduate', title: 'Recent Graduate', category: 'student', template: 'minimal', tier: 5, experienceLevel: 'entry', priority: 0.8 },
];

// ============================================
// Tier 6: Creative & Marketing
// ============================================
const tier6Jobs: JobConfig[] = [
  { slug: 'social-media-manager', title: 'Social Media Manager', category: 'creative', template: 'modern', tier: 6, experienceLevel: 'mid', priority: 0.7 },
  { slug: 'content-writer', title: 'Content Writer', category: 'creative', template: 'modern', tier: 6, experienceLevel: 'mid', priority: 0.7 },
];

// ============================================
// Tier 7: Trades
// ============================================
const tier7Jobs: JobConfig[] = [
  { slug: 'electrician', title: 'Electrician', category: 'trades', template: 'classic', tier: 7, experienceLevel: 'mid', priority: 0.7 },
  { slug: 'hvac-technician', title: 'HVAC Technician', category: 'trades', template: 'classic', tier: 7, experienceLevel: 'mid', priority: 0.7 },
  { slug: 'plumber', title: 'Plumber', category: 'trades', template: 'classic', tier: 7, experienceLevel: 'mid', priority: 0.7 },
  { slug: 'construction-worker', title: 'Construction Worker', category: 'trades', template: 'minimal', tier: 7, experienceLevel: 'entry', priority: 0.7 },
  { slug: 'mechanic', title: 'Mechanic', category: 'trades', template: 'classic', tier: 7, experienceLevel: 'mid', priority: 0.7 },
];

export const ALL_JOBS: JobConfig[] = [
  ...tier1Jobs,
  ...tier2Jobs,
  ...tier3Jobs,
  ...tier4Jobs,
  ...tier5Jobs,
  ...tier6Jobs,
  ...tier7Jobs,
];

// Jobs that already have YAML files (will be skipped during generation)
export const EXISTING_JOBS = [
  'customer-service-representative',
  'administrative-assistant',
  'software-engineer',
  'registered-nurse',
  'project-manager',
  'college-student',
  'data-analyst',
  'teacher',
  'graphic-designer',
  'business-analyst',
  'receptionist',
];

export function getJobsToGenerate(): JobConfig[] {
  return ALL_JOBS.filter(job => !EXISTING_JOBS.includes(job.slug));
}

export function getJobBySlug(slug: string): JobConfig | undefined {
  return ALL_JOBS.find(job => job.slug === slug);
}

export function getJobsByTier(tier: number): JobConfig[] {
  return ALL_JOBS.filter(job => job.tier === tier);
}

// Summary stats
console.log(`
Job Examples Configuration Summary:
===================================
Total Jobs: ${ALL_JOBS.length}
Existing YAML Files: ${EXISTING_JOBS.length}
Jobs to Generate: ${getJobsToGenerate().length}

By Tier:
- Tier 1 (High Volume): ${tier1Jobs.length}
- Tier 2 (Corporate): ${tier2Jobs.length}
- Tier 3 (Healthcare/Specialized): ${tier3Jobs.length}
- Tier 4 (Finance/Tech): ${tier4Jobs.length}
- Tier 5 (Student/Entry): ${tier5Jobs.length}
- Tier 6 (Creative): ${tier6Jobs.length}
- Tier 7 (Trades): ${tier7Jobs.length}
`);
