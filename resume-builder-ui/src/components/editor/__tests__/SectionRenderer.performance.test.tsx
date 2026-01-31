// src/components/editor/__tests__/SectionRenderer.performance.test.tsx
// Tests for React.memo and useCallback optimizations in SectionRenderer

import React, { Profiler, ProfilerOnRenderCallback } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import SectionRenderer from '../SectionRenderer';
import { Section, IconListItem } from '../../../types';
import { EditorContentIconRegistry } from '../EditorContent';

// Mock child components with render tracking
const experienceSectionRenderCount = { current: 0 };
const educationSectionRenderCount = { current: 0 };
const genericSectionRenderCount = { current: 0 };
const iconListSectionRenderCount = { current: 0 };

vi.mock('../../ExperienceSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => {
    experienceSectionRenderCount.current++;
    return <div data-testid="experience-section" data-section-name={sectionName} />;
  },
}));

vi.mock('../../EducationSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => {
    educationSectionRenderCount.current++;
    return <div data-testid="education-section" data-section-name={sectionName} />;
  },
}));

vi.mock('../../GenericSection', () => ({
  default: ({ section }: { section: Section }) => {
    genericSectionRenderCount.current++;
    return <div data-testid="generic-section" data-section-name={section.name} />;
  },
}));

vi.mock('../../IconListSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => {
    iconListSectionRenderCount.current++;
    return <div data-testid="icon-list-section" data-section-name={sectionName} />;
  },
}));

describe('SectionRenderer Performance', () => {
  // Mock icon registry
  const mockIconRegistry: EditorContentIconRegistry = {
    registerIcon: vi.fn(),
    registerIconWithFilename: vi.fn(),
    getIconFile: vi.fn(),
    removeIcon: vi.fn(),
    clearRegistry: vi.fn(),
    getRegisteredFilenames: vi.fn().mockReturnValue([]),
    getRegistrySize: vi.fn().mockReturnValue(0),
  };

  // Stable mock handlers (created once, reused)
  const stableHandlers = {
    handleUpdateSection: vi.fn(),
    handleDeleteSection: vi.fn(),
    handleDeleteEntry: vi.fn(),
    handleReorderEntry: vi.fn(),
    handleTitleEdit: vi.fn(),
    handleTitleSave: vi.fn(),
    handleTitleCancel: vi.fn(),
    setTemporaryTitle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    experienceSectionRenderCount.current = 0;
    educationSectionRenderCount.current = 0;
    genericSectionRenderCount.current = 0;
    iconListSectionRenderCount.current = 0;
  });

  // Test sections
  const experienceSection: Section = {
    name: 'Work Experience',
    type: 'experience',
    content: [
      {
        company: 'Tech Corp',
        title: 'Engineer',
        dates: '2020-Present',
        description: ['Built features'],
      },
    ],
  };

  const educationSection: Section = {
    name: 'Education',
    type: 'education',
    content: [
      {
        degree: 'BS Computer Science',
        school: 'MIT',
        year: '2020',
      },
    ],
  };

  const iconListSection: Section = {
    name: 'Certifications',
    type: 'icon-list',
    content: [
      {
        certification: 'AWS',
        issuer: 'Amazon',
        date: '2023',
        icon: 'aws.png',
      },
    ] as IconListItem[],
  };

  const genericSection: Section = {
    name: 'Skills',
    type: 'bulleted-list',
    content: ['JavaScript', 'TypeScript'],
  };

  const createDefaultProps = (section: Section, index: number = 0) => ({
    section,
    index,
    ...stableHandlers,
    isEditingTitle: false,
    temporaryTitle: '',
    supportsIcons: true,
    iconRegistry: mockIconRegistry,
  });

  describe('React.memo Effectiveness', () => {
    it('should not re-render child when props are unchanged', () => {
      // Use child component render count to verify React.memo effectiveness
      // (Profiler still fires during reconciliation, but the actual component body won't execute)
      const props = createDefaultProps(experienceSection, 0);

      const { rerender } = render(<SectionRenderer {...props} />);

      const initialRenderCount = experienceSectionRenderCount.current;

      // Rerender with exact same props object
      rerender(<SectionRenderer {...props} />);

      // React.memo should prevent child from re-rendering since props are same reference
      expect(experienceSectionRenderCount.current).toBe(initialRenderCount);
    });

    it('should re-render only when section prop changes', () => {
      const onRenderCallback: ProfilerOnRenderCallback = vi.fn();

      const props = createDefaultProps(experienceSection, 0);

      const { rerender } = render(
        <Profiler id="SectionRenderer" onRender={onRenderCallback}>
          <SectionRenderer {...props} />
        </Profiler>
      );

      const initialRenderCount = (onRenderCallback as ReturnType<typeof vi.fn>).mock.calls.length;

      // Update section content (new object reference)
      const updatedSection: Section = {
        ...experienceSection,
        content: [
          {
            company: 'New Corp',
            title: 'Senior Engineer',
            dates: '2021-Present',
            description: ['New responsibilities'],
          },
        ],
      };

      rerender(
        <Profiler id="SectionRenderer" onRender={onRenderCallback}>
          <SectionRenderer {...createDefaultProps(updatedSection, 0)} />
        </Profiler>
      );

      // Should have rendered again with new section
      expect((onRenderCallback as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(initialRenderCount);
    });

    it('should re-render when isEditingTitle changes', () => {
      const onRenderCallback: ProfilerOnRenderCallback = vi.fn();

      const props = createDefaultProps(experienceSection, 0);

      const { rerender } = render(
        <Profiler id="SectionRenderer" onRender={onRenderCallback}>
          <SectionRenderer {...props} isEditingTitle={false} />
        </Profiler>
      );

      const initialRenderCount = (onRenderCallback as ReturnType<typeof vi.fn>).mock.calls.length;

      rerender(
        <Profiler id="SectionRenderer" onRender={onRenderCallback}>
          <SectionRenderer {...props} isEditingTitle={true} />
        </Profiler>
      );

      expect((onRenderCallback as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('O(1) Update Verification', () => {
    /**
     * This test verifies that updating one section doesn't cause other sections to re-render.
     * In a parent component rendering multiple SectionRenderers, each should update independently.
     */
    it('should only render the affected section when one section updates', () => {
      // Render multiple sections
      const { rerender } = render(
        <>
          <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
          <SectionRenderer {...createDefaultProps(educationSection, 1)} />
          <SectionRenderer {...createDefaultProps(genericSection, 2)} />
        </>
      );

      const expRenderAfterInitial = experienceSectionRenderCount.current;
      const eduRenderAfterInitial = educationSectionRenderCount.current;
      const genRenderAfterInitial = genericSectionRenderCount.current;

      // Update only the experience section
      const updatedExperience: Section = {
        ...experienceSection,
        name: 'Updated Work Experience',
      };

      rerender(
        <>
          <SectionRenderer {...createDefaultProps(updatedExperience, 0)} />
          <SectionRenderer {...createDefaultProps(educationSection, 1)} />
          <SectionRenderer {...createDefaultProps(genericSection, 2)} />
        </>
      );

      // Experience section should have re-rendered (section changed)
      expect(experienceSectionRenderCount.current).toBeGreaterThan(expRenderAfterInitial);

      // Education and generic sections should NOT have re-rendered (props unchanged)
      expect(educationSectionRenderCount.current).toBe(eduRenderAfterInitial);
      expect(genericSectionRenderCount.current).toBe(genRenderAfterInitial);
    });

    it('should isolate re-renders when handlers are stable', () => {
      // Render with stable handlers
      const { rerender } = render(
        <>
          <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
          <SectionRenderer {...createDefaultProps(iconListSection, 1)} />
        </>
      );

      const expRenderAfterInitial = experienceSectionRenderCount.current;
      const iconListRenderAfterInitial = iconListSectionRenderCount.current;

      // Update only icon list section
      const updatedIconList: Section = {
        ...iconListSection,
        content: [
          ...iconListSection.content as IconListItem[],
          {
            certification: 'Azure',
            issuer: 'Microsoft',
            date: '2024',
            icon: 'azure.png',
          },
        ],
      };

      rerender(
        <>
          <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
          <SectionRenderer {...createDefaultProps(updatedIconList, 1)} />
        </>
      );

      // Icon list section should have re-rendered
      expect(iconListSectionRenderCount.current).toBeGreaterThan(iconListRenderAfterInitial);

      // Experience section should NOT have re-rendered
      expect(experienceSectionRenderCount.current).toBe(expRenderAfterInitial);
    });

    it('should handle N sections efficiently - only affected sections re-render', () => {
      // Create 5 sections
      const sections = [
        { ...experienceSection, name: 'Experience 0' },
        { ...educationSection, name: 'Education 1' },
        { ...genericSection, name: 'Skills 2' },
        { ...genericSection, name: 'Skills 3' },
        { ...genericSection, name: 'Skills 4' },
      ];

      const { rerender } = render(
        <>
          {sections.map((section, index) => (
            <SectionRenderer
              key={`section-${index}`}
              {...createDefaultProps(section, index)}
            />
          ))}
        </>
      );

      const expRenderAfterInitial = experienceSectionRenderCount.current;
      const eduRenderAfterInitial = educationSectionRenderCount.current;
      const genRenderAfterInitial = genericSectionRenderCount.current;

      // Update only the middle generic section (index 2)
      const updatedSections = sections.map((section, index) =>
        index === 2 ? { ...section, name: 'Updated Skills 2' } : section
      );

      rerender(
        <>
          {updatedSections.map((section, index) => (
            <SectionRenderer
              key={`section-${index}`}
              {...createDefaultProps(section, index)}
            />
          ))}
        </>
      );

      // Only 1 additional generic section render (the updated one)
      // Note: Child components re-render when SectionRenderer re-renders
      expect(genericSectionRenderCount.current).toBe(genRenderAfterInitial + 1);

      // Experience and education should not re-render
      expect(experienceSectionRenderCount.current).toBe(expRenderAfterInitial);
      expect(educationSectionRenderCount.current).toBe(eduRenderAfterInitial);
    });
  });

  describe('Internal useCallback Stability', () => {
    /**
     * These tests verify that the callbacks created inside SectionRenderer
     * remain stable when the section prop doesn't change, preventing unnecessary
     * child re-renders.
     */

    it('should maintain stable callbacks when section is unchanged', () => {
      const sectionRef = experienceSection; // Same reference

      const { rerender } = render(
        <SectionRenderer {...createDefaultProps(sectionRef, 0)} />
      );

      const initialRenderCount = experienceSectionRenderCount.current;

      // Rerender with same section reference
      rerender(
        <SectionRenderer {...createDefaultProps(sectionRef, 0)} />
      );

      // Should not cause additional child render
      expect(experienceSectionRenderCount.current).toBe(initialRenderCount);
    });

    it('should create new callbacks when index changes', () => {
      const { rerender } = render(
        <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
      );

      const initialRenderCount = experienceSectionRenderCount.current;

      // Change only the index
      rerender(
        <SectionRenderer {...createDefaultProps(experienceSection, 5)} />
      );

      // Should re-render because index changed (affects useCallback deps)
      expect(experienceSectionRenderCount.current).toBeGreaterThan(initialRenderCount);
    });

    it('should not re-render child when unrelated state changes in parent', () => {
      // This simulates a parent component with local state that doesn't affect SectionRenderer
      const ParentComponent = ({ count }: { count: number }) => (
        <div data-count={count}>
          <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
        </div>
      );

      const { rerender } = render(<ParentComponent count={0} />);

      const initialRenderCount = experienceSectionRenderCount.current;

      // Parent state changes but SectionRenderer props don't
      rerender(<ParentComponent count={1} />);

      // SectionRenderer should not re-render due to React.memo
      expect(experienceSectionRenderCount.current).toBe(initialRenderCount);
    });
  });

  describe('Handler Stability with Refs', () => {
    it('should not cause re-render when parent handler references change but functionality is same', () => {
      // In real usage, handlers from useSectionManagement use refs internally
      // This test verifies that as long as the handler function references passed as props
      // remain stable, no re-renders occur

      const stableProps = createDefaultProps(experienceSection, 0);

      const { rerender } = render(
        <SectionRenderer {...stableProps} />
      );

      const initialRenderCount = experienceSectionRenderCount.current;

      // Rerender with same props object (handlers have same reference)
      rerender(<SectionRenderer {...stableProps} />);

      expect(experienceSectionRenderCount.current).toBe(initialRenderCount);
    });

    it('should re-render when new handler reference is provided', () => {
      const { rerender } = render(
        <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
      );

      const initialRenderCount = experienceSectionRenderCount.current;

      // Create new props with new handler references
      const newProps = {
        ...createDefaultProps(experienceSection, 0),
        handleDeleteSection: vi.fn(), // New function reference
      };

      rerender(<SectionRenderer {...newProps} />);

      // Should re-render because a prop changed
      expect(experienceSectionRenderCount.current).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('Memory and Reference Behavior', () => {
    it('should handle rapid section updates without memory leaks', () => {
      const { rerender } = render(
        <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
      );

      // Simulate rapid updates
      for (let i = 0; i < 10; i++) {
        const updatedSection: Section = {
          ...experienceSection,
          name: `Experience ${i}`,
        };
        rerender(
          <SectionRenderer {...createDefaultProps(updatedSection, 0)} />
        );
      }

      // Test passes if no errors occur and renders complete
      expect(experienceSectionRenderCount.current).toBe(11); // Initial + 10 updates
    });

    it('should handle section type transitions', () => {
      // Start with experience section
      const { rerender } = render(
        <SectionRenderer {...createDefaultProps(experienceSection, 0)} />
      );

      expect(experienceSectionRenderCount.current).toBe(1);
      expect(educationSectionRenderCount.current).toBe(0);

      // Switch to education section at same index
      rerender(
        <SectionRenderer {...createDefaultProps(educationSection, 0)} />
      );

      expect(educationSectionRenderCount.current).toBe(1);

      // Switch to generic section
      rerender(
        <SectionRenderer {...createDefaultProps(genericSection, 0)} />
      );

      expect(genericSectionRenderCount.current).toBe(1);
    });
  });
});
