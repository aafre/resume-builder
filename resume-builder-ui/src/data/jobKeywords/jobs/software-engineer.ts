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
  metaTitle: 'Software Engineer Resume Keywords (2026) — 120+ Dev Skills & Tools',
  metaDescription:
    'Complete software engineer resume keywords: Python, Java, React, AWS, CI/CD, Docker, Kubernetes. Before/after examples for SWE resumes. ATS-optimized.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-02-04',

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
    'Implemented automated alerting and runbook documentation, improving incident response time by 50% and maintaining 99.99% uptime SLA for payment processing service',
    'Led migration of 3 legacy Java services to Go microservices on Kubernetes, reducing infrastructure costs by 45% and improving p99 latency from 1.2s to 180ms',
    'Optimized data ingestion pipeline to handle 2M events/sec throughput, reducing end-to-end processing latency from 30s to under 2s using Kafka and Apache Flink',
    'Implemented OWASP Top 10 security best practices across 12 microservices, resolving 25 critical vulnerabilities and passing SOC 2 compliance audit',
    'Built internal CLI tool and VS Code extension for service scaffolding, reducing new microservice setup time from 3 days to 20 minutes and adopted by 40+ engineers',
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

  customFaqs: [
    {
      question: 'What keywords should a junior vs senior software engineer use on their resume?',
      answer:
        'Junior engineers should emphasize foundational skills (data structures, algorithms, Git, testing) and learning velocity—mention technologies you\'ve shipped with, internships, and personal projects with real users. Senior engineers should highlight architecture decisions, mentorship, system design, scalability, cross-team leadership, and production ownership. Both levels need metrics, but seniors are expected to show broader scope: "Led migration for 15-person team" vs. "Implemented feature in React."',
    },
    {
      question: 'How should I list programming languages on my resume?',
      answer:
        'Group languages by proficiency or relevance, not alphabetically. Lead with languages in the job description. A strong format is: "Languages: Python (5 years), TypeScript (3 years), Go (2 years)." Alternatively, demonstrate proficiency through your bullet points—"Built real-time pipeline in Go handling 1M events/day" is more convincing than listing "Go" in a skills section. Avoid listing languages you cannot discuss in an interview.',
    },
    {
      question: 'Should I include DevOps and cloud skills on a software engineer resume?',
      answer:
        'Yes. Modern SWE roles expect familiarity with CI/CD, Docker, Kubernetes, and at least one cloud provider (AWS, GCP, or Azure). Include these in your skills section and, more importantly, in your bullet points: "Deployed services to AWS ECS using Terraform and GitHub Actions." Even if you are not a DevOps specialist, showing you can own the full lifecycle from code to production is a strong signal to hiring teams.',
    },
    {
      question: 'What is the difference between Software Engineer, Software Developer, and DevOps Engineer keywords?',
      answer:
        'Software Engineer resumes emphasize system design, algorithms, data structures, scalability, and production-level code. Software Developer resumes often lean toward application-level skills — CRUD operations, UI development, API integration, and business logic. DevOps Engineer resumes focus on infrastructure-as-code (Terraform, CloudFormation), CI/CD pipelines (Jenkins, GitHub Actions), container orchestration (Kubernetes, ECS), monitoring (Datadog, Prometheus, Grafana), and cloud architecture. If a job title says "Full-Stack Engineer," blend frontend frameworks (React, Vue) with backend (Node.js, Python) and infrastructure keywords.',
    },
    {
      question: 'What framework and library keywords should I include for frontend vs backend roles?',
      answer:
        'Frontend roles: React, Vue, Angular, Next.js, TypeScript, Tailwind CSS, Webpack/Vite, responsive design, accessibility (WCAG), state management (Redux, Zustand), component testing (Jest, Testing Library). Backend roles: Node.js, Express, Django, FastAPI, Spring Boot, PostgreSQL, Redis, message queues (Kafka, RabbitMQ), REST API design, GraphQL, authentication (OAuth, JWT), and ORM tools (Prisma, SQLAlchemy). Always match the specific frameworks listed in the job description — a React job cares about React, not Angular.',
    },
  ],
};
