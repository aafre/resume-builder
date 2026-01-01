import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  AGILE_METHODOLOGIES,
  COLLABORATION_TOOLS,
  DATA_TOOLS,
} from '../common/skills';

export const productManager: JobKeywordsData = {
  slug: 'product-manager',
  title: 'Product Manager',
  metaTitle: 'Product Manager Resume Keywords - Agile, Roadmaps & Strategy',
  metaDescription:
    'Top product manager resume keywords: product roadmap, Agile, user stories, stakeholder management, A/B testing, and product strategy for ATS success.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Product Strategy',
      'Product Vision',
      ...COMMON_SOFT_SKILLS.leadership,
      ...COMMON_SOFT_SKILLS.communication,
      'Customer Empathy',
      'Data-Driven Decision Making',
    ],
    technical: [
      'Product Roadmap',
      'User Stories',
      'Wireframing',
      ...COLLABORATION_TOOLS.projectManagement,
      ...DATA_TOOLS.visualization.slice(0, 2), // Tableau, Power BI
      'SQL',
      'Analytics',
      'A/B Testing',
      'Feature Prioritization',
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks, // Agile/Scrum, Kanban, Lean, SAFe
      'Product Discovery',
      'User Research',
      'Market Analysis',
      'OKRs (Objectives and Key Results)',
      'Go-to-Market Strategy',
      'Backlog Management',
    ],
    certifications: [
      'Certified Scrum Product Owner (CSPO)',
      'Pragmatic Marketing Certified (PMC)',
      'Product Management Certificate',
      'Google Analytics Certification',
    ],
    metrics: [
      'User Engagement',
      'Retention Rate',
      'Churn Rate',
      'Customer Lifetime Value (LTV)',
      'Monthly Active Users (MAU)',
    ],
  },

  tools: [
    {
      category: 'Product Management',
      items: ['Jira', 'Asana', 'Productboard', 'Aha!', 'Linear'],
    },
    {
      category: 'Design & Prototyping',
      items: ['Figma', 'Sketch', 'Miro', 'Balsamiq', 'Adobe XD'],
    },
    {
      category: 'Analytics',
      items: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Heap', 'Looker'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication, 'Notion', 'Confluence'],
    },
  ],

  example: {
    before: 'Managed product features and worked with engineering teams.',
    after: 'Led cross-functional teams using Agile/Scrum to launch 3 major features, conducting A/B tests and user research to increase Monthly Active Users by 35% and improve retention rate from 68% to 82%.',
  },
};
