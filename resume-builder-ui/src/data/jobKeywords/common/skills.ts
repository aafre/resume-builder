/**
 * Common Skills and Tools (DRY)
 * Shared keyword constants to maintain consistency across job roles
 * and make bulk updates easier
 */

// ===== CORE SOFT SKILLS =====
export const COMMON_SOFT_SKILLS = {
  communication: [
    'Communication Skills',
    'Team Collaboration',
    'Interpersonal Skills',
    'Presentation Skills',
  ],
  problemSolving: [
    'Problem Solving',
    'Critical Thinking',
    'Analytical Skills',
    'Decision Making',
  ],
  leadership: [
    'Leadership',
    'Team Management',
    'Mentoring',
    'Stakeholder Management',
  ],
  organization: [
    'Time Management',
    'Organizational Skills',
    'Attention to Detail',
    'Multi-tasking',
  ],
} as const;

// ===== PROGRAMMING LANGUAGES =====
export const PROGRAMMING_LANGUAGES = {
  web: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  backend: ['Python', 'Java', 'Go', 'Ruby', 'C#', 'PHP'],
  systems: ['C++', 'Rust', 'C'],
  data: ['Python', 'R', 'SQL', 'Scala'],
  mobile: ['Swift', 'Kotlin', 'Dart'],
} as const;

// ===== FRONTEND TECHNOLOGIES =====
export const FRONTEND_TECH = {
  frameworks: ['React', 'Angular', 'Vue.js', 'Svelte', 'Next.js'],
  tools: ['Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier'],
  css: ['Tailwind CSS', 'Sass', 'CSS-in-JS', 'Bootstrap'],
  testing: ['Jest', 'Cypress', 'React Testing Library', 'Playwright'],
} as const;

// ===== BACKEND TECHNOLOGIES =====
export const BACKEND_TECH = {
  frameworks: ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', '.NET', 'FastAPI'],
  api: ['REST APIs', 'GraphQL', 'gRPC', 'WebSockets'],
} as const;

// ===== DATABASES =====
export const DATABASES = {
  relational: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server'],
  noSql: ['MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'Elasticsearch'],
  tools: ['SQL', 'NoSQL', 'Database Design', 'Query Optimization'],
} as const;

// ===== CLOUD & INFRASTRUCTURE =====
export const CLOUD_PLATFORMS = {
  providers: ['AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean'],
  services: ['EC2', 'S3', 'Lambda', 'CloudFormation', 'RDS'],
} as const;

// ===== DEVOPS & TOOLS =====
export const DEVOPS_TOOLS = {
  versionControl: ['Git', 'GitHub', 'GitLab', 'Bitbucket'],
  ciCd: ['CI/CD', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI'],
  containers: ['Docker', 'Kubernetes', 'Docker Compose', 'Helm'],
  monitoring: ['Prometheus', 'Grafana', 'Datadog', 'New Relic'],
  iac: ['Terraform', 'Ansible', 'CloudFormation', 'Puppet'],
} as const;

// ===== AGILE & PROCESSES =====
export const AGILE_METHODOLOGIES = {
  frameworks: ['Agile/Scrum', 'Kanban', 'Lean', 'SAFe'],
  practices: ['Sprint Planning', 'Daily Standups', 'Retrospectives', 'Backlog Grooming'],
  roles: ['Scrum Master', 'Product Owner', 'Agile Coach'],
} as const;

// ===== COLLABORATION TOOLS =====
export const COLLABORATION_TOOLS = {
  communication: ['Slack', 'Microsoft Teams', 'Zoom', 'Google Workspace', 'Discord'],
  projectManagement: ['Jira', 'Confluence', 'Trello', 'Asana', 'Monday.com'],
  documentation: ['Confluence', 'Notion', 'Google Docs', 'SharePoint'],
} as const;

// ===== DATA & ANALYTICS =====
export const DATA_TOOLS = {
  visualization: ['Tableau', 'Power BI', 'Looker', 'Matplotlib', 'D3.js'],
  processing: ['Pandas', 'NumPy', 'Apache Spark', 'Airflow'],
  ml: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras'],
  platforms: ['Jupyter', 'Databricks', 'Snowflake', 'BigQuery'],
} as const;

// ===== DESIGN TOOLS =====
export const DESIGN_TOOLS = {
  ui: ['Figma', 'Sketch', 'Adobe XD', 'InVision'],
  prototyping: ['Figma', 'Axure', 'Balsamiq', 'Proto.io'],
  graphics: ['Adobe Creative Suite', 'Photoshop', 'Illustrator'],
} as const;

// ===== CERTIFICATIONS =====
export const COMMON_CERTIFICATIONS = {
  aws: ['AWS Certified Developer', 'AWS Solutions Architect', 'AWS SysOps Administrator'],
  azure: ['Azure Administrator', 'Azure Developer', 'Azure Solutions Architect'],
  google: ['Google Cloud Professional', 'Google Cloud Associate'],
  agile: ['Certified Scrum Master (CSM)', 'PMI-ACP', 'SAFe Agilist'],
  security: ['CompTIA Security+', 'CISSP', 'CEH'],
  pmp: ['PMP (Project Management Professional)', 'PRINCE2', 'CAPM'],
} as const;

// ===== TESTING =====
export const TESTING_PRACTICES = {
  types: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'Performance Testing'],
  methodologies: ['Test-Driven Development (TDD)', 'Behavior-Driven Development (BDD)'],
  tools: ['Jest', 'Mocha', 'Selenium', 'Postman', 'JUnit'],
} as const;

// ===== SECURITY =====
export const SECURITY_PRACTICES = [
  'Security Best Practices',
  'OWASP Top 10',
  'Authentication & Authorization',
  'Encryption',
  'Security Audits',
] as const;

// ===== SOFTWARE ENGINEERING PRACTICES =====
export const SE_PRACTICES = [
  'Code Reviews',
  'Version Control',
  'Pair Programming',
  'Technical Documentation',
  'Design Patterns',
  'SOLID Principles',
  'Clean Code',
] as const;
