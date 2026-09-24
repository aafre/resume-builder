import { describe, it, expect } from 'vitest';
import { tokenize, findRanges, sentenceRange } from '../resumeEvidence';

const RESUME = `EXPERIENCE
Senior Engineer, Acme
Led a team of 6 engineers shipping containerised services
on AWS with automated deploys.
Built and maintained CI pipelines in GitHub Actions, cutting release time from two days to twenty minutes.
Owned observability across forty microservices using Prometheus and Grafana dashboards.
Skills: Python, C++, Docker`;

describe('findRanges', () => {
  const tokens = tokenize(RESUME);

  const text = (r: { start: number; end: number }) => RESUME.slice(r.start, r.end);

  it('locates a single keyword', () => {
    expect(text(findRanges(tokens, 'Docker')[0])).toBe('Docker');
  });

  it('locates a chunk that spans a line break (worker rewrites \n as ". ")', () => {
    const chunk = 'shipping containerised services. on AWS with automated deploys';
    expect(text(findRanges(tokens, chunk)[0])).toBe(
      'shipping containerised services\non AWS with automated deploys',
    );
  });

  it('tolerates a chunk truncated mid-word at 150 chars', () => {
    expect(text(findRanges(tokens, 'Led a team of 6 engin')[0])).toBe('Led a team of 6');
  });

  it('keeps punctuated tokens whole', () => {
    expect(text(findRanges(tokens, 'C++')[0])).toBe('C++');
  });

  it('returns nothing when the phrase is absent', () => {
    expect(findRanges(tokens, 'Kubernetes')).toEqual([]);
  });

  it('finds every occurrence up to the limit', () => {
    expect(findRanges(tokenize('aws and aws and aws'), 'aws', 2)).toHaveLength(2);
  });
});

describe('sentenceRange', () => {
  const text = (r: { start: number; end: number }) => RESUME.slice(r.start, r.end);

  it('snaps a chunk that was truncated mid-sentence back to a sentence', () => {
    const tokens = tokenize(RESUME);
    const chunk =
      'Built and maintained CI pipelines in GitHub Actions, cutting release time from two days to twenty minutes. Owned observability across forty';
    expect(text(sentenceRange(RESUME, findRanges(tokens, chunk)[0]))).toBe(
      'Built and maintained CI pipelines in GitHub Actions, cutting release time from two days to twenty minutes.',
    );
  });

  it('grows a single term to its whole sentence', () => {
    const tokens = tokenize(RESUME);
    expect(text(sentenceRange(RESUME, findRanges(tokens, 'Prometheus')[0]))).toBe(
      'Owned observability across forty microservices using Prometheus and Grafana dashboards.',
    );
  });

  it('stops at a line break for a sentence with no terminator', () => {
    expect(text(sentenceRange(RESUME, findRanges(tokenize(RESUME), 'Acme')[0]))).toBe(
      'Senior Engineer, Acme',
    );
  });
});
