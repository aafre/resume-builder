import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateJobPageTitle, generateJobPageDescription } from '../seoHelpers';
import type { JobKeywordsData } from '../../data/jobKeywords/types';

// Mock getTotalKeywordCount
vi.mock('../jobKeywordHelpers', () => ({
  getTotalKeywordCount: vi.fn(() => 42),
}));

import { getTotalKeywordCount } from '../jobKeywordHelpers';

const mockJob: JobKeywordsData = {
  slug: 'software-engineer',
  title: 'Software Engineer',
  keywords: {
    technical: ['Python', 'JavaScript', 'React', 'Node.js'],
    soft: ['Communication', 'Leadership'],
    tools: ['Git', 'Docker'],
    certifications: ['AWS Certified'],
    action_verbs: ['Developed', 'Implemented'],
  },
  industry: 'Technology',
  experience_level: 'mid',
} as JobKeywordsData;

describe('seoHelpers', () => {
  const realDate = Date;

  beforeEach(() => {
    // Mock current year
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateJobPageTitle', () => {
    it('generates title with job title and current year', () => {
      const title = generateJobPageTitle(mockJob);
      expect(title).toBe('Software Engineer Resume Keywords That Pass ATS Filters (2026)');
    });

    it('includes the exact job title as provided', () => {
      const customJob = { ...mockJob, title: 'Senior Data Scientist' };
      const title = generateJobPageTitle(customJob);
      expect(title).toContain('Senior Data Scientist');
    });
  });

  describe('generateJobPageDescription', () => {
    it('generates description with count, title, and top 3 skills', () => {
      const desc = generateJobPageDescription(mockJob);
      expect(desc).toBe(
        '42+ proven software engineer resume keywords including Python, JavaScript, React. Copy-paste ready skills organized by category to beat ATS screening. Updated 2026.'
      );
    });

    it('lowercases the job title', () => {
      const desc = generateJobPageDescription(mockJob);
      expect(desc).toContain('software engineer');
      expect(desc).not.toContain('Software Engineer');
    });

    it('includes only first 3 technical skills', () => {
      const desc = generateJobPageDescription(mockJob);
      expect(desc).toContain('Python, JavaScript, React');
      expect(desc).not.toContain('Node.js');
    });

    it('handles job with fewer than 3 technical skills', () => {
      const fewSkillsJob = {
        ...mockJob,
        keywords: { ...mockJob.keywords, technical: ['Python'] },
      };
      const desc = generateJobPageDescription(fewSkillsJob);
      expect(desc).toContain('including Python');
    });

    it('handles job with no technical skills', () => {
      const noSkillsJob = {
        ...mockJob,
        keywords: { ...mockJob.keywords, technical: [] },
      };
      const desc = generateJobPageDescription(noSkillsJob);
      expect(desc).not.toContain('including');
      expect(desc).toContain('42+ proven');
    });

    it('uses total keyword count from helper', () => {
      generateJobPageDescription(mockJob);
      expect(getTotalKeywordCount).toHaveBeenCalledWith(mockJob);
    });
  });
});
