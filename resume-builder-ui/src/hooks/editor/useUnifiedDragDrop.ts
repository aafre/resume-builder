// src/hooks/editor/useUnifiedDragDrop.ts
// Unified drag-and-drop hook managing all drag levels (sections, items, subitems)

import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  DroppableContainer,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Section } from '../../types';
import { DraggedItemInfo } from '../../contexts/UnifiedDndContext';

/**
 * Drag level types for ID-based routing
 * - 'unknown' is returned for malformed IDs that don't match expected patterns
 */
export type DragLevel = 'section' | 'item' | 'subitem' | 'unknown';

/**
 * Item reorder handler registration
 */
export interface ItemReorderHandler {
  sectionId: string;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

/**
 * Props for useUnifiedDragDrop hook
 */
export interface UseUnifiedDragDropProps {
  sections: Section[];
  setSections: (sections: Section[] | ((prev: Section[]) => Section[])) => void;
}

/**
 * Return type for useUnifiedDragDrop hook
 */
export interface UseUnifiedDragDropReturn {
  /** Currently dragged ID, null if not dragging */
  activeId: string | null;
  /** Current drag level */
  activeLevel: DragLevel | null;
  /** Currently dragged section (if dragging a section) */
  draggedSection: Section | null;
  /** Currently dragged item info for preview */
  draggedItemInfo: DraggedItemInfo | null;
  /** Configured sensors for DndContext */
  sensors: ReturnType<typeof useSensors>;
  /** Handler for drag start event */
  handleDragStart: (event: DragStartEvent) => void;
  /** Handler for drag end event */
  handleDragEnd: (event: DragEndEvent) => void;
  /** Handler for drag cancel event */
  handleDragCancel: () => void;
  /** Custom collision detection for level-aware matching */
  collisionDetection: CollisionDetection;
  /** Register an item-level reorder handler */
  registerItemHandler: (sectionId: string, onReorder: (oldIndex: number, newIndex: number) => void) => void;
  /** Unregister an item-level reorder handler */
  unregisterItemHandler: (sectionId: string) => void;
  /** Set dragged item info for preview */
  setDraggedItemInfo: (info: DraggedItemInfo | null) => void;
}

/**
 * Parse drag level and extract info from ID
 *
 * ID formats:
 * - Section: "section-{index}"
 * - Item: "{sectionId}-item-{index}"
 * - Subitem: "{sectionId}-item-{itemIndex}-subitem-{subIndex}"
 */
export function parseDragId(id: string): {
  level: DragLevel;
  sectionIndex?: number;
  sectionId?: string;
  itemIndex?: number;
  subitemIndex?: number;
} {
  // Check for subitem first (most specific)
  const subitemMatch = id.match(/^(.+)-item-(\d+)-subitem-(\d+)$/);
  if (subitemMatch) {
    return {
      level: 'subitem',
      sectionId: subitemMatch[1],
      itemIndex: parseInt(subitemMatch[2], 10),
      subitemIndex: parseInt(subitemMatch[3], 10),
    };
  }

  // Check for item
  const itemMatch = id.match(/^(.+)-item-(\d+)$/);
  if (itemMatch) {
    return {
      level: 'item',
      sectionId: itemMatch[1],
      itemIndex: parseInt(itemMatch[2], 10),
    };
  }

  // Check for section
  const sectionMatch = id.match(/^section-(\d+)$/);
  if (sectionMatch) {
    return {
      level: 'section',
      sectionIndex: parseInt(sectionMatch[1], 10),
    };
  }

  // Return unknown level for malformed IDs
  return { level: 'unknown' };
}

/**
 * Get the parent context ID for collision filtering
 * - Sections match with other sections
 * - Items match with items in the same section
 * - Subitems match with subitems in the same item
 */
function getCollisionGroup(id: string): string {
  const parsed = parseDragId(id);

  switch (parsed.level) {
    case 'section':
      return 'sections';
    case 'item':
      return `items-${parsed.sectionId}`;
    case 'subitem':
      return `subitems-${parsed.sectionId}-item-${parsed.itemIndex}`;
    default:
      return 'unknown';
  }
}

/**
 * useUnifiedDragDrop Hook
 *
 * Manages drag-and-drop functionality for all levels (sections, items, subitems).
 * Uses a single DndContext with ID-based routing.
 *
 * Features:
 * - Unified sensor configuration
 * - Level-aware collision detection
 * - ID-based routing to appropriate handlers
 * - Support for registering item-level handlers dynamically
 */
export const useUnifiedDragDrop = ({
  sections,
  setSections,
}: UseUnifiedDragDropProps): UseUnifiedDragDropReturn => {
  // Track the currently dragged element
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<DragLevel | null>(null);
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);
  const [draggedItemInfo, setDraggedItemInfo] = useState<DraggedItemInfo | null>(null);

  // Registry for item-level reorder handlers
  const itemHandlersRef = useRef<Map<string, (oldIndex: number, newIndex: number) => void>>(new Map());

  /**
   * Configure sensors for drag-and-drop
   * - PointerSensor: 8px activation distance to prevent accidental drags
   * - TouchSensor: 150ms delay and 5px tolerance to distinguish from scroll gestures
   * - KeyboardSensor: Keyboard navigation support
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Register an item-level reorder handler
   */
  const registerItemHandler = useCallback(
    (sectionId: string, onReorder: (oldIndex: number, newIndex: number) => void) => {
      itemHandlersRef.current.set(sectionId, onReorder);
    },
    []
  );

  /**
   * Unregister an item-level reorder handler
   */
  const unregisterItemHandler = useCallback((sectionId: string) => {
    itemHandlersRef.current.delete(sectionId);
  }, []);

  /**
   * Custom collision detection that only matches items at the same level
   */
  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      const { active, droppableContainers } = args;

      if (!active?.id) {
        return rectIntersection(args);
      }

      const activeGroup = getCollisionGroup(String(active.id));

      // Filter droppable containers to only those in the same group
      const filteredContainers: DroppableContainer[] = [];
      droppableContainers.forEach((container) => {
        if (getCollisionGroup(String(container.id)) === activeGroup) {
          filteredContainers.push(container);
        }
      });

      // Use pointerWithin for more precise collision detection
      const collisions = pointerWithin({
        ...args,
        droppableContainers: filteredContainers,
      });

      // Fallback to rectIntersection if pointerWithin finds nothing
      if (collisions.length === 0) {
        return rectIntersection({
          ...args,
          droppableContainers: filteredContainers,
        });
      }

      return collisions;
    },
    []
  );

  /**
   * Handles the start of a drag operation
   */
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const id = String(active.id);
      const parsed = parseDragId(id);

      setActiveId(id);
      setActiveLevel(parsed.level);

      // If dragging a section, capture it for preview
      if (parsed.level === 'section' && parsed.sectionIndex !== undefined) {
        setDraggedSection(sections[parsed.sectionIndex] ?? null);
      } else {
        setDraggedSection(null);
      }
    },
    [sections]
  );

  /**
   * Handles the end of a drag operation
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        setActiveId(null);
        setActiveLevel(null);
        setDraggedSection(null);
        setDraggedItemInfo(null);
        return;
      }

      const activeId = String(active.id);
      const overId = String(over.id);
      const activeParsed = parseDragId(activeId);
      const overParsed = parseDragId(overId);

      // Only allow drops at the same level
      if (activeParsed.level !== overParsed.level) {
        setActiveId(null);
        setActiveLevel(null);
        setDraggedSection(null);
        setDraggedItemInfo(null);
        return;
      }

      switch (activeParsed.level) {
        case 'section': {
          const oldIndex = activeParsed.sectionIndex!;
          const newIndex = overParsed.sectionIndex!;

          if (oldIndex !== newIndex) {
            setSections((prevSections) => arrayMove(prevSections, oldIndex, newIndex));
            toast.success('Section reordered successfully!');
          }
          break;
        }

        case 'item': {
          // Items must be in the same section
          if (activeParsed.sectionId !== overParsed.sectionId) {
            break;
          }

          const handler = itemHandlersRef.current.get(activeParsed.sectionId!);
          if (handler) {
            handler(activeParsed.itemIndex!, overParsed.itemIndex!);
          }
          break;
        }

        case 'subitem': {
          // Subitems must be in the same item within the same section
          if (
            activeParsed.sectionId !== overParsed.sectionId ||
            activeParsed.itemIndex !== overParsed.itemIndex
          ) {
            break;
          }

          // Construct the parent item's handler key
          const parentKey = `${activeParsed.sectionId}-item-${activeParsed.itemIndex}`;
          const handler = itemHandlersRef.current.get(parentKey);
          if (handler) {
            handler(activeParsed.subitemIndex!, overParsed.subitemIndex!);
          }
          break;
        }
      }

      // Clear drag state
      setActiveId(null);
      setActiveLevel(null);
      setDraggedSection(null);
      setDraggedItemInfo(null);
    },
    [setSections]
  );

  /**
   * Handles drag cancellation
   */
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveLevel(null);
    setDraggedSection(null);
    setDraggedItemInfo(null);
  }, []);

  return {
    activeId,
    activeLevel,
    draggedSection,
    draggedItemInfo,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    collisionDetection,
    registerItemHandler,
    setDraggedItemInfo,
    unregisterItemHandler,
  };
};
