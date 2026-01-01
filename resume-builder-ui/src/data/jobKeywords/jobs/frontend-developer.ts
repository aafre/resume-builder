import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  FRONTEND_TECH,
  DEVOPS_TOOLS,
  AGILE_METHODOLOGIES,
  TESTING_PRACTICES,
  SE_PRACTICES,
} from '../common/skills';

export const frontendDeveloper: JobKeywordsData = {
  slug: 'frontend-developer',
  title: 'Frontend Developer',
  metaTitle: 'Frontend Developer Resume Keywords - React, JavaScript & UI/UX',
  metaDescription:
    'Frontend developer resume keywords: React, JavaScript, TypeScript, HTML/CSS, responsive design, accessibility, and modern framework skills for ATS.',
  category: 'technology',
  priority: 0.85,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Frontend Development',
      'UI Implementation',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Attention to Detail',
      'User-Centric Design',
    ],
    technical: [
      ...PROGRAMMING_LANGUAGES.web, // JavaScript, TypeScript, HTML, CSS
      ...FRONTEND_TECH.frameworks, // React, Angular, Vue.js, Svelte, Next.js
      ...FRONTEND_TECH.css, // Tailwind CSS, Sass, CSS-in-JS, Bootstrap
      'Responsive Design',
      'Cross-Browser Compatibility',
      'Web Accessibility (WCAG)',
      'Performance Optimization',
      ...DEVOPS_TOOLS.versionControl.slice(0, 1), // Git
      'RESTful APIs',
      'State Management',
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks.slice(0, 1), // Agile/Scrum
      ...SE_PRACTICES.slice(0, 2), // Code Reviews, Version Control
      ...TESTING_PRACTICES.types.slice(0, 2), // Unit Testing, Integration Testing
      'Component-Driven Development',
      'Mobile-First Design',
    ],
    certifications: [
      'Meta Front-End Developer Certificate',
      'Google UX Design Certificate',
      'AWS Certified Developer',
    ],
  },

  tools: [
    {
      category: 'Core Technologies',
      items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
    },
    {
      category: 'Frameworks & Libraries',
      items: [...FRONTEND_TECH.frameworks, 'Redux', 'MobX', 'Zustand'],
    },
    {
      category: 'Build Tools',
      items: [...FRONTEND_TECH.tools],
    },
    {
      category: 'CSS Frameworks',
      items: [...FRONTEND_TECH.css],
    },
    {
      category: 'Testing',
      items: [...FRONTEND_TECH.testing],
    },
    {
      category: 'Version Control',
      items: ['Git', 'GitHub', 'GitLab'],
    },
  ],

  example: {
    before: 'Built website features and fixed bugs for users.',
    after: 'Developed responsive React components using TypeScript and Tailwind CSS, implementing Web Accessibility (WCAG 2.1) standards and optimizing performance to achieve 95+ Lighthouse scores, reducing page load time by 60%.',
  },
};
