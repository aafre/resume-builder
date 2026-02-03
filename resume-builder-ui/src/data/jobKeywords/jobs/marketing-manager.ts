import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS } from '../common/skills';

export const marketingManager: JobKeywordsData = {
  slug: 'marketing-manager',
  title: 'Marketing Manager',
  metaTitle: 'Marketing Manager Resume Keywords - ATS-Optimized Skills List (2026)',
  metaDescription:
    'Complete list of marketing manager resume keywords including SEO, Google Analytics, HubSpot, campaign management, and digital marketing skills that pass ATS systems.',
  category: 'business',
  priority: 0.8,
  lastmod: '2026-02-02',

  roleIntro:
    'Marketing manager roles span digital, content, brand, and product marketing. Hiring teams want to see specific channels you\'ve managed (paid search, email, social), tools you\'ve used (HubSpot, Google Analytics), and business outcomes you\'ve driven (pipeline, revenue, CAC reduction). Quantify everything — impressions, CTR, conversion rates, and ROI.',

  keywords: {
    core: [
      'Marketing Strategy',
      'Campaign Management',
      'Brand Management',
      'Content Strategy',
      'Market Research',
      ...COMMON_SOFT_SKILLS.leadership.slice(0, 3),
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Cross-Functional Collaboration',
      'Budget Management',
    ],
    technical: [
      'Google Analytics',
      'Google Ads',
      'Meta Ads Manager',
      'HubSpot',
      'Salesforce Marketing Cloud',
      'Mailchimp',
      'SEO',
      'SEM',
      'Content Marketing',
      'Email Marketing',
      'Social Media Marketing',
      'Marketing Automation',
      'CRM',
      'A/B Testing',
      'Conversion Rate Optimization (CRO)',
    ],
    certifications: [
      'Google Analytics Certified',
      'Google Ads Certified',
      'HubSpot Inbound Marketing',
      'Meta Blueprint Certified',
      'Hootsuite Social Marketing',
    ],
    metrics: [
      'Return on Ad Spend (ROAS)',
      'Customer Acquisition Cost (CAC)',
      'Conversion Rate',
      'Click-Through Rate (CTR)',
      'Cost Per Lead (CPL)',
      'Marketing Qualified Leads (MQLs)',
      'Customer Lifetime Value (LTV)',
      'Brand Awareness',
    ],
    processes: [
      'Go-to-Market Strategy',
      'Marketing Funnel Optimization',
      'Competitive Analysis',
      'Buyer Persona Development',
      'Content Calendar Management',
      'Brand Guidelines',
      'Marketing Attribution',
    ],
  },

  tools: [
    {
      category: 'Analytics & Data',
      items: ['Google Analytics 4', 'Google Tag Manager', 'Mixpanel', 'Hotjar', 'Tableau', 'Looker'],
    },
    {
      category: 'Marketing Platforms',
      items: ['HubSpot', 'Marketo', 'Salesforce Marketing Cloud', 'Mailchimp', 'ActiveCampaign', 'Klaviyo'],
    },
    {
      category: 'Advertising',
      items: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'Programmatic (DV360)'],
    },
    {
      category: 'SEO & Content',
      items: ['Ahrefs', 'SEMrush', 'Moz', 'WordPress', 'Canva', 'Adobe Creative Suite'],
    },
    {
      category: 'Social Media',
      items: ['Hootsuite', 'Sprout Social', 'Buffer', 'Later', 'Brandwatch'],
    },
  ],

  phrases: [
    'digital marketing strategy',
    'lead generation',
    'demand generation',
    'content marketing',
    'paid media campaigns',
    'organic growth',
    'brand positioning',
    'email nurture campaigns',
    'marketing analytics',
    'multi-channel campaigns',
    'influencer marketing',
    'product launch',
    'go-to-market execution',
    'performance marketing',
    'inbound marketing',
  ],

  example: {
    before: 'Managed marketing campaigns and increased website traffic.',
    after: 'Led multi-channel marketing campaigns across Google Ads, Meta, and LinkedIn, driving a 45% increase in MQLs and reducing CAC by 22%. Managed $500K annual budget, achieving 4.2x ROAS through A/B testing and conversion rate optimization in HubSpot.',
  },

  exampleBullets: [
    'Developed and executed go-to-market strategy for product launch, generating 2,500 MQLs in first quarter through integrated paid, organic, and email campaigns',
    'Grew organic search traffic 180% YoY through SEO content strategy, keyword research (Ahrefs), and technical SEO improvements',
    'Managed $1.2M annual paid media budget across Google Ads, Meta, and LinkedIn, maintaining 3.8x blended ROAS',
    'Built marketing automation workflows in HubSpot, nurturing 15K leads monthly with 32% email open rate and 4.8% CTR',
    'Led rebranding initiative including brand guidelines, messaging framework, and creative assets for 12-person marketing team',
    'Reduced customer acquisition cost from $180 to $125 through funnel optimization and retargeting campaign improvements',
    'Analyzed campaign performance in Google Analytics 4 and Looker, delivering weekly executive reports on pipeline contribution and ROI',
  ],

  commonMistakes: [
    {
      mistake: 'Using vague terms like "increased engagement"',
      fix: 'Quantify: "Increased Instagram engagement rate from 2.1% to 4.8% (+128%)"',
    },
    {
      mistake: 'Not specifying which marketing channels you managed',
      fix: 'Name the channels: paid search, paid social, email, SEO, content. Recruiters filter on channel expertise.',
    },
    {
      mistake: 'Listing tools without showing impact',
      fix: 'Pair tools with outcomes: "Used HubSpot to build 15 automated workflows, nurturing 3K leads monthly"',
    },
    {
      mistake: 'Omitting budget responsibility',
      fix: 'Always mention budget size — it signals seniority level: "Managed $500K annual paid media budget"',
    },
  ],
};
