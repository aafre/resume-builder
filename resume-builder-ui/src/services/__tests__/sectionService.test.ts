// src/services/__tests__/sectionService.test.ts
import { describe, it, expect } from 'vitest';
import {
  getUniqueDefaultName,
  createDefaultSection,
  deleteSectionItem,
  reorderSectionItems,
} from '../sectionService';
import { Section } from '../../types';

describe('sectionService', () => {
  describe('getUniqueDefaultName', () => {
    it('should return base name when unique', () => {
      const sections: Section[] = [
        { name: 'Experience', type: 'experience', content: [] },
      ];

      const name = getUniqueDefaultName('education', sections);

      expect(name).toBe('New Education Section');
    });

    it('should append number when duplicate exists', () => {
      const sections: Section[] = [
        { name: 'New Experience Section', type: 'experience', content: [] },
      ];

      const name = getUniqueDefaultName('experience', sections);

      expect(name).toBe('New Experience Section 2');
    });

    it('should handle multiple duplicates', () => {
      const sections: Section[] = [
        { name: 'New Experience Section', type: 'experience', content: [] },
        { name: 'New Experience Section 2', type: 'experience', content: [] },
        { name: 'New Experience Section 3', type: 'experience', content: [] },
      ];

      const name = getUniqueDefaultName('experience', sections);

      expect(name).toBe('New Experience Section 4');
    });

    it('should be case-insensitive when checking duplicates', () => {
      const sections: Section[] = [
        { name: 'NEW EXPERIENCE SECTION', type: 'experience', content: [] },
      ];

      const name = getUniqueDefaultName('experience', sections);

      expect(name).toBe('New Experience Section 2');
    });

    it('should handle mixed case section names', () => {
      const sections: Section[] = [
        { name: 'New Experience Section', type: 'experience', content: [] },
        { name: 'new experience section 2', type: 'experience', content: [] },
        { name: 'NEW EXPERIENCE SECTION 3', type: 'experience', content: [] },
      ];

      const name = getUniqueDefaultName('experience', sections);

      expect(name).toBe('New Experience Section 4');
    });

    it('should return default "New Section" for unknown type', () => {
      const sections: Section[] = [];

      const name = getUniqueDefaultName('unknown-type', sections);

      expect(name).toBe('New Section');
    });

    it('should handle all known section types', () => {
      const sections: Section[] = [];

      expect(getUniqueDefaultName('experience', sections)).toBe('New Experience Section');
      expect(getUniqueDefaultName('education', sections)).toBe('New Education Section');
      expect(getUniqueDefaultName('text', sections)).toBe('New Text Section');
      expect(getUniqueDefaultName('bulleted-list', sections)).toBe('New Bulleted List Section');
      expect(getUniqueDefaultName('inline-list', sections)).toBe('New Inline List Section');
      expect(getUniqueDefaultName('dynamic-column-list', sections)).toBe('New Dynamic Column List Section');
      expect(getUniqueDefaultName('icon-list', sections)).toBe('New Icon List Section');
    });

    it('should handle empty sections array', () => {
      const name = getUniqueDefaultName('experience', []);

      expect(name).toBe('New Experience Section');
    });
  });

  describe('createDefaultSection', () => {
    it('should create experience section with default content', () => {
      const section = createDefaultSection('experience', []);

      expect(section.type).toBe('experience');
      expect(section.name).toBe('New Experience Section');
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content).toHaveLength(1);
      expect(section.content[0]).toEqual({
        company: '',
        title: '',
        dates: '',
        description: [''],
        icon: null,
      });
    });

    it('should create education section with default content', () => {
      const section = createDefaultSection('education', []);

      expect(section.type).toBe('education');
      expect(section.name).toBe('New Education Section');
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content).toHaveLength(1);
      expect(section.content[0]).toEqual({
        degree: '',
        school: '',
        year: '',
        field_of_study: '',
        icon: null,
      });
    });

    it('should create text section with empty string content', () => {
      const section = createDefaultSection('text', []);

      expect(section.type).toBe('text');
      expect(section.name).toBe('New Text Section');
      expect(section.content).toBe('');
    });

    it('should create bulleted-list section with empty array', () => {
      const section = createDefaultSection('bulleted-list', []);

      expect(section.type).toBe('bulleted-list');
      expect(section.name).toBe('New Bulleted List Section');
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content).toHaveLength(0);
    });

    it('should create inline-list section with empty array', () => {
      const section = createDefaultSection('inline-list', []);

      expect(section.type).toBe('inline-list');
      expect(section.name).toBe('New Inline List Section');
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content).toHaveLength(0);
    });

    it('should create dynamic-column-list section with empty array', () => {
      const section = createDefaultSection('dynamic-column-list', []);

      expect(section.type).toBe('dynamic-column-list');
      expect(section.name).toBe('New Dynamic Column List Section');
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content).toHaveLength(0);
    });

    it('should create icon-list section with empty array', () => {
      const section = createDefaultSection('icon-list', []);

      expect(section.type).toBe('icon-list');
      expect(section.name).toBe('New Icon List Section');
      expect(Array.isArray(section.content)).toBe(true);
      expect(section.content).toHaveLength(0);
    });

    it('should generate unique name when creating duplicate type', () => {
      const existingSections: Section[] = [
        { name: 'New Experience Section', type: 'experience', content: [] },
      ];

      const section = createDefaultSection('experience', existingSections);

      expect(section.name).toBe('New Experience Section 2');
    });

    it('should handle unknown section type with empty string content', () => {
      const section = createDefaultSection('unknown-type', []);

      expect(section.type).toBe('unknown-type');
      expect(section.name).toBe('New Section');
      expect(section.content).toBe('');
    });
  });

  describe('deleteSectionItem', () => {
    it('should remove correct item at index', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
          { company: 'Company C', title: 'Title C', dates: '2022-2023', description: [], icon: null },
        ],
      };

      const result = deleteSectionItem(section, 1);

      expect(result.content).toHaveLength(2);
      expect(result.content[0]).toEqual(section.content[0]);
      expect(result.content[1]).toEqual(section.content[2]);
    });

    it('should return new section object (immutable)', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
        ],
      };

      const result = deleteSectionItem(section, 0);

      expect(result).not.toBe(section);
      expect(result.content).not.toBe(section.content);
      expect(section.content).toHaveLength(2); // Original unchanged
    });

    it('should handle deletion from empty array', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [],
      };

      const result = deleteSectionItem(section, 0);

      expect(result.content).toHaveLength(0);
    });

    it('should handle deletion of first item', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
        ],
      };

      const result = deleteSectionItem(section, 0);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual(section.content[1]);
    });

    it('should handle deletion of last item', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
        ],
      };

      const result = deleteSectionItem(section, 1);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual(section.content[0]);
    });

    it('should handle non-array content gracefully', () => {
      const section: Section = {
        name: 'Text Section',
        type: 'text',
        content: 'Some text content',
      };

      const result = deleteSectionItem(section, 0);

      expect(result).toEqual(section);
      expect(result.content).toBe('Some text content');
    });

    it('should handle out of bounds index', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
        ],
      };

      const result = deleteSectionItem(section, 5);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual(section.content[0]);
    });

    it('should handle negative index', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
        ],
      };

      const result = deleteSectionItem(section, -1);

      // Negative indices in filter callback won't match, so all items remain
      expect(result.content).toHaveLength(2);
    });
  });

  describe('reorderSectionItems', () => {
    it('should move item from oldIndex to newIndex', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
          { company: 'Company C', title: 'Title C', dates: '2022-2023', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 0, 2);

      expect(result.content).toHaveLength(3);
      expect(result.content[0]).toEqual(section.content[1]); // Company B
      expect(result.content[1]).toEqual(section.content[2]); // Company C
      expect(result.content[2]).toEqual(section.content[0]); // Company A
    });

    it('should handle moving first item to last', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
          { company: 'Company C', title: 'Title C', dates: '2022-2023', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 0, 2);

      expect(result.content[2]).toEqual(section.content[0]);
    });

    it('should handle moving last item to first', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
          { company: 'Company C', title: 'Title C', dates: '2022-2023', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 2, 0);

      expect(result.content[0]).toEqual(section.content[2]);
      expect(result.content[1]).toEqual(section.content[0]);
      expect(result.content[2]).toEqual(section.content[1]);
    });

    it('should be no-op when indices are equal', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 1, 1);

      expect(result).toEqual(section);
      expect(result.content).toEqual(section.content);
    });

    it('should return new section object (immutable)', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 0, 1);

      expect(result).not.toBe(section);
      expect(result.content).not.toBe(section.content);
      expect(section.content[0]).toEqual({ company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null });
    });

    it('should handle non-array content gracefully', () => {
      const section: Section = {
        name: 'Text Section',
        type: 'text',
        content: 'Some text content',
      };

      const result = reorderSectionItems(section, 0, 1);

      expect(result).toEqual(section);
    });

    it('should handle empty array', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [],
      };

      const result = reorderSectionItems(section, 0, 1);

      expect(result.content).toHaveLength(0);
    });

    it('should handle single item array', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 0, 0);

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual(section.content[0]);
    });

    it('should handle moving item down by one position', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
          { company: 'Company C', title: 'Title C', dates: '2022-2023', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 0, 1);

      expect(result.content[0]).toEqual(section.content[1]); // Company B
      expect(result.content[1]).toEqual(section.content[0]); // Company A
      expect(result.content[2]).toEqual(section.content[2]); // Company C
    });

    it('should handle moving item up by one position', () => {
      const section: Section = {
        name: 'Experience',
        type: 'experience',
        content: [
          { company: 'Company A', title: 'Title A', dates: '2020-2021', description: [], icon: null },
          { company: 'Company B', title: 'Title B', dates: '2021-2022', description: [], icon: null },
          { company: 'Company C', title: 'Title C', dates: '2022-2023', description: [], icon: null },
        ],
      };

      const result = reorderSectionItems(section, 2, 1);

      expect(result.content[0]).toEqual(section.content[0]); // Company A
      expect(result.content[1]).toEqual(section.content[2]); // Company C
      expect(result.content[2]).toEqual(section.content[1]); // Company B
    });
  });
});
