// src/hooks/editor/__tests__/useSectionDragDrop.test.ts
// Tests for useSectionDragDrop hook

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSectionDragDrop } from '../useSectionDragDrop';
import { Section } from '../../../types';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
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

/**
 * Helper function to create DragStartEvent test objects
 * Reduces boilerplate and improves test readability
 */
const createDragStartEvent = (id: string): DragStartEvent => ({
  active: {
    id,
    data: { current: {} },
    rect: { current: { initial: null, translated: null } },
  },
});

/**
 * Helper function to create DragEndEvent test objects
 * Reduces boilerplate and improves test readability
 *
 * @param activeId - ID of the dragged element
 * @param overId - ID of the drop target (null if dropped outside valid area)
 */
const createDragEndEvent = (activeId: string, overId: string | null): DragEndEvent => ({
  active: {
    id: activeId,
    data: { current: {} },
    rect: { current: { initial: null, translated: null } },
  },
  over: overId
    ? {
        id: overId,
        data: { current: {} },
        rect: { current: { initial: null, translated: null } },
        disabled: false,
      }
    : null,
  delta: { x: 0, y: 0 },
  collisions: null,
});

describe('useSectionDragDrop', () => {
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

    setSections = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with null activeId and draggedSection', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedSection).toBeNull();
    });

    it('should configure sensors correctly', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      expect(result.current.sensors).toBeDefined();
      expect(Array.isArray(result.current.sensors)).toBe(true);
    });

    it('should expose all required handlers', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      expect(typeof result.current.handleDragStart).toBe('function');
      expect(typeof result.current.handleDragEnd).toBe('function');
      expect(typeof result.current.handleDragCancel).toBe('function');
    });
  });

  describe('handleDragStart', () => {
    it('should set activeId when drag starts', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      expect(result.current.activeId).toBe('0');
    });

    it('should set draggedSection to the correct section', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragStart(createDragStartEvent('1'));
      });

      expect(result.current.draggedSection).toEqual(sections[1]);
      expect(result.current.draggedSection?.name).toBe('Education');
    });

    it('should handle drag start for first section', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      expect(result.current.activeId).toBe('0');
      expect(result.current.draggedSection).toEqual(sections[0]);
    });

    it('should handle drag start for last section', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragStart(createDragStartEvent('2'));
      });

      expect(result.current.activeId).toBe('2');
      expect(result.current.draggedSection).toEqual(sections[2]);
    });
  });

  describe('handleDragEnd', () => {
    it('should call setSections with reordered array when position changes', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', '2'));
      });

      expect(setSections).toHaveBeenCalledTimes(1);
      expect(setSections).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should reorder sections correctly (move down)', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', '2'));
      });

      // Get the updater function that was passed to setSections
      const updater = setSections.mock.calls[0][0];
      const reorderedSections = updater(sections);

      // Verify the order: Education, Skills, Experience
      expect(reorderedSections[0].name).toBe('Education');
      expect(reorderedSections[1].name).toBe('Skills');
      expect(reorderedSections[2].name).toBe('Experience');
    });

    it('should reorder sections correctly (move up)', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragEnd(createDragEndEvent('2', '0'));
      });

      const updater = setSections.mock.calls[0][0];
      const reorderedSections = updater(sections);

      // Verify the order: Skills, Experience, Education
      expect(reorderedSections[0].name).toBe('Skills');
      expect(reorderedSections[1].name).toBe('Experience');
      expect(reorderedSections[2].name).toBe('Education');
    });

    it('should show success toast when position changes', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', '1'));
      });

      expect(toast.success).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Section reordered successfully!');
    });

    it('should clear drag state after drag end', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start drag
      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      expect(result.current.activeId).toBe('0');
      expect(result.current.draggedSection).not.toBeNull();

      // End drag
      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', '1'));
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedSection).toBeNull();
    });

    it('should not call setSections when dropped at same position', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragEnd(createDragEndEvent('1', '1'));
      });

      expect(setSections).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('should not call setSections when over is null', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', null));
      });

      expect(setSections).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('should clear drag state even when over is null', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start drag
      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      // End drag with no over target
      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', null));
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedSection).toBeNull();
    });
  });

  describe('handleDragCancel', () => {
    it('should clear activeId when drag is cancelled', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start drag
      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      expect(result.current.activeId).toBe('0');

      // Cancel drag
      act(() => {
        result.current.handleDragCancel();
      });

      expect(result.current.activeId).toBeNull();
    });

    it('should clear draggedSection when drag is cancelled', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start drag
      act(() => {
        result.current.handleDragStart(createDragStartEvent('1'));
      });

      expect(result.current.draggedSection).not.toBeNull();

      // Cancel drag
      act(() => {
        result.current.handleDragCancel();
      });

      expect(result.current.draggedSection).toBeNull();
    });

    it('should not call setSections when drag is cancelled', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start drag
      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      // Cancel drag
      act(() => {
        result.current.handleDragCancel();
      });

      expect(setSections).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty sections array', () => {
      const emptySections: Section[] = [];
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections: emptySections, setSections })
      );

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedSection).toBeNull();
      expect(result.current.sensors).toBeDefined();
    });

    it('should handle single section array', () => {
      const singleSection: Section[] = [
        { name: 'Experience', type: 'experience', content: [] },
      ];

      const { result } = renderHook(() =>
        useSectionDragDrop({ sections: singleSection, setSections })
      );

      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      expect(result.current.draggedSection).toEqual(singleSection[0]);
    });

    it('should update draggedSection when sections prop changes', () => {
      const { result, rerender } = renderHook(
        ({ sections, setSections }) =>
          useSectionDragDrop({ sections, setSections }),
        {
          initialProps: { sections, setSections },
        }
      );

      // Start drag with index 1 (Education)
      act(() => {
        result.current.handleDragStart(createDragStartEvent('1'));
      });

      expect(result.current.draggedSection?.name).toBe('Education');

      // Update sections prop (simulate external change)
      const updatedSections = [
        ...sections,
        { name: 'Projects', type: 'bulleted-list', content: [] },
      ];

      rerender({ sections: updatedSections, setSections });

      // Start a new drag - should use updated sections
      act(() => {
        result.current.handleDragStart(createDragStartEvent('3'));
      });

      expect(result.current.draggedSection?.name).toBe('Projects');
    });
  });

  describe('drag lifecycle', () => {
    it('should handle complete drag lifecycle (start -> end)', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start
      act(() => {
        result.current.handleDragStart(createDragStartEvent('0'));
      });

      expect(result.current.activeId).toBe('0');
      expect(result.current.draggedSection).toEqual(sections[0]);

      // End
      act(() => {
        result.current.handleDragEnd(createDragEndEvent('0', '2'));
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedSection).toBeNull();
      expect(setSections).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledTimes(1);
    });

    it('should handle complete drag lifecycle (start -> cancel)', () => {
      const { result } = renderHook(() =>
        useSectionDragDrop({ sections, setSections })
      );

      // Start
      act(() => {
        result.current.handleDragStart(createDragStartEvent('1'));
      });

      expect(result.current.activeId).toBe('1');
      expect(result.current.draggedSection).toEqual(sections[1]);

      // Cancel
      act(() => {
        result.current.handleDragCancel();
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedSection).toBeNull();
      expect(setSections).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
