/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import {
  generateJobFAQs,
  generateBeforeAfterExample,
  getTotalKeywordCount,
  getCategoryKeywordCount,
} from '../utils/jobKeywordHelpers';
import { softwareEngineer } from '../data/jobKeywords/jobs/software-engineer';
import { dataScientist } from '../data/jobKeywords/jobs/data-scientist';

describe('jobKeywordHelpers', () => {
  describe('generateJobFAQs', () => {
    it('should generate 6 FAQs for software engineer', () => {
      const faqs = generateJobFAQs(softwareEngineer);
      expect(faqs).toHaveLength(6);
    });

    it('should include job title in questions', () => {
      const faqs = generateJobFAQs(softwareEngineer);
      expect(faqs[0].question).toContain('Software Engineer');
      expect(faqs[1].question).toContain('Software Engineer');
    });

    it('should include specific keywords from job data in answers', () => {
      const faqs = generateJobFAQs(softwareEngineer);
      const firstAnswer = faqs[0].answer;

      // Should mention at least one core skill
      const hasCoreSkill = softwareEngineer.keywords.core.some(skill =>
        firstAnswer.includes(skill)
      );
      expect(hasCoreSkill).toBe(true);
    });

    it('should generate different FAQs for different jobs', () => {
      const sweFaqs = generateJobFAQs(softwareEngineer);
      const dsFaqs = generateJobFAQs(dataScientist);

      // Questions should be different
      expect(sweFaqs[0].question).not.toBe(dsFaqs[0].question);
      expect(sweFaqs[0].answer).not.toBe(dsFaqs[0].answer);
    });

    it('should handle jobs with certifications', () => {
      const faqs = generateJobFAQs(softwareEngineer);
      const certFaq = faqs.find(faq => faq.question.includes('certification'));

      expect(certFaq).toBeDefined();
      expect(certFaq?.answer).toContain(softwareEngineer.keywords.certifications![0]);
    });

    it('should handle jobs without certifications', () => {
      const jobWithoutCerts = { ...softwareEngineer, keywords: { ...softwareEngineer.keywords, certifications: undefined } };
      const faqs = generateJobFAQs(jobWithoutCerts);

      expect(faqs).toHaveLength(6);
      // Should still have certification FAQ but with generic answer
      const certFaq = faqs.find(faq => faq.question.includes('certification'));
      expect(certFaq).toBeDefined();
    });
  });

  describe('generateBeforeAfterExample', () => {
    it('should return before and after examples', () => {
      const example = generateBeforeAfterExample(softwareEngineer);

      expect(example).toHaveProperty('before');
      expect(example).toHaveProperty('after');
      expect(example.before).toBeTruthy();
      expect(example.after).toBeTruthy();
    });

    it('should include job-specific technical skills in after example', () => {
      const example = generateBeforeAfterExample(softwareEngineer);

      // Should mention at least one technical skill
      const hasTechSkill = softwareEngineer.keywords.technical.some(skill =>
        example.after.includes(skill)
      );
      expect(hasTechSkill).toBe(true);
    });

    it('should include processes in after example if available', () => {
      const example = generateBeforeAfterExample(softwareEngineer);

      // Should mention at least one process
      const hasProcess = softwareEngineer.keywords.processes?.some(process =>
        example.after.includes(process)
      );
      expect(hasProcess).toBe(true);
    });

    it('should be different for different jobs', () => {
      const sweExample = generateBeforeAfterExample(softwareEngineer);
      const dsExample = generateBeforeAfterExample(dataScientist);

      expect(sweExample.after).not.toBe(dsExample.after);
    });
  });

  describe('getTotalKeywordCount', () => {
    it('should calculate total keywords correctly for software engineer', () => {
      const count = getTotalKeywordCount(softwareEngineer);

      const expected =
        softwareEngineer.keywords.core.length +
        softwareEngineer.keywords.technical.length +
        (softwareEngineer.keywords.certifications?.length || 0) +
        (softwareEngineer.keywords.metrics?.length || 0) +
        (softwareEngineer.keywords.processes?.length || 0);

      expect(count).toBe(expected);
    });

    it('should return count greater than 20 for software engineer', () => {
      const count = getTotalKeywordCount(softwareEngineer);
      expect(count).toBeGreaterThan(20);
    });

    it('should handle jobs without optional keyword categories', () => {
      const minimalJob = {
        ...softwareEngineer,
        keywords: {
          core: ['Skill 1', 'Skill 2'],
          technical: ['Tech 1', 'Tech 2', 'Tech 3'],
        },
      };

      const count = getTotalKeywordCount(minimalJob);
      expect(count).toBe(5); // 2 core + 3 technical
    });
  });

  describe('getCategoryKeywordCount', () => {
    it('should return correct count for core keywords', () => {
      const count = getCategoryKeywordCount(softwareEngineer, 'core');
      expect(count).toBe(softwareEngineer.keywords.core.length);
    });

    it('should return correct count for technical keywords', () => {
      const count = getCategoryKeywordCount(softwareEngineer, 'technical');
      expect(count).toBe(softwareEngineer.keywords.technical.length);
    });

    it('should return correct count for processes', () => {
      const count = getCategoryKeywordCount(softwareEngineer, 'processes');
      expect(count).toBe(softwareEngineer.keywords.processes?.length || 0);
    });

    it('should return 0 for missing optional categories', () => {
      const count = getCategoryKeywordCount(softwareEngineer, 'metrics');
      expect(count).toBe(0);
    });
  });
});
