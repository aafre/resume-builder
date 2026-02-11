import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS, COLLABORATION_TOOLS, DATA_TOOLS } from '../common/skills';

export const businessAnalyst: JobKeywordsData = {
  slug: 'business-analyst',
  title: 'Business Analyst',
  h1: 'Business Analyst Resume Keywords — Top ATS Keywords for BA Professionals',
  metaTitle: 'Business Analyst Resume Keywords (2026) — 60+ ATS-Optimized Skills',
  metaDescription:
    'Complete list of business analyst resume keywords. Requirements gathering, data analysis, SQL, Jira, Agile/Scrum, and stakeholder management skills ATS systems scan for.',
  category: 'business',
  priority: 0.85,
  lastmod: '2026-02-10',

  roleIntro:
    'Business analysts sit at the intersection of business strategy and technology execution, and hiring managers expect resumes that demonstrate both sides. Your resume must prove you can gather and document requirements, model processes, analyze data, and translate between technical teams and business stakeholders. ATS systems at consulting firms, banks, tech companies, and enterprises filter heavily on methodology keywords (Agile, Waterfall, SAFe), tool proficiency (Jira, Confluence, SQL, Tableau), and deliverable types (BRD, user stories, process maps). This guide covers the 60+ keywords that pass those filters and get your resume in front of hiring managers.',

  keywords: {
    core: [
      'Business Analysis',
      'Requirements Gathering',
      'Requirements Elicitation',
      'Stakeholder Management',
      'Process Improvement',
      'Process Mapping',
      'Gap Analysis',
      'Root Cause Analysis',
      'Business Process Reengineering',
      'Change Management',
      'User Acceptance Testing (UAT)',
      ...COMMON_SOFT_SKILLS.communication,
      ...COMMON_SOFT_SKILLS.problemSolving,
      ...COMMON_SOFT_SKILLS.leadership.slice(0, 2),
      'Facilitation',
      'Workshops',
      'Cross-Functional Collaboration',
      'Vendor Evaluation',
      'Cost-Benefit Analysis',
    ],
    technical: [
      'SQL',
      'Python',
      'R',
      'Excel (Advanced)',
      'Power BI',
      'Tableau',
      'Looker',
      'Jira',
      'Confluence',
      'Azure DevOps',
      'Microsoft Visio',
      'Lucidchart',
      'Miro',
      'SAP',
      'Salesforce',
      'ServiceNow',
      'SharePoint',
      'Microsoft Project',
      'Balsamiq',
      'Figma',
      'Postman (API Testing)',
      'BPMN 2.0',
      'UML',
    ],
    certifications: [
      'CBAP (Certified Business Analysis Professional)',
      'CCBA (Certification of Capability in Business Analysis)',
      'PMI-PBA (Professional in Business Analysis)',
      'ECBA (Entry Certificate in Business Analysis)',
      'Certified Scrum Product Owner (CSPO)',
      'Certified ScrumMaster (CSM)',
      'Six Sigma Green Belt',
      'Six Sigma Black Belt',
      'ITIL Foundation',
      'Lean Certification',
    ],
    metrics: [
      'Process Efficiency Improvement',
      'Cost Reduction',
      'Time-to-Market Reduction',
      'Requirements Defect Rate',
      'Stakeholder Satisfaction Score',
      'Project Delivery Rate',
      'System Adoption Rate',
      'ROI (Return on Investment)',
      'Error Rate Reduction',
      'Cycle Time Improvement',
    ],
    processes: [
      'Agile / Scrum',
      'Waterfall',
      'SAFe (Scaled Agile Framework)',
      'Kanban',
      'Lean',
      'Six Sigma',
      'BABOK (Business Analysis Body of Knowledge)',
      'Design Thinking',
      'User Story Mapping',
      'Use Case Modeling',
      'Data Flow Diagrams (DFD)',
      'Entity Relationship Diagrams (ERD)',
      'SWOT Analysis',
      'MoSCoW Prioritization',
      'Kano Model',
      'Business Process Model and Notation (BPMN)',
    ],
  },

  tools: [
    {
      category: 'Requirements & Documentation',
      items: ['Jira', 'Confluence', 'Azure DevOps', 'IBM DOORS', 'Helix RM', 'Microsoft Word/SharePoint'],
    },
    {
      category: 'Process Modeling & Diagramming',
      items: ['Microsoft Visio', 'Lucidchart', 'Miro', 'Draw.io', 'Bizagi Modeler', 'ARIS'],
    },
    {
      category: 'Data Analysis & Visualization',
      items: ['SQL', 'Excel (Power Query/Pivot Tables)', ...DATA_TOOLS.visualization.slice(0, 3), 'Python (Pandas)'],
    },
    {
      category: 'Prototyping & Wireframing',
      items: ['Balsamiq', 'Figma', 'Axure RP', 'Moqups', 'Sketch'],
    },
    {
      category: 'Project Management',
      items: [...COLLABORATION_TOOLS.projectManagement.slice(0, 4), 'Microsoft Project', 'Smartsheet'],
    },
    {
      category: 'Enterprise Systems',
      items: ['SAP', 'Salesforce', 'ServiceNow', 'Oracle EBS', 'Microsoft Dynamics'],
    },
  ],

  phrases: [
    'requirements gathering and elicitation',
    'business requirements document (BRD)',
    'functional requirements specification',
    'user stories and acceptance criteria',
    'stakeholder interviews',
    'process mapping and optimization',
    'gap analysis and remediation',
    'user acceptance testing',
    'data-driven decision making',
    'cross-functional collaboration',
    'as-is and to-be analysis',
    'business case development',
    'impact analysis',
    'traceability matrix',
    'sprint planning and backlog grooming',
    'system integration testing',
    'vendor selection and evaluation',
    'change request management',
    'KPI definition and tracking',
    'workflow automation',
  ],

  example: {
    before: 'Gathered requirements and created documentation for software projects.',
    after:
      'Elicited and documented business requirements for a $3.2M ERP migration by conducting 40+ stakeholder interviews, producing a 200-page BRD with traceability matrix. Facilitated Agile ceremonies for 3 cross-functional teams in Jira, reducing requirements defect rate by 35% and accelerating delivery by 4 weeks.',
  },

  exampleBullets: [
    'Led requirements gathering for $5M digital transformation initiative, conducting 60+ stakeholder interviews and producing comprehensive BRD with 350+ user stories in Jira',
    'Mapped 25 end-to-end business processes in Visio/BPMN, identifying 12 automation opportunities that reduced manual effort by 40% ($800K annual savings)',
    'Facilitated bi-weekly sprint planning, backlog grooming, and retrospectives for 4 Agile teams (32 developers) using Jira and Confluence',
    'Designed Power BI dashboards consolidating data from SAP, Salesforce, and 3 legacy systems, giving leadership real-time visibility into $50M revenue pipeline',
    'Defined UAT strategy and test cases for CRM migration (12,000 users), achieving 98% test pass rate and on-time go-live',
    'Conducted cost-benefit analysis for vendor selection ($2M contract), evaluating 8 solutions against 45 weighted criteria — recommendation adopted by steering committee',
    'Reduced project change request volume by 60% through improved upfront requirements workshops and MoSCoW prioritization framework',
    'Bridged communication between technical and business teams across 5 time zones, maintaining a 4.8/5.0 stakeholder satisfaction score',
  ],

  commonMistakes: [
    {
      mistake: 'Listing only "requirements gathering" without specifics',
      fix: 'Be precise: "Conducted 40+ stakeholder interviews," "Produced 200-page BRD," "Defined 350+ user stories with acceptance criteria in Jira." ATS and hiring managers want evidence of methodology, scale, and deliverables.',
    },
    {
      mistake: 'Not specifying BA methodology or framework',
      fix: 'State your working methodology: "Agile/Scrum environment," "SAFe PI Planning participant," "BABOK-aligned elicitation techniques." Enterprise BA roles heavily filter on methodology keywords.',
    },
    {
      mistake: 'Omitting data and technical skills',
      fix: 'Modern BA roles require SQL, Excel (advanced), and visualization tools (Power BI/Tableau). Include them even if they were secondary — many ATS systems require at least one data skill.',
    },
    {
      mistake: 'Focusing only on documentation, not business outcomes',
      fix: 'Connect your work to results: "Mapped processes → identified 12 automation opportunities → $800K annual savings." BRDs are the deliverable, but cost savings and efficiency gains are the value.',
    },
    {
      mistake: 'Not mentioning specific deliverable types',
      fix: 'Include deliverable keywords: BRD, FRD, user stories, use cases, process maps, wireframes, traceability matrix, test plans, gap analysis reports. These are high-frequency ATS filter terms.',
    },
    {
      mistake: 'Using generic project descriptions without scale indicators',
      fix: 'Quantify project scope: "$5M initiative," "12,000-user migration," "4 Agile teams," "25 business processes." Scale demonstrates seniority and capability.',
    },
  ],

  customFaqs: [
    {
      question: 'What are the most important keywords for a business analyst resume?',
      answer:
        'The most critical BA resume keywords are requirements gathering, stakeholder management, Agile/Scrum, user stories, process mapping, SQL, Jira, Confluence, BRD, UAT, and data analysis tools like Power BI or Tableau. CBAP and PMI-PBA certifications are also high-frequency ATS filter terms.',
    },
    {
      question: 'Do business analysts need SQL on their resume?',
      answer:
        'Yes. SQL appears in over 65% of business analyst job postings. Even if SQL is not your primary skill, demonstrating basic-to-intermediate proficiency (queries, joins, data validation) signals you can work independently with data rather than relying entirely on technical teams.',
    },
    {
      question: 'What is the difference between a BA and a product manager on a resume?',
      answer:
        'BAs focus on requirements elicitation, documentation, process analysis, and bridging business-IT communication. Product managers emphasize product vision, roadmap ownership, market research, and P&L accountability. If transitioning between roles, emphasize overlapping skills: stakeholder management, user stories, prioritization, and data-driven decisions.',
    },
    {
      question: 'Should I include CBAP or PMI-PBA certification on my resume?',
      answer:
        'Absolutely. CBAP (Certified Business Analysis Professional) and PMI-PBA are the two most recognized BA certifications and appear as ATS filter criteria at consulting firms and enterprises. Even ECBA (entry level) differentiates candidates. Place certifications in a dedicated section near the top of your resume.',
    },
    {
      question: 'How do I show business impact as a business analyst?',
      answer:
        'Connect every deliverable to a measurable outcome: "Mapped 25 processes → identified 12 automation opportunities → $800K annual savings" or "Reduced requirements defects by 35% → 4-week faster delivery." Use cost savings, time reduction, efficiency improvement, and adoption rate as your primary impact metrics.',
    },
    {
      question: 'What Agile-specific keywords should a BA include?',
      answer:
        'Include: Agile/Scrum, sprint planning, backlog grooming/refinement, user stories with acceptance criteria, story points, velocity, definition of done, retrospectives, PI planning (for SAFe), and Kanban. Also mention tools: Jira, Confluence, Azure DevOps, or Rally.',
    },
  ],
};
