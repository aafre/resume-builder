import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  FRONTEND_TECH,
  BACKEND_TECH,
  DATABASES,
  CLOUD_PLATFORMS,
  DEVOPS_TOOLS,
  AGILE_METHODOLOGIES,
  SE_PRACTICES,
  COMMON_CERTIFICATIONS,
} from '../common/skills';

export const fullStackDeveloper: JobKeywordsData = {
  slug: 'full-stack-developer',
  title: 'Full Stack Developer',
  metaTitle: 'Full Stack Developer Resume Keywords - Frontend + Backend Skills',
  metaDescription:
    'Full stack developer resume keywords: React, Node.js, JavaScript, databases, REST APIs, cloud platforms, and end-to-end development skills for ATS.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Full Stack Development',
      'End-to-End Development',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'System Architecture',
      'Technical Leadership',
    ],
    technical: [
      // Frontend
      ...PROGRAMMING_LANGUAGES.web, // JavaScript, TypeScript, HTML, CSS
      ...FRONTEND_TECH.frameworks.slice(0, 3), // React, Angular, Vue.js
      // Backend
      ...BACKEND_TECH.frameworks.slice(0, 3), // Node.js, Express, Django
      ...BACKEND_TECH.api.slice(0, 2), // REST APIs, GraphQL
      // Database
      ...DATABASES.relational.slice(0, 2), // PostgreSQL, MySQL
      ...DATABASES.noSql.slice(0, 2), // MongoDB, Redis
      // DevOps & Cloud
      ...DEVOPS_TOOLS.versionControl.slice(0, 1), // Git
      ...DEVOPS_TOOLS.containers.slice(0, 2), // Docker, Kubernetes
      ...CLOUD_PLATFORMS.providers.slice(0, 1), // AWS
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks.slice(0, 1), // Agile/Scrum
      ...DEVOPS_TOOLS.ciCd.slice(0, 1), // CI/CD
      ...SE_PRACTICES.slice(0, 4), // Code Reviews, Version Control, Pair Programming, Technical Documentation
      'Full SDLC',
    ],
    certifications: [
      ...COMMON_CERTIFICATIONS.aws.slice(0, 1), // AWS Certified Developer
      'Full Stack Web Developer Certificate',
      'Meta Full Stack Engineer Certificate',
    ],
  },

  tools: [
    {
      category: 'Frontend',
      items: ['React', 'Vue.js', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'Python', 'Django', 'Flask'],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    },
    {
      category: 'DevOps & Cloud',
      items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git'],
    },
    {
      category: 'Tools',
      items: ['Webpack', 'Vite', 'Postman', 'Jira', 'VS Code'],
    },
  ],

  example: {
    before: 'Built full stack web applications using modern technologies.',
    after: 'Engineered end-to-end web applications using React and Node.js with PostgreSQL, implementing RESTful APIs and deploying on AWS with Docker, serving 100K+ monthly users with 99.7% uptime and reducing page load time by 50%.',
  },
};
