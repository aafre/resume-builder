import type { JobKeywordsData } from '../types';
import { COMMON_SOFT_SKILLS } from '../common/skills';

export const teacher: JobKeywordsData = {
  slug: 'teacher',
  title: 'Teacher',
  metaTitle: 'Teacher Resume Keywords - ATS-Optimized Skills List (2026)',
  metaDescription:
    'Complete list of teacher resume keywords including curriculum design, classroom management, differentiated instruction, IEP, and education technology skills for ATS.',
  category: 'education',
  priority: 0.8,
  lastmod: '2026-02-02',

  h1: 'Teacher Resume Keywords',

  roleIntro:
    'School districts increasingly use ATS systems to filter teacher applications. Beyond standard teaching skills, hiring committees look for evidence of student outcomes, familiarity with educational technology, and experience with diverse learners. Quantify your impact with test score improvements, class sizes, and student achievement data.',

  keywords: {
    core: [
      'Classroom Management',
      'Lesson Planning',
      'Curriculum Development',
      'Differentiated Instruction',
      'Student Assessment',
      ...COMMON_SOFT_SKILLS.communication.slice(0, 2),
      'Mentoring',
      'Parent Communication',
      'Collaboration',
      'Adaptability',
    ],
    technical: [
      'Google Classroom',
      'Canvas LMS',
      'Blackboard',
      'Schoology',
      'PowerSchool',
      'Smartboard / Interactive Whiteboard',
      'Microsoft Office Suite',
      'Google Workspace for Education',
      'Zoom / Virtual Instruction',
      'EdTech Tools',
      'Student Information Systems (SIS)',
      'Grading Software',
    ],
    certifications: [
      'State Teaching License/Certification',
      'National Board Certification (NBCT)',
      'ESL/TESOL Certification',
      'Special Education Certification',
      'Google Certified Educator',
      'First Aid / CPR Certified',
    ],
    metrics: [
      'Student Achievement Growth',
      'Standardized Test Scores',
      'Graduation Rates',
      'Student Retention',
      'Parent Satisfaction',
      'Attendance Improvement',
    ],
    processes: [
      'Individualized Education Program (IEP)',
      'Response to Intervention (RTI)',
      'Data-Driven Instruction',
      'Formative Assessment',
      'Summative Assessment',
      'Backward Design (UbD)',
      'Project-Based Learning (PBL)',
      'Social-Emotional Learning (SEL)',
    ],
  },

  tools: [
    {
      category: 'Learning Management Systems',
      items: ['Google Classroom', 'Canvas', 'Schoology', 'Blackboard', 'Moodle', 'Seesaw'],
    },
    {
      category: 'Assessment & Grading',
      items: ['PowerSchool', 'Infinite Campus', 'Kahoot', 'Quizlet', 'Formative', 'Edulastic'],
    },
    {
      category: 'EdTech & Engagement',
      items: ['Nearpod', 'Pear Deck', 'Padlet', 'Flipgrid', 'Book Creator', 'Canva for Education'],
    },
    {
      category: 'Communication',
      items: ['ClassDojo', 'Remind', 'ParentSquare', 'Google Meet', 'Zoom'],
    },
  ],

  phrases: [
    'curriculum development',
    'differentiated instruction',
    'classroom management',
    'student engagement',
    'data-driven instruction',
    'standards-based grading',
    'blended learning',
    'culturally responsive teaching',
    'special education inclusion',
    'formative assessment',
    'project-based learning',
    'social-emotional learning',
    'professional development',
    'parent-teacher conferences',
    'cross-curricular integration',
  ],

  example: {
    before: 'Taught classes and helped students learn the material.',
    after: 'Designed and delivered differentiated instruction for 28 students across 3 reading levels, using data-driven formative assessments in Google Classroom. Improved standardized test pass rates from 72% to 89% through targeted RTI interventions and project-based learning.',
  },

  exampleBullets: [
    'Developed standards-aligned curriculum for 5 sections of 8th-grade English (140 students), integrating project-based learning and achieving 15% growth in state assessment scores',
    'Implemented differentiated instruction strategies for 6 IEP students, collaborating with special education team to meet all accommodation requirements',
    'Created blended learning environment using Google Classroom and Nearpod, increasing student engagement scores from 3.2 to 4.5 (on 5-point scale)',
    'Led professional development workshops on data-driven instruction for 25-person department, adopted district-wide',
    'Maintained 95% parent communication response rate through ClassDojo and quarterly parent-teacher conferences',
    'Mentored 3 student teachers through full practicum experience, all receiving district employment offers',
    'Integrated social-emotional learning (SEL) curriculum, reducing classroom behavioral incidents by 40% over academic year',
  ],

  commonMistakes: [
    {
      mistake: 'Using only generic terms like "taught" or "instructed"',
      fix: 'Use education-specific language: "Designed differentiated instruction," "Implemented RTI interventions," "Developed standards-aligned curriculum"',
    },
    {
      mistake: 'Not specifying grade levels, subjects, or class sizes',
      fix: 'Be specific: "5th-grade math (32 students)" or "AP Chemistry (3 sections, 75 students total)"',
    },
    {
      mistake: 'Omitting student outcome data',
      fix: 'Quantify growth: "Improved reading levels by 1.5 grade levels," "92% of students met or exceeded state standards"',
    },
    {
      mistake: 'Not listing educational technology tools',
      fix: 'Name the platforms: Google Classroom, Canvas, PowerSchool, Nearpod — schools increasingly filter on EdTech skills',
    },
  ],
};
