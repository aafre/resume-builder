import { describe, expect, it } from 'vitest';
import { getResumeCount } from '../resumeCount';

describe('getResumeCount', () => {
  it('is the baseline on the baseline day', () => {
    expect(getResumeCount('2026-09-23')).toBe(150_000);
  });
  it('adds the daily rate per whole day', () => {
    expect(getResumeCount('2026-10-03')).toBe(155_200);
  });
  it('never drops below the baseline', () => {
    expect(getResumeCount('2026-01-01')).toBe(150_000);
  });
  it('lands on a multiple of 100', () => {
    expect(getResumeCount('2027-03-15') % 100).toBe(0);
  });
});
