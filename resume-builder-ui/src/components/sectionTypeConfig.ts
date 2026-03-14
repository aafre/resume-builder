// Shared section type metadata used by SectionTypeModal and SectionTypePopover.
// Single source of truth for type labels, descriptions, and visuals.

import { SectionType } from '../services/sectionService';
import {
  ExperienceVisual,
  EducationVisual,
  TextVisual,
  BulletedListVisual,
  InlineListVisual,
  SmartTableVisual,
  CertificationVisual,
} from './sectionVisuals';

export interface SectionTypeOption {
  type: SectionType;
  title: string;
  description: string;
  Visual: React.FC<{ className?: string }>;
}

/**
 * Complete registry of all section types with display metadata.
 * Order determines presentation order in UI.
 */
export const ALL_SECTION_TYPE_OPTIONS: SectionTypeOption[] = [
  {
    type: 'experience',
    title: 'Experience',
    description: 'Work history with company, title, dates, and achievements.',
    Visual: ExperienceVisual,
  },
  {
    type: 'education',
    title: 'Education',
    description: 'Academic qualifications with degree, school, and year.',
    Visual: EducationVisual,
  },
  {
    type: 'text',
    title: 'Text Block',
    description: 'Simple paragraph for summaries or statements.',
    Visual: TextVisual,
  },
  {
    type: 'bulleted-list',
    title: 'Bulleted List',
    description: 'Traditional vertical list with bullet points.',
    Visual: BulletedListVisual,
  },
  {
    type: 'inline-list',
    title: 'Inline List',
    description: 'Items displayed horizontally, flowing like tags.',
    Visual: InlineListVisual,
  },
  {
    type: 'dynamic-column-list',
    title: 'Smart Table',
    description: 'Auto-arranges items in columns for space efficiency.',
    Visual: SmartTableVisual,
  },
  {
    type: 'icon-list',
    title: 'Certifications',
    description: 'Professional certifications with issuer and dates.',
    Visual: CertificationVisual,
  },
];

/** Lookup a section type option by type key */
export const getSectionTypeOption = (type: string): SectionTypeOption | undefined =>
  ALL_SECTION_TYPE_OPTIONS.find(o => o.type === type);
