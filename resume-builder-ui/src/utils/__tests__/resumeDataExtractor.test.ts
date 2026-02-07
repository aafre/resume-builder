import { describe, it, expect } from 'vitest';
import { extractJobSearchParams, extractSkills, detectSeniority, estimateYearsExperience } from '../resumeDataExtractor';
import type { ContactInfo, Section, ExperienceItem } from '../../types';

const makeContact = (location: string): ContactInfo => ({
  name: 'John Doe',
  location,
  email: 'john@example.com',
  phone: '555-1234',
});

const makeExperienceSection = (titles: string[], dates?: string[]): Section => ({
  name: 'Experience',
  type: 'experience' as const,
  content: titles.map((title, i) => ({
    company: 'Company',
    title,
    dates: dates?.[i] ?? 'Recent',
    description: ['Did things'],
  })),
});

describe('extractJobSearchParams', () => {
  it('extracts query and location from resume with experience', () => {
    const result = extractJobSearchParams(
      makeContact('New York, NY'),
      [makeExperienceSection(['Software Engineer'])],
    );

    expect(result).toEqual({
      query: 'Software Engineer',
      displayTitle: 'Software Engineer',
      location: 'New York, NY',
      country: 'us',
      category: 'it-jobs',
      skills: [],
      seniorityLevel: 'mid',
      yearsExperience: 0,
    });
  });

  it('detects country from location', () => {
    const result = extractJobSearchParams(
      makeContact('London, UK'),
      [makeExperienceSection(['Product Manager'])],
    );

    expect(result).toEqual({
      query: 'Product Manager',
      displayTitle: 'Product Manager',
      location: 'London',
      country: 'gb',
      category: null,
      skills: [],
      seniorityLevel: 'mid',
      yearsExperience: 0,
    });
  });

  it('returns null when no experience section exists', () => {
    const result = extractJobSearchParams(
      makeContact('New York, NY'),
      [{ name: 'Skills', type: 'bulleted-list', content: ['TypeScript', 'React'] }],
    );

    expect(result).toBeNull();
  });

  it('returns null when experience section has no items', () => {
    const result = extractJobSearchParams(
      makeContact('New York, NY'),
      [{ name: 'Experience', type: 'experience', content: [] }],
    );

    expect(result).toBeNull();
  });

  it('returns null when first job title is empty', () => {
    const result = extractJobSearchParams(
      makeContact('New York, NY'),
      [makeExperienceSection([''])],
    );

    expect(result).toBeNull();
  });

  it('returns null when contactInfo is null', () => {
    const result = extractJobSearchParams(
      null,
      [makeExperienceSection(['Software Engineer'])],
    );

    expect(result).toEqual({
      query: 'Software Engineer',
      displayTitle: 'Software Engineer',
      location: '',
      country: 'us',
      category: 'it-jobs',
      skills: [],
      seniorityLevel: 'mid',
      yearsExperience: 0,
    });
  });

  it('handles legacy experience section (no type, name-based)', () => {
    const legacySection: Section = {
      name: 'Experience',
      content: [
        {
          company: 'Acme',
          title: 'Designer',
          dates: '2023',
          description: ['Designed things'],
        },
      ],
    } as Section;

    const result = extractJobSearchParams(
      makeContact('Paris, France'),
      [legacySection],
    );

    expect(result).toEqual({
      query: 'Designer',
      displayTitle: 'Designer',
      location: 'Paris',
      country: 'fr',
      category: 'creative-design-jobs',
      skills: [],
      seniorityLevel: 'mid',
      yearsExperience: 0,
    });
  });

  it('uses first experience section when multiple exist', () => {
    const result = extractJobSearchParams(
      makeContact('Berlin'),
      [
        makeExperienceSection(['Senior Engineer']),
        makeExperienceSection(['Junior Engineer']),
      ],
    );

    expect(result).toEqual({
      query: 'Senior Engineer',
      displayTitle: 'Senior Engineer',
      location: 'Berlin',
      country: 'de',
      category: 'engineering-jobs',
      skills: [],
      seniorityLevel: 'senior',
      yearsExperience: 0,
    });
  });

  it('detects seniority and years from full experience data', () => {
    const result = extractJobSearchParams(
      makeContact('San Francisco, CA'),
      [makeExperienceSection(
        ['Senior Software Engineer', 'Software Engineer', 'Junior Developer'],
        ['2021 - Present', '2018 - 2021', '2016 - 2018'],
      )],
    );

    expect(result).not.toBeNull();
    expect(result!.seniorityLevel).toBe('senior');
    expect(result!.yearsExperience).toBeGreaterThanOrEqual(8);
  });
});

describe('extractSkills', () => {
  it('extracts from inline-list sections', () => {
    const sections = [
      { name: 'Technical Skills', type: 'inline-list' as const, content: ['Python', 'React', 'AWS'] },
    ];
    expect(extractSkills(sections as any)).toEqual(['Python', 'React', 'AWS']);
  });

  it('extracts from dynamic-column-list sections', () => {
    const sections = [
      { name: 'Key Skills', type: 'dynamic-column-list' as const, content: ['Docker', 'Kubernetes', 'CI/CD'] },
    ];
    expect(extractSkills(sections as any)).toEqual(['Docker', 'Kubernetes', 'CI/CD']);
  });

  it('combines items from multiple skill sections', () => {
    const sections = [
      { name: 'Languages', type: 'inline-list' as const, content: ['Python', 'Go'] },
      { name: 'Cloud', type: 'dynamic-column-list' as const, content: ['AWS', 'GCP'] },
    ];
    expect(extractSkills(sections as any)).toEqual(['Python', 'Go', 'AWS', 'GCP']);
  });

  it('caps at 5 items', () => {
    const sections = [
      {
        name: 'Skills',
        type: 'inline-list' as const,
        content: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
      },
    ];
    expect(extractSkills(sections as any)).toHaveLength(5);
    expect(extractSkills(sections as any)).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('filters out empty items', () => {
    const sections = [
      { name: 'Skills', type: 'inline-list' as const, content: ['Python', '', '  ', 'React'] },
    ];
    expect(extractSkills(sections as any)).toEqual(['Python', 'React']);
  });

  it('ignores bulleted-list sections', () => {
    const sections = [
      { name: 'Achievements', type: 'bulleted-list' as const, content: ['Led team of 5', 'Shipped product'] },
    ];
    expect(extractSkills(sections as any)).toEqual([]);
  });

  it('returns empty array when no skill sections exist', () => {
    const sections = [
      { name: 'Experience', type: 'experience' as const, content: [{ company: 'Co', title: 'Dev', dates: '2024', description: [] }] },
    ];
    expect(extractSkills(sections as any)).toEqual([]);
  });

  it('includes skills in extractJobSearchParams result', () => {
    const result = extractJobSearchParams(
      makeContact('New York, NY'),
      [
        makeExperienceSection(['Software Engineer']),
        { name: 'Skills', type: 'inline-list' as const, content: ['TypeScript', 'Node.js'] } as any,
      ],
    );
    expect(result?.skills).toEqual(['TypeScript', 'Node.js']);
  });
});

describe('detectSeniority', () => {
  it('returns "senior" for "Senior Software Engineer"', () => {
    expect(detectSeniority(['Senior Software Engineer'])).toBe('senior');
  });

  it('returns "lead" for "Lead Developer"', () => {
    expect(detectSeniority(['Lead Developer'])).toBe('lead');
  });

  it('returns "entry" for "Junior Developer"', () => {
    expect(detectSeniority(['Junior Developer'])).toBe('entry');
  });

  it('returns "lead" for "Principal Engineer"', () => {
    expect(detectSeniority(['Principal Engineer'])).toBe('lead');
  });

  it('returns "mid" when no seniority word found', () => {
    expect(detectSeniority(['Software Engineer'])).toBe('mid');
  });

  it('uses first title (most recent) for detection', () => {
    expect(detectSeniority(['Senior Engineer', 'Junior Developer'])).toBe('senior');
  });

  it('falls back to second title if first has no seniority', () => {
    expect(detectSeniority(['Software Engineer', 'Senior Developer'])).toBe('senior');
  });

  it('returns "mid" for empty array', () => {
    expect(detectSeniority([])).toBe('mid');
  });
});

describe('estimateYearsExperience', () => {
  it('calculates years from date ranges', () => {
    const items: ExperienceItem[] = [
      { company: 'Co1', title: 'Dev', dates: '2020 - 2024', description: [] },
      { company: 'Co2', title: 'Dev', dates: '2018 - 2020', description: [] },
    ];
    expect(estimateYearsExperience(items)).toBe(6);
  });

  it('handles "Present" as current year', () => {
    const items: ExperienceItem[] = [
      { company: 'Co', title: 'Dev', dates: '2020 - Present', description: [] },
    ];
    const currentYear = new Date().getFullYear();
    expect(estimateYearsExperience(items)).toBe(currentYear - 2020);
  });

  it('handles "Current" as current year', () => {
    const items: ExperienceItem[] = [
      { company: 'Co', title: 'Dev', dates: '2019 - Current', description: [] },
    ];
    const currentYear = new Date().getFullYear();
    expect(estimateYearsExperience(items)).toBe(currentYear - 2019);
  });

  it('returns 0 when no dates can be parsed', () => {
    const items: ExperienceItem[] = [
      { company: 'Co', title: 'Dev', dates: '', description: [] },
    ];
    expect(estimateYearsExperience(items)).toBe(0);
  });

  it('returns 0 for empty items', () => {
    expect(estimateYearsExperience([])).toBe(0);
  });

  it('handles month-year format "Jan 2018 - Dec 2022"', () => {
    const items: ExperienceItem[] = [
      { company: 'Co', title: 'Dev', dates: 'Jan 2018 - Dec 2022', description: [] },
    ];
    expect(estimateYearsExperience(items)).toBe(4);
  });
});
