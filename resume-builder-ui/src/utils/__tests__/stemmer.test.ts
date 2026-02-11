import { describe, it, expect } from 'vitest';
import { stem, stemPhrase, registerSkipTerms } from '../keywordData/stemmer';

describe('stem', () => {
  it('strips -ing suffix', () => {
    expect(stem('developing')).toBe('develop');
    expect(stem('testing')).toBe('test');
    expect(stem('building')).toBe('build');
  });

  it('strips -ed suffix', () => {
    expect(stem('developed')).toBe('develop');
    expect(stem('managed')).toBe('manag');
  });

  it('strips -ment suffix', () => {
    expect(stem('management')).toBe('manage');
    expect(stem('deployment')).toBe('deploy');
  });

  it('strips -ments suffix', () => {
    expect(stem('deployments')).toBe('deploy');
    expect(stem('requirements')).toBe('require');
  });

  it('strips -tion suffix', () => {
    expect(stem('encryption')).toBe('encryp');
  });

  it('strips -ation suffix', () => {
    expect(stem('automation')).toBe('autom');
    expect(stem('visualization')).toBe('visual');
  });

  it('strips -ization suffix', () => {
    expect(stem('optimization')).toBe('optim');
    expect(stem('organization')).toBe('organ');
  });

  it('strips -izing suffix (matches -ization stem)', () => {
    expect(stem('optimizing')).toBe('optim');
    expect(stem('organizing')).toBe('organ');
  });

  it('strips -ized suffix (matches -ization stem)', () => {
    expect(stem('optimized')).toBe('optim');
  });

  it('strips -ated suffix (matches -ation stem)', () => {
    expect(stem('automated')).toBe('autom');
    expect(stem('generated')).toBe('gener');
  });

  it('strips -er suffix', () => {
    expect(stem('developer')).toBe('develop');
    expect(stem('designer')).toBe('design');
  });

  it('strips -ers suffix', () => {
    expect(stem('developers')).toBe('develop');
  });

  it('strips -ly suffix', () => {
    expect(stem('effectively')).toBe('effective');
  });

  it('strips -ies suffix to -y', () => {
    expect(stem('strategies')).toBe('strategy');
    expect(stem('technologies')).toBe('technology');
  });

  it('strips -s suffix', () => {
    expect(stem('systems')).toBe('system');
    expect(stem('teams')).toBe('team');
  });

  it('does not stem short words (≤ 4 chars)', () => {
    expect(stem('runs')).toBe('runs');
    expect(stem('led')).toBe('led');
    expect(stem('test')).toBe('test');
  });

  it('does not stem when stem would be too short', () => {
    // "ed" stripping from "used" → "us" (length 2 < minStem 3) → no change
    expect(stem('used')).toBe('used');
  });

  it('returns lowercase', () => {
    expect(stem('TESTING')).toBe('test');
    expect(stem('Building')).toBe('build');
  });

  describe('skip set', () => {
    it('does not stem known skills when registered', () => {
      registerSkipTerms(new Set(['react', 'docker', 'kubernetes']));
      expect(stem('react')).toBe('react');
      expect(stem('docker')).toBe('docker');
      expect(stem('kubernetes')).toBe('kubernetes');
    });
  });
});

describe('stemPhrase', () => {
  it('stems each word independently', () => {
    expect(stemPhrase('developing applications')).toBe('develop application');
  });

  it('preserves word order', () => {
    expect(stemPhrase('testing deployment')).toBe('test deploy');
  });
});

describe('morphological pair matching', () => {
  it('optimization ↔ optimizing produce same stem', () => {
    expect(stem('optimization')).toBe(stem('optimizing'));
  });

  it('automation ↔ automated produce same stem', () => {
    expect(stem('automation')).toBe(stem('automated'));
  });

  it('development ↔ developing produce same stem', () => {
    expect(stem('development')).toBe(stem('developing'));
  });

  it('management and managing produce close but not identical stems', () => {
    // -ment → "manage", -ing → "manag" — trailing "e" difference is a stemmer limitation
    // Both still match in practice since stem matching uses regex on stemmed text
    expect(stem('management')).toBe('manage');
    expect(stem('managing')).toBe('manag');
  });

  it('testing ↔ tests produce same stem', () => {
    expect(stem('testing')).toBe(stem('tests'));
  });
});
