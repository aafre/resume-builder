import { describe, it, expect } from 'vitest';
import { extractJobSearchParams } from '../resumeDataExtractor';
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
    });
  });
});
