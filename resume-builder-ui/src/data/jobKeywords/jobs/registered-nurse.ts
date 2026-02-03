import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS } from '../common/skills';

export const registeredNurse: JobKeywordsData = {
  slug: 'registered-nurse',
  title: 'Registered Nurse',
  metaTitle: 'Registered Nurse Resume Keywords - ATS-Optimized Skills List (2026)',
  metaDescription:
    'Complete list of registered nurse resume keywords including clinical skills, EMR systems, certifications (BLS, ACLS), patient care, and nursing specialties that pass ATS.',
  category: 'healthcare',
  priority: 0.8,
  lastmod: '2026-02-02',

  roleIntro:
    'Healthcare recruiters and ATS systems scan for specific clinical competencies, certifications, and EMR experience. Generic terms like "patient care" aren\'t enough — you need to list the exact systems, procedures, and specializations you\'ve worked with. Quantify outcomes (patient loads, satisfaction scores, error reduction) to stand out.',

  keywords: {
    core: [
      'Patient Care',
      'Patient Assessment',
      'Clinical Documentation',
      'Care Planning',
      'Patient Advocacy',
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      'Empathy',
      'Time Management',
      'Team Collaboration',
    ],
    technical: [
      'Electronic Medical Records (EMR)',
      'Epic Systems',
      'Cerner',
      'Meditech',
      'IV Therapy',
      'Wound Care',
      'Medication Administration',
      'Vital Signs Monitoring',
      'Phlebotomy',
      'EKG/ECG Interpretation',
      'Catheterization',
      'Infection Control',
      'Ventilator Management',
      'Triage',
      'HIPAA Compliance',
    ],
    certifications: [
      'Registered Nurse (RN)',
      'Basic Life Support (BLS)',
      'Advanced Cardiovascular Life Support (ACLS)',
      'Pediatric Advanced Life Support (PALS)',
      'Certified Emergency Nurse (CEN)',
      'Critical Care Registered Nurse (CCRN)',
      'Oncology Certified Nurse (OCN)',
      'Certified Medical-Surgical Registered Nurse (CMSRN)',
    ],
    metrics: [
      'Patient Satisfaction Scores',
      'Patient-to-Nurse Ratio',
      'Readmission Rates',
      'Fall Prevention',
      'Medication Error Rate',
      'Hand Hygiene Compliance',
      'HCAHPS Scores',
    ],
    processes: [
      'Evidence-Based Practice',
      'Care Coordination',
      'Discharge Planning',
      'Patient Education',
      'Interdisciplinary Rounds',
      'Quality Improvement (QI)',
      'Nursing Process (ADPIE)',
    ],
  },

  tools: [
    {
      category: 'EMR/EHR Systems',
      items: ['Epic', 'Cerner', 'Meditech', 'Allscripts', 'athenahealth', 'NextGen'],
    },
    {
      category: 'Clinical Equipment',
      items: ['IV Pumps', 'Cardiac Monitors', 'Ventilators', 'Pulse Oximeters', 'Glucometers', 'Defibrillators'],
    },
    {
      category: 'Documentation & Communication',
      items: ['SBAR Communication', 'Nursing Care Plans', 'MAR (Medication Administration Record)', 'Shift Reports'],
    },
  ],

  phrases: [
    'patient-centered care',
    'evidence-based nursing',
    'clinical assessment',
    'medication management',
    'interdisciplinary team',
    'care coordination',
    'patient education',
    'infection prevention',
    'quality improvement',
    'discharge planning',
    'acute care nursing',
    'critical care',
    'chronic disease management',
    'pain management',
    'wound assessment',
  ],

  example: {
    before: 'Took care of patients and gave medications on the floor.',
    after: 'Managed care for 6-8 patients per shift on a 36-bed medical-surgical unit, administering IV medications via Epic MAR, monitoring vital signs, and maintaining 98% medication accuracy. Achieved unit-highest HCAHPS patient satisfaction scores (92nd percentile) through patient education and care coordination.',
  },

  exampleBullets: [
    'Provided direct patient care to 5-7 ICU patients, managing ventilators, IV drips, and continuous cardiac monitoring with zero sentinel events',
    'Reduced unit fall rate by 35% through implementation of evidence-based fall prevention protocols and hourly rounding',
    'Trained and mentored 8 new graduate nurses during 12-week orientation program, achieving 100% retention rate',
    'Coordinated discharge planning for 200+ patients monthly, collaborating with case managers, social workers, and home health agencies',
    'Maintained 100% compliance with hand hygiene and infection control protocols during 2-year tenure',
    'Documented patient assessments and care plans in Epic EMR, consistently meeting documentation deadlines with 99.5% accuracy',
  ],

  commonMistakes: [
    {
      mistake: 'Listing only generic terms like "patient care"',
      fix: 'Specify the type of care: "post-operative wound care," "pediatric IV therapy," "cardiac telemetry monitoring"',
    },
    {
      mistake: 'Not mentioning EMR systems by name',
      fix: 'Always list the specific EMR (Epic, Cerner, Meditech) — recruiters filter on these',
    },
    {
      mistake: 'Omitting certifications from the resume body',
      fix: 'List BLS, ACLS, PALS prominently — many ATS systems filter on these mandatory certifications',
    },
    {
      mistake: 'No patient load or outcome metrics',
      fix: 'Include patient-to-nurse ratios, satisfaction scores, and error rates to show capacity and quality',
    },
  ],
};
