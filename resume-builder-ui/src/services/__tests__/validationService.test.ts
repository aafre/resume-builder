// src/services/__tests__/validationService.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateLinkedInUrl,
  validatePlatformUrl,
  validateIconSize,
  validateYAMLStructure,
} from '../validationService';

describe('validationService', () => {
  describe('validateLinkedInUrl', () => {
    it('should return true for empty string', () => {
      expect(validateLinkedInUrl('')).toBe(true);
    });

    it('should return true for whitespace-only string', () => {
      expect(validateLinkedInUrl('   ')).toBe(true);
    });

    it('should validate basic linkedin.com/in/ format', () => {
      expect(validateLinkedInUrl('linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate www.linkedin.com/in/ format', () => {
      expect(validateLinkedInUrl('www.linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate https://linkedin.com/in/ format', () => {
      expect(validateLinkedInUrl('https://linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate http://www.linkedin.com/in/ format', () => {
      expect(validateLinkedInUrl('http://www.linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate country code subdomain (uk.linkedin.com)', () => {
      expect(validateLinkedInUrl('uk.linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate country code subdomain (ca.linkedin.com)', () => {
      expect(validateLinkedInUrl('ca.linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate mobile subdomain', () => {
      expect(validateLinkedInUrl('mobile.linkedin.com/in/johndoe')).toBe(true);
    });

    it('should validate /pub/ path format', () => {
      expect(validateLinkedInUrl('linkedin.com/pub/johndoe')).toBe(true);
    });

    it('should validate /public-profile/in/ format', () => {
      expect(validateLinkedInUrl('linkedin.com/public-profile/in/johndoe')).toBe(true);
    });

    it('should validate /public-profile/pub/ format', () => {
      expect(validateLinkedInUrl('linkedin.com/public-profile/pub/johndoe')).toBe(true);
    });

    it('should validate with trailing slash', () => {
      expect(validateLinkedInUrl('linkedin.com/in/johndoe/')).toBe(true);
    });

    it('should validate usernames with hyphens', () => {
      expect(validateLinkedInUrl('linkedin.com/in/john-doe')).toBe(true);
    });

    it('should validate usernames with numbers', () => {
      expect(validateLinkedInUrl('linkedin.com/in/johndoe123')).toBe(true);
    });

    it('should validate minimum username length (3 chars)', () => {
      expect(validateLinkedInUrl('linkedin.com/in/abc')).toBe(true);
    });

    it('should validate maximum username length (100 chars)', () => {
      const longUsername = 'a'.repeat(100);
      expect(validateLinkedInUrl(`linkedin.com/in/${longUsername}`)).toBe(true);
    });

    it('should handle case-insensitive URLs', () => {
      expect(validateLinkedInUrl('LINKEDIN.COM/IN/JOHNDOE')).toBe(true);
      expect(validateLinkedInUrl('LinkedIn.com/In/JohnDoe')).toBe(true);
    });

    it('should reject username shorter than 3 characters', () => {
      expect(validateLinkedInUrl('linkedin.com/in/ab')).toBe(false);
    });

    it('should reject username longer than 100 characters', () => {
      const tooLongUsername = 'a'.repeat(101);
      expect(validateLinkedInUrl(`linkedin.com/in/${tooLongUsername}`)).toBe(false);
    });

    it('should reject non-LinkedIn URLs', () => {
      expect(validateLinkedInUrl('https://google.com')).toBe(false);
      expect(validateLinkedInUrl('https://facebook.com/johndoe')).toBe(false);
    });

    it('should reject malformed LinkedIn URLs', () => {
      expect(validateLinkedInUrl('linkedin.com')).toBe(false);
      expect(validateLinkedInUrl('linkedin.com/johndoe')).toBe(false);
      expect(validateLinkedInUrl('linkedin.com/profile/johndoe')).toBe(false);
    });

    it('should reject LinkedIn company pages', () => {
      expect(validateLinkedInUrl('linkedin.com/company/acme')).toBe(false);
    });

    it('should reject URLs with invalid characters in username', () => {
      expect(validateLinkedInUrl('linkedin.com/in/john@doe')).toBe(false);
      expect(validateLinkedInUrl('linkedin.com/in/john.doe')).toBe(false);
      expect(validateLinkedInUrl('linkedin.com/in/john doe')).toBe(false);
      expect(validateLinkedInUrl('linkedin.com/in/john_doe')).toBe(false);
    });

    it('should reject URLs without /in/ or /pub/ path', () => {
      expect(validateLinkedInUrl('linkedin.com/johndoe')).toBe(false);
    });
  });

  describe('validatePlatformUrl', () => {
    it('should return valid for empty URL (optional field)', () => {
      const result = validatePlatformUrl('github', '');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for whitespace-only URL', () => {
      const result = validatePlatformUrl('github', '   ');
      expect(result.valid).toBe(true);
    });

    it('should validate GitHub URLs', () => {
      expect(validatePlatformUrl('github', 'github.com/user').valid).toBe(true);
      expect(validatePlatformUrl('github', 'https://github.com/user').valid).toBe(true);
      expect(validatePlatformUrl('github', 'www.github.com/user').valid).toBe(true);
    });

    it('should validate Twitter URLs', () => {
      expect(validatePlatformUrl('twitter', 'twitter.com/user').valid).toBe(true);
      expect(validatePlatformUrl('twitter', 'x.com/user').valid).toBe(true);
    });

    it('should validate LinkedIn URLs', () => {
      expect(validatePlatformUrl('linkedin', 'linkedin.com/in/user').valid).toBe(true);
      expect(validatePlatformUrl('linkedin', 'linkedin.com/pub/user').valid).toBe(true);
    });

    it('should validate website URLs', () => {
      expect(validatePlatformUrl('website', 'example.com').valid).toBe(true);
      expect(validatePlatformUrl('website', 'https://example.com/path').valid).toBe(true);
    });

    it('should reject invalid GitHub URLs', () => {
      const result = validatePlatformUrl('github', 'not-a-github-url');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid Twitter URLs', () => {
      const result = validatePlatformUrl('twitter', 'invalid.com/user');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid Twitter/X profile URL');
    });

    it('should return error for unknown platform', () => {
      const result = validatePlatformUrl('unknown-platform', 'https://example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Unknown platform');
    });

    it('should handle case-insensitive URLs', () => {
      expect(validatePlatformUrl('github', 'GITHUB.COM/USER').valid).toBe(true);
    });

    it('should trim whitespace from URLs', () => {
      expect(validatePlatformUrl('github', '  github.com/user  ').valid).toBe(true);
    });
  });

  describe('validateIconSize', () => {
    // Helper function to create mock File objects
    const createMockFile = (sizeInKB: number): File => {
      const sizeInBytes = sizeInKB * 1024;
      const content = new Array(sizeInBytes).fill('a').join('');
      return new File([content], 'test.png', { type: 'image/png' });
    };

    it('should return valid for file under 500KB', () => {
      const file = createMockFile(100); // 100KB
      const result = validateIconSize(file);

      expect(result.valid).toBe(true);
      expect(result.sizeKB).toBe(100);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for file exactly 500KB', () => {
      const file = createMockFile(500); // 500KB
      const result = validateIconSize(file);

      expect(result.valid).toBe(true);
      expect(result.sizeKB).toBe(500);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for file over 500KB', () => {
      const file = createMockFile(501); // 501KB
      const result = validateIconSize(file);

      expect(result.valid).toBe(false);
      expect(result.sizeKB).toBe(501);
      expect(result.error).toBe('File size (501KB) exceeds maximum allowed size of 500KB');
    });

    it('should return invalid for file much larger than 500KB', () => {
      const file = createMockFile(1000); // 1MB
      const result = validateIconSize(file);

      expect(result.valid).toBe(false);
      expect(result.sizeKB).toBe(1000);
      expect(result.error).toContain('File size (1000KB) exceeds maximum allowed size of 500KB');
    });

    it('should handle very small files (< 1KB)', () => {
      const file = new File(['small'], 'test.png', { type: 'image/png' });
      const result = validateIconSize(file);

      expect(result.valid).toBe(true);
      expect(result.sizeKB).toBeLessThan(1);
    });

    it('should always include sizeKB in result', () => {
      const file = createMockFile(250);
      const result = validateIconSize(file);

      expect(result).toHaveProperty('sizeKB');
      expect(typeof result.sizeKB).toBe('number');
    });

    it('should round file size to nearest KB', () => {
      // Create a file with 250.5KB (256512 bytes)
      const file = new File([new Array(256512).fill('a').join('')], 'test.png');
      const result = validateIconSize(file);

      // Should round 250.5KB to 251KB
      expect(result.sizeKB).toBe(251);
    });
  });

  describe('validateYAMLStructure', () => {
    it('should return valid for correct YAML structure', () => {
      const data = {
        contact_info: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        sections: [
          {
            name: 'Experience',
            type: 'experience',
            content: []
          }
        ]
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for null data', () => {
      const result = validateYAMLStructure(null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid YAML data: expected an object');
    });

    it('should return invalid for undefined data', () => {
      const result = validateYAMLStructure(undefined);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid YAML data: expected an object');
    });

    it('should return invalid for non-object data (string)', () => {
      const result = validateYAMLStructure('not an object');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid YAML data: expected an object');
    });

    it('should return invalid for non-object data (number)', () => {
      const result = validateYAMLStructure(123);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid YAML data: expected an object');
    });

    it('should return invalid for missing contact_info', () => {
      const data = {
        sections: []
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing required field: contact_info');
    });

    it('should return invalid for missing sections', () => {
      const data = {
        contact_info: {
          name: 'John Doe'
        }
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing required field: sections');
    });

    it('should return invalid for non-array sections (string)', () => {
      const data = {
        contact_info: { name: 'John' },
        sections: 'not an array'
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field "sections" must be an array');
    });

    it('should return invalid for non-array sections (object)', () => {
      const data = {
        contact_info: { name: 'John' },
        sections: { name: 'Experience' }
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field "sections" must be an array');
    });

    it('should return valid for empty sections array', () => {
      const data = {
        contact_info: { name: 'John' },
        sections: []
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(true);
    });

    it('should return valid for empty object data structure', () => {
      const data = {
        contact_info: {},
        sections: []
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(true);
    });

    it('should return valid even with extra fields', () => {
      const data = {
        contact_info: { name: 'John' },
        sections: [],
        extra_field: 'this is ignored',
        another_field: 123
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(true);
    });

    it('should handle complex nested sections', () => {
      const data = {
        contact_info: {
          name: 'John Doe',
          email: 'john@example.com',
          social_links: [
            { platform: 'github', url: 'github.com/john' }
          ]
        },
        sections: [
          {
            name: 'Experience',
            type: 'experience',
            content: [
              {
                company: 'ACME Corp',
                title: 'Senior Engineer',
                dates: '2020-Present',
                description: ['Built things']
              }
            ]
          },
          {
            name: 'Education',
            type: 'education',
            content: []
          }
        ]
      };

      const result = validateYAMLStructure(data);

      expect(result.valid).toBe(true);
    });
  });
});
