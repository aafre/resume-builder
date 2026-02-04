import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  DATABASES,
  DATA_TOOLS,
  COLLABORATION_TOOLS,
} from '../common/skills';

export const dataAnalyst: JobKeywordsData = {
  slug: 'data-analyst',
  title: 'Data Analyst',
  metaTitle: 'Data Analyst Resume Keywords (2026) — SQL, Python, Tableau & More',
  metaDescription:
    'Data analyst resume keywords: SQL, Python, Tableau, Power BI, ETL, statistical analysis. Before/after bullet examples. Copy-paste into your resume.',
  category: 'technology',
  priority: 0.85,
  lastmod: '2026-02-04',

  roleIntro:
    'Hiring teams want to see that you can translate raw data into actionable business insights. They\'re looking for hands-on SQL skills, experience with visualization tools, and evidence that your analysis drove real business decisions. Show concrete examples where your insights led to measurable outcomes—revenue increases, cost savings, or process improvements.',

  keywords: {
    core: [
      'Data Analysis',
      ...COMMON_SOFT_SKILLS.problemSolving,
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Business Intelligence',
      'Reporting',
      ...COMMON_SOFT_SKILLS.organization.slice(0, 2),
    ],
    technical: [
      'SQL',
      'Excel',
      ...DATA_TOOLS.visualization, // Tableau, Power BI, Looker, Matplotlib, D3.js
      ...PROGRAMMING_LANGUAGES.data.slice(0, 2), // Python, R
      ...DATA_TOOLS.processing.slice(0, 2), // Pandas, NumPy
      ...DATABASES.relational.slice(0, 2), // PostgreSQL, MySQL
      'Statistical Analysis',
      'Data Modeling',
      'ETL',
    ],
    processes: [
      'Data Cleaning',
      'Data Validation',
      'Exploratory Data Analysis (EDA)',
      'Dashboard Development',
      'KPI Tracking',
      'A/B Testing',
      'Root Cause Analysis',
    ],
    certifications: [
      'Google Data Analytics Certificate',
      'Microsoft Certified: Data Analyst Associate',
      'Tableau Desktop Specialist',
      'IBM Data Analyst Professional Certificate',
    ],
    metrics: [
      'Revenue Analysis',
      'Customer Metrics',
      'Conversion Rate',
      'ROI Analysis',
    ],
  },

  tools: [
    {
      category: 'Data Visualization',
      items: [...DATA_TOOLS.visualization, 'Google Data Studio'],
    },
    {
      category: 'Databases & SQL',
      items: [...DATABASES.relational, ...DATABASES.noSql.slice(0, 1)],
    },
    {
      category: 'Programming & Analysis',
      items: ['Python', 'R', 'Pandas', 'NumPy', 'Excel', 'VBA'],
    },
    {
      category: 'BI Platforms',
      items: ['Tableau', 'Power BI', 'Looker', 'Qlik', 'Sisense'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication.slice(0, 3), 'Google Sheets'],
    },
  ],

  phrases: [
    'data-driven decision making',
    'business intelligence reporting',
    'SQL query optimization',
    'dashboard development',
    'stakeholder presentations',
    'exploratory data analysis',
    'statistical significance',
    'data visualization best practices',
    'ETL pipeline',
    'ad-hoc analysis',
    'executive reporting',
    'KPI monitoring',
    'trend analysis',
    'customer segmentation',
    'predictive modeling',
  ],

  example: {
    before: 'Analyzed business data and created reports for stakeholders.',
    after: 'Analyzed customer behavior data using SQL and Python (Pandas), building interactive Tableau dashboards to track KPIs and identify revenue opportunities, leading to a 22% increase in conversion rate and $1.2M in additional annual revenue.',
  },

  exampleBullets: [
    'Built 15+ interactive Tableau dashboards tracking sales KPIs, reducing executive reporting time by 8 hours weekly',
    'Wrote complex SQL queries to analyze 5M+ row datasets, identifying pricing anomalies that recovered $200K in lost revenue',
    'Developed automated ETL pipelines using Python and Airflow, reducing manual data processing from 4 hours to 15 minutes daily',
    'Conducted A/B test analysis for marketing campaigns, achieving statistical significance and improving click-through rates by 34%',
    'Created customer segmentation model using SQL and R, enabling targeted campaigns that increased retention by 18%',
    'Collaborated with product team to define and track user engagement metrics, informing roadmap decisions for 3 feature releases',
    'Automated weekly executive reports using Python and Excel VBA, eliminating 6 hours of manual work per week',
    'Performed root cause analysis on declining conversion rates, identifying checkout friction points that led to 15% improvement after fix',
    'Built self-service Power BI reports enabling sales team to access real-time pipeline data, reducing ad-hoc requests by 60%',
    'Analyzed customer churn patterns using SQL and Tableau, presenting findings that drove retention strategy changes',
    'Designed and launched real-time logistics dashboard in Power BI, enabling operations team to reduce delivery delays by 20% through proactive routing adjustments',
    'Built automated data pipeline using Python and Apache Airflow to ingest data from 5 source systems, reducing ETL errors by 90% and saving 12 hours of manual reconciliation weekly',
    'Partnered with marketing, finance, and product teams to standardize KPI definitions across departments, creating a single source of truth that improved cross-team alignment',
    'Developed demand forecasting model using Python (scikit-learn) and historical sales data, improving quarterly forecast accuracy from 72% to 91%',
    'Implemented data quality monitoring framework with automated anomaly detection, catching 15+ data integrity issues per month before they reached downstream reports',
  ],

  commonMistakes: [
    {
      mistake: 'Saying "proficient in Excel" without specifics',
      fix: 'Specify: "Excel (VLOOKUP, PivotTables, Power Query, VBA macros)"',
    },
    {
      mistake: 'Listing SQL but no evidence of complexity',
      fix: 'Show query types: "Complex joins, window functions, CTEs, query optimization"',
    },
    {
      mistake: 'Only showing technical skills, not business impact',
      fix: 'Connect analysis to outcomes: revenue, cost savings, efficiency gains, decisions influenced',
    },
    {
      mistake: 'Generic "data analysis" without domain context',
      fix: 'Specify the type: "customer behavior analysis," "financial forecasting," "marketing attribution"',
    },
    {
      mistake: 'No mention of stakeholder communication',
      fix: 'Show you presented findings: "Delivered insights to C-suite," "Led data review meetings"',
    },
    {
      mistake: 'Ignoring data quality and cleaning work',
      fix: 'Highlight: "Cleaned and validated datasets," "Ensured data integrity across sources"',
    },
  ],

  customFaqs: [
    {
      question: 'Data Analyst vs Data Scientist keywords — what is the difference?',
      answer:
        'Data Analyst resumes emphasize SQL, Excel, Tableau/Power BI, reporting, dashboards, KPI tracking, and business intelligence. Data Scientist resumes lean into machine learning, deep learning, NLP, Python (scikit-learn, TensorFlow), statistical modeling, and experimentation design. There is overlap in SQL, Python, and A/B testing, but analysts focus on descriptive and diagnostic analytics while scientists focus on predictive and prescriptive work. Tailor your keywords based on which title the job posting uses.',
    },
    {
      question: 'Do I need Python for a data analyst resume?',
      answer:
        'Python is increasingly expected but not always required. Many data analyst roles still accept SQL + Excel + a visualization tool (Tableau or Power BI) as the core stack. However, listing Python with libraries like Pandas, NumPy, or Matplotlib gives you a competitive advantage and opens doors to roles at tech companies. If you know Python, include it prominently. If not, prioritize SQL proficiency and visualization tools first, and note Python as a skill you are developing.',
    },
    {
      question: 'How do I show business impact on a data analyst resume?',
      answer:
        'Connect every analysis to a business outcome. Instead of "Built dashboard in Tableau," write "Built Tableau dashboard tracking daily revenue KPIs, enabling sales leadership to identify underperforming regions and recover $150K in quarterly revenue." Use metrics like revenue influenced, cost savings, time saved, decisions supported, and efficiency gains. If you do not have exact numbers, use reasonable estimates: "Reduced reporting time by approximately 60%."',
    },
  ],
};
