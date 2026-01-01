import type { JobKeywordsData } from '../types';
import {
  COMMON_SOFT_SKILLS,
  PROGRAMMING_LANGUAGES,
  DESIGN_TOOLS,
  COLLABORATION_TOOLS,
  AGILE_METHODOLOGIES,
} from '../common/skills';

export const uxDesigner: JobKeywordsData = {
  slug: 'ux-designer',
  title: 'UX Designer',
  metaTitle: 'UX Designer Resume Keywords - Figma, User Research & Prototyping',
  metaDescription:
    'UX designer resume keywords: Figma, user research, wireframing, prototyping, usability testing, accessibility, and user-centered design skills.',
  category: 'technology',
  priority: 0.8,
  lastmod: '2026-01-01',

  keywords: {
    core: [
      'User Experience Design',
      'User-Centered Design',
      ...COMMON_SOFT_SKILLS.communication,
      'Empathy',
      ...COMMON_SOFT_SKILLS.problemSolving.slice(0, 2),
      'Creative Thinking',
    ],
    technical: [
      ...DESIGN_TOOLS.ui, // Figma, Sketch, Adobe XD, InVision
      ...DESIGN_TOOLS.prototyping, // Figma, Axure, Balsamiq, Proto.io
      'Wireframing',
      'User Flows',
      'Information Architecture',
      'Interaction Design',
      'Visual Design',
      'Responsive Design',
      ...PROGRAMMING_LANGUAGES.web.slice(2, 4), // HTML, CSS (basic understanding)
    ],
    processes: [
      'User Research',
      'Usability Testing',
      'A/B Testing',
      'Persona Development',
      'Journey Mapping',
      'Accessibility (WCAG)',
      ...AGILE_METHODOLOGIES.frameworks.slice(0, 1), // Agile/Scrum
      'Design Thinking',
    ],
    certifications: [
      'Google UX Design Certificate',
      'Nielsen Norman Group UX Certification',
      'Interaction Design Foundation Certificate',
      'CPUX-F (Certified Professional for Usability and UX)',
    ],
  },

  tools: [
    {
      category: 'Design Tools',
      items: [...DESIGN_TOOLS.ui, 'Framer', 'Principle'],
    },
    {
      category: 'Prototyping',
      items: [...DESIGN_TOOLS.prototyping, 'Marvel', 'Webflow'],
    },
    {
      category: 'User Research',
      items: ['UserTesting', 'Hotjar', 'Maze', 'Optimal Workshop', 'Lookback'],
    },
    {
      category: 'Collaboration',
      items: [...COLLABORATION_TOOLS.communication.slice(0, 3), 'Miro', 'FigJam'],
    },
    {
      category: 'Analytics',
      items: ['Google Analytics', 'Mixpanel', 'Amplitude', 'FullStory'],
    },
  ],
};
