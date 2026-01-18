// src/contexts/UnifiedDndContext.tsx
// React context for passing unified drag-and-drop handlers to child components

import { createContext, useContext } from 'react';

/**
 * Dragged item info for preview
 */
export interface DraggedItemInfo {
  /** Primary label (e.g., company name, school name) */
  label: string;
  /** Secondary label (e.g., job title, degree) */
  sublabel?: string;
  /** Type of item for icon selection */
  type: 'experience' | 'education' | 'certification' | 'bullet' | 'generic';
}

/**
 * Context value for unified drag-and-drop
 */
export interface UnifiedDndContextValue {
  /** Register an item-level reorder handler */
  registerItemHandler: (sectionId: string, onReorder: (oldIndex: number, newIndex: number) => void) => void;
  /** Unregister an item-level reorder handler */
  unregisterItemHandler: (sectionId: string) => void;
  /** Report dragged item info for preview */
  setDraggedItemInfo: (info: DraggedItemInfo | null) => void;
  /** Current dragged item info */
  draggedItemInfo: DraggedItemInfo | null;
}

/**
 * React context for unified drag-and-drop
 */
export const UnifiedDndContext = createContext<UnifiedDndContextValue | null>(null);

/**
 * Hook to access the unified drag-and-drop context
 * @throws Error if used outside of UnifiedDndContext.Provider
 */
export function useUnifiedDndContext(): UnifiedDndContextValue {
  const context = useContext(UnifiedDndContext);
  if (!context) {
    throw new Error('useUnifiedDndContext must be used within a UnifiedDndContext.Provider');
  }
  return context;
}

/**
 * Hook to optionally access the unified drag-and-drop context
 * Returns null if not within a provider (for backwards compatibility)
 */
export function useOptionalUnifiedDndContext(): UnifiedDndContextValue | null {
  return useContext(UnifiedDndContext);
}
