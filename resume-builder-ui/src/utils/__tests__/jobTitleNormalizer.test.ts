import { describe, it, expect } from 'vitest';
import { normalizeJobTitle } from '../jobTitleNormalizer';

describe('normalizeJobTitle', () => {
  // --- Pass-through / simple titles ---
  it('passes through a simple title', () => {
    expect(normalizeJobTitle('Software Engineer')).toEqual({
      query: 'Software Engineer',
      category: 'it-jobs',
    });
  });

  it('passes through "Product Manager"', () => {
    expect(normalizeJobTitle('Product Manager')).toEqual({
      query: 'Product Manager',
      category: null,
    });
  });

  it('detects accounting category', () => {
    expect(normalizeJobTitle('Financial Analyst')).toEqual({
      query: 'Financial Analyst',
      category: 'accounting-finance-jobs',
    });
  });

  // --- Compound title splitting ---
  it('splits compound title and picks recognizable segment', () => {
    const result = normalizeJobTitle('VP - Software Developer');
    expect(result.query).toBe('Software Developer');
    expect(result.category).toBe('it-jobs');
  });

  it('splits slash-separated titles', () => {
    const result = normalizeJobTitle('Manager / Data Analyst');
    expect(result.query).toBe('Data Analyst');
    expect(result.category).toBe('it-jobs');
  });

  it('splits pipe-separated titles', () => {
    const result = normalizeJobTitle('Team Lead | Backend Developer');
    expect(result.query).toBe('Backend Developer');
    expect(result.category).toBe('it-jobs');
  });

  // --- Executive prefix stripping ---
  it('strips "Director of Engineering"', () => {
    const result = normalizeJobTitle('Director of Engineering');
    expect(result.query).toBe('Engineering');
    expect(result.category).toBe('engineering-jobs');
  });

  it('strips "VP of Marketing"', () => {
    const result = normalizeJobTitle('VP of Marketing');
    expect(result.query).toBe('Marketing');
    expect(result.category).toBe('marketing-jobs');
  });

  it('strips "Head of Sales"', () => {
    const result = normalizeJobTitle('Head of Sales');
    expect(result.query).toBe('Sales');
    expect(result.category).toBe('sales-jobs');
  });

  it('keeps standalone Director (no following words to extract)', () => {
    expect(normalizeJobTitle('Director')).toEqual({
      query: 'Director',
      category: null,
    });
  });

  // --- Seniority preserved when ≤ 3 words ---
  it('preserves seniority in "Senior Data Analyst" (3 words)', () => {
    const result = normalizeJobTitle('Senior Data Analyst');
    expect(result.query).toBe('Senior Data Analyst');
    expect(result.category).toBe('it-jobs');
  });

  it('preserves "Lead Software Engineer" (3 words)', () => {
    const result = normalizeJobTitle('Lead Software Engineer');
    expect(result.query).toBe('Lead Software Engineer');
    expect(result.category).toBe('it-jobs');
  });

  // --- Seniority trimming when > 3 words ---
  it('trims seniority from long title', () => {
    const result = normalizeJobTitle('Principal Staff Engineer Platform Infrastructure');
    expect(result.query.split(' ').length).toBeLessThanOrEqual(3);
    expect(result.category).toBe('engineering-jobs');
  });

  it('trims "Senior Associate Software Development Engineer"', () => {
    const result = normalizeJobTitle('Senior Associate Software Development Engineer');
    // "Senior" and "Associate" stripped (both seniority), leaving 3 words
    expect(result.query).toBe('Software Development Engineer');
    expect(result.category).toBe('it-jobs');
  });

  // --- Roman numerals / level indicators ---
  it('strips roman numeral suffix', () => {
    const result = normalizeJobTitle('Engineer III');
    expect(result.query).toBe('Engineer');
    expect(result.category).toBe('engineering-jobs');
  });

  it('strips "Level 2" suffix', () => {
    const result = normalizeJobTitle('Software Developer Level 2');
    expect(result.query).toBe('Software Developer');
    expect(result.category).toBe('it-jobs');
  });

  it('strips "Grade 3" suffix', () => {
    const result = normalizeJobTitle('Analyst Grade 3');
    expect(result.query).toBe('Analyst');
    expect(result.category).toBe(null);
  });

  // --- Parenthetical stripping ---
  it('strips parenthetical suffix "(Remote)"', () => {
    const result = normalizeJobTitle('Product Manager (Remote)');
    expect(result.query).toBe('Product Manager');
  });

  it('strips parenthetical suffix "(Contract)"', () => {
    const result = normalizeJobTitle('UX Designer (Contract)');
    expect(result.query).toBe('UX Designer');
    expect(result.category).toBe('creative-design-jobs');
  });

  // --- Long title final safety ---
  it('truncates very long titles to ≤ 3 words', () => {
    const result = normalizeJobTitle(
      'Global Technology Solutions Delivery Optimization Specialist',
    );
    expect(result.query.split(' ').length).toBeLessThanOrEqual(3);
  });

  // --- Category null ---
  it('returns null category for unrecognized title', () => {
    const result = normalizeJobTitle('Chief of Staff');
    expect(result.category).toBeNull();
  });

  // --- Edge cases ---
  it('returns empty query for empty string', () => {
    expect(normalizeJobTitle('')).toEqual({ query: '', category: null });
  });

  it('returns empty query for whitespace-only string', () => {
    expect(normalizeJobTitle('   ')).toEqual({ query: '', category: null });
  });

  it('collapses extra whitespace', () => {
    const result = normalizeJobTitle('  Software   Engineer  ');
    expect(result.query).toBe('Software Engineer');
  });

  // --- Healthcare category ---
  it('detects healthcare category for Nurse Practitioner', () => {
    const result = normalizeJobTitle('Nurse Practitioner');
    expect(result.category).toBe('healthcare-nursing-jobs');
  });

  // --- Teaching category ---
  it('detects teaching category', () => {
    const result = normalizeJobTitle('Math Teacher');
    expect(result.category).toBe('teaching-jobs');
  });

  // --- Noise word stripping ---
  it('strips noise words in longer titles', () => {
    const result = normalizeJobTitle('Director for Human Resources and Talent');
    // "Director" exec stripped, "for" connector stripped, then noise "and" stripped
    expect(result.query).not.toContain(' and ');
  });
});
