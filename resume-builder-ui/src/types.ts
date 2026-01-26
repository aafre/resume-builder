// src/types.ts

// Social media link for contact info.
export interface SocialLink {
  platform: string; // e.g., "linkedin", "github", "twitter", "website"
  url: string;
  display_text?: string; // Optional custom display text
}

// Contact information section.
export interface ContactInfo {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin?: string; // Deprecated: kept for backward compatibility
  linkedin_display?: string; // Deprecated: kept for backward compatibility
  social_links?: SocialLink[]; // New: array of social media links
}

// The overall resume template object.
export interface ResumeTemplate {
  template?: string;
  font?: string;
  contact_info: ContactInfo;
  sections: Section[];
}

// Base interface for a section.
export interface SectionBase {
  id?: string; // Unique identifier for stable list rendering and drag-and-drop
  name: string;
  type?: string; // Optional as some sections do not need a type
  content: any;
}

// --- Section Types ---

// Simple text section.
export interface TextSection extends SectionBase {
  type: "text";
  content: string;
}

// Bulleted list section.
export interface BulletedListSection extends SectionBase {
  type: "bulleted-list";
  content: string[];
}

// Inline list section.
export interface InlineListSection extends SectionBase {
  type: "inline-list";
  content: string[];
}

// Dynamic column list section.
export interface DynamicColumnListSection extends SectionBase {
  type: "dynamic-column-list";
  content: string[];
}

// Icon list section (e.g. Certifications).
export interface IconListSection extends SectionBase {
  type: "icon-list";
  content: IconListItem[];
}

export interface IconListItem {
  certification: string;
  issuer: string;
  date: string;
  icon: string;
}

// Experience section.
export interface ExperienceSection extends SectionBase {
  type?: "experience"; // Optional for backwards compatibility
  content: ExperienceItem[];
}

export interface ExperienceItem {
  company: string;
  title: string;
  dates: string;
  description: string[];
  icon?: string;
}

// Education section.
export interface EducationSection extends SectionBase {
  type?: "education"; // Optional for backwards compatibility
  content: EducationItem[];
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
  icon?: string;
}

export interface GenericSection extends SectionBase {
  content: string | string[];
}

// --- Union Type for All Sections ---

export type Section =
  | TextSection
  | BulletedListSection
  | InlineListSection
  | DynamicColumnListSection
  | IconListSection
  | ExperienceSection
  | EducationSection
  | GenericSection;

// --- Resume Storage Types ---

// Resume list item (for My Resumes page)
export interface ResumeListItem {
  id: string;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  pdf_url?: string | null;
  pdf_generated_at?: string | null;
  thumbnail_url?: string | null;
}

// Saved resume with full data
export interface SavedResume {
  id: string;
  title: string;
  template_id: string;
  contact_info: ContactInfo;
  sections: Section[];
  icons: SavedIcon[];
  created_at: string;
  updated_at: string;
}

// Icon stored in Supabase
export interface SavedIcon {
  filename: string;
  storage_url: string;
  storage_path?: string;
}

// Cloud save status
export type SaveStatus = 'saved' | 'saving' | 'error';
