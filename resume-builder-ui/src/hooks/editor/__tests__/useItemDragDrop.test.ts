// src/hooks/editor/__tests__/useItemDragDrop.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useItemDragDrop } from '../useItemDragDrop';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

describe('useItemDragDrop', () => {
  const mockOnReorder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    items: ['Item 1', 'Item 2', 'Item 3'],
    sectionId: 'test-section',
    onReorder: mockOnReorder,
  };

  describe('initialization', () => {
    it('should initialize with null activeId and draggedItem', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedItem).toBeNull();
    });

    it('should generate correct itemIds based on sectionId and indices', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      expect(result.current.itemIds).toEqual([
        'test-section-item-0',
        'test-section-item-1',
        'test-section-item-2',
      ]);
    });

    it('should update itemIds when items length changes', () => {
      const { result, rerender } = renderHook(
        (props) => useItemDragDrop(props),
        { initialProps: defaultProps }
      );

      expect(result.current.itemIds).toHaveLength(3);

      rerender({
        ...defaultProps,
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      });

      expect(result.current.itemIds).toHaveLength(4);
      expect(result.current.itemIds[3]).toBe('test-section-item-3');
    });
  });

  describe('sensors', () => {
    it('should return configured sensors', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      // Sensors is an array of sensor configurations
      expect(result.current.sensors).toBeDefined();
      expect(Array.isArray(result.current.sensors)).toBe(true);
    });
  });

  describe('handleDragStart', () => {
    it('should set activeId and draggedItem on drag start', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      const mockEvent = {
        active: { id: 'test-section-item-1' },
      } as DragStartEvent;

      act(() => {
        result.current.handleDragStart(mockEvent);
      });

      expect(result.current.activeId).toBe('test-section-item-1');
      expect(result.current.draggedItem).toBe('Item 2');
    });

    it('should handle invalid item index gracefully', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      const mockEvent = {
        active: { id: 'test-section-item-99' },
      } as DragStartEvent;

      act(() => {
        result.current.handleDragStart(mockEvent);
      });

      expect(result.current.activeId).toBe('test-section-item-99');
      expect(result.current.draggedItem).toBeNull();
    });

    it('should handle wrong sectionId prefix', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      const mockEvent = {
        active: { id: 'other-section-item-1' },
      } as DragStartEvent;

      act(() => {
        result.current.handleDragStart(mockEvent);
      });

      expect(result.current.activeId).toBe('other-section-item-1');
      expect(result.current.draggedItem).toBeNull();
    });
  });

  describe('handleDragEnd', () => {
    it('should call onReorder when item is moved to a new position', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      // Start drag first
      act(() => {
        result.current.handleDragStart({
          active: { id: 'test-section-item-0' },
        } as DragStartEvent);
      });

      // End drag at new position
      act(() => {
        result.current.handleDragEnd({
          active: { id: 'test-section-item-0' },
          over: { id: 'test-section-item-2' },
        } as unknown as DragEndEvent);
      });

      expect(mockOnReorder).toHaveBeenCalledWith(0, 2);
      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedItem).toBeNull();
    });

    it('should not call onReorder when item is dropped at same position', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      act(() => {
        result.current.handleDragStart({
          active: { id: 'test-section-item-1' },
        } as DragStartEvent);
      });

      act(() => {
        result.current.handleDragEnd({
          active: { id: 'test-section-item-1' },
          over: { id: 'test-section-item-1' },
        } as unknown as DragEndEvent);
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('should not call onReorder when over is null (dropped outside)', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      act(() => {
        result.current.handleDragStart({
          active: { id: 'test-section-item-1' },
        } as DragStartEvent);
      });

      act(() => {
        result.current.handleDragEnd({
          active: { id: 'test-section-item-1' },
          over: null,
        } as unknown as DragEndEvent);
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
      expect(result.current.activeId).toBeNull();
    });

    it('should clear drag state after drag end', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      act(() => {
        result.current.handleDragStart({
          active: { id: 'test-section-item-0' },
        } as DragStartEvent);
      });

      expect(result.current.activeId).not.toBeNull();

      act(() => {
        result.current.handleDragEnd({
          active: { id: 'test-section-item-0' },
          over: { id: 'test-section-item-1' },
        } as unknown as DragEndEvent);
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedItem).toBeNull();
    });
  });

  describe('handleDragCancel', () => {
    it('should clear drag state on cancel', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      // Start drag
      act(() => {
        result.current.handleDragStart({
          active: { id: 'test-section-item-1' },
        } as DragStartEvent);
      });

      expect(result.current.activeId).toBe('test-section-item-1');

      // Cancel drag
      act(() => {
        result.current.handleDragCancel();
      });

      expect(result.current.activeId).toBeNull();
      expect(result.current.draggedItem).toBeNull();
    });

    it('should not call onReorder on cancel', () => {
      const { result } = renderHook(() => useItemDragDrop(defaultProps));

      act(() => {
        result.current.handleDragStart({
          active: { id: 'test-section-item-0' },
        } as DragStartEvent);
      });

      act(() => {
        result.current.handleDragCancel();
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });
  });

  describe('complex object items', () => {
    it('should work with object items', () => {
      const objectItems = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' },
        { id: 3, name: 'Third' },
      ];

      const { result } = renderHook(() =>
        useItemDragDrop({
          items: objectItems,
          sectionId: 'objects',
          onReorder: mockOnReorder,
        })
      );

      act(() => {
        result.current.handleDragStart({
          active: { id: 'objects-item-1' },
        } as DragStartEvent);
      });

      expect(result.current.draggedItem).toEqual({ id: 2, name: 'Second' });
    });
  });
});
