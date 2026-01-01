/**
 * Job Keywords Database
 * Initial set: 10 high-volume technology jobs
 *
 * Each job includes:
 * - Core skills (soft skills, competencies)
 * - Technical skills (hard skills, tools, software)
 * - Processes/methodologies
 * - Certifications
 * - Detailed tool breakdown by category
 */

import type { JobKeywordsData } from './types';

export const JOBS_DATABASE: JobKeywordsData[] = [
  {
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
        'Problem Solving',
        'Code Review',
        'Debugging',
        'Team Collaboration',
        'Agile Methodology',
        'Technical Documentation',
        'System Design',
        'Algorithm Design',
        'Data Structures',
      ],
      technical: [
        'Python',
        'JavaScript',
        'Java',
        'TypeScript',
        'React',
        'Node.js',
        'Git',
        'Docker',
        'Kubernetes',
        'AWS',
        'REST APIs',
        'GraphQL',
        'SQL',
        'NoSQL',
        'Microservices',
      ],
      processes: [
        'Agile/Scrum',
        'CI/CD',
        'Test-Driven Development (TDD)',
        'Code Reviews',
        'Version Control',
        'DevOps Practices',
        'Pair Programming',
      ],
      certifications: [
        'AWS Certified Developer',
        'Certified Scrum Master (CSM)',
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
        items: ['React', 'Angular', 'Vue.js', 'Svelte', 'Next.js'],
      },
      {
        category: 'Backend Frameworks',
        items: ['Node.js', 'Express', 'Django', 'Spring Boot', 'Flask', '.NET'],
      },
      {
        category: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra'],
      },
      {
        category: 'DevOps & Cloud',
        items: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'GitLab CI'],
      },
      {
        category: 'Tools & Platforms',
        items: ['Git', 'GitHub', 'Jira', 'Confluence', 'VS Code', 'IntelliJ'],
      },
    ],
  },

  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    metaTitle: 'Data Scientist Resume Keywords - Machine Learning & Analytics Skills',
    metaDescription:
      'Essential data scientist resume keywords: Python, R, TensorFlow, PyTorch, SQL, machine learning, statistical analysis, and data visualization tools.',
    category: 'technology',
    priority: 0.9,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Data Analysis',
        'Statistical Modeling',
        'Machine Learning',
        'Problem Solving',
        'Communication',
        'Business Intelligence',
        'Critical Thinking',
        'Data Storytelling',
      ],
      technical: [
        'Python',
        'R',
        'SQL',
        'TensorFlow',
        'PyTorch',
        'Scikit-learn',
        'Pandas',
        'NumPy',
        'Tableau',
        'Power BI',
        'Apache Spark',
        'Jupyter',
      ],
      processes: [
        'A/B Testing',
        'Hypothesis Testing',
        'Data Mining',
        'Predictive Modeling',
        'Feature Engineering',
        'Model Evaluation',
        'Cross-Validation',
      ],
      metrics: [
        'Model Accuracy',
        'Precision/Recall',
        'F1 Score',
        'ROC-AUC',
        'RMSE',
        'R-squared',
      ],
      certifications: [
        'Google Data Analytics Professional',
        'AWS Certified Machine Learning',
        'Microsoft Certified: Azure Data Scientist',
      ],
    },
    tools: [
      {
        category: 'Programming Languages',
        items: ['Python', 'R', 'SQL', 'Scala', 'Julia'],
      },
      {
        category: 'ML Frameworks',
        items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost', 'LightGBM'],
      },
      {
        category: 'Data Manipulation',
        items: ['Pandas', 'NumPy', 'Dask', 'PySpark'],
      },
      {
        category: 'Visualization',
        items: ['Tableau', 'Power BI', 'Matplotlib', 'Seaborn', 'Plotly', 'D3.js'],
      },
      {
        category: 'Big Data Tools',
        items: ['Apache Spark', 'Hadoop', 'Hive', 'Kafka'],
      },
    ],
  },

  {
    slug: 'product-manager',
    title: 'Product Manager',
    metaTitle: 'Product Manager Resume Keywords - Product Development & Strategy',
    metaDescription:
      'Product manager resume keywords: product roadmap, user stories, Agile, stakeholder management, data-driven decision making, and product lifecycle.',
    category: 'technology',
    priority: 0.9,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Product Strategy',
        'Stakeholder Management',
        'User-Centric Design',
        'Communication',
        'Leadership',
        'Problem Solving',
        'Decision Making',
        'Cross-Functional Collaboration',
      ],
      technical: [
        'Product Roadmap',
        'User Stories',
        'Wireframing',
        'A/B Testing',
        'Product Analytics',
        'SQL',
        'Jira',
        'Confluence',
        'Figma',
        'Google Analytics',
      ],
      processes: [
        'Agile/Scrum',
        'Product Discovery',
        'User Research',
        'Competitive Analysis',
        'Go-to-Market Strategy',
        'Sprint Planning',
        'Backlog Management',
      ],
      metrics: [
        'Monthly Active Users (MAU)',
        'Customer Satisfaction (CSAT)',
        'Net Promoter Score (NPS)',
        'Conversion Rate',
        'Churn Rate',
        'Revenue Growth',
      ],
      certifications: [
        'Certified Scrum Product Owner (CSPO)',
        'Pragmatic Marketing Certified (PMC)',
        'Product Management Certificate (PMC)',
      ],
    },
    tools: [
      {
        category: 'Product Management',
        items: ['Jira', 'Asana', 'ProductBoard', 'Aha!', 'Monday.com'],
      },
      {
        category: 'Design & Prototyping',
        items: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Miro'],
      },
      {
        category: 'Analytics',
        items: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Heap', 'Looker'],
      },
      {
        category: 'Communication',
        items: ['Slack', 'Confluence', 'Notion', 'Microsoft Teams'],
      },
    ],
  },

  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    metaTitle: 'Frontend Developer Resume Keywords - React, JavaScript, UI/UX Skills',
    metaDescription:
      'Frontend developer resume keywords: React, JavaScript, TypeScript, HTML, CSS, responsive design, accessibility, and modern frontend frameworks.',
    category: 'technology',
    priority: 0.85,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'UI Development',
        'Responsive Design',
        'Cross-Browser Compatibility',
        'Performance Optimization',
        'Accessibility (a11y)',
        'User Experience (UX)',
        'Problem Solving',
      ],
      technical: [
        'JavaScript',
        'TypeScript',
        'React',
        'HTML5',
        'CSS3',
        'Tailwind CSS',
        'Redux',
        'Webpack',
        'Vite',
        'REST APIs',
        'GraphQL',
        'Git',
      ],
      processes: [
        'Agile/Scrum',
        'Code Review',
        'Version Control',
        'Testing (Jest, React Testing Library)',
        'CI/CD',
        'Component-Driven Development',
      ],
      certifications: [
        'AWS Certified Developer',
        'Meta Frontend Developer Professional',
        'Google UX Design Certificate',
      ],
    },
    tools: [
      {
        category: 'Frontend Frameworks',
        items: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'],
      },
      {
        category: 'CSS Frameworks',
        items: ['Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design', 'Chakra UI'],
      },
      {
        category: 'Build Tools',
        items: ['Webpack', 'Vite', 'Parcel', 'Rollup', 'esbuild'],
      },
      {
        category: 'Testing',
        items: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Vitest'],
      },
    ],
  },

  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    metaTitle: 'Backend Developer Resume Keywords - APIs, Databases, Server-Side',
    metaDescription:
      'Backend developer resume keywords: Node.js, Python, Java, REST APIs, databases, microservices, cloud platforms, and server-side programming.',
    category: 'technology',
    priority: 0.85,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Server-Side Development',
        'API Design',
        'Database Management',
        'System Architecture',
        'Problem Solving',
        'Performance Optimization',
        'Security Best Practices',
      ],
      technical: [
        'Node.js',
        'Python',
        'Java',
        'REST APIs',
        'GraphQL',
        'SQL',
        'PostgreSQL',
        'MongoDB',
        'Redis',
        'Docker',
        'Kubernetes',
        'AWS',
      ],
      processes: [
        'Agile/Scrum',
        'Microservices Architecture',
        'CI/CD',
        'Test-Driven Development',
        'Code Review',
        'DevOps Practices',
      ],
      certifications: [
        'AWS Certified Developer',
        'Oracle Certified Java Programmer',
        'MongoDB Certified Developer',
      ],
    },
    tools: [
      {
        category: 'Backend Frameworks',
        items: ['Express.js', 'Django', 'Flask', 'Spring Boot', 'NestJS', 'FastAPI'],
      },
      {
        category: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB'],
      },
      {
        category: 'Cloud Platforms',
        items: ['AWS', 'Google Cloud', 'Azure', 'Heroku', 'DigitalOcean'],
      },
      {
        category: 'DevOps',
        items: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
      },
    ],
  },

  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    metaTitle: 'Full Stack Developer Resume Keywords - Frontend & Backend Skills',
    metaDescription:
      'Full stack developer resume keywords: React, Node.js, databases, REST APIs, DevOps, frontend and backend technologies for complete web development.',
    category: 'technology',
    priority: 0.9,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Full Stack Development',
        'Frontend Development',
        'Backend Development',
        'Database Design',
        'System Architecture',
        'Problem Solving',
        'Team Collaboration',
      ],
      technical: [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Express',
        'SQL',
        'MongoDB',
        'REST APIs',
        'GraphQL',
        'Docker',
        'AWS',
        'Git',
      ],
      processes: [
        'Agile/Scrum',
        'Full Stack Architecture',
        'CI/CD',
        'Test-Driven Development',
        'Code Review',
        'DevOps',
      ],
      certifications: [
        'AWS Certified Developer',
        'Meta Full Stack Developer',
        'Microsoft Certified: Azure Developer',
      ],
    },
    tools: [
      {
        category: 'Frontend',
        items: ['React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS'],
      },
      {
        category: 'Backend',
        items: ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot'],
      },
      {
        category: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
      },
      {
        category: 'Cloud & DevOps',
        items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel'],
      },
    ],
  },

  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    metaTitle: 'DevOps Engineer Resume Keywords - CI/CD, Cloud, Automation',
    metaDescription:
      'DevOps engineer resume keywords: Docker, Kubernetes, AWS, CI/CD, automation, infrastructure as code, monitoring, and cloud platform management.',
    category: 'technology',
    priority: 0.85,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Infrastructure Management',
        'Automation',
        'System Administration',
        'Problem Solving',
        'Collaboration',
        'Performance Optimization',
        'Security',
      ],
      technical: [
        'Docker',
        'Kubernetes',
        'AWS',
        'Azure',
        'Terraform',
        'Ansible',
        'Jenkins',
        'GitLab CI',
        'Prometheus',
        'Grafana',
        'Python',
        'Bash',
      ],
      processes: [
        'CI/CD Pipelines',
        'Infrastructure as Code (IaC)',
        'Continuous Monitoring',
        'Incident Management',
        'Agile/Scrum',
        'Configuration Management',
      ],
      metrics: [
        'Deployment Frequency',
        'Lead Time for Changes',
        'Mean Time to Recovery (MTTR)',
        'Change Failure Rate',
        'System Uptime',
      ],
      certifications: [
        'AWS Certified DevOps Engineer',
        'Certified Kubernetes Administrator (CKA)',
        'HashiCorp Certified: Terraform Associate',
        'Docker Certified Associate',
      ],
    },
    tools: [
      {
        category: 'Containerization & Orchestration',
        items: ['Docker', 'Kubernetes', 'Docker Compose', 'Helm'],
      },
      {
        category: 'Cloud Platforms',
        items: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean'],
      },
      {
        category: 'CI/CD Tools',
        items: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI'],
      },
      {
        category: 'Infrastructure as Code',
        items: ['Terraform', 'Ansible', 'CloudFormation', 'Pulumi'],
      },
      {
        category: 'Monitoring',
        items: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'New Relic'],
      },
    ],
  },

  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    metaTitle: 'Data Analyst Resume Keywords - SQL, Excel, Tableau, Analytics',
    metaDescription:
      'Data analyst resume keywords: SQL, Excel, Tableau, Power BI, data visualization, statistical analysis, and business intelligence tools.',
    category: 'technology',
    priority: 0.85,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Data Analysis',
        'Business Intelligence',
        'Problem Solving',
        'Communication',
        'Critical Thinking',
        'Attention to Detail',
        'Reporting',
      ],
      technical: [
        'SQL',
        'Excel',
        'Tableau',
        'Power BI',
        'Python',
        'R',
        'Google Analytics',
        'Data Visualization',
        'Statistical Analysis',
      ],
      processes: [
        'Data Mining',
        'Trend Analysis',
        'KPI Reporting',
        'Dashboard Creation',
        'A/B Testing',
        'Forecasting',
      ],
      metrics: [
        'Data Accuracy',
        'Report Completion Time',
        'Stakeholder Satisfaction',
        'Dashboard Adoption Rate',
      ],
      certifications: [
        'Google Data Analytics Professional',
        'Microsoft Certified: Power BI Data Analyst',
        'Tableau Desktop Specialist',
      ],
    },
    tools: [
      {
        category: 'Data Visualization',
        items: ['Tableau', 'Power BI', 'Looker', 'Google Data Studio', 'Qlik'],
      },
      {
        category: 'Analysis Tools',
        items: ['Excel', 'SQL', 'Python', 'R', 'SPSS'],
      },
      {
        category: 'Databases',
        items: ['SQL Server', 'MySQL', 'PostgreSQL', 'BigQuery'],
      },
    ],
  },

  {
    slug: 'ux-designer',
    title: 'UX Designer',
    metaTitle: 'UX Designer Resume Keywords - User Experience, Prototyping, Research',
    metaDescription:
      'UX designer resume keywords: user research, wireframing, prototyping, Figma, usability testing, information architecture, and user-centered design.',
    category: 'technology',
    priority: 0.8,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'User Research',
        'User-Centered Design',
        'Empathy',
        'Problem Solving',
        'Communication',
        'Collaboration',
        'Creative Thinking',
      ],
      technical: [
        'Figma',
        'Sketch',
        'Adobe XD',
        'InVision',
        'Wireframing',
        'Prototyping',
        'Usability Testing',
        'User Flows',
        'Information Architecture',
      ],
      processes: [
        'Design Thinking',
        'User Research',
        'Usability Testing',
        'A/B Testing',
        'Iterative Design',
        'Agile/Scrum',
      ],
      metrics: [
        'User Satisfaction (CSAT)',
        'Task Success Rate',
        'Time on Task',
        'Error Rate',
        'Net Promoter Score (NPS)',
      ],
      certifications: [
        'Google UX Design Professional',
        'Nielsen Norman Group UX Certification',
        'Interaction Design Foundation',
      ],
    },
    tools: [
      {
        category: 'Design Tools',
        items: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer'],
      },
      {
        category: 'Prototyping',
        items: ['Figma', 'Axure', 'Principle', 'ProtoPie'],
      },
      {
        category: 'Research',
        items: ['UserTesting', 'Hotjar', 'Optimal Workshop', 'Maze'],
      },
      {
        category: 'Collaboration',
        items: ['Miro', 'FigJam', 'Notion', 'Confluence'],
      },
    ],
  },

  {
    slug: 'project-manager',
    title: 'Project Manager',
    metaTitle: 'Project Manager Resume Keywords - Agile, Scrum, Leadership, Planning',
    metaDescription:
      'Project manager resume keywords: project planning, Agile, Scrum, stakeholder management, risk management, budget management, and team leadership.',
    category: 'technology',
    priority: 0.85,
    lastmod: '2026-01-01',
    keywords: {
      core: [
        'Project Planning',
        'Leadership',
        'Stakeholder Management',
        'Communication',
        'Risk Management',
        'Budget Management',
        'Team Coordination',
        'Problem Solving',
      ],
      technical: [
        'Jira',
        'Asana',
        'Microsoft Project',
        'Confluence',
        'Monday.com',
        'Gantt Charts',
        'Project Roadmaps',
        'Resource Planning',
      ],
      processes: [
        'Agile/Scrum',
        'Waterfall',
        'Kanban',
        'Sprint Planning',
        'Risk Assessment',
        'Change Management',
        'Quality Assurance',
      ],
      metrics: [
        'On-Time Delivery Rate',
        'Budget Variance',
        'Resource Utilization',
        'Stakeholder Satisfaction',
        'Team Velocity',
      ],
      certifications: [
        'PMP (Project Management Professional)',
        'Certified Scrum Master (CSM)',
        'PRINCE2 Certified',
        'Agile Certified Practitioner (PMI-ACP)',
      ],
    },
    tools: [
      {
        category: 'Project Management',
        items: ['Jira', 'Asana', 'Monday.com', 'Microsoft Project', 'Trello'],
      },
      {
        category: 'Communication',
        items: ['Slack', 'Microsoft Teams', 'Zoom', 'Confluence'],
      },
      {
        category: 'Documentation',
        items: ['Notion', 'Confluence', 'Google Workspace', 'SharePoint'],
      },
    ],
  },
];
