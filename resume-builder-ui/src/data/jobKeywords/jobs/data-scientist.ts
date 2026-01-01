import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  DATABASES,
  DATA_TOOLS,
  COLLABORATION_TOOLS,
} from '../common/skills';

export const dataScientist: JobKeywordsData = {
  slug: 'data-scientist',
  title: 'Data Scientist',
  metaTitle: 'Data Scientist Resume Keywords - Machine Learning & Analytics Skills',
  metaDescription:
    'Essential data scientist resume keywords: Python, R, TensorFlow, SQL, machine learning, statistical analysis, and data visualization tools for ATS optimization.',
  category: 'technology',
  priority: 0.9,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'Data Analysis',
      'Statistical Modeling',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      'Research',
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Business Acumen',
      'Data Storytelling',
    ],
    technical: [
      ...PROGRAMMING_LANGUAGES.data, // Python, R, SQL, Scala
      ...DATA_TOOLS.ml, // TensorFlow, PyTorch, Scikit-learn, Keras
      ...DATA_TOOLS.processing.slice(0, 2), // Pandas, NumPy
      ...DATA_TOOLS.visualization.slice(0, 3), // Tableau, Power BI, Looker
      ...DATABASES.relational.slice(0, 1), // PostgreSQL
      ...DATABASES.noSql.slice(0, 1), // MongoDB
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing (NLP)',
      'Computer Vision',
    ],
    processes: [
      'A/B Testing',
      'Hypothesis Testing',
      'Data Cleaning',
      'Feature Engineering',
      'Model Deployment',
      'Experimental Design',
      'ETL Pipelines',
    ],
    certifications: [
      'Google Data Analytics Certificate',
      'AWS Certified Machine Learning',
      'Microsoft Certified: Azure Data Scientist',
      'TensorFlow Developer Certificate',
    ],
  },

  tools: [
    {
      category: 'Programming Languages',
      items: ['Python', 'R', 'SQL', 'Scala', 'Julia'],
    },
    {
      category: 'Machine Learning Frameworks',
      items: [...DATA_TOOLS.ml, 'XGBoost', 'LightGBM', 'CatBoost'],
    },
    {
      category: 'Data Processing',
      items: [...DATA_TOOLS.processing, 'Dask', 'Ray'],
    },
    {
      category: 'Visualization Tools',
      items: [...DATA_TOOLS.visualization, 'Plotly', 'Seaborn'],
    },
    {
      category: 'Data Platforms',
      items: [...DATA_TOOLS.platforms, 'AWS SageMaker', 'Google AI Platform'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication.slice(0, 3), 'GitHub'],
    },
  ],

  example: {
    before: 'Analyzed data to help the business make better decisions.',
    after: 'Built predictive models using Python and TensorFlow to forecast customer churn, achieving 92% accuracy and enabling targeted retention campaigns that reduced churn by 18%.',
  },
};
