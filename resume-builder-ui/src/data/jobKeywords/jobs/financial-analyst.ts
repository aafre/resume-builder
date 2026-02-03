import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS } from '../common/skills';

export const financialAnalyst: JobKeywordsData = {
  slug: 'financial-analyst',
  title: 'Financial Analyst',
  metaTitle: 'Financial Analyst Resume Keywords - ATS-Optimized Skills List (2026)',
  metaDescription:
    'Complete list of financial analyst resume keywords including Excel, financial modeling, SQL, Bloomberg, forecasting, and valuation skills that pass ATS screening.',
  category: 'business',
  priority: 0.8,
  lastmod: '2026-02-02',

  roleIntro:
    'Financial analyst roles demand a specific mix of technical modeling skills and business acumen. Hiring managers look for proficiency in Excel (advanced functions, not just basic), financial modeling experience, and familiarity with industry tools like Bloomberg or Capital IQ. Quantify your impact in dollars, percentages, and accuracy rates.',

  keywords: {
    core: [
      'Financial Analysis',
      'Financial Modeling',
      'Forecasting',
      'Budgeting',
      'Variance Analysis',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      'Attention to Detail',
      'Analytical Thinking',
      'Presentation Skills',
      'Stakeholder Communication',
    ],
    technical: [
      'Excel (Advanced)',
      'VLOOKUP / XLOOKUP',
      'Pivot Tables',
      'VBA / Macros',
      'SQL',
      'Power BI',
      'Tableau',
      'Bloomberg Terminal',
      'Capital IQ',
      'SAP',
      'Oracle Financials',
      'Python (pandas)',
      'Financial Statements',
      'DCF Modeling',
      'Sensitivity Analysis',
    ],
    certifications: [
      'Chartered Financial Analyst (CFA)',
      'Certified Public Accountant (CPA)',
      'Financial Modeling & Valuation Analyst (FMVA)',
      'Certified Management Accountant (CMA)',
      'Chartered Alternative Investment Analyst (CAIA)',
    ],
    metrics: [
      'Revenue Forecasting Accuracy',
      'Budget Variance',
      'Cost Savings Identified',
      'ROI Analysis',
      'Profit Margin Improvement',
      'Working Capital Optimization',
    ],
    processes: [
      'FP&A (Financial Planning & Analysis)',
      'Due Diligence',
      'Valuation (DCF, Comparable, Precedent)',
      'Month-End Close',
      'Quarterly Reporting',
      'Board Presentation',
      'GAAP / IFRS Compliance',
    ],
  },

  tools: [
    {
      category: 'Spreadsheet & Modeling',
      items: ['Microsoft Excel (Advanced)', 'Google Sheets', 'VBA/Macros', 'Financial Modeling Templates'],
    },
    {
      category: 'Data & Visualization',
      items: ['Power BI', 'Tableau', 'SQL', 'Python (pandas, NumPy)', 'R'],
    },
    {
      category: 'Financial Data Platforms',
      items: ['Bloomberg Terminal', 'Capital IQ', 'FactSet', 'PitchBook', 'Reuters Eikon'],
    },
    {
      category: 'ERP & Accounting Systems',
      items: ['SAP', 'Oracle Financials', 'NetSuite', 'Workday', 'QuickBooks Enterprise'],
    },
  ],

  phrases: [
    'financial modeling',
    'discounted cash flow',
    'variance analysis',
    'budget forecasting',
    'revenue projection',
    'P&L analysis',
    'cost-benefit analysis',
    'financial reporting',
    'quarterly earnings',
    'capital allocation',
    'working capital management',
    'scenario analysis',
    'risk assessment',
    'mergers and acquisitions',
    'investor relations',
  ],

  example: {
    before: 'Created financial reports and helped with budgeting.',
    after: 'Built 3-statement financial models in Excel with DCF and sensitivity analysis, supporting $50M in M&A due diligence. Delivered monthly variance reports to C-suite, identifying $2.3M in cost savings through P&L trend analysis and improving forecast accuracy from 85% to 94%.',
  },

  exampleBullets: [
    'Developed annual operating budget ($120M) and monthly rolling forecasts, achieving 94% forecast accuracy vs. actuals',
    'Built automated financial dashboard in Power BI, reducing monthly reporting time from 5 days to 1 day for 8-person FP&A team',
    'Performed DCF and comparable company valuation for 3 acquisition targets ($15M-$80M), presented findings to CFO and board',
    'Analyzed P&L variances across 12 business units monthly, identifying $2.3M in cost optimization opportunities',
    'Created Excel-based scenario models (VBA) for capital expenditure planning, evaluating 15+ investment proposals annually',
    'Automated data extraction from SAP using SQL queries, reducing manual data entry by 20 hours per month',
    'Supported IPO readiness by preparing SEC-compliant financial statements and investor presentations under GAAP standards',
  ],

  commonMistakes: [
    {
      mistake: 'Listing "Excel" without specifying proficiency level',
      fix: 'Specify: "Advanced Excel (VLOOKUP, pivot tables, VBA macros, 3-statement models)"',
    },
    {
      mistake: 'Not mentioning the scale of budgets or portfolios managed',
      fix: 'Include dollar amounts: "$120M annual budget," "$50M portfolio," "$2.3M in savings identified"',
    },
    {
      mistake: 'Omitting relevant certifications or progress toward them',
      fix: 'List CFA, CPA, or FMVA — even "CFA Level II Candidate" signals commitment to the field',
    },
    {
      mistake: 'Generic "financial analysis" without specifying the type',
      fix: 'Be specific: "DCF valuation," "P&L variance analysis," "FP&A forecasting," "M&A due diligence"',
    },
  ],
};
