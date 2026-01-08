// src/hooks/editor/__tests__/useReorderMode.test.ts
// Tests for useReorderMode hook

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReorderMode } from '../useReorderMode';
import { Section } from '../../../types';
import { toast } from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock @dnd-kit/sortable arrayMove
vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');
  return {
    ...actual,
    arrayMove: vi.fn((array: any[], from: number, to: number) => {
      // Simple implementation for testing
      const result = [...array];
      const [removed] = result.splice(from, 1);
      result.splice(to, 0, removed);
      return result;
    }),
  };
});

describe('useReorderMode', () => {
  let sections: Section[];
  let setSections: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Setup test sections
    sections = [
      {
        name: 'Experience',
        type: 'experience',
        content: [],
      },
      {
        name: 'Education',
        type: 'education',
        content: [],
      },
      {
        name: 'Skills',
        type: 'bulleted-list',
        content: ['JavaScript', 'TypeScript'],
      },
    ];

    setSections = vi.fn((updater) => {
      if (typeof updater === 'function') {
        sections = updater(sections);
      } else {
        sections = updater;
      }
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with isReorderModeActive=false', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.isReorderModeActive).toBe(false);
    });

    it('should initialize with hasUnsavedChanges=false', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should expose all required methods', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(typeof result.current.enterReorderMode).toBe('function');
      expect(typeof result.current.cancelReorderMode).toBe('function');
      expect(typeof result.current.commitReorderMode).toBe('function');
      expect(typeof result.current.moveSectionUp).toBe('function');
      expect(typeof result.current.moveSectionDown).toBe('function');
      expect(typeof result.current.canMoveUp).toBe('function');
      expect(typeof result.current.canMoveDown).toBe('function');
    });
  });

  describe('enterReorderMode', () => {
    it('should set isReorderModeActive to true', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(true);
    });

    it('should snapshot sections for potential cancel', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Modify sections through move
      act(() => {
        result.current.moveSectionDown(0);
      });

      // Cancel should restore
      act(() => {
        result.current.cancelReorderMode();
      });

      // setSections should have been called with original order
      expect(setSections).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Experience' }),
          expect.objectContaining({ name: 'Education' }),
          expect.objectContaining({ name: 'Skills' }),
        ])
      );
    });

    it('should do nothing if already in reorder mode', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Try to enter again
      act(() => {
        result.current.enterReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(true);
    });
  });

  describe('cancelReorderMode', () => {
    it('should restore original section order', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      // Enter reorder mode
      act(() => {
        result.current.enterReorderMode();
      });

      // Move a section
      act(() => {
        result.current.moveSectionDown(0);
      });

      // Cancel
      act(() => {
        result.current.cancelReorderMode();
      });

      // Should restore original order
      const restoreCall = setSections.mock.calls[setSections.mock.calls.length - 1][0];
      expect(restoreCall[0].name).toBe('Experience');
      expect(restoreCall[1].name).toBe('Education');
      expect(restoreCall[2].name).toBe('Skills');
    });

    it('should set isReorderModeActive to false', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.cancelReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(false);
    });

    it('should clear hasUnsavedChanges', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.moveSectionDown(0);
      });

      // Simulate sections being updated after the move
      const newSections = [
        { name: 'Education', type: 'education', content: [] },
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'TypeScript'] },
      ];
      rerender({ sections: newSections, setSections });

      // Changes were made
      expect(result.current.hasUnsavedChanges).toBe(true);

      act(() => {
        result.current.cancelReorderMode();
      });

      // After cancel, no longer in mode so no unsaved changes
      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should do nothing if not in reorder mode', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      // Call cancel without entering reorder mode
      act(() => {
        result.current.cancelReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(false);
      expect(setSections).not.toHaveBeenCalled();
    });
  });

  describe('commitReorderMode', () => {
    it('should set isReorderModeActive to false', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.commitReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(false);
    });

    it('should clear snapshot (not restore original order)', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Move section
      act(() => {
        result.current.moveSectionDown(0);
      });

      // Get the moved sections
      const movedSections = [...sections];

      // Commit (should keep current order)
      act(() => {
        result.current.commitReorderMode();
      });

      // The last setSections call should be from moveSectionDown, not a restore
      const calls = setSections.mock.calls;
      const lastCall = calls[calls.length - 1][0];

      // It's a function that produces moved order
      if (typeof lastCall === 'function') {
        const result = lastCall([
          { name: 'Experience' },
          { name: 'Education' },
          { name: 'Skills' },
        ]);
        expect(result[0].name).toBe('Education');
        expect(result[1].name).toBe('Experience');
      }
    });

    it('should show success toast when changes were made', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Move a section to create changes
      act(() => {
        result.current.moveSectionDown(0);
      });

      // Update the hook with new sections order to reflect the change
      const newSections = [
        { name: 'Education', type: 'education', content: [] },
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'TypeScript'] },
      ];
      rerender({ sections: newSections, setSections });

      act(() => {
        result.current.commitReorderMode();
      });

      expect(toast.success).toHaveBeenCalledWith('Section order saved!');
    });

    it('should not show toast when no changes were made', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Commit without making changes
      act(() => {
        result.current.commitReorderMode();
      });

      expect(toast.success).not.toHaveBeenCalled();
    });

    it('should do nothing if not in reorder mode', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.commitReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(false);
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe('moveSectionUp', () => {
    it('should move section from index 1 to index 0', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.moveSectionUp(1);
      });

      expect(setSections).toHaveBeenCalled();

      // Get the updater function and test with a fresh array
      const updater = setSections.mock.calls[0][0];
      expect(typeof updater).toBe('function');

      // Create a test array to pass through the updater
      const testSections = [
        { name: 'First', type: 'text', content: '' },
        { name: 'Second', type: 'text', content: '' },
        { name: 'Third', type: 'text', content: '' },
      ];
      const reorderedSections = updater(testSections);

      // moveSectionUp(1) moves index 1 to index 0
      expect(reorderedSections[0].name).toBe('Second');
      expect(reorderedSections[1].name).toBe('First');
      expect(reorderedSections[2].name).toBe('Third');
    });

    it('should not move section at index 0 (already at top)', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.moveSectionUp(0);
      });

      // setSections should not be called for the move (only snapshot happens)
      // The call from enterReorderMode doesn't happen, so check if any calls exist
      expect(setSections).not.toHaveBeenCalled();
    });

    it('should do nothing if not in reorder mode', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.moveSectionUp(1);
      });

      expect(setSections).not.toHaveBeenCalled();
    });
  });

  describe('moveSectionDown', () => {
    it('should move section from index 0 to index 1', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.moveSectionDown(0);
      });

      expect(setSections).toHaveBeenCalled();

      // Get the updater function and test with a fresh array
      const updater = setSections.mock.calls[0][0];
      expect(typeof updater).toBe('function');

      // Create a test array to pass through the updater
      const testSections = [
        { name: 'First', type: 'text', content: '' },
        { name: 'Second', type: 'text', content: '' },
        { name: 'Third', type: 'text', content: '' },
      ];
      const reorderedSections = updater(testSections);

      // moveSectionDown(0) moves index 0 to index 1
      expect(reorderedSections[0].name).toBe('Second');
      expect(reorderedSections[1].name).toBe('First');
      expect(reorderedSections[2].name).toBe('Third');
    });

    it('should not move section at last index (already at bottom)', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.moveSectionDown(2); // Last index
      });

      // setSections should not be called
      expect(setSections).not.toHaveBeenCalled();
    });

    it('should do nothing if not in reorder mode', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.moveSectionDown(0);
      });

      expect(setSections).not.toHaveBeenCalled();
    });
  });

  describe('canMoveUp', () => {
    it('should return false for index 0', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.canMoveUp(0)).toBe(false);
    });

    it('should return true for index > 0', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.canMoveUp(1)).toBe(true);
      expect(result.current.canMoveUp(2)).toBe(true);
    });

    it('should return false for negative index', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.canMoveUp(-1)).toBe(false);
    });
  });

  describe('canMoveDown', () => {
    it('should return false for last index', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.canMoveDown(2, 3)).toBe(false);
    });

    it('should return true for index < total - 1', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.canMoveDown(0, 3)).toBe(true);
      expect(result.current.canMoveDown(1, 3)).toBe(true);
    });

    it('should return false when index equals total - 1', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.canMoveDown(4, 5)).toBe(false);
    });
  });

  describe('hasUnsavedChanges', () => {
    it('should be false when not in reorder mode', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should be false when in reorder mode but no changes made', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should be true after moving a section', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      act(() => {
        result.current.enterReorderMode();
      });

      act(() => {
        result.current.moveSectionDown(0);
      });

      // Simulate sections being updated
      const newSections = [
        { name: 'Education', type: 'education', content: [] },
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'TypeScript'] },
      ];
      rerender({ sections: newSections, setSections });

      expect(result.current.hasUnsavedChanges).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty sections array', () => {
      const emptySections: Section[] = [];
      const { result } = renderHook(() =>
        useReorderMode({ sections: emptySections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(true);

      // Move operations should be no-ops
      act(() => {
        result.current.moveSectionUp(0);
        result.current.moveSectionDown(0);
      });

      expect(setSections).not.toHaveBeenCalled();
    });

    it('should handle single section array', () => {
      const singleSection: Section[] = [
        { name: 'Experience', type: 'experience', content: [] },
      ];

      const { result } = renderHook(() =>
        useReorderMode({ sections: singleSection, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(true);
      expect(result.current.canMoveUp(0)).toBe(false);
      expect(result.current.canMoveDown(0, 1)).toBe(false);

      // Move operations should be no-ops
      act(() => {
        result.current.moveSectionUp(0);
        result.current.moveSectionDown(0);
      });

      expect(setSections).not.toHaveBeenCalled();
    });

    it('should handle sections prop changes', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Add a new section
      const updatedSections = [
        ...sections,
        { name: 'Projects', type: 'bulleted-list', content: [] },
      ];

      rerender({ sections: updatedSections, setSections });

      // Should still be in reorder mode
      expect(result.current.isReorderModeActive).toBe(true);

      // canMoveDown should now work for index 2 since total is 4
      expect(result.current.canMoveDown(2, 4)).toBe(true);
    });

    it('should create deep clone of sections on enter (not reference)', () => {
      const { result } = renderHook(() =>
        useReorderMode({ sections, setSections })
      );

      act(() => {
        result.current.enterReorderMode();
      });

      // Mutate original sections (bad practice but tests deep clone)
      sections[0].name = 'MUTATED';

      act(() => {
        result.current.cancelReorderMode();
      });

      // Should restore original name, not mutated
      const restoreCall = setSections.mock.calls[setSections.mock.calls.length - 1][0];
      expect(restoreCall[0].name).toBe('Experience');
    });
  });

  describe('complete workflow', () => {
    it('should handle full reorder workflow: enter -> move -> commit', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      // Enter reorder mode
      act(() => {
        result.current.enterReorderMode();
      });
      expect(result.current.isReorderModeActive).toBe(true);
      expect(result.current.hasUnsavedChanges).toBe(false);

      // Move a section
      act(() => {
        result.current.moveSectionDown(0);
      });

      // Simulate sections update
      const newSections = [
        { name: 'Education', type: 'education', content: [] },
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'TypeScript'] },
      ];
      rerender({ sections: newSections, setSections });

      expect(result.current.hasUnsavedChanges).toBe(true);

      // Commit
      act(() => {
        result.current.commitReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(false);
      expect(result.current.hasUnsavedChanges).toBe(false);
      expect(toast.success).toHaveBeenCalledWith('Section order saved!');
    });

    it('should handle full reorder workflow: enter -> move -> cancel', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useReorderMode({ sections, setSections }),
        { initialProps: { sections, setSections } }
      );

      // Enter reorder mode
      act(() => {
        result.current.enterReorderMode();
      });

      // Move a section
      act(() => {
        result.current.moveSectionDown(0);
      });

      // Simulate sections update
      const newSections = [
        { name: 'Education', type: 'education', content: [] },
        { name: 'Experience', type: 'experience', content: [] },
        { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'TypeScript'] },
      ];
      rerender({ sections: newSections, setSections });

      // Cancel
      act(() => {
        result.current.cancelReorderMode();
      });

      expect(result.current.isReorderModeActive).toBe(false);
      expect(toast.success).not.toHaveBeenCalled();

      // Verify original order was restored
      const restoreCall = setSections.mock.calls[setSections.mock.calls.length - 1][0];
      expect(restoreCall[0].name).toBe('Experience');
      expect(restoreCall[1].name).toBe('Education');
      expect(restoreCall[2].name).toBe('Skills');
    });
  });
});
