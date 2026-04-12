import { describe, it, expect } from 'vitest';
import {
  getMatchingExampleSlug,
  getMatchingKeywordSlug,
  getKeywordJobTitle,
  getExampleJobTitle,
} from '../crossLinkHelpers';

describe('crossLinkHelpers', () => {
  describe('getMatchingExampleSlug', () => {
    it('returns override slug for known keyword-to-example overrides', () => {
      expect(getMatchingExampleSlug('frontend-developer')).toBe('front-end-developer');
    });

    it('returns override slug for nursing → registered-nurse', () => {
      expect(getMatchingExampleSlug('nursing')).toBe('registered-nurse');
    });

    it('returns direct match when slug exists in examples database', () => {
      // "software-engineer" exists in both databases with the same slug
      expect(getMatchingExampleSlug('software-engineer')).toBe('software-engineer');
    });

    it('returns null for non-existent keyword slug', () => {
      expect(getMatchingExampleSlug('nonexistent-job-slug-xyz')).toBeNull();
    });
  });

  describe('getMatchingKeywordSlug', () => {
    it('returns override slug for known example-to-keyword overrides', () => {
      expect(getMatchingKeywordSlug('front-end-developer')).toBe('frontend-developer');
    });

    it('returns override slug for registered-nurse → nursing', () => {
      expect(getMatchingKeywordSlug('registered-nurse')).toBe('nursing');
    });

    it('returns direct match when slug exists in keywords database', () => {
      expect(getMatchingKeywordSlug('software-engineer')).toBe('software-engineer');
    });

    it('returns null for non-existent example slug', () => {
      expect(getMatchingKeywordSlug('nonexistent-example-slug-xyz')).toBeNull();
    });
  });

  describe('getKeywordJobTitle', () => {
    it('returns title for existing keyword slug', () => {
      const title = getKeywordJobTitle('software-engineer');
      expect(title).toBeTruthy();
      expect(typeof title).toBe('string');
    });

    it('returns null for non-existent slug', () => {
      expect(getKeywordJobTitle('nonexistent-slug-xyz')).toBeNull();
    });
  });

  describe('getExampleJobTitle', () => {
    it('returns title for existing example slug', () => {
      const title = getExampleJobTitle('software-engineer');
      expect(title).toBeTruthy();
      expect(typeof title).toBe('string');
    });

    it('returns null for non-existent slug', () => {
      expect(getExampleJobTitle('nonexistent-slug-xyz')).toBeNull();
    });
  });

  describe('bidirectional consistency', () => {
    it('overrides are bidirectional (keyword→example and example→keyword)', () => {
      // frontend-developer → front-end-developer
      expect(getMatchingExampleSlug('frontend-developer')).toBe('front-end-developer');
      expect(getMatchingKeywordSlug('front-end-developer')).toBe('frontend-developer');
    });
  });
});
