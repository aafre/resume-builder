/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { STATIC_URLS } from '../data/sitemapUrls';
import { JOBS_DATABASE } from '../data/jobKeywords';
import { JOB_EXAMPLES_DATABASE } from '../data/jobExamples';
import { blogPosts, getActiveBlogPosts } from '../data/blogPosts';

/**
 * These tests validate the prerender route generation logic — the same
 * algorithm used in scripts/prerender.ts. We replicate the logic here
 * rather than importing the script (which depends on Playwright).
 */

const PRERENDER_EXCLUDE = new Set(['/privacy-policy', '/terms-of-service']);

function buildRoutesToPrerender(): string[] {
  const routes = new Set<string>();

  for (const url of STATIC_URLS) {
    if (!PRERENDER_EXCLUDE.has(url.loc)) {
      routes.add(url.loc);
    }
  }

  for (const job of JOBS_DATABASE) {
    routes.add(`/resume-keywords/${job.slug}`);
  }

  for (const example of JOB_EXAMPLES_DATABASE) {
    routes.add(`/examples/${example.slug}`);
  }

  for (const post of getActiveBlogPosts()) {
    routes.add(`/blog/${post.slug}`);
  }

  return Array.from(routes);
}

describe('Prerender route generation', () => {
  const routes = buildRoutesToPrerender();

  it('generates a reasonable number of routes (100+)', () => {
    expect(routes.length).toBeGreaterThanOrEqual(100);
  });

  it('includes all routes from STATIC_URLS except excluded ones', () => {
    for (const url of STATIC_URLS) {
      if (PRERENDER_EXCLUDE.has(url.loc)) {
        expect(routes).not.toContain(url.loc);
      } else {
        expect(routes).toContain(url.loc);
      }
    }
  });

  it('includes all job keyword routes', () => {
    for (const job of JOBS_DATABASE) {
      expect(routes).toContain(`/resume-keywords/${job.slug}`);
    }
  });

  it('includes all job example routes', () => {
    for (const example of JOB_EXAMPLES_DATABASE) {
      expect(routes).toContain(`/examples/${example.slug}`);
    }
  });

  it('excludes privacy-policy and terms-of-service', () => {
    expect(routes).not.toContain('/privacy-policy');
    expect(routes).not.toContain('/terms-of-service');
  });

  it('all routes start with /', () => {
    for (const route of routes) {
      expect(route).toMatch(/^\//);
    }
  });

  it('has no duplicate routes', () => {
    const unique = new Set(routes);
    expect(unique.size).toBe(routes.length);
  });

  it('does not contain any known redirect sources', () => {
    const redirectSources = [
      '/blog/software-engineer-resume-keywords',
      '/blog/customer-service-resume-keywords',
      '/blog/zety-vs-easy-free-resume',
      '/blog/career-change-resume',
      '/blog/how-to-use-resume-keywords-to-beat-ats',
      '/blog/how-to-list-skills-on-resume',
      '/privacy',
      '/terms',
    ];
    for (const redirect of redirectSources) {
      expect(routes).not.toContain(redirect);
    }
  });

  it('includes all non-redirect blog post routes', () => {
    for (const post of getActiveBlogPosts()) {
      expect(routes).toContain(`/blog/${post.slug}`);
    }
  });

  it('does not include redirect blog post routes', () => {
    const redirectPosts = blogPosts.filter(p => p.redirectTo);
    for (const post of redirectPosts) {
      expect(routes).not.toContain(`/blog/${post.slug}`);
    }
  });

  it('includes key high-value pages', () => {
    const keyPages = [
      '/',
      '/templates',
      '/blog',
      '/resume-keywords',
      '/examples',
      '/about',
    ];
    for (const page of keyPages) {
      expect(routes).toContain(page);
    }
  });
});
