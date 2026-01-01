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
  TESTING_PRACTICES,
  COMMON_CERTIFICATIONS,
  SE_PRACTICES,
} from '../common/skills';

export const softwareEngineer: JobKeywordsData = {
  slug: 'software-engineer',
  title: 'Software Engineer',
  metaTitle: 'Software Engineer Resume Keywords - ATS-Optimized Skills List',
  metaDescription:
    'Complete list of software engineer resume keywords including Python, JavaScript, React, AWS, Docker, Agile, and essential programming skills that pass ATS systems.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Software Development',
      ...COMMON_SOFT_SKILLS.problemSolving,
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'System Design',
      'Algorithm Design',
      'Data Structures',
    ],
    technical: [
      ...PROGRAMMING_LANGUAGES.backend.slice(0, 4), // Python, Java, Go, Ruby
      ...PROGRAMMING_LANGUAGES.web.slice(0, 2), // JavaScript, TypeScript
      ...FRONTEND_TECH.frameworks.slice(0, 2), // React, Angular
      ...BACKEND_TECH.frameworks.slice(0, 2), // Node.js, Express
      ...DEVOPS_TOOLS.versionControl.slice(0, 1), // Git
      ...DEVOPS_TOOLS.containers.slice(0, 2), // Docker, Kubernetes
      ...CLOUD_PLATFORMS.providers.slice(0, 1), // AWS
      ...BACKEND_TECH.api.slice(0, 2), // REST APIs, GraphQL
      ...DATABASES.relational.slice(0, 1), // PostgreSQL
      ...DATABASES.noSql.slice(0, 1), // MongoDB
      'Microservices',
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks.slice(0, 1), // Agile/Scrum
      ...DEVOPS_TOOLS.ciCd.slice(0, 1), // CI/CD
      ...TESTING_PRACTICES.methodologies, // TDD, BDD
      ...SE_PRACTICES.slice(0, 3), // Code Reviews, Version Control, Pair Programming
    ],
    certifications: [
      ...COMMON_CERTIFICATIONS.aws.slice(0, 1), // AWS Certified Developer
      ...COMMON_CERTIFICATIONS.agile.slice(0, 1), // CSM
      'Oracle Certified Java Programmer',
      'Google Cloud Professional',
    ],
  },

  tools: [
    {
      category: 'Programming Languages',
      items: ['Python', 'JavaScript', 'Java', 'TypeScript', 'C++', 'Go', 'Ruby', 'C#'],
    },
    {
      category: 'Frontend Frameworks',
      items: [...FRONTEND_TECH.frameworks],
    },
    {
      category: 'Backend Frameworks',
      items: [...BACKEND_TECH.frameworks],
    },
    {
      category: 'Databases',
      items: [...DATABASES.relational, ...DATABASES.noSql.slice(0, 4)],
    },
    {
      category: 'DevOps & Cloud',
      items: [
        ...DEVOPS_TOOLS.containers.slice(0, 2),
        ...CLOUD_PLATFORMS.providers.slice(0, 3),
        ...DEVOPS_TOOLS.ciCd.slice(0, 3),
      ],
    },
    {
      category: 'Tools & Platforms',
      items: ['Git', 'GitHub', 'Jira', 'Confluence', 'VS Code', 'IntelliJ'],
    },
  ],
};
