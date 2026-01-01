import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  BACKEND_TECH,
  DATABASES,
  CLOUD_PLATFORMS,
  DEVOPS_TOOLS,
  AGILE_METHODOLOGIES,
  TESTING_PRACTICES,
  SECURITY_PRACTICES,
  SE_PRACTICES,
  COMMON_CERTIFICATIONS,
} from '../common/skills';

export const backendDeveloper: JobKeywordsData = {
  slug: 'backend-developer',
  title: 'Backend Developer',
  metaTitle: 'Backend Developer Resume Keywords - APIs, Databases & Server-Side',
  metaDescription:
    'Backend developer resume keywords: Node.js, Python, REST APIs, databases, microservices, cloud infrastructure, and server-side development skills.',
  category: 'technology',
  priority: 0.85,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Backend Development',
      'Server-Side Programming',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'System Architecture',
      'Database Design',
    ],
    technical: [
      ...PROGRAMMING_LANGUAGES.backend, // Python, Java, Go, Ruby, C#, PHP
      ...BACKEND_TECH.frameworks, // Node.js, Express, Django, Flask, Spring Boot, .NET
      ...BACKEND_TECH.api, // REST APIs, GraphQL, gRPC, WebSockets
      ...DATABASES.relational, // PostgreSQL, MySQL, Oracle, SQL Server
      ...DATABASES.noSql, // MongoDB, Redis, DynamoDB, Cassandra, Elasticsearch
      ...CLOUD_PLATFORMS.providers.slice(0, 3), // AWS, Azure, Google Cloud
      ...DEVOPS_TOOLS.containers.slice(0, 2), // Docker, Kubernetes
      'Microservices Architecture',
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks.slice(0, 1), // Agile/Scrum
      ...DEVOPS_TOOLS.ciCd.slice(0, 1), // CI/CD
      ...TESTING_PRACTICES.methodologies, // TDD, BDD
      ...SE_PRACTICES.slice(0, 3), // Code Reviews, Version Control, Pair Programming
      ...SECURITY_PRACTICES.slice(0, 2),
    ],
    certifications: [
      ...COMMON_CERTIFICATIONS.aws, // AWS certs
      'MongoDB Certified Developer',
      'Oracle Certified Professional',
    ],
  },

  tools: [
    {
      category: 'Programming Languages',
      items: ['Python', 'Node.js', 'Java', 'Go', 'Ruby', 'C#'],
    },
    {
      category: 'Frameworks',
      items: [...BACKEND_TECH.frameworks],
    },
    {
      category: 'Databases',
      items: [...DATABASES.relational, ...DATABASES.noSql],
    },
    {
      category: 'Cloud Platforms',
      items: [...CLOUD_PLATFORMS.providers],
    },
    {
      category: 'DevOps',
      items: [...DEVOPS_TOOLS.containers, ...DEVOPS_TOOLS.ciCd.slice(0, 3)],
    },
    {
      category: 'Tools',
      items: ['Git', 'Postman', 'Swagger', 'Redis', 'RabbitMQ'],
    },
  ],

  example: {
    before: 'Developed APIs and worked on server-side code.',
    after: 'Architected RESTful APIs using Node.js and PostgreSQL, implementing microservices with Docker and AWS Lambda to handle 50K+ requests/day with 99.95% uptime, reducing response time by 45%.',
  },
};
