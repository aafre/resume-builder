import { describe, it, expect } from 'vitest';
import evidence from '../data/redditEvidence.json';
import { SEO_PAGES } from '../config/seoPages';

describe('Reddit evidence page', () => {
  it('meta description thread count matches the data', () => {
    const n = Number(SEO_PAGES.redditRecommended.seo.description.match(/(\d+) Reddit threads/)?.[1]);
    expect(n).toBe(evidence.threads.length);
  });

  it('every quote links to its comment on reddit.com', () => {
    for (const q of evidence.quotes) {
      expect(q.url).toMatch(new RegExp(`^https://www\\.reddit\\.com/r/${q.sub}/comments/\\w+/[^/]+/comment/${q.id}/$`));
    }
  });

  it('shows our own mention, including a negative score', () => {
    const us = evidence.quotes.filter((q) => q.group === 'us');
    expect(us).toHaveLength(1);
    expect(evidence.mentions.find((m) => m.tool === 'EasyFreeResume')?.threads).toBe(1);
  });
});
