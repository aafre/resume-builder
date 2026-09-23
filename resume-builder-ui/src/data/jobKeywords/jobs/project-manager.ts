import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  AGILE_METHODOLOGIES,
  COLLABORATION_TOOLS,
  COMMON_CERTIFICATIONS,
} from '../common/skills';

export const projectManager: JobKeywordsData = {
  slug: 'project-manager',
  title: 'Project Manager',
  metaTitle: 'Project Manager Resume Keywords - Agile, PMP & Stakeholder Management',
  metaDescription:
    'Project manager resume keywords: Agile, Scrum, stakeholder management, risk management, budgeting, PMP, and project planning skills for ATS.',
  category: 'technology',
  priority: 0.85,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Project Management',
      'Project Planning',
      ...COMMON_SOFT_SKILLS.leadership,
      ...COMMON_SOFT_SKILLS.communication,
      ...COMMON_SOFT_SKILLS.organization,
      'Risk Management',
      'Budget Management',
    ],
    technical: [
      ...COLLABORATION_TOOLS.projectManagement, // Jira, Confluence, Trello, Asana, Monday.com
      'Microsoft Project',
      'Gantt Charts',
      'Resource Planning',
      'Scope Management',
      'Change Management',
      'Status Reporting',
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks, // Agile/Scrum, Kanban, Lean, SAFe
      ...AGILE_METHODOLOGIES.practices, // Sprint Planning, Daily Standups, Retrospectives, Backlog Grooming
      'Waterfall Methodology',
      'Risk Assessment',
      'Quality Assurance',
      'Project Lifecycle Management',
    ],
    certifications: [
      ...COMMON_CERTIFICATIONS.pmp, // PMP, PRINCE2, CAPM
      ...COMMON_CERTIFICATIONS.agile.slice(0, 2), // CSM, PMI-ACP
      'Six Sigma Green Belt',
    ],
    metrics: [
      'On-Time Delivery',
      'Budget Variance',
      'Resource Utilization',
      'Project ROI',
      'Stakeholder Satisfaction',
    ],
  },

  tools: [
    {
      category: 'Project Management Software',
      items: [...COLLABORATION_TOOLS.projectManagement, 'Microsoft Project', 'Smartsheet'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication, ...COLLABORATION_TOOLS.documentation],
    },
    {
      category: 'Reporting & Analytics',
      items: ['Excel', 'Power BI', 'Tableau', 'Google Sheets'],
    },
    {
      category: 'Agile Tools',
      items: ['Jira', 'Azure DevOps', 'VersionOne', 'Rally'],
    },
  ],

  example: {
    before: 'Managed multiple projects and coordinated with cross-functional teams.',
    after: 'Managed 5 concurrent Agile projects worth $3.2M using Jira and Microsoft Project, coordinating cross-functional teams of 20+ members across engineering, design, and marketing, delivering all projects on time and 12% under budget while maintaining 92% stakeholder satisfaction.',
  },
};
