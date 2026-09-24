import { describe, expect, it } from 'vitest';
import { getResumeCount } from '../resumeCount';

const BASE = Date.parse('2026-09-23');
const H = 3_600_000;

describe('getResumeCount', () => {
  it('is the baseline at the baseline instant', () => {
    expect(getResumeCount(BASE)).toBe(150_000);
  });
  it('adds the daily rate per day', () => {
    expect(getResumeCount(BASE + 24 * H)).toBe(150_520);
  });
  it('advances within the day', () => {
    expect(getResumeCount(BASE + 2 * H)).toBe(150_043);
  });
  it('never drops below the baseline', () => {
    expect(getResumeCount(Date.parse('2026-01-01'))).toBe(150_000);
  });
  it('is a non-decreasing integer across every minute of a day', () => {
    let prev = getResumeCount(BASE + 5 * 24 * H);
    for (let m = 1; m <= 1440; m++) {
      const v = getResumeCount(BASE + 5 * 24 * H + m * 60_000);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});
