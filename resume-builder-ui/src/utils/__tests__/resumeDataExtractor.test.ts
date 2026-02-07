import { describe, it, expect } from 'vitest';
import { extractJobSearchParams, extractSkills } from '../resumeDataExtractor';
import type { ContactInfo, Section } from '../../types';

const makeContact = (location: string): ContactInfo => ({
  name: 'John Doe',
  location,
  email: 'john@example.com',
  phone: '555-1234',
});

const makeExperienceSection = (titles: string[]): Section => ({
  name: 'Experience',
  type: 'experience' as const,
  content: titles.map((title) => ({
    company: 'Company',
    title,
    dates: '2024 - Present',
    description: ['Did things'],
  })),
});

describe('extractJobSearchParams', () => {
  it('extracts query and location from resume with experience', () => {
    const result = extractJobSearchParams(
      makeContact('New York, NY'),
      [makeExperienceSection(['Software Engineer', 'Junior Dev'])],
    );

    expect(result).toEqual({
      query: 'Software Engineer',
      displayTitle: 'Software Engineer',
      location: 'New York, NY',
      country: 'us',
      category: 'it-jobs',
      skills: [],
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
    });
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

  it('caps at 10 items', () => {
    const sections = [
      {
        name: 'Skills',
        type: 'inline-list' as const,
        content: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
      },
    ];
    expect(extractSkills(sections as any)).toHaveLength(10);
    expect(extractSkills(sections as any)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
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
