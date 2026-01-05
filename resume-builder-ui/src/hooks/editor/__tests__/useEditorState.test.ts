// src/hooks/editor/__tests__/useEditorState.test.ts

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorState } from '../useEditorState';
import type { ContactInfo, Section } from '../../../types';

describe('useEditorState', () => {
  describe('Initial States', () => {
    it('should initialize contactInfo to null', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.contactInfo).toBeNull();
    });

    it('should initialize sections to empty array', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.sections).toEqual([]);
      expect(result.current.sections).toHaveLength(0);
    });

    it('should initialize templateId to null', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.templateId).toBeNull();
    });

    it('should initialize supportsIcons to false', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.supportsIcons).toBe(false);
    });

    it('should initialize originalTemplateData to null', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.originalTemplateData).toBeNull();
    });

    it('should initialize loading to true', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.loading).toBe(true);
    });

    it('should initialize loadingError to null', () => {
      const { result } = renderHook(() => useEditorState());
      expect(result.current.loadingError).toBeNull();
    });
  });

  describe('Setter Functions', () => {
    describe('setContactInfo', () => {
      it('should update contactInfo state', () => {
        const { result } = renderHook(() => useEditorState());
        const newContactInfo: ContactInfo = {
          name: 'John Doe',
          location: 'San Francisco, CA',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
        };

        act(() => {
          result.current.setContactInfo(newContactInfo);
        });

        expect(result.current.contactInfo).toEqual(newContactInfo);
      });

      it('should update contactInfo with social links', () => {
        const { result } = renderHook(() => useEditorState());
        const contactInfoWithSocial: ContactInfo = {
          name: 'Jane Smith',
          location: 'New York, NY',
          email: 'jane@example.com',
          phone: '+1 (555) 987-6543',
          social_links: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/janesmith' },
            { platform: 'github', url: 'https://github.com/janesmith' },
          ],
        };

        act(() => {
          result.current.setContactInfo(contactInfoWithSocial);
        });

        expect(result.current.contactInfo).toEqual(contactInfoWithSocial);
        expect(result.current.contactInfo?.social_links).toHaveLength(2);
      });

      it('should allow setting contactInfo to null', () => {
        const { result } = renderHook(() => useEditorState());
        const contactInfo: ContactInfo = {
          name: 'Test User',
          location: 'Test City',
          email: 'test@example.com',
          phone: '123-456-7890',
        };

        act(() => {
          result.current.setContactInfo(contactInfo);
        });
        expect(result.current.contactInfo).toEqual(contactInfo);

        act(() => {
          result.current.setContactInfo(null);
        });
        expect(result.current.contactInfo).toBeNull();
      });
    });

    describe('setSections', () => {
      it('should update sections state', () => {
        const { result } = renderHook(() => useEditorState());
        const newSections: Section[] = [
          {
            name: 'Summary',
            type: 'text',
            content: 'Experienced software engineer...',
          },
          {
            name: 'Skills',
            type: 'bulleted-list',
            content: ['JavaScript', 'TypeScript', 'React'],
          },
        ];

        act(() => {
          result.current.setSections(newSections);
        });

        expect(result.current.sections).toEqual(newSections);
        expect(result.current.sections).toHaveLength(2);
      });

      it('should handle experience sections', () => {
        const { result } = renderHook(() => useEditorState());
        const experienceSections: Section[] = [
          {
            name: 'Experience',
            type: 'experience',
            content: [
              {
                company: 'Tech Corp',
                title: 'Senior Engineer',
                dates: '2020 - Present',
                description: ['Led team of 5 developers', 'Implemented CI/CD pipeline'],
              },
            ],
          },
        ];

        act(() => {
          result.current.setSections(experienceSections);
        });

        expect(result.current.sections).toEqual(experienceSections);
      });

      it('should handle education sections', () => {
        const { result } = renderHook(() => useEditorState());
        const educationSections: Section[] = [
          {
            name: 'Education',
            type: 'education',
            content: [
              {
                degree: 'B.S. Computer Science',
                school: 'MIT',
                year: '2018',
                field_of_study: 'Software Engineering',
              },
            ],
          },
        ];

        act(() => {
          result.current.setSections(educationSections);
        });

        expect(result.current.sections).toEqual(educationSections);
      });

      it('should allow setting empty sections array', () => {
        const { result } = renderHook(() => useEditorState());
        const sections: Section[] = [
          { name: 'Test', type: 'text', content: 'Test content' },
        ];

        act(() => {
          result.current.setSections(sections);
        });
        expect(result.current.sections).toHaveLength(1);

        act(() => {
          result.current.setSections([]);
        });
        expect(result.current.sections).toEqual([]);
        expect(result.current.sections).toHaveLength(0);
      });
    });

    describe('setTemplateId', () => {
      it('should update templateId state', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setTemplateId('modern');
        });

        expect(result.current.templateId).toBe('modern');
      });

      it('should allow setting templateId to null', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setTemplateId('classic');
        });
        expect(result.current.templateId).toBe('classic');

        act(() => {
          result.current.setTemplateId(null);
        });
        expect(result.current.templateId).toBeNull();
      });
    });

    describe('setSupportsIcons', () => {
      it('should update supportsIcons to true', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setSupportsIcons(true);
        });

        expect(result.current.supportsIcons).toBe(true);
      });

      it('should update supportsIcons to false', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setSupportsIcons(true);
        });
        expect(result.current.supportsIcons).toBe(true);

        act(() => {
          result.current.setSupportsIcons(false);
        });
        expect(result.current.supportsIcons).toBe(false);
      });
    });

    describe('setOriginalTemplateData', () => {
      it('should update originalTemplateData state', () => {
        const { result } = renderHook(() => useEditorState());
        const templateData = {
          contactInfo: {
            name: 'Template User',
            location: 'Template City',
            email: 'template@example.com',
            phone: '000-000-0000',
          },
          sections: [
            { name: 'Summary', type: 'text' as const, content: 'Template summary' },
          ],
        };

        act(() => {
          result.current.setOriginalTemplateData(templateData);
        });

        expect(result.current.originalTemplateData).toEqual(templateData);
      });

      it('should allow setting originalTemplateData to null', () => {
        const { result } = renderHook(() => useEditorState());
        const templateData = {
          contactInfo: {
            name: 'Test',
            location: 'Test',
            email: 'test@test.com',
            phone: '123',
          },
          sections: [],
        };

        act(() => {
          result.current.setOriginalTemplateData(templateData);
        });
        expect(result.current.originalTemplateData).toEqual(templateData);

        act(() => {
          result.current.setOriginalTemplateData(null);
        });
        expect(result.current.originalTemplateData).toBeNull();
      });
    });

    describe('setLoading', () => {
      it('should update loading to false', () => {
        const { result } = renderHook(() => useEditorState());
        expect(result.current.loading).toBe(true);

        act(() => {
          result.current.setLoading(false);
        });

        expect(result.current.loading).toBe(false);
      });

      it('should update loading to true', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setLoading(false);
        });
        expect(result.current.loading).toBe(false);

        act(() => {
          result.current.setLoading(true);
        });
        expect(result.current.loading).toBe(true);
      });
    });

    describe('setLoadingError', () => {
      it('should update loadingError state', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setLoadingError('Failed to load template');
        });

        expect(result.current.loadingError).toBe('Failed to load template');
      });

      it('should allow setting loadingError to null', () => {
        const { result } = renderHook(() => useEditorState());

        act(() => {
          result.current.setLoadingError('Error occurred');
        });
        expect(result.current.loadingError).toBe('Error occurred');

        act(() => {
          result.current.setLoadingError(null);
        });
        expect(result.current.loadingError).toBeNull();
      });
    });
  });

  describe('updateSection Helper', () => {
    it('should update section at index 0', () => {
      const { result } = renderHook(() => useEditorState());
      const initialSections: Section[] = [
        { name: 'Summary', type: 'text', content: 'Original summary' },
        { name: 'Skills', type: 'bulleted-list', content: ['Skill 1'] },
      ];

      act(() => {
        result.current.setSections(initialSections);
      });

      const updatedSection: Section = {
        name: 'Summary',
        type: 'text',
        content: 'Updated summary text',
      };

      act(() => {
        result.current.updateSection(0, updatedSection);
      });

      expect(result.current.sections[0]).toEqual(updatedSection);
      expect(result.current.sections[1]).toEqual(initialSections[1]);
      expect(result.current.sections).toHaveLength(2);
    });

    it('should update section at middle index', () => {
      const { result } = renderHook(() => useEditorState());
      const initialSections: Section[] = [
        { name: 'Summary', type: 'text', content: 'Summary' },
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Education', type: 'education', content: [] },
      ];

      act(() => {
        result.current.setSections(initialSections);
      });

      const updatedSection: Section = {
        name: 'Work Experience',
        type: 'experience',
        content: [
          {
            company: 'New Company',
            title: 'Engineer',
            dates: '2023 - Present',
            description: ['Description'],
          },
        ],
      };

      act(() => {
        result.current.updateSection(1, updatedSection);
      });

      expect(result.current.sections[1]).toEqual(updatedSection);
      expect(result.current.sections[0]).toEqual(initialSections[0]);
      expect(result.current.sections[2]).toEqual(initialSections[2]);
    });

    it('should update section at last index', () => {
      const { result } = renderHook(() => useEditorState());
      const initialSections: Section[] = [
        { name: 'Summary', type: 'text', content: 'Summary' },
        { name: 'Skills', type: 'bulleted-list', content: ['Skill 1'] },
        { name: 'Education', type: 'education', content: [] },
      ];

      act(() => {
        result.current.setSections(initialSections);
      });

      const updatedSection: Section = {
        name: 'Education',
        type: 'education',
        content: [
          {
            degree: 'B.S. Computer Science',
            school: 'University',
            year: '2020',
          },
        ],
      };

      act(() => {
        result.current.updateSection(2, updatedSection);
      });

      expect(result.current.sections[2]).toEqual(updatedSection);
      expect(result.current.sections[0]).toEqual(initialSections[0]);
      expect(result.current.sections[1]).toEqual(initialSections[1]);
    });

    it('should not mutate original sections array', () => {
      const { result } = renderHook(() => useEditorState());
      const initialSections: Section[] = [
        { name: 'Summary', type: 'text', content: 'Summary' },
      ];

      act(() => {
        result.current.setSections(initialSections);
      });

      const sectionsBeforeUpdate = result.current.sections;

      const updatedSection: Section = {
        name: 'Summary',
        type: 'text',
        content: 'Updated',
      };

      act(() => {
        result.current.updateSection(0, updatedSection);
      });

      // Should create new array, not mutate
      expect(result.current.sections).not.toBe(sectionsBeforeUpdate);
      expect(result.current.sections[0]).toEqual(updatedSection);
    });

    it('should handle updateSection with invalid index gracefully', () => {
      const { result } = renderHook(() => useEditorState());
      const initialSections: Section[] = [
        { name: 'Summary', type: 'text', content: 'Summary' },
      ];

      act(() => {
        result.current.setSections(initialSections);
      });

      const updatedSection: Section = {
        name: 'New Section',
        type: 'text',
        content: 'New content',
      };

      // Spy on console.warn to verify it's called
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Update at index that doesn't exist
      act(() => {
        result.current.updateSection(5, updatedSection);
      });

      // Should warn and leave sections unchanged
      expect(warnSpy).toHaveBeenCalledWith('Attempted to update section at out-of-bounds index: 5');
      expect(result.current.sections).toEqual(initialSections);
      expect(result.current.sections).toHaveLength(1);

      warnSpy.mockRestore();
    });

    it('should handle negative index', () => {
      const { result } = renderHook(() => useEditorState());
      const initialSections: Section[] = [
        { name: 'Summary', type: 'text', content: 'Summary' },
        { name: 'Skills', type: 'bulleted-list', content: ['Skill'] },
      ];

      act(() => {
        result.current.setSections(initialSections);
      });

      const updatedSection: Section = {
        name: 'Negative Index Section',
        type: 'text',
        content: 'Content',
      };

      // Spy on console.warn to verify it's called
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Negative index should be rejected with bounds check
      act(() => {
        result.current.updateSection(-1, updatedSection);
      });

      // Should warn and leave sections unchanged
      expect(warnSpy).toHaveBeenCalledWith('Attempted to update section at out-of-bounds index: -1');
      expect(result.current.sections).toEqual(initialSections);
      expect(result.current.sections).toHaveLength(2);
      expect(result.current.sections[0]).toEqual(initialSections[0]);
      expect(result.current.sections[1]).toEqual(initialSections[1]);

      warnSpy.mockRestore();
    });
  });

  describe('Return Object Stability', () => {
    it('should return stable object reference when states do not change', () => {
      const { result, rerender } = renderHook(() => useEditorState());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      expect(firstRender).toBe(secondRender);
    });

    it('should maintain stable setter function references', () => {
      const { result } = renderHook(() => useEditorState());

      const firstSetContactInfo = result.current.setContactInfo;
      const firstSetSections = result.current.setSections;
      const firstSetTemplateId = result.current.setTemplateId;

      act(() => {
        result.current.setContactInfo({
          name: 'Test',
          location: 'Test',
          email: 'test@test.com',
          phone: '123',
        });
      });

      const secondSetContactInfo = result.current.setContactInfo;
      const secondSetSections = result.current.setSections;
      const secondSetTemplateId = result.current.setTemplateId;

      expect(firstSetContactInfo).toBe(secondSetContactInfo);
      expect(firstSetSections).toBe(secondSetSections);
      expect(firstSetTemplateId).toBe(secondSetTemplateId);
    });

    it('should maintain stable updateSection reference when sections change', () => {
      const { result } = renderHook(() => useEditorState());

      const firstUpdateSection = result.current.updateSection;

      act(() => {
        result.current.setSections([
          { name: 'Test', type: 'text', content: 'Content' },
        ]);
      });

      const secondUpdateSection = result.current.updateSection;

      // updateSection uses functional update form with empty dependencies,
      // so it should maintain stable reference
      expect(firstUpdateSection).toBe(secondUpdateSection);
    });
  });
});
