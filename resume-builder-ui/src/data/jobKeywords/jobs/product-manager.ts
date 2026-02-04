import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  AGILE_METHODOLOGIES,
  COLLABORATION_TOOLS,
  DATA_TOOLS,
} from '../common/skills';

export const productManager: JobKeywordsData = {
  slug: 'product-manager',
  title: 'Product Manager',
  metaTitle: 'Product Manager Resume Keywords (2026) — 120+ PM Skills & Tools',
  metaDescription:
    'Complete PM resume keywords: Agile, roadmapping, A/B testing, OKRs, stakeholder management. Organized by PM type — Technical, Growth, Platform. Copy-paste ready.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-02-04',

  roleIntro:
    'Hiring teams look for product managers who can demonstrate business impact through data-informed decisions. They want to see you\'ve owned product outcomes (not just features), collaborated across engineering/design/marketing, and made difficult prioritization calls. Your resume should show both strategic thinking and execution ability—backed by metrics that prove your products moved the needle.',

  keywords: {
    core: [
      'Product Strategy',
      'Product Vision',
      ...COMMON_SOFT_SKILLS.leadership,
      ...COMMON_SOFT_SKILLS.communication,
      'Customer Empathy',
      'Data-Driven Decision Making',
    ],
    technical: [
      'Product Roadmap',
      'User Stories',
      'Wireframing',
      ...COLLABORATION_TOOLS.projectManagement,
      ...DATA_TOOLS.visualization.slice(0, 2), // Tableau, Power BI
      'SQL',
      'Analytics',
      'A/B Testing',
      'Feature Prioritization',
    ],
    processes: [
      ...AGILE_METHODOLOGIES.frameworks, // Agile/Scrum, Kanban, Lean, SAFe
      'Product Discovery',
      'User Research',
      'Market Analysis',
      'OKRs (Objectives and Key Results)',
      'Go-to-Market Strategy',
      'Backlog Management',
    ],
    certifications: [
      'Certified Scrum Product Owner (CSPO)',
      'Pragmatic Marketing Certified (PMC)',
      'Product Management Certificate',
      'Google Analytics Certification',
    ],
    metrics: [
      'User Engagement',
      'Retention Rate',
      'Churn Rate',
      'Customer Lifetime Value (LTV)',
      'Monthly Active Users (MAU)',
    ],
  },

  tools: [
    {
      category: 'Product Management',
      items: ['Jira', 'Asana', 'Productboard', 'Aha!', 'Linear'],
    },
    {
      category: 'Design & Prototyping',
      items: ['Figma', 'Sketch', 'Miro', 'Balsamiq', 'Adobe XD'],
    },
    {
      category: 'Analytics',
      items: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Heap', 'Looker'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication, 'Notion', 'Confluence'],
    },
  ],

  phrases: [
    'product roadmap development',
    'cross-functional leadership',
    'user research insights',
    'feature prioritization framework',
    'stakeholder alignment',
    'go-to-market strategy',
    'data-driven product decisions',
    'customer feedback analysis',
    'sprint planning',
    'product-market fit',
    'competitive analysis',
    'OKR setting',
    'backlog prioritization',
    'product discovery',
    'hypothesis-driven development',
  ],

  example: {
    before: 'Managed product features and worked with engineering teams.',
    after: 'Led cross-functional teams using Agile/Scrum to launch 3 major features, conducting A/B tests and user research to increase Monthly Active Users by 35% and improve retention rate from 68% to 82%.',
  },

  exampleBullets: [
    'Owned product roadmap for B2B SaaS platform serving 500+ enterprise clients, prioritizing features that drove 40% increase in contract renewals',
    'Led cross-functional team of 8 engineers, 2 designers, and 1 QA to ship mobile app redesign in 3 months, achieving 4.6 App Store rating (up from 3.2)',
    'Conducted 50+ user interviews and synthesized insights into personas that informed feature prioritization, resulting in 28% improvement in user activation',
    'Defined and tracked OKRs for subscription product, achieving 120% of target MRR growth ($2M to $4.4M in 12 months)',
    'Implemented RICE prioritization framework, reducing stakeholder conflicts and accelerating feature delivery by 25%',
    'Partnered with engineering to reduce technical debt sprint allocation from 40% to 20% while maintaining feature velocity',
    'Designed and executed A/B tests on pricing page, increasing conversion rate by 18% and annual revenue by $800K',
    'Created product requirements documents (PRDs) and user stories for 15+ features, ensuring clear acceptance criteria and reducing development rework by 30%',
    'Led product discovery process for new market segment, validating demand through MVP that secured $500K pilot contract',
    'Collaborated with marketing on go-to-market strategy for major feature launch, achieving 5,000 signups in first week',
    'Spearheaded product launch for enterprise analytics module, driving $3.2M ARR within 6 months through targeted beta program and phased rollout',
    'Led 12-person cross-functional team across engineering, design, and data science to deliver recommendation engine, increasing average order value by 22%',
    'Synthesized findings from 30+ usability studies and 2,000 NPS surveys to redesign onboarding flow, improving Day-7 retention by 40%',
    'Drove freemium-to-paid conversion strategy leveraging in-app triggers and personalized upgrade prompts, growing paid user base by 65% quarter-over-quarter',
    'Managed public API product serving 1,200+ developer integrations, increasing API adoption 3x through improved documentation and developer portal redesign',
    'Led platform migration from on-premise to cloud-native architecture, coordinating with 4 engineering squads to deliver on time with zero customer downtime',
    'Launched self-serve analytics feature reducing customer support tickets by 35% and enabling $1.5M in upsell opportunities',
  ],

  commonMistakes: [
    {
      mistake: 'Focusing on features shipped, not outcomes achieved',
      fix: 'Lead with metrics: retention, engagement, revenue, NPS—not just "shipped X feature"',
    },
    {
      mistake: 'No evidence of cross-functional collaboration',
      fix: 'Show how you worked with engineering, design, marketing, sales, and executives',
    },
    {
      mistake: 'Vague "product strategy" claims without proof',
      fix: 'Describe specific frameworks used: RICE, OKRs, Jobs-to-be-Done, North Star metric',
    },
    {
      mistake: 'Not showing user research skills',
      fix: 'Highlight: "Conducted X user interviews," "Synthesized customer feedback," "Built personas"',
    },
    {
      mistake: 'Missing data/analytics skills',
      fix: 'Mention tools and methods: "Analyzed user behavior in Mixpanel," "Ran SQL queries to identify churn patterns"',
    },
    {
      mistake: 'Only listing B2C or B2B experience',
      fix: 'Highlight transferable skills: stakeholder management, prioritization, and user empathy apply to both',
    },
  ],

  customFaqs: [
    {
      question: 'What product management skills should I put on my resume?',
      answer:
        'Focus on a mix of strategic and execution skills. Include product strategy, roadmapping, stakeholder management, user research, data analysis (SQL, Mixpanel, Amplitude), A/B testing, OKR setting, and Agile/Scrum. Tailor the balance based on the job description—some roles emphasize analytics and experimentation while others prioritize stakeholder alignment and go-to-market strategy.',
    },
    {
      question: 'How to get past ATS as a product manager?',
      answer:
        'Use exact keyword matches from the job description in your resume. ATS systems scan for terms like "product roadmap," "cross-functional leadership," "user stories," and specific tools (Jira, Confluence, Figma). Avoid abbreviations the ATS might not recognize—write out "Objectives and Key Results (OKRs)" at least once. Place your most important keywords in your summary, skills section, and the first bullet of each role.',
    },
    {
      question: 'What are the resume differences between a Technical PM and a non-technical PM?',
      answer:
        'Technical PM resumes should emphasize API design, system architecture decisions, developer experience, platform scalability, and partnerships with engineering. Non-technical PM resumes lean into user research, go-to-market execution, stakeholder communication, and business metrics like revenue and retention. Both should show data-driven decision making, but technical PMs should demonstrate comfort with engineering trade-offs and technical specifications.',
    },
    {
      question: 'How do I show product management experience without a PM title?',
      answer:
        'Highlight transferable PM activities from any role: defining requirements, prioritizing features, coordinating across teams, analyzing user data, or leading a product launch. Use PM-specific language—say "owned the product roadmap for X" instead of "managed the project." If you led cross-functional initiatives, ran experiments, or made prioritization decisions backed by data, frame those as product management accomplishments with measurable outcomes.',
    },
  ],
};
