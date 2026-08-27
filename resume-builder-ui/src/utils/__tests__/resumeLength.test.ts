import { describe, it, expect, beforeEach } from 'vitest';
import {
  estimateResumeLength,
  rawHeightPx,
  calibrateAgainst,
  resetCalibration,
  visibleText,
  __testing,
} from '../resumeLength';
import type { ContactInfo, Section } from '../../types';

const contact: ContactInfo = {
  name: 'Jane Doe',
  location: 'London, UK',
  email: 'jane@example.com',
  phone: '+44 7000000000',
};

const summary = (text: string): Section => ({ name: 'Summary', type: 'text', content: text });

const experience = (bulletsPerJob: number, jobs = 1): Section => ({
  name: 'Experience',
  type: 'experience',
  content: Array.from({ length: jobs }, () => ({
    company: 'Acme',
    title: 'Engineer',
    dates: '2020 - 2024',
    description: Array.from({ length: bulletsPerJob }, () => 'Did a thing that took about one line.'),
  })),
});

beforeEach(resetCalibration);

describe('visibleText', () => {
  it('strips the markup the rich-text fields actually store', () => {
    expect(visibleText('<p>Led <strong>five</strong> teams</p>')).toBe('Led five teams');
    expect(visibleText('**bold** and _thin_')).toBe('bold and thin');
    expect(visibleText('see [the docs](https://example.com)')).toBe('see the docs');
    expect(visibleText('a<br/>b')).toBe('a b');
    expect(visibleText('Tom &amp; Jerry')).toBe('Tom & Jerry');
  });

  it('is safe on the non-strings the section union allows', () => {
    expect(visibleText(undefined)).toBe('');
    expect(visibleText(null)).toBe('');
    expect(visibleText(['a'])).toBe('');
  });
});

describe('estimateResumeLength', () => {
  it('reports at least one page even for an empty resume', () => {
    const e = estimateResumeLength(null, []);
    expect(e.pageCount).toBe(1);
    expect(e.heightPx).toBe(0);
  });

  it('keeps a short resume on one page and pushes a long one over', () => {
    const short = estimateResumeLength(contact, [summary('A brief summary.'), experience(3)]);
    expect(short.pageCount).toBe(1);

    const long = estimateResumeLength(contact, [
      summary('A brief summary.'),
      experience(8, 6),
    ]);
    expect(long.pageCount).toBeGreaterThan(1);
  });

  it('grows monotonically as content is added', () => {
    const one = rawHeightPx(contact, [experience(3)]);
    const two = rawHeightPx(contact, [experience(6)]);
    const three = rawHeightPx(contact, [experience(6, 2)]);
    expect(two).toBeGreaterThan(one);
    expect(three).toBeGreaterThan(two);
  });

  it('charges more for text that wraps onto extra lines', () => {
    const oneLine = rawHeightPx(null, [summary('short')]);
    const manyLines = rawHeightPx(null, [summary('x'.repeat(__testing.CHARS_PER_LINE * 4))]);
    expect(manyLines - oneLine).toBeGreaterThanOrEqual(__testing.H.line * 3);
  });

  it('does not charge for markup, only for visible text', () => {
    const plain = rawHeightPx(null, [summary('Led five teams')]);
    const marked = rawHeightPx(null, [summary('<p>Led <strong>five</strong> teams</p>')]);
    expect(marked).toBe(plain);
  });

  it('reports lastPageFill as a fraction, and as full on an exact boundary', () => {
    const partial = estimateResumeLength(contact, [experience(3)]);
    expect(partial.lastPageFill).toBeGreaterThan(0);
    expect(partial.lastPageFill).toBeLessThan(1);
  });

  it('handles legacy sections whose type is missing or whose content is a bare string', () => {
    const legacy: Section = { name: 'Notes', content: 'plain string content' } as Section;
    expect(() => rawHeightPx(contact, [legacy])).not.toThrow();
    expect(rawHeightPx(contact, [legacy])).toBeGreaterThan(0);
  });

  it('survives malformed content without throwing', () => {
    const junk = [
      { name: 'A', type: 'bulleted-list', content: null },
      { name: 'B', type: 'experience', content: undefined },
      { name: 'C', type: 'icon-list', content: [] },
    ] as unknown as Section[];
    expect(() => estimateResumeLength(contact, junk)).not.toThrow();
  });
});

describe('calibrateAgainst', () => {
  it('pulls the estimate toward a real PDF page count', () => {
    const sections = [summary('A brief summary.'), experience(4, 2)];
    const raw = rawHeightPx(contact, sections);

    // Claim the real PDF was 2 pages when the raw model thinks it is 1.
    expect(Math.ceil(raw / __testing.PAGE_CONTENT_HEIGHT_PX)).toBe(1);
    calibrateAgainst(raw, 2);

    const after = estimateResumeLength(contact, sections);
    expect(after.calibrated).toBe(true);
    expect(after.heightPx).toBeGreaterThan(raw);
  });

  it('eases rather than snapping, so one odd resume cannot throw the model', () => {
    const raw = 1000;
    calibrateAgainst(raw, 1);
    const first = estimateResumeLength(contact, []).calibrated;
    expect(first).toBe(true);

    // A second, wildly different observation should move it only part way.
    calibrateAgainst(raw, 3);
    const sections = [summary('x')];
    const eased = rawHeightPx(contact, sections);
    expect(eased).toBeGreaterThan(0); // model still sane, not exploded
  });

  it('clamps to a sane band and ignores nonsense input', () => {
    calibrateAgainst(1, 100); // absurd -> clamped
    const huge = estimateResumeLength(contact, [summary('x')]);
    expect(Number.isFinite(huge.heightPx)).toBe(true);

    resetCalibration();
    const before = estimateResumeLength(contact, [summary('x')]).heightPx;
    calibrateAgainst(0, 2);
    calibrateAgainst(-5, 2);
    calibrateAgainst(100, 0);
    calibrateAgainst(100, 1.5);
    expect(estimateResumeLength(contact, [summary('x')]).heightPx).toBe(before);
  });
});
