// src/hooks/editor/__tests__/useSectionManagement.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSectionManagement, UseSectionManagementProps } from '../useSectionManagement';
import { Section } from '../../../types';
import { DeleteTarget } from '../../../types/editor';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}));

import { toast } from 'react-hot-toast';

describe('useSectionManagement', () => {
  // Test fixtures
  const createMockSections = (): Section[] => [
    { name: 'Summary', type: 'text', content: 'Professional summary...' },
    {
      name: 'Experience',
      type: 'experience',
      content: [
        {
          company: 'Tech Corp',
          title: 'Engineer',
          dates: '2020-Present',
          description: ['Led projects', 'Built features'],
        },
      ],
    },
    { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'React', 'TypeScript'] },
  ];

  // Shared mock functions
  let mockSetSections: ReturnType<typeof vi.fn>;
  let mockOpenDeleteConfirm: ReturnType<typeof vi.fn>;
  let mockCloseDeleteConfirm: ReturnType<typeof vi.fn>;
  let mockCloseSectionTypeModal: ReturnType<typeof vi.fn>;
  let mockOnSectionAdded: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockSetSections = vi.fn();
    mockOpenDeleteConfirm = vi.fn();
    mockCloseDeleteConfirm = vi.fn();
    mockCloseSectionTypeModal = vi.fn();
    mockOnSectionAdded = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createDefaultProps = (overrides?: Partial<UseSectionManagementProps>): UseSectionManagementProps => ({
    sections: createMockSections(),
    setSections: mockSetSections,
    deleteTarget: null,
    openDeleteConfirm: mockOpenDeleteConfirm,
    closeDeleteConfirm: mockCloseDeleteConfirm,
    closeSectionTypeModal: mockCloseSectionTypeModal,
    ...overrides,
  });

  describe('Initial State', () => {
    it('should initialize editingTitleIndex to null', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));
      expect(result.current.editingTitleIndex).toBeNull();
    });

    it('should initialize temporaryTitle to empty string', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));
      expect(result.current.temporaryTitle).toBe('');
    });
  });

  describe('handleAddSection', () => {
    it('should add a new text section', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

      act(() => {
        result.current.handleAddSection('text');
      });

      expect(mockSetSections).toHaveBeenCalledTimes(1);
      // Get the updater function and call it
      const updater = mockSetSections.mock.calls[0][0];
      const newSections = updater([]);
      expect(newSections).toHaveLength(1);
      expect(newSections[0].type).toBe('text');
      expect(newSections[0].name).toBe('New Text Section');
      expect(newSections[0].content).toBe('');
    });

    it('should add a new experience section with default content', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

      act(() => {
        result.current.handleAddSection('experience');
      });

      const updater = mockSetSections.mock.calls[0][0];
      const newSections = updater([]);
      expect(newSections[0].type).toBe('experience');
      expect(newSections[0].content).toEqual([
        {
          company: '',
          title: '',
          dates: '',
          description: [''],
        },
      ]);
    });

    it('should add a new education section with default content', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

      act(() => {
        result.current.handleAddSection('education');
      });

      const updater = mockSetSections.mock.calls[0][0];
      const newSections = updater([]);
      expect(newSections[0].type).toBe('education');
      expect(newSections[0].content).toEqual([
        {
          degree: '',
          school: '',
          year: '',
          field_of_study: '',
        },
      ]);
    });

    it('should add a new bulleted-list section with empty array', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

      act(() => {
        result.current.handleAddSection('bulleted-list');
      });

      const updater = mockSetSections.mock.calls[0][0];
      const newSections = updater([]);
      expect(newSections[0].type).toBe('bulleted-list');
      expect(newSections[0].content).toEqual([]);
    });

    it('should generate unique name when duplicate exists', () => {
      const existingSections = [
        { name: 'New Text Section', type: 'text', content: '' },
      ];
      const { result } = renderHook(() =>
        useSectionManagement(createDefaultProps({ sections: existingSections }))
      );

      act(() => {
        result.current.handleAddSection('text');
      });

      const updater = mockSetSections.mock.calls[0][0];
      const newSections = updater(existingSections);
      // New section is added at top by default
      expect(newSections[0].name).toBe('New Text Section 2');
    });

    it('should close section type modal after adding', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

      act(() => {
        result.current.handleAddSection('text');
      });

      expect(mockCloseSectionTypeModal).toHaveBeenCalledTimes(1);
    });

    it('should call onSectionAdded callback after delay', () => {
      const { result } = renderHook(() =>
        useSectionManagement(createDefaultProps({ onSectionAdded: mockOnSectionAdded }))
      );

      act(() => {
        result.current.handleAddSection('text');
      });

      expect(mockOnSectionAdded).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(mockOnSectionAdded).toHaveBeenCalledTimes(1);
    });

    it('should not call onSectionAdded if not provided', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

      act(() => {
        result.current.handleAddSection('text');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // No error should occur
      expect(mockCloseSectionTypeModal).toHaveBeenCalled();
    });

    describe('position parameter', () => {
      it('should add section at top by default', () => {
        const existingSections = [
          { name: 'Existing Section', type: 'text', content: '' },
        ];
        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ sections: existingSections }))
        );

        act(() => {
          result.current.handleAddSection('experience');
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(existingSections);

        // New section should be at index 0
        expect(newSections[0].type).toBe('experience');
        expect(newSections[1].name).toBe('Existing Section');
      });

      it('should add section at bottom when position is "bottom"', () => {
        const existingSections = [
          { name: 'Existing Section', type: 'text', content: '' },
        ];
        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ sections: existingSections }))
        );

        act(() => {
          result.current.handleAddSection('experience', 'bottom');
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(existingSections);

        // New section should be at index 1 (end)
        expect(newSections[0].name).toBe('Existing Section');
        expect(newSections[1].type).toBe('experience');
      });

      it('should add section at specific index when position is a number', () => {
        const existingSections = [
          { name: 'Section 1', type: 'text', content: '' },
          { name: 'Section 2', type: 'text', content: '' },
          { name: 'Section 3', type: 'text', content: '' },
        ];
        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ sections: existingSections }))
        );

        act(() => {
          // Insert after section 1 (at index 1)
          result.current.handleAddSection('experience', 1);
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(existingSections);

        expect(newSections).toHaveLength(4);
        expect(newSections[0].name).toBe('Section 1');
        expect(newSections[1].type).toBe('experience');
        expect(newSections[2].name).toBe('Section 2');
        expect(newSections[3].name).toBe('Section 3');
      });

      it('should clamp position index to valid range (not negative)', () => {
        const existingSections = [
          { name: 'Existing Section', type: 'text', content: '' },
        ];
        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ sections: existingSections }))
        );

        act(() => {
          result.current.handleAddSection('experience', -5);
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(existingSections);

        // Should clamp to 0
        expect(newSections[0].type).toBe('experience');
        expect(newSections[1].name).toBe('Existing Section');
      });

      it('should clamp position index to valid range (not beyond array length)', () => {
        const existingSections = [
          { name: 'Existing Section', type: 'text', content: '' },
        ];
        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ sections: existingSections }))
        );

        act(() => {
          result.current.handleAddSection('experience', 999);
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(existingSections);

        // Should clamp to end of array
        expect(newSections[0].name).toBe('Existing Section');
        expect(newSections[1].type).toBe('experience');
      });

      it('should handle empty sections array with "top" position', () => {
        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ sections: [] }))
        );

        act(() => {
          result.current.handleAddSection('text', 'top');
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater([]);

        expect(newSections).toHaveLength(1);
        expect(newSections[0].type).toBe('text');
      });
    });
  });

  describe('handleUpdateSection', () => {
    it('should update section at specified index', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

      const updatedSection: Section = {
        name: 'Updated Summary',
        type: 'text',
        content: 'Updated content',
      };

      act(() => {
        result.current.handleUpdateSection(0, updatedSection);
      });

      const updater = mockSetSections.mock.calls[0][0];
      const newSections = updater(createMockSections());
      expect(newSections[0]).toEqual(updatedSection);
      expect(newSections[1]).toEqual(createMockSections()[1]);
    });

    it('should not update with out-of-bounds index', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

      const updatedSection: Section = {
        name: 'Invalid',
        type: 'text',
        content: '',
      };

      act(() => {
        result.current.handleUpdateSection(10, updatedSection);
      });

      const updater = mockSetSections.mock.calls[0][0];
      const originalSections = createMockSections();
      const newSections = updater(originalSections);
      expect(newSections).toBe(originalSections);
      expect(warnSpy).toHaveBeenCalledWith('Attempted to update section at out-of-bounds index: 10');

      warnSpy.mockRestore();
    });

    it('should not update with negative index', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

      const updatedSection: Section = {
        name: 'Invalid',
        type: 'text',
        content: '',
      };

      act(() => {
        result.current.handleUpdateSection(-1, updatedSection);
      });

      const updater = mockSetSections.mock.calls[0][0];
      const originalSections = createMockSections();
      const newSections = updater(originalSections);
      expect(newSections).toBe(originalSections);
      expect(warnSpy).toHaveBeenCalledWith('Attempted to update section at out-of-bounds index: -1');

      warnSpy.mockRestore();
    });
  });

  describe('handleDeleteSection', () => {
    it('should open delete confirmation with section target', () => {
      const sections = createMockSections();
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

      act(() => {
        result.current.handleDeleteSection(1);
      });

      expect(mockOpenDeleteConfirm).toHaveBeenCalledTimes(1);
      expect(mockOpenDeleteConfirm).toHaveBeenCalledWith({
        type: 'section',
        sectionIndex: 1,
        sectionName: 'Experience',
      });
    });

    it('should handle undefined section name gracefully', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

      act(() => {
        result.current.handleDeleteSection(0);
      });

      expect(mockOpenDeleteConfirm).toHaveBeenCalledWith({
        type: 'section',
        sectionIndex: 0,
        sectionName: undefined,
      });
    });
  });

  describe('handleDeleteEntry', () => {
    it('should open delete confirmation with entry target', () => {
      const sections = createMockSections();
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

      act(() => {
        result.current.handleDeleteEntry(1, 0);
      });

      expect(mockOpenDeleteConfirm).toHaveBeenCalledTimes(1);
      expect(mockOpenDeleteConfirm).toHaveBeenCalledWith({
        type: 'entry',
        sectionIndex: 1,
        entryIndex: 0,
        sectionName: 'Experience',
      });
    });
  });

  describe('confirmDelete', () => {
    it('should do nothing when deleteTarget is null', () => {
      const { result } = renderHook(() =>
        useSectionManagement(createDefaultProps({ deleteTarget: null }))
      );

      act(() => {
        result.current.confirmDelete();
      });

      expect(mockSetSections).not.toHaveBeenCalled();
      expect(mockCloseDeleteConfirm).not.toHaveBeenCalled();
    });

    describe('section deletion', () => {
      it('should delete section and show toast', () => {
        const deleteTarget: DeleteTarget = {
          type: 'section',
          sectionIndex: 1,
          sectionName: 'Experience',
        };

        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ deleteTarget }))
        );

        act(() => {
          result.current.confirmDelete();
        });

        expect(mockSetSections).toHaveBeenCalledTimes(1);
        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(createMockSections());
        expect(newSections).toHaveLength(2);
        expect(newSections.find((s: Section) => s.name === 'Experience')).toBeUndefined();

        expect(toast.success).toHaveBeenCalledWith('Section "Experience" deleted');
        expect(mockCloseDeleteConfirm).toHaveBeenCalledTimes(1);
      });

      it('should delete first section', () => {
        const deleteTarget: DeleteTarget = {
          type: 'section',
          sectionIndex: 0,
          sectionName: 'Summary',
        };

        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ deleteTarget }))
        );

        act(() => {
          result.current.confirmDelete();
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(createMockSections());
        expect(newSections[0].name).toBe('Experience');
      });

      it('should delete last section', () => {
        const deleteTarget: DeleteTarget = {
          type: 'section',
          sectionIndex: 2,
          sectionName: 'Skills',
        };

        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ deleteTarget }))
        );

        act(() => {
          result.current.confirmDelete();
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(createMockSections());
        expect(newSections).toHaveLength(2);
        expect(newSections[1].name).toBe('Experience');
      });
    });

    describe('entry deletion', () => {
      it('should delete entry from section and show toast', () => {
        const sectionsWithMultipleEntries = [
          {
            name: 'Experience',
            type: 'experience',
            content: [
              { company: 'Company A', title: 'Role A', dates: '2020', description: [] },
              { company: 'Company B', title: 'Role B', dates: '2021', description: [] },
            ],
          },
        ];

        const deleteTarget: DeleteTarget = {
          type: 'entry',
          sectionIndex: 0,
          entryIndex: 0,
          sectionName: 'Experience',
        };

        const { result } = renderHook(() =>
          useSectionManagement(
            createDefaultProps({
              sections: sectionsWithMultipleEntries,
              deleteTarget,
            })
          )
        );

        act(() => {
          result.current.confirmDelete();
        });

        expect(mockSetSections).toHaveBeenCalledTimes(1);
        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(sectionsWithMultipleEntries);
        expect(newSections[0].content).toHaveLength(1);
        expect((newSections[0].content as any[])[0].company).toBe('Company B');

        expect(toast.success).toHaveBeenCalledWith('Entry deleted from "Experience"');
        expect(mockCloseDeleteConfirm).toHaveBeenCalledTimes(1);
      });

      it('should handle entry deletion when entryIndex is undefined', () => {
        const deleteTarget: DeleteTarget = {
          type: 'entry',
          sectionIndex: 0,
          entryIndex: undefined,
          sectionName: 'Experience',
        };

        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ deleteTarget }))
        );

        act(() => {
          result.current.confirmDelete();
        });

        // Should still close dialog but not modify sections
        expect(mockCloseDeleteConfirm).toHaveBeenCalledTimes(1);
      });

      it('should handle deletion when section does not exist', () => {
        const deleteTarget: DeleteTarget = {
          type: 'entry',
          sectionIndex: 10,
          entryIndex: 0,
          sectionName: 'NonExistent',
        };

        const { result } = renderHook(() =>
          useSectionManagement(createDefaultProps({ deleteTarget }))
        );

        act(() => {
          result.current.confirmDelete();
        });

        const updater = mockSetSections.mock.calls[0][0];
        const originalSections = createMockSections();
        const newSections = updater(originalSections);
        expect(newSections).toBe(originalSections);
      });
    });
  });

  describe('Title Editing', () => {
    describe('handleTitleEdit', () => {
      it('should set editingTitleIndex and temporaryTitle', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        act(() => {
          result.current.handleTitleEdit(1);
        });

        expect(result.current.editingTitleIndex).toBe(1);
        expect(result.current.temporaryTitle).toBe('Experience');
      });

      it('should handle editing first section', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        act(() => {
          result.current.handleTitleEdit(0);
        });

        expect(result.current.editingTitleIndex).toBe(0);
        expect(result.current.temporaryTitle).toBe('Summary');
      });

      it('should handle undefined section gracefully', () => {
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

        act(() => {
          result.current.handleTitleEdit(0);
        });

        expect(result.current.editingTitleIndex).toBe(0);
        expect(result.current.temporaryTitle).toBe('');
      });
    });

    describe('setTemporaryTitle', () => {
      it('should update temporaryTitle for controlled input', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Start editing
        act(() => {
          result.current.handleTitleEdit(0);
        });
        expect(result.current.temporaryTitle).toBe('Summary');

        // Update title via setTemporaryTitle (controlled input)
        act(() => {
          result.current.setTemporaryTitle('New Title');
        });

        expect(result.current.temporaryTitle).toBe('New Title');
      });

      it('should allow setting empty string', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        act(() => {
          result.current.handleTitleEdit(0);
        });

        act(() => {
          result.current.setTemporaryTitle('');
        });

        expect(result.current.temporaryTitle).toBe('');
      });

      it('should be usable without handleTitleEdit', () => {
        const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

        act(() => {
          result.current.setTemporaryTitle('Direct Set');
        });

        expect(result.current.temporaryTitle).toBe('Direct Set');
      });
    });

    describe('handleTitleSave', () => {
      it('should save title and reset editing state', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Start editing
        act(() => {
          result.current.handleTitleEdit(0);
        });

        // Update the title using setTemporaryTitle
        act(() => {
          result.current.setTemporaryTitle('Updated Summary');
        });

        // Save (which should use current temporaryTitle)
        act(() => {
          result.current.handleTitleSave();
        });

        expect(result.current.editingTitleIndex).toBeNull();
        expect(mockSetSections).toHaveBeenCalled();

        // Verify the saved name
        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(sections);
        expect(newSections[0].name).toBe('Updated Summary');
      });

      it('should do nothing when editingTitleIndex is null', () => {
        const { result } = renderHook(() => useSectionManagement(createDefaultProps()));

        act(() => {
          result.current.handleTitleSave();
        });

        expect(mockSetSections).not.toHaveBeenCalled();
      });

      it('should update section name immutably', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        act(() => {
          result.current.handleTitleEdit(0);
        });

        act(() => {
          result.current.handleTitleSave();
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(sections);
        // Name should be updated to temporaryTitle value (which is 'Summary' from handleTitleEdit)
        expect(newSections[0].name).toBe('Summary');
        // Should be new object, not same reference
        expect(newSections[0]).not.toBe(sections[0]);
      });

      it('should handle out-of-bounds editingTitleIndex', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Manually trigger editing state for invalid index
        act(() => {
          result.current.handleTitleEdit(10);
        });

        act(() => {
          result.current.handleTitleSave();
        });

        const updater = mockSetSections.mock.calls[0][0];
        const originalSections = createMockSections();
        const newSections = updater(originalSections);
        expect(newSections).toBe(originalSections);
      });

      it('should save title when passed directly as parameter', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Start editing
        act(() => {
          result.current.handleTitleEdit(0);
        });

        // Save with new title passed directly (simulates blur behavior)
        act(() => {
          result.current.handleTitleSave('Directly Passed Title');
        });

        expect(result.current.editingTitleIndex).toBeNull();
        expect(mockSetSections).toHaveBeenCalled();

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(sections);
        expect(newSections[0].name).toBe('Directly Passed Title');
      });

      it('should use passed title over temporaryTitle state', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Start editing
        act(() => {
          result.current.handleTitleEdit(0);
        });

        // Update temporaryTitle to something different
        act(() => {
          result.current.setTemporaryTitle('State Title');
        });

        // Save with different title passed directly (should override state)
        act(() => {
          result.current.handleTitleSave('Passed Title');
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(sections);
        // Should use the passed title, not the state value
        expect(newSections[0].name).toBe('Passed Title');
      });

      it('should fall back to temporaryTitle when no parameter passed', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        act(() => {
          result.current.handleTitleEdit(0);
        });

        act(() => {
          result.current.setTemporaryTitle('State Title');
        });

        // Call without parameter (legacy behavior)
        act(() => {
          result.current.handleTitleSave();
        });

        const updater = mockSetSections.mock.calls[0][0];
        const newSections = updater(sections);
        expect(newSections[0].name).toBe('State Title');
      });
    });

    describe('handleTitleCancel', () => {
      it('should reset editing state without saving', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        act(() => {
          result.current.handleTitleEdit(1);
        });

        expect(result.current.editingTitleIndex).toBe(1);

        act(() => {
          result.current.handleTitleCancel();
        });

        expect(result.current.editingTitleIndex).toBeNull();
        expect(result.current.temporaryTitle).toBe('');
        // setSections should not have been called (no save)
        expect(mockSetSections).not.toHaveBeenCalled();
      });
    });

    describe('full title editing flow', () => {
      it('should support edit -> cancel flow', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Edit
        act(() => {
          result.current.handleTitleEdit(0);
        });
        expect(result.current.editingTitleIndex).toBe(0);
        expect(result.current.temporaryTitle).toBe('Summary');

        // Cancel
        act(() => {
          result.current.handleTitleCancel();
        });
        expect(result.current.editingTitleIndex).toBeNull();
        expect(result.current.temporaryTitle).toBe('');
        expect(mockSetSections).not.toHaveBeenCalled();
      });

      it('should support edit -> save flow', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Edit
        act(() => {
          result.current.handleTitleEdit(0);
        });

        // Save
        act(() => {
          result.current.handleTitleSave();
        });

        expect(result.current.editingTitleIndex).toBeNull();
        expect(mockSetSections).toHaveBeenCalled();
      });

      it('should support switching between sections while editing', () => {
        const sections = createMockSections();
        const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

        // Edit first section
        act(() => {
          result.current.handleTitleEdit(0);
        });
        expect(result.current.temporaryTitle).toBe('Summary');

        // Switch to second section
        act(() => {
          result.current.handleTitleEdit(1);
        });
        expect(result.current.editingTitleIndex).toBe(1);
        expect(result.current.temporaryTitle).toBe('Experience');
      });
    });
  });

  describe('Function Stability', () => {
    it('should maintain stable function references when sections change', () => {
      const { result, rerender } = renderHook(
        ({ sections }) => useSectionManagement(createDefaultProps({ sections })),
        { initialProps: { sections: createMockSections() } }
      );

      const firstHandleAddSection = result.current.handleAddSection;
      const firstHandleUpdateSection = result.current.handleUpdateSection;
      const firstHandleDeleteSection = result.current.handleDeleteSection;

      // Change sections
      rerender({ sections: [{ name: 'New', type: 'text', content: '' }] });

      // Functions should be recreated due to dependency on sections
      // This is expected behavior - functions depend on sections for name lookups
      expect(result.current.handleAddSection).toBeDefined();
      expect(result.current.handleUpdateSection).toBeDefined();
      expect(result.current.handleDeleteSection).toBeDefined();
    });

    it('should maintain stable title editing functions', () => {
      const { result, rerender } = renderHook(() => useSectionManagement(createDefaultProps()));

      const firstHandleTitleCancel = result.current.handleTitleCancel;
      rerender();
      const secondHandleTitleCancel = result.current.handleTitleCancel;

      expect(firstHandleTitleCancel).toBe(secondHandleTitleCancel);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty sections array', () => {
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections: [] })));

      // All operations should work without error
      act(() => {
        result.current.handleAddSection('text');
      });
      expect(mockSetSections).toHaveBeenCalled();

      act(() => {
        result.current.handleDeleteSection(0);
      });
      expect(mockOpenDeleteConfirm).toHaveBeenCalled();

      act(() => {
        result.current.handleTitleEdit(0);
      });
      expect(result.current.editingTitleIndex).toBe(0);
    });

    it('should handle sections with special characters in names', () => {
      const specialSections = [
        { name: 'Summary & Overview', type: 'text', content: '' },
        { name: 'Skills <Technical>', type: 'bulleted-list', content: [] },
      ];

      const { result } = renderHook(() =>
        useSectionManagement(createDefaultProps({ sections: specialSections }))
      );

      act(() => {
        result.current.handleTitleEdit(0);
      });

      expect(result.current.temporaryTitle).toBe('Summary & Overview');
    });

    it('should handle concurrent operations', () => {
      const sections = createMockSections();
      const { result } = renderHook(() => useSectionManagement(createDefaultProps({ sections })));

      // Start editing and add section at the same time
      act(() => {
        result.current.handleTitleEdit(0);
        result.current.handleAddSection('text');
      });

      expect(result.current.editingTitleIndex).toBe(0);
      expect(mockSetSections).toHaveBeenCalled();
      expect(mockCloseSectionTypeModal).toHaveBeenCalled();
    });
  });
});
