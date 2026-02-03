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
  metaTitle: 'Software Engineer Resume Keywords (2026) - 120+ ATS Skills & Examples',
  metaDescription:
    'Free software engineer resume keywords: Python, Java, React, AWS, CI/CD, microservices, Docker. Includes before/after bullet examples for developer resumes.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-01-18',

  roleIntro:
    'Hiring teams scan for both technical depth and practical experience. They want to see specific technologies you\'ve used (not just "programming"), evidence of scale (users, transactions, uptime), and proof you can work in modern development environments. Your resume should demonstrate you can ship production code, collaborate with teams, and solve real problems—not just that you\'ve taken courses.',

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

  phrases: [
    'full-stack development',
    'RESTful API design',
    'microservices architecture',
    'test-driven development',
    'continuous integration',
    'agile methodology',
    'code review',
    'scalable systems',
    'cloud-native applications',
    'database optimization',
    'performance tuning',
    'cross-functional collaboration',
    'technical documentation',
    'system design',
    'production deployment',
  ],

  example: {
    before: 'Worked on software projects and helped the team deliver features on time.',
    after: 'Developed scalable microservices using Python and React, implementing CI/CD pipelines with Docker and Kubernetes, reducing deployment time by 40% and increasing system reliability to 99.9% uptime.',
  },

  exampleBullets: [
    'Architected and implemented a microservices backend using Node.js and Express, handling 50K+ daily API requests with 99.95% uptime',
    'Reduced page load time by 60% through React code splitting, lazy loading, and CDN optimization',
    'Built CI/CD pipeline using GitHub Actions and Docker, decreasing deployment time from 2 hours to 15 minutes',
    'Designed and implemented RESTful APIs consumed by 3 client applications, documenting endpoints with OpenAPI/Swagger',
    'Migrated legacy monolith to microservices architecture, improving system scalability and reducing infrastructure costs by 35%',
    'Led code reviews for a 5-person team, establishing coding standards that reduced production bugs by 40%',
    'Optimized PostgreSQL queries and implemented Redis caching, reducing average API response time from 800ms to 120ms',
    'Developed real-time notification system using WebSockets, serving 10K concurrent users with <50ms latency',
    'Implemented comprehensive test suite (Jest, Cypress) achieving 85% code coverage across frontend and backend',
    'Collaborated with product and design teams in Agile sprints, consistently delivering features 2 days ahead of estimates',
  ],

  commonMistakes: [
    {
      mistake: 'Listing every technology you\'ve touched',
      fix: 'Focus on technologies you can discuss confidently in interviews. Show depth over breadth.',
    },
    {
      mistake: 'Using vague terms like "worked on" or "helped with"',
      fix: 'Use action verbs: "Developed," "Implemented," "Architected," "Optimized," "Led"',
    },
    {
      mistake: 'No metrics or quantifiable results',
      fix: 'Add numbers: users served, latency reduced, uptime achieved, deployment frequency',
    },
    {
      mistake: 'Listing outdated technologies prominently',
      fix: 'Lead with modern, in-demand skills. Mention legacy tech only if relevant to the job',
    },
    {
      mistake: 'Not showing proficiency levels',
      fix: 'Indicate expertise: "Python (5+ years)", "React (Advanced)", "Go (Intermediate)"',
    },
    {
      mistake: 'Ignoring soft skills entirely',
      fix: 'Weave in collaboration, communication, and leadership through your bullet points',
    },
  ],
};
