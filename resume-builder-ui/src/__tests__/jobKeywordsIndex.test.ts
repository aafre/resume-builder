/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import {
  getJobBySlug,
  getAllJobSlugs,
  getJobsByCategory,
  getTotalJobCount,
  searchJobsByTitle,
  JOBS_DATABASE,
} from '../data/jobKeywords';

describe('jobKeywords index (data access helpers)', () => {
  describe('JOBS_DATABASE', () => {
    it('should have 15 jobs', () => {
      expect(JOBS_DATABASE).toHaveLength(15);
    });

    it('should have all jobs with required fields', () => {
      JOBS_DATABASE.forEach(job => {
        expect(job).toHaveProperty('slug');
        expect(job).toHaveProperty('title');
        expect(job).toHaveProperty('metaTitle');
        expect(job).toHaveProperty('metaDescription');
        expect(job).toHaveProperty('category');
        expect(job).toHaveProperty('priority');
        expect(job).toHaveProperty('keywords');
        expect(job.keywords).toHaveProperty('core');
        expect(job.keywords).toHaveProperty('technical');
      });
    });

    it('should have unique slugs', () => {
      const slugs = JOBS_DATABASE.map(job => job.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('should have valid categories for all jobs', () => {
      const validCategories = ['technology', 'healthcare', 'business', 'creative', 'trades', 'education'];
      JOBS_DATABASE.forEach(job => {
        expect(validCategories).toContain(job.category);
      });
    });
  });

  describe('getJobBySlug', () => {
    it('should return job for valid slug', () => {
      const job = getJobBySlug('software-engineer');

      expect(job).toBeDefined();
      expect(job?.slug).toBe('software-engineer');
      expect(job?.title).toBe('Software Engineer');
    });

    it('should return undefined for invalid slug', () => {
      const job = getJobBySlug('nonexistent-job');

      expect(job).toBeUndefined();
    });

    it('should return correct job for each of the 10 jobs', () => {
      const expectedJobs = [
        'software-engineer',
        'data-scientist',
        'product-manager',
        'frontend-developer',
        'backend-developer',
        'full-stack-developer',
        'devops-engineer',
        'data-analyst',
        'ux-designer',
        'project-manager',
      ];

      expectedJobs.forEach(slug => {
        const job = getJobBySlug(slug);
        expect(job).toBeDefined();
        expect(job?.slug).toBe(slug);
      });
    });

    it('should be case-sensitive', () => {
      const job = getJobBySlug('Software-Engineer'); // Wrong case
      expect(job).toBeUndefined();
    });
  });

  describe('getAllJobSlugs', () => {
    it('should return array of 15 slugs', () => {
      const slugs = getAllJobSlugs();

      expect(slugs).toHaveLength(15);
      expect(Array.isArray(slugs)).toBe(true);
    });

    it('should return all expected slugs', () => {
      const slugs = getAllJobSlugs();

      expect(slugs).toContain('software-engineer');
      expect(slugs).toContain('data-scientist');
      expect(slugs).toContain('product-manager');
      expect(slugs).toContain('frontend-developer');
      expect(slugs).toContain('backend-developer');
      expect(slugs).toContain('full-stack-developer');
      expect(slugs).toContain('devops-engineer');
      expect(slugs).toContain('data-analyst');
      expect(slugs).toContain('ux-designer');
      expect(slugs).toContain('project-manager');
      expect(slugs).toContain('registered-nurse');
      expect(slugs).toContain('marketing-manager');
      expect(slugs).toContain('financial-analyst');
      expect(slugs).toContain('teacher');
      expect(slugs).toContain('sales-representative');
    });

    it('should return strings', () => {
      const slugs = getAllJobSlugs();

      slugs.forEach(slug => {
        expect(typeof slug).toBe('string');
      });
    });
  });

  describe('getJobsByCategory', () => {
    it('should return technology jobs', () => {
      const jobs = getJobsByCategory('technology');

      expect(jobs.length).toBeGreaterThan(0);
      jobs.forEach(job => {
        expect(job.category).toBe('technology');
      });
    });

    it('should return jobs for all populated categories', () => {
      const healthcareJobs = getJobsByCategory('healthcare');
      const businessJobs = getJobsByCategory('business');
      const educationJobs = getJobsByCategory('education');

      expect(healthcareJobs.length).toBeGreaterThan(0);
      expect(businessJobs.length).toBeGreaterThan(0);
      expect(educationJobs.length).toBeGreaterThan(0);
    });

    it('should return jobs with correct category', () => {
      const jobs = getJobsByCategory('technology');

      jobs.forEach(job => {
        expect(job.category).toBe('technology');
      });
    });
  });

  describe('getTotalJobCount', () => {
    it('should return 15', () => {
      const count = getTotalJobCount();

      expect(count).toBe(15);
    });

    it('should match JOBS_DATABASE length', () => {
      const count = getTotalJobCount();

      expect(count).toBe(JOBS_DATABASE.length);
    });
  });

  describe('searchJobsByTitle', () => {
    it('should find jobs by partial title match', () => {
      const results = searchJobsByTitle('Engineer');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(job => {
        expect(job.title.toLowerCase()).toContain('engineer');
      });
    });

    it('should be case-insensitive', () => {
      const lowerResults = searchJobsByTitle('engineer');
      const upperResults = searchJobsByTitle('ENGINEER');
      const mixedResults = searchJobsByTitle('Engineer');

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });

    it('should return empty array for no matches', () => {
      const results = searchJobsByTitle('NonexistentJob');

      expect(results).toHaveLength(0);
    });

    it('should find specific jobs', () => {
      const softwareResults = searchJobsByTitle('Software');
      const dataResults = searchJobsByTitle('Data');
      const uxResults = searchJobsByTitle('UX');

      expect(softwareResults).toHaveLength(1);
      expect(softwareResults[0].slug).toBe('software-engineer');

      expect(dataResults).toHaveLength(2); // Data Scientist, Data Analyst
      expect(uxResults).toHaveLength(1);
      expect(uxResults[0].slug).toBe('ux-designer');
    });

    it('should find exact title match', () => {
      const results = searchJobsByTitle('Product Manager');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Product Manager');
    });
  });
});
