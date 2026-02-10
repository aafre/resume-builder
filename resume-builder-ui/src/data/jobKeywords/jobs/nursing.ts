import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS } from '../common/skills';

export const nursing: JobKeywordsData = {
  slug: 'nursing',
  title: 'Nursing',
  h1: 'Nursing Resume Keywords — Top ATS Keywords for Nurses',
  metaTitle: 'Nursing Resume Keywords (2026) — 60+ ATS-Optimized Skills for Nurses',
  metaDescription:
    'Complete list of nursing resume keywords for ATS systems. Clinical skills, certifications (BLS, ACLS, RN), EHR systems (Epic, Cerner), and specializations hiring managers scan for.',
  category: 'healthcare',
  priority: 0.85,
  lastmod: '2026-02-10',

  roleIntro:
    'Healthcare hiring is increasingly automated, and most hospital systems, staffing agencies, and clinics now use ATS platforms to screen nursing resumes before a recruiter ever sees them. Whether you are an RN, LPN/LVN, NP, or travel nurse, your resume must include the exact clinical competencies, certifications, and EHR proficiency terms that these systems filter for. Hospitals like HCA, Kaiser Permanente, and Mayo Clinic use ATS software that matches candidates against specific license types, unit experience (ICU, ER, OR, L&D), and mandatory certifications (BLS, ACLS, PALS). This guide covers the 60+ keywords that get your nursing resume past ATS screening and into the hands of nurse managers.',

  keywords: {
    core: [
      'Patient Care',
      'Patient Assessment',
      'Patient Education',
      'Patient Advocacy',
      'Clinical Nursing',
      'Nursing Care Plans',
      'Medication Administration',
      'IV Therapy',
      'Wound Care',
      'Vital Signs Monitoring',
      'Pain Management',
      'Infection Control',
      'Sterile Technique',
      'Triage',
      'Discharge Planning',
      'Care Coordination',
      'Health Promotion',
      'Evidence-Based Practice',
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      'Compassionate Care',
      'Cultural Competency',
      'Patient Safety',
      'HIPAA Compliance',
      'Multidisciplinary Collaboration',
      'Time Management',
      'Documentation',
      'Clinical Documentation Improvement (CDI)',
    ],
    technical: [
      'Epic (EHR)',
      'Cerner (Oracle Health)',
      'MEDITECH',
      'Allscripts',
      'Athenahealth',
      'PointClickCare',
      'McKesson',
      'Pyxis MedStation',
      'Omnicell',
      'Alaris IV Pumps',
      'Baxter Infusion Systems',
      'Telemetry Monitoring',
      'Cardiac Monitoring',
      'Ventilator Management',
      'Electronic Medication Administration Record (eMAR)',
      'Barcode Medication Administration (BCMA)',
      'Clinical Decision Support Systems',
      'Microsoft Office',
      'Smartsheet',
    ],
    certifications: [
      'Registered Nurse (RN)',
      'Licensed Practical Nurse (LPN)',
      'Licensed Vocational Nurse (LVN)',
      'Nurse Practitioner (NP)',
      'Basic Life Support (BLS)',
      'Advanced Cardiovascular Life Support (ACLS)',
      'Pediatric Advanced Life Support (PALS)',
      'Neonatal Resuscitation Program (NRP)',
      'Trauma Nursing Core Course (TNCC)',
      'Critical Care Registered Nurse (CCRN)',
      'Certified Emergency Nurse (CEN)',
      'Oncology Certified Nurse (OCN)',
      'Certified Pediatric Nurse (CPN)',
      'Certified Medical-Surgical Registered Nurse (CMSRN)',
      'Certified Perioperative Nurse (CNOR)',
      'Wound Care Certified (WCC)',
      'Certified Diabetes Educator (CDE)',
      'Bachelor of Science in Nursing (BSN)',
      'Master of Science in Nursing (MSN)',
      'Doctor of Nursing Practice (DNP)',
      'Compact/Multi-State License (eNLC)',
    ],
    metrics: [
      'Patient Satisfaction Scores (HCAHPS)',
      'Patient-to-Nurse Ratio',
      'Fall Rate Reduction',
      'Hospital-Acquired Infection Rate',
      'Medication Error Rate',
      'Readmission Rate',
      'Code Response Time',
      'Discharge Time Improvement',
      'Patient Throughput',
      'Hand Hygiene Compliance Rate',
      'Pressure Injury Prevention Rate',
      'CLABSI/CAUTI Rates',
    ],
    processes: [
      'Nursing Process (ADPIE)',
      'SBAR Communication',
      'Bedside Shift Report',
      'Hourly Rounding',
      'Fall Prevention Protocols',
      'Sepsis Screening',
      'Rapid Response',
      'Code Blue Response',
      'Restraint Management',
      'Blood Transfusion Protocols',
      'Chain of Custody',
      'Quality Improvement (QI)',
      'Root Cause Analysis (RCA)',
      'Plan-Do-Study-Act (PDSA)',
      'Joint Commission Standards',
      'Magnet Recognition Program',
    ],
  },

  tools: [
    {
      category: 'Electronic Health Records (EHR)',
      items: ['Epic', 'Cerner (Oracle Health)', 'MEDITECH', 'Allscripts', 'Athenahealth', 'PointClickCare'],
    },
    {
      category: 'Medication Management Systems',
      items: ['Pyxis MedStation', 'Omnicell', 'Baxter', 'eMAR', 'BCMA (Barcode Scanning)'],
    },
    {
      category: 'Monitoring Equipment',
      items: ['Telemetry Systems', 'Cardiac Monitors', 'Ventilators', 'Pulse Oximetry', 'Alaris IV Pumps', 'Sequential Compression Devices'],
    },
    {
      category: 'Nursing Specialization Units',
      items: ['ICU/CCU', 'Emergency Department (ED)', 'Operating Room (OR)', 'Labor & Delivery (L&D)', 'Medical-Surgical (Med-Surg)', 'Oncology', 'Pediatrics (PICU/NICU)', 'Telemetry/Step-Down', 'Post-Anesthesia Care Unit (PACU)'],
    },
    {
      category: 'Communication & Coordination',
      items: ['SBAR', 'Vocera', 'Nurse Call Systems', 'Secure Messaging (TigerConnect)', 'Care Coordination Platforms'],
    },
  ],

  phrases: [
    'patient assessment and care planning',
    'medication administration and reconciliation',
    'evidence-based nursing practice',
    'infection prevention and control',
    'patient and family education',
    'interdisciplinary team collaboration',
    'electronic health record documentation',
    'acute care nursing',
    'critical care nursing',
    'wound care management',
    'pain assessment and management',
    'discharge planning and coordination',
    'quality improvement initiatives',
    'clinical preceptor and mentoring',
    'charge nurse responsibilities',
    'patient safety protocols',
    'fall prevention program',
    'code response and resuscitation',
    'HIPAA-compliant documentation',
    'nurse residency program',
  ],

  example: {
    before: 'Took care of patients and gave medications in the hospital.',
    after:
      'Provided comprehensive nursing care for 5-6 acute medical-surgical patients per shift, performing patient assessments, administering medications via Pyxis/BCMA, documenting in Epic EHR, and coordinating care with interdisciplinary teams. Maintained 98% medication administration accuracy and achieved unit-best HCAHPS patient satisfaction score of 92%.',
  },

  exampleBullets: [
    'Managed care for 4-5 critically ill ICU patients per shift, including ventilator management, continuous drip titration, and hemodynamic monitoring using telemetry and arterial lines',
    'Reduced unit fall rate by 40% over 6 months by implementing hourly rounding protocol and leading staff education on fall prevention best practices',
    'Maintained 99.5% medication administration accuracy across 12,000+ annual medication passes using Pyxis MedStation and BCMA barcode scanning',
    'Precepted 12 new graduate nurses through 12-week orientation program, achieving 100% retention rate and accelerating competency milestones by 2 weeks on average',
    'Led unit-based Quality Improvement project reducing CLABSI rate from 1.8 to 0.3 per 1,000 line-days through evidence-based bundle compliance auditing',
    'Served as charge nurse for 32-bed medical-surgical unit, managing patient flow, staffing assignments, and rapid response activations for 15+ shifts/month',
    'Achieved 95th percentile HCAHPS patient satisfaction scores through consistent bedside shift reporting, purposeful rounding, and patient education initiatives',
    'Trained 25+ staff members on Epic EHR upgrade and new clinical documentation workflows, reducing documentation errors by 30% during transition period',
  ],

  commonMistakes: [
    {
      mistake: 'Not including specific certifications and license details',
      fix: 'List every relevant certification: RN, BSN, BLS, ACLS, PALS, TNCC, CCRN, etc. Include license numbers and state(s) of licensure. ATS systems filter on these exact acronyms — missing one could mean automatic rejection.',
    },
    {
      mistake: 'Using vague descriptions like "provided patient care"',
      fix: 'Be specific: "Managed care for 5-6 acute med-surg patients per shift, administering medications via Pyxis/BCMA, documenting in Epic, and coordinating with interdisciplinary teams." Specificity demonstrates clinical competency.',
    },
    {
      mistake: 'Not mentioning EHR system experience',
      fix: 'Name the exact EHR: Epic, Cerner, MEDITECH, or Allscripts. Over 70% of hospital job postings filter on EHR proficiency. "EMR experience" alone will not pass — use the specific platform name.',
    },
    {
      mistake: 'Omitting unit type and patient acuity level',
      fix: 'Specify your unit: ICU, ED, OR, L&D, Med-Surg, Oncology, NICU. Include patient-to-nurse ratios and acuity levels. Nurse managers filter by specialty experience before reading further.',
    },
    {
      mistake: 'Not including quality metrics or patient outcomes',
      fix: 'Include measurable outcomes: "Reduced fall rate by 40%," "99.5% medication accuracy," "92% HCAHPS score." Quality metrics differentiate experienced nurses from new graduates in ATS ranking.',
    },
    {
      mistake: 'Listing clinical skills but ignoring leadership indicators',
      fix: 'Include charge nurse experience, precepting, committee membership, quality improvement projects, and education initiatives. These keywords signal readiness for advancement and are filtered by many ATS systems.',
    },
  ],

  customFaqs: [
    {
      question: 'What are the most important keywords for a nursing resume?',
      answer:
        'The most critical nursing resume keywords are your license type (RN, LPN, NP), certifications (BLS, ACLS, PALS), unit specialization (ICU, ED, Med-Surg), EHR system (Epic, Cerner), and clinical skills (patient assessment, medication administration, care coordination). Always match keywords to the specific job posting — an ICU position and a clinic position have very different keyword priorities.',
    },
    {
      question: 'Should I include BLS and ACLS on my nursing resume?',
      answer:
        'Yes, always. BLS (Basic Life Support) is required for virtually every nursing position and ACLS (Advanced Cardiovascular Life Support) is required for most acute care roles. Include them even if they seem obvious — ATS systems filter on these exact certifications and will reject resumes that do not include them.',
    },
    {
      question: 'How do I list nursing certifications on a resume?',
      answer:
        'Create a dedicated "Licenses & Certifications" section near the top of your resume. List each certification with its full name and acronym: "Basic Life Support (BLS) — American Heart Association — Exp. 2027." Group by type: licenses first, then mandatory certifications, then specialty certifications.',
    },
    {
      question: 'What EHR skills should nurses include on their resume?',
      answer:
        'Name the specific EHR system(s) you have used: Epic, Cerner (Oracle Health), MEDITECH, Allscripts, or PointClickCare. Go beyond just naming the system — mention specific modules like medication administration (eMAR/BCMA), care planning, clinical documentation, and order entry. Epic proficiency appears in over 40% of hospital job postings.',
    },
    {
      question: 'How do I show nursing experience without years of experience?',
      answer:
        'Focus on clinical rotations, preceptorship details, certifications, and measurable outcomes from clinical placements. Include patient population, acuity levels, procedures performed, and specific unit types. New graduate programs and nurse residency programs value BLS/ACLS certification, EHR training, and clinical simulation hours.',
    },
    {
      question: 'What is the difference between nursing resume keywords for hospitals vs clinics?',
      answer:
        'Hospital resumes should emphasize acute care, code response, telemetry monitoring, IV therapy, and shift-based patient ratios. Clinic resumes should focus on outpatient care, patient education, chronic disease management, scheduling systems, and preventive care. Both should include EHR proficiency and relevant certifications.',
    },
  ],
};
