import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  DATABASES,
  DATA_TOOLS,
  COLLABORATION_TOOLS,
} from '../common/skills';

export const dataAnalyst: JobKeywordsData = {
  slug: 'data-analyst',
  title: 'Data Analyst',
  metaTitle: 'Data Analyst Resume Keywords - SQL, Excel & Data Visualization',
  metaDescription:
    'Data analyst resume keywords: SQL, Excel, Tableau, Power BI, Python, data visualization, statistical analysis, and business intelligence skills.',
  category: 'technology',
  priority: 0.85,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Data Analysis',
      ...COMMON_SOFT_SKILLS.problemSolving,
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Business Intelligence',
      'Reporting',
      ...COMMON_SOFT_SKILLS.organization.slice(0, 2),
    ],
    technical: [
      'SQL',
      'Excel',
      ...DATA_TOOLS.visualization, // Tableau, Power BI, Looker, Matplotlib, D3.js
      ...PROGRAMMING_LANGUAGES.data.slice(0, 2), // Python, R
      ...DATA_TOOLS.processing.slice(0, 2), // Pandas, NumPy
      ...DATABASES.relational.slice(0, 2), // PostgreSQL, MySQL
      'Statistical Analysis',
      'Data Modeling',
      'ETL',
    ],
    processes: [
      'Data Cleaning',
      'Data Validation',
      'Exploratory Data Analysis (EDA)',
      'Dashboard Development',
      'KPI Tracking',
      'A/B Testing',
      'Root Cause Analysis',
    ],
    certifications: [
      'Google Data Analytics Certificate',
      'Microsoft Certified: Data Analyst Associate',
      'Tableau Desktop Specialist',
      'IBM Data Analyst Professional Certificate',
    ],
    metrics: [
      'Revenue Analysis',
      'Customer Metrics',
      'Conversion Rate',
      'ROI Analysis',
    ],
  },

  tools: [
    {
      category: 'Data Visualization',
      items: [...DATA_TOOLS.visualization, 'Google Data Studio'],
    },
    {
      category: 'Databases & SQL',
      items: [...DATABASES.relational, ...DATABASES.noSql.slice(0, 1)],
    },
    {
      category: 'Programming & Analysis',
      items: ['Python', 'R', 'Pandas', 'NumPy', 'Excel', 'VBA'],
    },
    {
      category: 'BI Platforms',
      items: ['Tableau', 'Power BI', 'Looker', 'Qlik', 'Sisense'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication.slice(0, 3), 'Google Sheets'],
    },
  ],
};
