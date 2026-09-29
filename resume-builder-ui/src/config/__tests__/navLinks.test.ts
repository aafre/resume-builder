import { describe, it, expect } from 'vitest';
import { getNavLinks } from '../navLinks';

const hasJobs = (links: { path: string }[]) => links.some((l) => l.path === '/jobs');

describe('getNavLinks jobs entry', () => {
  it('shows Jobs to everyone when jobs are available', () => {
    expect(hasJobs(getNavLinks(false, true))).toBe(true);
    expect(hasJobs(getNavLinks(true, true))).toBe(true);
  });

  it('hides Jobs when unavailable (flag off, unsupported country, or not yet known)', () => {
    expect(hasJobs(getNavLinks(false, false))).toBe(false);
    expect(hasJobs(getNavLinks(true, false))).toBe(false);
  });
});
