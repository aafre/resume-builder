import { describe, it, expect } from 'vitest';
import {
  normalizeSynonym,
  applyMultiWordSynonyms,
  applyAllSynonyms,
  SYNONYMS,
} from '../keywordData/synonyms';

describe('normalizeSynonym', () => {
  it('maps nodejs → node.js', () => {
    expect(normalizeSynonym('nodejs')).toBe('node.js');
  });

  it('maps reactjs → react', () => {
    expect(normalizeSynonym('reactjs')).toBe('react');
  });

  it('maps k8s → kubernetes', () => {
    expect(normalizeSynonym('k8s')).toBe('kubernetes');
  });

  it('maps postgres → postgresql', () => {
    expect(normalizeSynonym('postgres')).toBe('postgresql');
  });

  it('maps golang → go', () => {
    expect(normalizeSynonym('golang')).toBe('go');
  });

  it('maps dotnet → .net', () => {
    expect(normalizeSynonym('dotnet')).toBe('.net');
  });

  it('is case-insensitive', () => {
    expect(normalizeSynonym('NodeJS')).toBe('node.js');
    expect(normalizeSynonym('GOLANG')).toBe('go');
  });

  it('returns original for unknown terms', () => {
    expect(normalizeSynonym('python')).toBe('python');
    expect(normalizeSynonym('randomword')).toBe('randomword');
  });
});

describe('applyMultiWordSynonyms', () => {
  it('replaces "ci cd" with "ci/cd"', () => {
    expect(applyMultiWordSynonyms('set up ci cd pipelines')).toBe(
      'set up ci/cd pipelines'
    );
  });

  it('replaces "dot net" with ".net"', () => {
    expect(applyMultiWordSynonyms('experience with dot net framework')).toBe(
      'experience with .net framework'
    );
  });

  it('replaces "amazon web services" with "aws"', () => {
    expect(
      applyMultiWordSynonyms('deployed on amazon web services infrastructure')
    ).toBe('deployed on aws infrastructure');
  });

  it('is case-insensitive', () => {
    expect(applyMultiWordSynonyms('CI CD pipelines')).toBe('ci/cd pipelines');
  });

  it('does not modify text without matches', () => {
    const text = 'python and react experience';
    expect(applyMultiWordSynonyms(text)).toBe(text);
  });
});

describe('applyAllSynonyms', () => {
  it('replaces single-word synonyms in text', () => {
    const result = applyAllSynonyms('built services with nodejs and reactjs');
    expect(result).toContain('node.js');
    expect(result).toContain('react');
  });

  it('does NOT corrupt existing dotted terms (node.js stays node.js)', () => {
    const result = applyAllSynonyms('experience with node.js backend');
    expect(result).toContain('node.js');
    expect(result).not.toContain('node.js.js');
    expect(result).not.toContain('node.javascript');
  });

  it('handles both multi-word and single-word synonyms', () => {
    const result = applyAllSynonyms('ci cd pipelines with nodejs backend');
    expect(result).toContain('ci/cd');
    expect(result).toContain('node.js');
  });

  it('skips 2-char synonym keys to avoid false positives', () => {
    // "js" should NOT be replaced in "node.js" or standalone
    const result = applyAllSynonyms('learned js and ts frameworks');
    // "js" and "ts" are ≤2 chars so they are NOT replaced at text level
    expect(result).toContain('js');
    expect(result).toContain('ts');
  });
});

describe('SYNONYMS map', () => {
  it('has expected number of entries (> 50)', () => {
    expect(SYNONYMS.size).toBeGreaterThan(50);
  });

  it('all keys are lowercase', () => {
    for (const key of SYNONYMS.keys()) {
      expect(key).toBe(key.toLowerCase());
    }
  });

  it('all values are lowercase', () => {
    for (const value of SYNONYMS.values()) {
      expect(value).toBe(value.toLowerCase());
    }
  });
});
