import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  CLOUD_PLATFORMS,
  DEVOPS_TOOLS,
  SECURITY_PRACTICES,
  AGILE_METHODOLOGIES,
  COMMON_CERTIFICATIONS,
} from '../common/skills';

export const devopsEngineer: JobKeywordsData = {
  slug: 'devops-engineer',
  title: 'DevOps Engineer',
  metaTitle: 'DevOps Engineer Resume Keywords - CI/CD, Cloud & Automation',
  metaDescription:
    'DevOps engineer resume keywords: Docker, Kubernetes, AWS, CI/CD, Terraform, infrastructure as code, automation, and cloud platform skills.',
  category: 'technology',
  priority: 0.85,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'DevOps Engineering',
      'Infrastructure Management',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Automation',
      'System Reliability',
    ],
    technical: [
      ...DEVOPS_TOOLS.containers, // Docker, Kubernetes, Docker Compose, Helm
      ...DEVOPS_TOOLS.ciCd, // CI/CD, Jenkins, GitLab CI, GitHub Actions, CircleCI
      ...DEVOPS_TOOLS.iac, // Terraform, Ansible, CloudFormation, Puppet
      ...CLOUD_PLATFORMS.providers, // AWS, Azure, Google Cloud, Heroku, DigitalOcean
      ...DEVOPS_TOOLS.monitoring, // Prometheus, Grafana, Datadog, New Relic
      ...PROGRAMMING_LANGUAGES.backend.slice(0, 2), // Python, Java
      'Bash/Shell Scripting',
      'Infrastructure as Code (IaC)',
      'Configuration Management',
    ],
    processes: [
      'Continuous Integration',
      'Continuous Deployment',
      ...AGILE_METHODOLOGIES.frameworks.slice(0, 1), // Agile/Scrum
      'Site Reliability Engineering (SRE)',
      'Incident Management',
      ...SECURITY_PRACTICES.slice(0, 2),
      'Blue-Green Deployment',
    ],
    certifications: [
      ...COMMON_CERTIFICATIONS.aws, // AWS certs
      'Certified Kubernetes Administrator (CKA)',
      'HashiCorp Terraform Certified',
      'Docker Certified Associate',
    ],
    metrics: [
      'System Uptime',
      'Deployment Frequency',
      'Mean Time to Recovery (MTTR)',
      'Change Failure Rate',
    ],
  },

  tools: [
    {
      category: 'Containerization & Orchestration',
      items: [...DEVOPS_TOOLS.containers],
    },
    {
      category: 'CI/CD Tools',
      items: [...DEVOPS_TOOLS.ciCd, 'Travis CI', 'TeamCity'],
    },
    {
      category: 'Infrastructure as Code',
      items: [...DEVOPS_TOOLS.iac, 'Chef', 'SaltStack'],
    },
    {
      category: 'Cloud Platforms',
      items: [...CLOUD_PLATFORMS.providers],
    },
    {
      category: 'Monitoring & Logging',
      items: [...DEVOPS_TOOLS.monitoring, 'ELK Stack', 'Splunk'],
    },
    {
      category: 'Scripting',
      items: ['Bash', 'Python', 'PowerShell', 'Go'],
    },
  ],
};
