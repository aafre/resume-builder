import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS } from '../common/skills';

export const salesRepresentative: JobKeywordsData = {
  slug: 'sales-representative',
  title: 'Sales Representative',
  metaTitle: 'Sales Representative Resume Keywords - ATS-Optimized Skills List (2026)',
  metaDescription:
    'Complete list of sales representative resume keywords including CRM (Salesforce, HubSpot), pipeline management, quota attainment, and sales methodology skills for ATS.',
  category: 'business',
  priority: 0.8,
  lastmod: '2026-02-02',

  roleIntro:
    'Sales hiring managers care about one thing above all: can you close? Your resume needs to prove it with specific numbers — quota attainment percentages, revenue generated, deal sizes, and pipeline value. Beyond the numbers, they want to see CRM proficiency (Salesforce is near-universal), familiarity with sales methodologies, and evidence you can prospect and build relationships.',

  keywords: {
    core: [
      'Sales',
      'Business Development',
      'Account Management',
      'Relationship Building',
      'Negotiation',
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Prospecting',
      'Lead Generation',
      'Customer Retention',
      'Closing',
    ],
    technical: [
      'Salesforce CRM',
      'HubSpot CRM',
      'LinkedIn Sales Navigator',
      'Outreach',
      'SalesLoft',
      'Gong',
      'Chorus',
      'ZoomInfo',
      'Microsoft Dynamics',
      'Pipedrive',
      'Tableau',
      'Excel',
      'PowerPoint',
      'Slack',
    ],
    certifications: [
      'Salesforce Certified Administrator',
      'HubSpot Sales Software Certified',
      'Sandler Sales Certified',
      'SPIN Selling Certified',
      'Challenger Sale Trained',
    ],
    metrics: [
      'Quota Attainment',
      'Revenue Generated',
      'Pipeline Value',
      'Win Rate',
      'Average Deal Size',
      'Sales Cycle Length',
      'Customer Retention Rate',
      'Year-over-Year Growth',
    ],
    processes: [
      'MEDDIC / MEDDPICC',
      'SPIN Selling',
      'Challenger Sale',
      'Sandler Selling System',
      'Solution Selling',
      'Consultative Selling',
      'Account-Based Selling (ABS)',
      'Sales Forecasting',
    ],
  },

  tools: [
    {
      category: 'CRM Platforms',
      items: ['Salesforce', 'HubSpot CRM', 'Microsoft Dynamics', 'Pipedrive', 'Zoho CRM'],
    },
    {
      category: 'Sales Engagement',
      items: ['Outreach', 'SalesLoft', 'Apollo.io', 'Lemlist', 'Mailshake'],
    },
    {
      category: 'Intelligence & Prospecting',
      items: ['LinkedIn Sales Navigator', 'ZoomInfo', 'Clearbit', 'Lusha', '6sense'],
    },
    {
      category: 'Conversation Intelligence',
      items: ['Gong', 'Chorus', 'Clari', 'People.ai'],
    },
  ],

  phrases: [
    'quota attainment',
    'pipeline management',
    'full sales cycle',
    'business development',
    'lead qualification',
    'cold outreach',
    'consultative selling',
    'territory management',
    'account expansion',
    'contract negotiation',
    'customer acquisition',
    'revenue growth',
    'sales forecasting',
    'competitive displacement',
    'cross-selling and upselling',
  ],

  example: {
    before: 'Sold products to customers and met sales goals.',
    after: 'Managed full sales cycle from prospecting to close in Salesforce, consistently exceeding quarterly quota (115% average attainment). Generated $1.8M in new ARR through consultative selling and LinkedIn Sales Navigator outreach, with a 32% win rate on qualified opportunities.',
  },

  exampleBullets: [
    'Exceeded annual quota of $2.4M by 18%, ranking #2 out of 35 account executives through MEDDIC-qualified pipeline management',
    'Built and managed $5M+ sales pipeline in Salesforce, maintaining accurate 90-day forecasts within 5% variance',
    'Sourced 40% of pipeline through outbound prospecting via LinkedIn Sales Navigator and Outreach sequences (200+ touches/week)',
    'Closed 28 new enterprise accounts ($50K-$300K ACV) with average 45-day sales cycle through consultative selling approach',
    'Achieved 95% customer retention rate across 60-account portfolio ($4.2M ARR), generating $600K in expansion revenue',
    'Reduced sales cycle length from 62 to 41 days by implementing Gong call analytics and refining discovery process',
    'Trained and onboarded 5 new SDRs, developing playbook that reduced ramp time from 6 months to 3.5 months',
  ],

  commonMistakes: [
    {
      mistake: 'Not including specific quota or revenue numbers',
      fix: 'Always quantify: "$1.8M generated," "115% quota attainment," "28 deals closed." Numbers are the language of sales resumes.',
    },
    {
      mistake: 'Using vague terms like "exceeded expectations"',
      fix: 'Be specific: "Ranked #2 out of 35 reps," "118% of quarterly target," "$5M pipeline generated"',
    },
    {
      mistake: 'Not mentioning CRM experience',
      fix: 'Name the CRM — Salesforce, HubSpot, or Dynamics. Most sales ATS systems filter on CRM proficiency.',
    },
    {
      mistake: 'Focusing only on closing, not the full sales process',
      fix: 'Show the full cycle: prospecting, qualification, discovery, proposal, negotiation, close, and account management',
    },
  ],
};
