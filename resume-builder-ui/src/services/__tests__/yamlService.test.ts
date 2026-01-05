// src/services/__tests__/yamlService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  processSectionsForExport,
  exportResumeAsYAML,
  importResumeFromYAML,
  IconRegistryForYAML,
} from '../yamlService';
import { Section, ContactInfo } from '../../types';
import { IconExportData } from '../../types/iconTypes';

describe('yamlService', () => {
  describe('processSectionsForExport', () => {
    it('should remove iconFile from experience items', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            {
              company: 'ACME Corp',
              title: 'Engineer',
              dates: '2020-2023',
              description: ['Built things'],
              icon: 'logo.png',
              iconFile: new File([''], 'logo.png'), // Should be removed
              iconBase64: 'data:image/png;base64,ABC', // Should be removed
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0]).not.toHaveProperty('iconFile');
      expect(result[0].content[0]).not.toHaveProperty('iconBase64');
      expect(result[0].content[0]).toHaveProperty('icon', 'logo.png');
    });

    it('should remove iconBase64 from education items', () => {
      const sections: Section[] = [
        {
          name: 'Education',
          type: 'education',
          content: [
            {
              degree: 'BS',
              school: 'MIT',
              year: '2020',
              field_of_study: 'CS',
              icon: 'school.png',
              iconBase64: 'data:image/png;base64,XYZ', // Should be removed
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0]).not.toHaveProperty('iconBase64');
      expect(result[0].content[0]).toHaveProperty('icon', 'school.png');
    });

    it('should clean "/icons/" prefix from icon path in experience section', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            {
              company: 'ACME',
              title: 'Dev',
              dates: '2020',
              description: [],
              icon: '/icons/logo.png', // Should become "logo.png"
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe('logo.png');
    });

    it('should clean "/icons/" prefix from icon path in education section', () => {
      const sections: Section[] = [
        {
          name: 'Education',
          type: 'education',
          content: [
            {
              degree: 'MS',
              school: 'Stanford',
              year: '2022',
              icon: '/icons/stanford.png', // Should become "stanford.png"
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe('stanford.png');
    });

    it('should preserve icon path without "/icons/" prefix', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            {
              company: 'ACME',
              title: 'Dev',
              dates: '2020',
              description: [],
              icon: 'logo.png', // Already clean
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe('logo.png');
    });

    it('should preserve null icon values', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            {
              company: 'ACME',
              title: 'Dev',
              dates: '2020',
              description: [],
              icon: null,
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe(null);
    });

    it('should preserve other section content unchanged', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            {
              company: 'ACME Corp',
              title: 'Senior Engineer',
              dates: '2020-2023',
              description: ['Built awesome things', 'Led team'],
              icon: 'logo.png',
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].company).toBe('ACME Corp');
      expect(result[0].content[0].title).toBe('Senior Engineer');
      expect(result[0].content[0].dates).toBe('2020-2023');
      expect(result[0].content[0].description).toEqual(['Built awesome things', 'Led team']);
    });

    it('should handle icon-list sections generically', () => {
      const sections: Section[] = [
        {
          name: 'Certifications',
          type: 'icon-list',
          content: [
            {
              certification: 'AWS Certified',
              issuer: 'Amazon',
              date: '2023',
              customField: 'custom value', // Should be preserved
              icon: '/icons/aws.png',
              iconFile: new File([''], 'aws.png'), // Should be removed
              iconBase64: 'data:image/png;base64,XYZ', // Should be removed
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      // Verify temporary fields are removed
      expect(result[0].content[0]).not.toHaveProperty('iconFile');
      expect(result[0].content[0]).not.toHaveProperty('iconBase64');

      // Verify icon path is cleaned
      expect(result[0].content[0].icon).toBe('aws.png');

      // Verify all original properties are preserved
      expect(result[0].content[0].certification).toBe('AWS Certified');
      expect(result[0].content[0].issuer).toBe('Amazon');
      expect(result[0].content[0].date).toBe('2023');
      expect(result[0].content[0].customField).toBe('custom value');
    });

    it('should handle icon-list with null icon', () => {
      const sections: Section[] = [
        {
          name: 'Certifications',
          type: 'icon-list',
          content: [
            {
              certification: 'Some Cert',
              issuer: 'Some Org',
              date: '2023',
              icon: null,
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe(null);
    });

    it('should preserve all properties in icon-list items', () => {
      const sections: Section[] = [
        {
          name: 'Awards',
          type: 'icon-list',
          content: [
            {
              award: 'Employee of the Year',
              organization: 'ACME Corp',
              year: 2023,
              description: 'Outstanding performance',
              // No icon field
            },
          ],
        },
      ];

      const result = processSectionsForExport(sections);

      // Verify all original properties are preserved
      expect(result[0].content[0].award).toBe('Employee of the Year');
      expect(result[0].content[0].organization).toBe('ACME Corp');
      expect(result[0].content[0].year).toBe(2023);
      expect(result[0].content[0].description).toBe('Outstanding performance');
      expect(result[0].content[0].icon).toBe(null);
    });

    it('should return non-icon sections unchanged', () => {
      const sections: Section[] = [
        {
          name: 'Summary',
          type: 'text',
          content: 'This is a summary paragraph',
        },
        {
          name: 'Skills',
          type: 'bulleted-list',
          content: ['JavaScript', 'TypeScript', 'React'],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0]).toEqual(sections[0]);
      expect(result[1]).toEqual(sections[1]);
    });

    it('should handle empty sections array', () => {
      const sections: Section[] = [];

      const result = processSectionsForExport(sections);

      expect(result).toEqual([]);
    });

    it('should handle multiple sections with mixed types', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [{ company: 'A', title: 'Dev', dates: '2020', description: [], icon: '/icons/a.png' }],
        },
        {
          name: 'Education',
          type: 'education',
          content: [{ degree: 'BS', school: 'MIT', year: '2020', icon: '/icons/mit.png' }],
        },
        {
          name: 'Skills',
          type: 'bulleted-list',
          content: ['JavaScript'],
        },
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe('a.png');
      expect(result[1].content[0].icon).toBe('mit.png');
      expect(result[2].content).toEqual(['JavaScript']);
    });

    it('should handle legacy experience section without type', () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          // No type property (legacy format)
          content: [
            {
              company: 'ACME',
              title: 'Dev',
              dates: '2020',
              description: [],
              icon: '/icons/logo.png',
            },
          ],
        } as Section,
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe('logo.png');
    });

    it('should handle legacy education section without type', () => {
      const sections: Section[] = [
        {
          name: 'Education',
          // No type property (legacy format)
          content: [
            {
              degree: 'BS',
              school: 'MIT',
              year: '2020',
              icon: '/icons/mit.png',
            },
          ],
        } as Section,
      ];

      const result = processSectionsForExport(sections);

      expect(result[0].content[0].icon).toBe('mit.png');
    });
  });

  describe('exportResumeAsYAML', () => {
    let mockIconRegistry: IconRegistryForYAML;

    beforeEach(() => {
      mockIconRegistry = {
        exportIconsForYAML: vi.fn().mockResolvedValue({}),
        importIconsFromYAML: vi.fn().mockResolvedValue(undefined),
      };
    });

    it('should return blob with YAML content type', async () => {
      const contactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [],
        },
      ];

      const result = await exportResumeAsYAML(contactInfo, sections, mockIconRegistry);

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('application/x-yaml');
    });

    it('should return iconCount of 0 when no icons present', async () => {
      const contactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [{ company: 'ACME', title: 'Dev', dates: '2020', description: [], icon: null }],
        },
      ];

      const result = await exportResumeAsYAML(contactInfo, sections, mockIconRegistry);

      expect(result.iconCount).toBe(0);
      expect(mockIconRegistry.exportIconsForYAML).not.toHaveBeenCalled();
    });

    it('should return iconCount > 0 when icons present', async () => {
      const mockIconData: IconExportData = {
        'logo.png': {
          data: 'data:image/png;base64,ABC',
          type: 'image/png',
          size: 1024,
          uploadedAt: '2024-01-01',
        },
        'school.png': {
          data: 'data:image/png;base64,XYZ',
          type: 'image/png',
          size: 2048,
          uploadedAt: '2024-01-02',
        },
      };

      mockIconRegistry.exportIconsForYAML = vi.fn().mockResolvedValue(mockIconData);

      const contactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [{ company: 'ACME', title: 'Dev', dates: '2020', description: [], icon: 'logo.png' }],
        },
        {
          name: 'Education',
          type: 'education',
          content: [{ degree: 'BS', school: 'MIT', year: '2020', icon: 'school.png' }],
        },
      ];

      const result = await exportResumeAsYAML(contactInfo, sections, mockIconRegistry);

      expect(result.iconCount).toBe(2);
      expect(mockIconRegistry.exportIconsForYAML).toHaveBeenCalledWith(['logo.png', 'school.png']);
    });

    it('should call iconRegistry.exportIconsForYAML with referenced icons', async () => {
      const contactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [
            { company: 'ACME', title: 'Dev', dates: '2020', description: [], icon: 'logo1.png' },
            { company: 'BETA', title: 'Dev', dates: '2021', description: [], icon: 'logo2.png' },
          ],
        },
      ];

      await exportResumeAsYAML(contactInfo, sections, mockIconRegistry);

      expect(mockIconRegistry.exportIconsForYAML).toHaveBeenCalledWith(['logo1.png', 'logo2.png']);
    });

    it('should create non-empty YAML blob with contact_info', async () => {
      const contactInfo: ContactInfo = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-1234',
      };
      const sections: Section[] = [];

      const result = await exportResumeAsYAML(contactInfo, sections, mockIconRegistry);

      // Verify blob exists, has correct type, and is non-empty
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('application/x-yaml');
      expect(result.blob.size).toBeGreaterThan(0);
    });

    it('should create non-empty YAML blob with sections', async () => {
      const contactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [{ company: 'ACME Corp', title: 'Engineer', dates: '2020', description: [], icon: null }],
        },
      ];

      const result = await exportResumeAsYAML(contactInfo, sections, mockIconRegistry);

      // Verify blob exists, has correct type, and size reflects section data
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.blob.type).toBe('application/x-yaml');
      expect(result.blob.size).toBeGreaterThan(50); // Should contain meaningful data
    });

    it('should handle null contactInfo', async () => {
      const sections: Section[] = [
        {
          name: 'Experience',
          type: 'experience',
          content: [],
        },
      ];

      const result = await exportResumeAsYAML(null, sections, mockIconRegistry);

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.iconCount).toBe(0);
    });

    it('should handle empty sections array', async () => {
      const contactInfo: ContactInfo = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = await exportResumeAsYAML(contactInfo, [], mockIconRegistry);

      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.iconCount).toBe(0);
    });
  });

  describe('importResumeFromYAML', () => {
    let mockIconRegistry: IconRegistryForYAML;

    beforeEach(() => {
      mockIconRegistry = {
        exportIconsForYAML: vi.fn().mockResolvedValue({}),
        importIconsFromYAML: vi.fn().mockResolvedValue(undefined),
      };
    });

    it('should parse YAML string correctly', async () => {
      const yamlString = `
contact_info:
  name: John Doe
  email: john@example.com
sections:
  - name: Experience
    type: experience
    content: []
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(result.contactInfo).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].name).toBe('Experience');
      expect(result.sections[0].type).toBe('experience');
    });

    it('should call iconRegistry.importIconsFromYAML when icons present', async () => {
      const yamlString = `
contact_info:
  name: John Doe
sections:
  - name: Experience
    type: experience
    content: []
__icons__:
  logo.png:
    data: data:image/png;base64,ABC
    type: image/png
    size: 1024
    uploadedAt: '2024-01-01'
`;

      await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(mockIconRegistry.importIconsFromYAML).toHaveBeenCalledWith({
        'logo.png': {
          data: 'data:image/png;base64,ABC',
          type: 'image/png',
          size: 1024,
          uploadedAt: '2024-01-01',
        },
      });
    });

    it('should return migrated sections', async () => {
      // Legacy format without type property
      const yamlString = `
contact_info:
  name: John Doe
sections:
  - name: Experience
    content: []
  - name: Education
    content: []
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      // Should auto-add type property via migrateLegacySections
      expect(result.sections[0].type).toBe('experience');
      expect(result.sections[1].type).toBe('education');
    });

    it('should return iconCount when icons imported', async () => {
      const yamlString = `
contact_info:
  name: John Doe
sections: []
__icons__:
  logo1.png:
    data: data:image/png;base64,ABC
    type: image/png
    size: 1024
    uploadedAt: '2024-01-01'
  logo2.png:
    data: data:image/png;base64,XYZ
    type: image/png
    size: 2048
    uploadedAt: '2024-01-02'
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(result.iconCount).toBe(2);
    });

    it('should return iconCount of 0 when no icons present', async () => {
      const yamlString = `
contact_info:
  name: John Doe
sections: []
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(result.iconCount).toBe(0);
      expect(mockIconRegistry.importIconsFromYAML).not.toHaveBeenCalled();
    });

    it('should handle empty __icons__ object', async () => {
      const yamlString = `
contact_info:
  name: John Doe
sections: []
__icons__: {}
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(result.iconCount).toBe(0);
      expect(mockIconRegistry.importIconsFromYAML).not.toHaveBeenCalled();
    });

    it('should preserve contact info fields', async () => {
      const yamlString = `
contact_info:
  name: Jane Smith
  email: jane@example.com
  phone: 555-1234
  linkedin: linkedin.com/in/jane
  location: San Francisco, CA
sections: []
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(result.contactInfo.name).toBe('Jane Smith');
      expect(result.contactInfo.email).toBe('jane@example.com');
      expect(result.contactInfo.phone).toBe('555-1234');
      expect(result.contactInfo.linkedin).toBe('linkedin.com/in/jane');
      expect(result.contactInfo.location).toBe('San Francisco, CA');
    });

    it('should handle complex section content', async () => {
      const yamlString = `
contact_info:
  name: John Doe
sections:
  - name: Experience
    type: experience
    content:
      - company: ACME Corp
        title: Senior Engineer
        dates: 2020-2023
        description:
          - Led team of 5 engineers
          - Built scalable systems
        icon: acme.png
`;

      const result = await importResumeFromYAML(yamlString, mockIconRegistry);

      expect(result.sections[0].content[0].company).toBe('ACME Corp');
      expect(result.sections[0].content[0].description).toHaveLength(2);
      expect(result.sections[0].content[0].icon).toBe('acme.png');
    });

    it('should throw error for invalid YAML', async () => {
      const invalidYaml = 'invalid: yaml: content: [[[';

      await expect(importResumeFromYAML(invalidYaml, mockIconRegistry)).rejects.toThrow();
    });
  });
});
