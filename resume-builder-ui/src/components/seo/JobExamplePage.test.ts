import { describe, it, expect } from 'vitest';
import { isA5Page } from './JobExamplePage';
import type { JobExampleData } from '../../data/jobExamples/types';

// ponytail: minimal shape — only the fields isA5Page reads.
const baseData = {
  meta: {} as JobExampleData['meta'],
  resume: {} as JobExampleData['resume'],
  bulletBank: [],
  relatedJobs: ['a', 'b'],
} as JobExampleData;

describe('isA5Page', () => {
  it('is false for null data', () => {
    expect(isA5Page(null)).toBe(false);
  });

  it('is false for legacy YAMLs (no answerBlock, even with relatedJobs)', () => {
    expect(isA5Page(baseData)).toBe(false);
  });

  it('is true once answerBlock is populated (A5 pilots + Wave-2 pages)', () => {
    expect(isA5Page({ ...baseData, answerBlock: 'A short answer.' })).toBe(true);
  });
});
