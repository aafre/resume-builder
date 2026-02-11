/**
 * Categorized skill dictionary for ATS keyword matching.
 *
 * Built from the existing common/skills.ts data (~200 skills) plus
 * additional terms for healthcare, business, trades, and other domains.
 *
 * Purpose: Skills mentioned once in a JD (Terraform, Kubernetes, PostgreSQL)
 * are recognized and kept instead of being filtered by the frequency >= 2 threshold.
 */

import {
  PROGRAMMING_LANGUAGES,
  FRONTEND_TECH,
  BACKEND_TECH,
  DATABASES,
  CLOUD_PLATFORMS,
  DEVOPS_TOOLS,
  DATA_TOOLS,
  DESIGN_TOOLS,
  COMMON_CERTIFICATIONS,
  TESTING_PRACTICES,
  AGILE_METHODOLOGIES,
  COMMON_SOFT_SKILLS,
  COLLABORATION_TOOLS,
  SECURITY_PRACTICES,
  SE_PRACTICES,
} from '../../data/jobKeywords/common/skills';

export type KeywordCategory =
  | 'hard-skill'
  | 'soft-skill'
  | 'tool'
  | 'certification'
  | 'methodology';

// Helper: flatten all values from a const object into lowercase strings
function flattenValues(obj: Record<string, readonly string[]>): string[] {
  return Object.values(obj).flat().map((s) => s.toLowerCase());
}

// Helper: flatten and dedupe
function uniqueLower(items: string[]): string[] {
  return [...new Set(items.map((s) => s.toLowerCase()))];
}

// --- Build category maps from existing skill data ---

const hardSkillEntries: Array<[string, KeywordCategory]> = uniqueLower([
  ...flattenValues(PROGRAMMING_LANGUAGES),
  ...flattenValues(FRONTEND_TECH),
  ...flattenValues(BACKEND_TECH),
  ...flattenValues(DATABASES),
  ...flattenValues(CLOUD_PLATFORMS),
  ...flattenValues(DATA_TOOLS),
  ...flattenValues(TESTING_PRACTICES),
  ...SECURITY_PRACTICES.map((s) => s.toLowerCase()),
  ...SE_PRACTICES.map((s) => s.toLowerCase()),
  // Additional hard skills not in common/skills.ts
  'machine learning', 'deep learning', 'natural language processing',
  'computer vision', 'data engineering', 'data analysis', 'data science',
  'data modeling', 'etl', 'data warehousing', 'data visualization',
  'statistical analysis', 'a/b testing', 'regression', 'classification',
  'reinforcement learning', 'neural networks', 'transformers',
  'api design', 'microservices', 'event-driven architecture',
  'distributed systems', 'system design', 'cloud architecture',
  'serverless', 'edge computing', 'blockchain', 'smart contracts',
  'cybersecurity', 'penetration testing', 'vulnerability assessment',
  'network security', 'encryption', 'oauth', 'jwt', 'sso',
  'responsive design', 'accessibility', 'wcag', 'seo',
  'performance optimization', 'caching', 'load balancing',
  'message queues', 'rabbitmq', 'kafka', 'apache kafka',
  'technical writing', 'documentation',
  // Healthcare
  'ehr', 'emr', 'hipaa', 'clinical documentation', 'patient care',
  'medical coding', 'icd-10', 'cpt coding', 'phlebotomy',
  'vital signs', 'medication administration', 'wound care',
  'ventilator management', 'telemetry', 'triage',
  // Business / Finance
  'financial modeling', 'financial analysis', 'forecasting', 'budgeting',
  'accounting', 'gaap', 'ifrs', 'audit', 'tax preparation',
  'bookkeeping', 'accounts payable', 'accounts receivable',
  'business intelligence', 'market research', 'competitive analysis',
  'crm', 'erp', 'supply chain', 'logistics', 'procurement',
  'risk management', 'compliance', 'regulatory',
  // Trades / Engineering
  'autocad', 'solidworks', 'revit', 'bim', 'cad',
  'plc programming', 'scada', 'hvac', 'electrical wiring',
  'welding', 'cnc machining', 'quality control', 'iso 9001',
  'lean manufacturing', 'six sigma',
  // Finance / Legal / Housing
  'conveyancing', 'treasury', 'loan security', 'valuations', 'leasehold',
  'freehold', 'land registry', 'title deeds', 'mortgage', 'remortgage',
  'debt recovery', 'credit control', 'arrears management',
  'housing management', 'social housing', 'housing association',
  'tenancy management', 'property management',
  'legal compliance', 'due diligence', 'contract management',
  'underwriting', 'portfolio management', 'asset management',
  'financial reporting', 'management accounts', 'cost control',
]).map((s) => [s, 'hard-skill']);

const toolEntries: Array<[string, KeywordCategory]> = uniqueLower([
  ...flattenValues(DEVOPS_TOOLS),
  ...flattenValues(COLLABORATION_TOOLS),
  ...flattenValues(DESIGN_TOOLS),
  // Additional tools
  'terraform', 'ansible', 'puppet', 'chef',
  'jenkins', 'circleci', 'travis ci', 'bamboo',
  'docker', 'kubernetes', 'helm', 'istio',
  'nginx', 'apache', 'haproxy', 'envoy',
  'linux', 'ubuntu', 'centos', 'windows server',
  'visual studio', 'visual studio code', 'intellij idea', 'eclipse',
  'postman', 'swagger', 'insomnia',
  'new relic', 'datadog', 'splunk', 'elk stack',
  'redis', 'memcached', 'rabbitmq',
  'salesforce', 'hubspot', 'marketo', 'mailchimp',
  'shopify', 'magento', 'woocommerce',
  'wordpress', 'drupal', 'contentful',
  'excel', 'powerpoint', 'word', 'google sheets',
  'power bi', 'tableau', 'looker',
  'jira', 'confluence', 'trello', 'asana', 'monday.com',
  'slack', 'microsoft teams', 'zoom',
  'figma', 'sketch', 'adobe xd', 'invision',
  'photoshop', 'illustrator', 'after effects',
  'git', 'github', 'gitlab', 'bitbucket',
  'jupyter', 'databricks', 'snowflake', 'bigquery',
  'airflow', 'apache spark',
  'sap', 'oracle', 'workday', 'peoplesoft',
]).map((s) => [s, 'tool']);

const certificationEntries: Array<[string, KeywordCategory]> = uniqueLower([
  ...flattenValues(COMMON_CERTIFICATIONS),
  // Additional certifications
  'pmp', 'prince2', 'capm', 'csm', 'psm',
  'cissp', 'ceh', 'comptia security+', 'comptia a+', 'comptia network+',
  'ccna', 'ccnp', 'ccie',
  'cpa', 'cfa', 'cma', 'cia',
  'aws certified', 'azure certified', 'google cloud certified',
  'itil', 'cobit', 'togaf',
  'six sigma green belt', 'six sigma black belt',
  'acls', 'bls', 'pals', 'ccrn', 'cen',
  'rn', 'bsn', 'msn', 'np',
  'pe', 'eit', 'leed',
  'servsafe', 'osha',
  // UK finance / legal certifications
  'lpc', 'cilex', 'cii', 'acca', 'cima',
]).map((s) => [s, 'certification']);

const methodologyEntries: Array<[string, KeywordCategory]> = uniqueLower([
  ...flattenValues(AGILE_METHODOLOGIES),
  // Additional methodologies
  'agile', 'scrum', 'kanban', 'waterfall', 'lean', 'safe',
  'sdlc', 'devops', 'devsecops', 'gitops',
  'test-driven development', 'behavior-driven development',
  'continuous integration', 'continuous delivery', 'continuous deployment',
  'pair programming', 'mob programming', 'code review',
  'design thinking', 'user-centered design',
  'object-oriented programming', 'functional programming',
  'domain-driven design', 'event sourcing', 'cqrs',
  'infrastructure as code', 'configuration management',
  'incident management', 'on-call',
]).map((s) => [s, 'methodology']);

const softSkillEntries: Array<[string, KeywordCategory]> = uniqueLower([
  ...flattenValues(COMMON_SOFT_SKILLS),
  // Additional soft skills
  'communication', 'teamwork', 'collaboration', 'leadership',
  'problem solving', 'critical thinking', 'analytical thinking',
  'adaptability', 'creativity', 'innovation',
  'time management', 'prioritization', 'multitasking',
  'negotiation', 'conflict resolution', 'emotional intelligence',
  'public speaking', 'presentation skills', 'storytelling',
  'customer service', 'client management', 'relationship building',
  'strategic thinking', 'decision making', 'initiative',
  'self-motivated', 'detail-oriented', 'results-driven',
  'cross-functional', 'stakeholder management',
  'flexibility', 'goal-oriented', 'proactive', 'resilience',
]).map((s) => [s, 'soft-skill']);

// --- Build the lookup structures ---

/** Map from lowercase skill name to its category */
export const SKILL_CATEGORIES: ReadonlyMap<string, KeywordCategory> = new Map([
  // Order matters: later entries override earlier ones for duplicates.
  // We want more-specific categories to win (e.g. "git" as tool, not hard-skill).
  ...hardSkillEntries,
  ...softSkillEntries,
  ...methodologyEntries,
  ...toolEntries,
  ...certificationEntries,
]);

/** Set of all known skill names (lowercase) for quick lookup */
export const KNOWN_SKILLS: ReadonlySet<string> = new Set(SKILL_CATEGORIES.keys());

/** Check if a term (case-insensitive) is a known skill */
export function isKnownSkill(term: string): boolean {
  return KNOWN_SKILLS.has(term.toLowerCase());
}

/** Get the category of a known skill, or undefined */
export function getSkillCategory(term: string): KeywordCategory | undefined {
  return SKILL_CATEGORIES.get(term.toLowerCase());
}

/**
 * Known multi-word phrases (3+ words) that should be extracted as trigrams.
 * Only phrases that actually appear in the text will be added.
 */
export const KNOWN_PHRASES: ReadonlySet<string> = new Set([
  'natural language processing',
  'object oriented programming',
  'object-oriented programming',
  'infrastructure as code',
  'version control system',
  'test driven development',
  'test-driven development',
  'behavior driven development',
  'behavior-driven development',
  'continuous integration continuous delivery',
  'machine learning engineer',
  'site reliability engineering',
  'user experience design',
  'user interface design',
  'application programming interface',
  'software development lifecycle',
  'software development kit',
  'content management system',
  'customer relationship management',
  'enterprise resource planning',
  'business intelligence analyst',
  'extract transform load',
  'amazon web services',
  'google cloud platform',
  'react testing library',
  'large language model',
  'artificial intelligence',
  'software as a service',
  'platform as a service',
  'domain driven design',
  'event driven architecture',
  'six sigma green belt',
  'six sigma black belt',
  'rest api design',
  'quality assurance testing',
  'search engine optimization',
  'cross functional team',
  'full stack developer',
  'front end developer',
  'back end developer',
  'data driven decision',
  'lean six sigma',
  'supply chain management',
  'project management professional',
  'human computer interaction',
  'internet of things',
]);
