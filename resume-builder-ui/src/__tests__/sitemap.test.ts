/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { STATIC_URLS, getStaticUrlPaths } from '../data/sitemapUrls';
import { JOBS_DATABASE, getAllJobSlugs } from '../data/jobKeywords';
import { JOB_EXAMPLES_DATABASE, getAllJobExampleSlugs } from '../data/jobExamples';
import {
  HREFLANG_PAIRS,
  CV_REGIONS,
  RESUME_REGION,
  DEFAULT_REGION,
  getAllCvPaths,
  getAllResumePathsWithCvPairs,
  findHreflangPair,
} from '../data/hreflangMappings';

describe('Sitemap URL Validation', () => {
  describe('Static URLs', () => {
    it('should have no duplicate static URL paths', () => {
      const paths = getStaticUrlPaths();
      const uniquePaths = new Set(paths);
      expect(paths.length).toBe(uniquePaths.size);
    });

    it('should have required fields for each static URL', () => {
      STATIC_URLS.forEach(url => {
        expect(url).toHaveProperty('loc');
        expect(url).toHaveProperty('priority');
        expect(url).toHaveProperty('changefreq');
        expect(url).toHaveProperty('lastmod');
        expect(url.loc).toMatch(/^\//); // Should start with /
        expect(url.priority).toBeGreaterThanOrEqual(0);
        expect(url.priority).toBeLessThanOrEqual(1);
        expect(['daily', 'weekly', 'monthly', 'yearly']).toContain(url.changefreq);
        expect(url.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      });
    });

    it('should have valid URL path formats (no trailing slashes except root)', () => {
      STATIC_URLS.forEach(url => {
        if (url.loc !== '/') {
          expect(url.loc.endsWith('/')).toBe(false);
        }
      });
    });

    it('should not contain query parameters or fragments', () => {
      STATIC_URLS.forEach(url => {
        expect(url.loc).not.toContain('?');
        expect(url.loc).not.toContain('#');
      });
    });
  });

  describe('Job Keywords Slugs', () => {
    it('should have unique slugs', () => {
      const slugs = getAllJobSlugs();
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('should have valid slug format (lowercase, hyphenated)', () => {
      JOBS_DATABASE.forEach(job => {
        expect(job.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      });
    });

    it('should have required priority field', () => {
      JOBS_DATABASE.forEach(job => {
        expect(job).toHaveProperty('priority');
        expect(job.priority).toBeGreaterThan(0);
        expect(job.priority).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Job Examples Slugs', () => {
    it('should have unique slugs', () => {
      const slugs = getAllJobExampleSlugs();
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('should have valid slug format (lowercase, hyphenated)', () => {
      JOB_EXAMPLES_DATABASE.forEach(job => {
        expect(job.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      });
    });

    it('should have required priority field', () => {
      JOB_EXAMPLES_DATABASE.forEach(job => {
        expect(job).toHaveProperty('priority');
        expect(job.priority).toBeGreaterThan(0);
        expect(job.priority).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Combined Sitemap Deduplication', () => {
    it('should have no duplicate URLs across static, job keywords, and job examples', () => {
      const allUrls: string[] = [];

      // Add static URLs
      allUrls.push(...getStaticUrlPaths());

      // Add job keyword URLs
      JOBS_DATABASE.forEach(job => {
        allUrls.push(`/resume-keywords/${job.slug}`);
      });

      // Add job example URLs
      JOB_EXAMPLES_DATABASE.forEach(job => {
        allUrls.push(`/examples/${job.slug}`);
      });

      const uniqueUrls = new Set(allUrls);
      expect(allUrls.length).toBe(uniqueUrls.size);
    });
  });
});

describe('Hreflang Mappings Validation', () => {
  describe('HREFLANG_PAIRS structure', () => {
    it('should have at least one pair defined', () => {
      expect(HREFLANG_PAIRS.length).toBeGreaterThan(0);
    });

    it('should have valid resume and cv paths for each pair', () => {
      HREFLANG_PAIRS.forEach(pair => {
        expect(pair).toHaveProperty('resume');
        expect(pair).toHaveProperty('cv');
        expect(pair.resume).toMatch(/^\//);
        expect(pair.cv).toMatch(/^\//);
        expect(pair.resume).not.toBe(pair.cv);
      });
    });

    it('should have no duplicate resume paths', () => {
      const resumePaths = HREFLANG_PAIRS.map(p => p.resume);
      const uniqueResumePaths = new Set(resumePaths);
      expect(resumePaths.length).toBe(uniqueResumePaths.size);
    });

    it('should have no duplicate cv paths', () => {
      const cvPaths = HREFLANG_PAIRS.map(p => p.cv);
      const uniqueCvPaths = new Set(cvPaths);
      expect(cvPaths.length).toBe(uniqueCvPaths.size);
    });
  });

  describe('Hreflang URL existence in sitemap', () => {
    const staticPaths = getStaticUrlPaths();

    it('all resume paths in hreflang pairs should exist in STATIC_URLS', () => {
      const resumePaths = getAllResumePathsWithCvPairs();
      resumePaths.forEach(path => {
        expect(staticPaths).toContain(path);
      });
    });

    it('all CV paths in hreflang pairs should exist in STATIC_URLS', () => {
      const cvPaths = getAllCvPaths();
      cvPaths.forEach(path => {
        expect(staticPaths).toContain(path);
      });
    });
  });

  describe('Bidirectional hreflang completeness', () => {
    it('every CV page should have a corresponding resume page', () => {
      HREFLANG_PAIRS.forEach(pair => {
        expect(pair.resume).toBeDefined();
        expect(pair.resume.length).toBeGreaterThan(0);
      });
    });

    it('every resume page in pairs should have a corresponding CV page', () => {
      HREFLANG_PAIRS.forEach(pair => {
        expect(pair.cv).toBeDefined();
        expect(pair.cv.length).toBeGreaterThan(0);
      });
    });

    it('findHreflangPair should return same pair for both resume and cv paths', () => {
      HREFLANG_PAIRS.forEach(pair => {
        const foundByResume = findHreflangPair(pair.resume);
        const foundByCv = findHreflangPair(pair.cv);
        expect(foundByResume).toEqual(pair);
        expect(foundByCv).toEqual(pair);
        expect(foundByResume).toEqual(foundByCv);
      });
    });
  });

  describe('Region definitions', () => {
    it('should have CV regions defined', () => {
      expect(CV_REGIONS.length).toBeGreaterThan(0);
    });

    it('CV regions should be valid language-country codes', () => {
      CV_REGIONS.forEach(region => {
        expect(region).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
      });
    });

    it('should have RESUME_REGION defined as en-US', () => {
      expect(RESUME_REGION).toBe('en-US');
    });

    it('should have DEFAULT_REGION defined as x-default', () => {
      expect(DEFAULT_REGION).toBe('x-default');
    });

    it('should have no overlapping regions between CV and resume', () => {
      expect(CV_REGIONS).not.toContain(RESUME_REGION);
    });
  });

  describe('Expected hreflang pairs', () => {
    it('should include /templates ↔ /cv-templates pair', () => {
      const pair = findHreflangPair('/templates');
      expect(pair).toBeDefined();
      expect(pair?.cv).toBe('/cv-templates');
    });

    it('should include /templates/ats-friendly ↔ /cv-templates/ats-friendly pair', () => {
      const pair = findHreflangPair('/templates/ats-friendly');
      expect(pair).toBeDefined();
      expect(pair?.cv).toBe('/cv-templates/ats-friendly');
    });

    it('should include /free-resume-builder-no-sign-up ↔ /free-cv-builder-no-sign-up pair', () => {
      const pair = findHreflangPair('/free-resume-builder-no-sign-up');
      expect(pair).toBeDefined();
      expect(pair?.cv).toBe('/free-cv-builder-no-sign-up');
    });
  });
});
