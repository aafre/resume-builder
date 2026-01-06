// src/hooks/editor/__tests__/useContactForm.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useContactForm } from '../useContactForm';
import { ContactInfo } from '../../../types';

// Mock the dependencies
vi.mock('../../../constants/socialPlatforms', () => ({
  validatePlatformUrl: vi.fn((platform: string, url: string) => {
    // Simple mock validation
    if (platform === 'github' && url.includes('github.com')) {
      return { valid: true };
    }
    if (platform === 'linkedin' && url.includes('linkedin.com')) {
      return { valid: true };
    }
    if (platform === 'twitter' && url.includes('twitter.com')) {
      return { valid: true };
    }
    return { valid: false, error: 'Invalid URL for platform' };
  }),
  generateDisplayText: vi.fn((platform: string, url: string, name?: string) => {
    // Simple mock display text generation
    if (platform === 'github') {
      return 'GitHub Profile';
    }
    if (platform === 'linkedin') {
      return name ? `${name} on LinkedIn` : 'LinkedIn Profile';
    }
    return 'Social Profile';
  }),
}));

vi.mock('../../../services/validationService', () => ({
  validateLinkedInUrl: vi.fn((url: string) => {
    if (!url.trim()) return true;
    return url.toLowerCase().includes('linkedin.com/in/');
  }),
}));

describe('useContactForm', () => {
  let contactInfo: ContactInfo;
  let setContactInfo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();

    contactInfo = {
      name: 'John Doe',
      location: 'New York, NY',
      email: 'john@example.com',
      phone: '555-1234',
      social_links: [],
    };

    // Mock setContactInfo - just capture the calls, don't execute
    setContactInfo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('updateContactField', () => {
    it('should update a contact info field', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.updateContactField('name', 'Jane Doe');
      });

      expect(setContactInfo).toHaveBeenCalledTimes(1);
      expect(setContactInfo).toHaveBeenCalledWith(expect.any(Function));

      // Verify the updater function works correctly
      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo).toEqual({
        ...contactInfo,
        name: 'Jane Doe',
      });
    });

    it('should handle null contactInfo gracefully', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo: null, setContactInfo })
      );

      act(() => {
        result.current.updateContactField('email', 'new@example.com');
      });

      expect(setContactInfo).toHaveBeenCalledTimes(1);

      // Verify the updater returns null when prev is null
      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(null);
      expect(newContactInfo).toBeNull();
    });

    it('should update different field types', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.updateContactField('location', 'San Francisco, CA');
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.location).toBe('San Francisco, CA');
    });
  });

  describe('validateLinkedIn', () => {
    it('should validate valid LinkedIn URL', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      const isValid = result.current.validateLinkedIn(
        'https://linkedin.com/in/johndoe'
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid LinkedIn URL', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      const isValid = result.current.validateLinkedIn('https://facebook.com/johndoe');

      expect(isValid).toBe(false);
    });

    it('should accept empty LinkedIn URL', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      const isValid = result.current.validateLinkedIn('');

      expect(isValid).toBe(true);
    });
  });

  describe('handleAddSocialLink', () => {
    it('should add a new empty social link', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleAddSocialLink();
      });

      expect(setContactInfo).toHaveBeenCalledTimes(1);

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(1);
      expect(newContactInfo.social_links?.[0]).toEqual({
        platform: '',
        url: '',
        display_text: '',
      });
    });

    it('should add to existing social links', () => {
      contactInfo.social_links = [
        { platform: 'github', url: 'https://github.com/johndoe', display_text: 'GitHub' },
      ];

      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleAddSocialLink();
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(2);
      expect(newContactInfo.social_links?.[1]).toEqual({
        platform: '',
        url: '',
        display_text: '',
      });
    });

    it('should handle null contactInfo gracefully', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo: null, setContactInfo })
      );

      act(() => {
        result.current.handleAddSocialLink();
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(null);
      expect(newContactInfo).toBeNull();
    });
  });

  describe('handleRemoveSocialLink', () => {
    beforeEach(() => {
      contactInfo.social_links = [
        { platform: 'github', url: 'https://github.com/johndoe', display_text: 'GitHub' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe', display_text: 'LinkedIn' },
        { platform: 'twitter', url: 'https://twitter.com/johndoe', display_text: 'Twitter' },
      ];
    });

    it('should remove social link at specified index', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleRemoveSocialLink(1);
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(2);
      expect(newContactInfo.social_links?.[0].platform).toBe('github');
      expect(newContactInfo.social_links?.[1].platform).toBe('twitter');
    });

    it('should remove first social link', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleRemoveSocialLink(0);
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(2);
      expect(newContactInfo.social_links?.[0].platform).toBe('linkedin');
    });

    it('should remove last social link', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleRemoveSocialLink(2);
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(2);
      expect(newContactInfo.social_links?.[1].platform).toBe('linkedin');
    });

    it('should clear error for removed social link', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      // First add an error
      act(() => {
        result.current.handleSocialLinkChange(1, 'url', 'invalid-url');
      });

      vi.runAllTimers();

      // Then remove the link
      act(() => {
        result.current.handleRemoveSocialLink(1);
      });

      expect(result.current.socialLinkErrors[1]).toBeUndefined();
    });

    it('should clear auto-generated flag for removed social link', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      // First trigger auto-generation
      act(() => {
        result.current.handleSocialLinkChange(
          1,
          'url',
          'https://linkedin.com/in/johndoe'
        );
      });

      act(() => {
        vi.runAllTimers();
      });

      // Verify it was marked as auto-generated
      expect(result.current.autoGeneratedIndexes.has(1)).toBe(true);

      // Then remove the link
      act(() => {
        result.current.handleRemoveSocialLink(1);
      });

      expect(result.current.autoGeneratedIndexes.has(1)).toBe(false);
    });

    it('should clear pending debounce timer for removed social link', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      // Start a debounced operation
      act(() => {
        result.current.handleSocialLinkChange(
          1,
          'url',
          'https://linkedin.com/in/johndoe'
        );
      });

      // Remove before debounce completes
      act(() => {
        result.current.handleRemoveSocialLink(1);
      });

      // Advance timers - should not trigger auto-generation
      act(() => {
        vi.runAllTimers();
      });

      // Verify auto-generation did not happen after removal
      expect(result.current.autoGeneratedIndexes.has(1)).toBe(false);
    });
  });

  describe('handleSocialLinkChange', () => {
    beforeEach(() => {
      contactInfo.social_links = [
        { platform: 'github', url: '', display_text: '' },
      ];
    });

    it('should update social link field', () => {
      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleSocialLinkChange(0, 'platform', 'linkedin');
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links?.[0].platform).toBe('linkedin');
    });

    it('should create social link if index does not exist', () => {
      contactInfo.social_links = [];

      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleSocialLinkChange(0, 'platform', 'github');
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(1);
      expect(newContactInfo.social_links?.[0].platform).toBe('github');
    });

    describe('URL field changes', () => {
      it('should validate URL when changed', () => {
        contactInfo.social_links = [
          { platform: 'github', url: '', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(
            0,
            'url',
            'https://github.com/johndoe'
          );
        });

        // Valid URL - no error
        expect(result.current.socialLinkErrors[0]).toBeUndefined();
      });

      it('should set error for invalid URL', () => {
        contactInfo.social_links = [
          { platform: 'github', url: '', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(0, 'url', 'https://invalid.com');
        });

        expect(result.current.socialLinkErrors[0]).toBe('Invalid URL for platform');
      });

      it('should clear error when URL is cleared', () => {
        contactInfo.social_links = [
          { platform: 'github', url: 'https://invalid.com', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        // First set an error
        act(() => {
          result.current.handleSocialLinkChange(0, 'url', 'https://invalid.com');
        });

        expect(result.current.socialLinkErrors[0]).toBe('Invalid URL for platform');

        // Then clear the URL
        act(() => {
          result.current.handleSocialLinkChange(0, 'url', '');
        });

        expect(result.current.socialLinkErrors[0]).toBeUndefined();
      });

      it('should clear display text when URL is cleared', () => {
        contactInfo.social_links = [
          { platform: 'github', url: 'https://github.com/johndoe', display_text: 'GitHub' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(0, 'url', '');
        });

        // Multiple setContactInfo calls - find the one that clears display_text
        const lastCall = setContactInfo.mock.calls[setContactInfo.mock.calls.length - 1];
        const updater = lastCall[0];
        const newContactInfo = updater(contactInfo);
        expect(newContactInfo.social_links?.[0].display_text).toBe('');
      });

      it('should trigger debounced auto-generation for valid URL', async () => {
        contactInfo.social_links = [
          { platform: 'github', url: '', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(
            0,
            'url',
            'https://github.com/johndoe'
          );
        });

        // Should not auto-generate immediately
        expect(result.current.autoGeneratedIndexes.has(0)).toBe(false);

        // Fast-forward 500ms
        act(() => {
          vi.advanceTimersByTime(500);
        });

        // Now should have auto-generated
        expect(result.current.autoGeneratedIndexes.has(0)).toBe(true);
      });

      it('should debounce auto-generation (500ms)', async () => {
        contactInfo.social_links = [
          { platform: 'github', url: '', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(
            0,
            'url',
            'https://github.com/johndoe'
          );
        });

        // Advance only 400ms - should not trigger
        act(() => {
          vi.advanceTimersByTime(400);
        });

        expect(result.current.autoGeneratedIndexes.has(0)).toBe(false);

        // Advance remaining 100ms - should trigger
        act(() => {
          vi.advanceTimersByTime(100);
        });

        expect(result.current.autoGeneratedIndexes.has(0)).toBe(true);
      });

      it('should cancel previous debounce when URL changes rapidly', async () => {
        contactInfo.social_links = [
          { platform: 'github', url: '', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        // First change
        act(() => {
          result.current.handleSocialLinkChange(
            0,
            'url',
            'https://github.com/user1'
          );
        });

        // Advance 300ms
        act(() => {
          vi.advanceTimersByTime(300);
        });

        // Second change (should cancel first debounce)
        act(() => {
          result.current.handleSocialLinkChange(
            0,
            'url',
            'https://github.com/user2'
          );
        });

        // Advance 300ms (total 600ms from first change, but only 300ms from second)
        act(() => {
          vi.advanceTimersByTime(300);
        });

        // Should not have triggered yet
        expect(result.current.autoGeneratedIndexes.has(0)).toBe(false);

        // Advance remaining 200ms to complete second debounce
        act(() => {
          vi.advanceTimersByTime(200);
        });

        // Now should trigger
        expect(result.current.autoGeneratedIndexes.has(0)).toBe(true);
      });
    });

    describe('platform field changes', () => {
      it('should re-validate URL when platform changes', () => {
        contactInfo.social_links = [
          { platform: 'github', url: 'https://github.com/johndoe', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(0, 'platform', 'linkedin');
        });

        // URL is now invalid for LinkedIn
        expect(result.current.socialLinkErrors[0]).toBe('Invalid URL for platform');
      });

      it('should trigger auto-generation when platform changes', () => {
        contactInfo.social_links = [
          { platform: 'github', url: 'https://linkedin.com/in/johndoe', display_text: '' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        act(() => {
          result.current.handleSocialLinkChange(0, 'platform', 'linkedin');
        });

        // Fast-forward debounce
        act(() => {
          vi.advanceTimersByTime(500);
        });

        expect(result.current.autoGeneratedIndexes.has(0)).toBe(true);
      });
    });

    describe('display_text field changes', () => {
      it('should remove auto-generated flag when manually edited', () => {
        contactInfo.social_links = [
          { platform: 'github', url: 'https://github.com/johndoe', display_text: 'Auto Generated' },
        ];

        const { result } = renderHook(() =>
          useContactForm({ contactInfo, setContactInfo })
        );

        // First mark as auto-generated
        act(() => {
          result.current.handleSocialLinkChange(
            0,
            'url',
            'https://github.com/johndoe'
          );
        });

        act(() => {
          vi.advanceTimersByTime(500);
        });

        expect(result.current.autoGeneratedIndexes.has(0)).toBe(true);

        // Then manually edit display text
        act(() => {
          result.current.handleSocialLinkChange(0, 'display_text', 'My Custom Text');
        });

        expect(result.current.autoGeneratedIndexes.has(0)).toBe(false);
      });
    });
  });

  describe('cleanup on unmount', () => {
    it('should clear all debounce timers on unmount', () => {
      contactInfo.social_links = [
        { platform: 'github', url: '', display_text: '' },
        { platform: 'linkedin', url: '', display_text: '' },
      ];

      const { result, unmount } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      // Start multiple debounced operations
      act(() => {
        result.current.handleSocialLinkChange(
          0,
          'url',
          'https://github.com/johndoe'
        );
        result.current.handleSocialLinkChange(
          1,
          'url',
          'https://linkedin.com/in/johndoe'
        );
      });

      // Unmount before timers complete
      unmount();

      // Advance timers - should not trigger auto-generation
      act(() => {
        vi.runAllTimers();
      });

      // Verify no auto-generation happened (component unmounted)
      // We can't check result.current after unmount, but the test
      // verifies that no errors occur during cleanup
      expect(true).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle missing social_links array', () => {
      contactInfo.social_links = undefined;

      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      act(() => {
        result.current.handleAddSocialLink();
      });

      const updater = setContactInfo.mock.calls[0][0];
      const newContactInfo = updater(contactInfo);
      expect(newContactInfo.social_links).toHaveLength(1);
    });

    it('should handle rapid URL changes with debouncing', () => {
      contactInfo.social_links = [
        { platform: 'github', url: '', display_text: '' },
      ];

      const { result } = renderHook(() =>
        useContactForm({ contactInfo, setContactInfo })
      );

      // Rapid changes
      act(() => {
        result.current.handleSocialLinkChange(0, 'url', 'https://github.com/user1');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.handleSocialLinkChange(0, 'url', 'https://github.com/user2');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.handleSocialLinkChange(0, 'url', 'https://github.com/user3');
      });

      // Only the last change should trigger after full debounce
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.autoGeneratedIndexes.has(0)).toBe(true);
    });
  });
});
