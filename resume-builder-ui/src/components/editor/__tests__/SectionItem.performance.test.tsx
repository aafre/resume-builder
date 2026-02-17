// src/components/editor/__tests__/SectionItem.performance.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import SectionItem, { SectionItemProps } from '../SectionItem';
import { Section } from '../../../types';
import { EditorContentIconRegistry, EditorContentRefs } from '../EditorContent';

// Mock components
const sectionRendererRenderCount = { current: 0 };
vi.mock('../SectionRenderer', () => ({
  default: () => {
    sectionRendererRenderCount.current++;
    return <div data-testid="section-renderer" />;
  },
}));

const dragHandleRenderCount = { current: 0 };
vi.mock('../../DragHandle', () => ({
  default: ({ children }: { children: React.ReactNode }) => {
    dragHandleRenderCount.current++;
    return <div data-testid="drag-handle">{children}</div>;
  },
}));

describe('SectionItem Performance', () => {
  const mockIconRegistry: EditorContentIconRegistry = {
    registerIcon: vi.fn(),
    registerIconWithFilename: vi.fn(),
    getIconFile: vi.fn(),
    removeIcon: vi.fn(),
    clearRegistry: vi.fn(),
    getRegisteredFilenames: vi.fn().mockReturnValue([]),
    getRegistrySize: vi.fn().mockReturnValue(0),
  };

  const mockRefs: EditorContentRefs = {
    contactInfoRef: { current: null },
    sectionRefs: { current: [] },
    newSectionRef: { current: null },
  };

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

  const testSection: Section = {
    name: 'Experience',
    type: 'experience',
    content: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sectionRendererRenderCount.current = 0;
    dragHandleRenderCount.current = 0;
  });

  const createProps = (overrides = {}): SectionItemProps => ({
    section: testSection,
    index: 0,
    isLast: false,
    supportsIcons: true,
    iconRegistry: mockIconRegistry,
    refs: mockRefs,
    ...stableHandlers,
    isEditingTitle: false,
    temporaryTitle: '',
    ...overrides,
  });

  it('should not re-render DragHandle when props are unchanged (memoization)', () => {
    const props = createProps();
    const { rerender } = render(<SectionItem {...props} />);

    const initialRenderCount = dragHandleRenderCount.current;

    // Rerender with same props
    rerender(<SectionItem {...props} />);

    // If SectionItem re-renders, DragHandle re-renders.
    // If SectionItem is memoized correctly, DragHandle count should not increase.
    expect(dragHandleRenderCount.current).toBe(initialRenderCount);
  });

  it('should re-render DragHandle when section changes', () => {
    const props = createProps();
    const { rerender } = render(<SectionItem {...props} />);

    const initialRenderCount = dragHandleRenderCount.current;

    const newSection = { ...testSection, name: 'New Name' };
    rerender(<SectionItem {...createProps({ section: newSection })} />);

    expect(dragHandleRenderCount.current).toBeGreaterThan(initialRenderCount);
  });

  it('should re-render DragHandle when isEditingTitle changes', () => {
    const props = createProps({ isEditingTitle: false });
    const { rerender } = render(<SectionItem {...props} />);

    const initialRenderCount = dragHandleRenderCount.current;

    rerender(<SectionItem {...createProps({ isEditingTitle: true })} />);

    expect(dragHandleRenderCount.current).toBeGreaterThan(initialRenderCount);
  });

  it('should NOT re-render DragHandle when handlers are stable', () => {
     // Verify that passing same handler references preserves memoization
    const props = createProps();
    const { rerender } = render(<SectionItem {...props} />);

    const initialRenderCount = dragHandleRenderCount.current;

    rerender(<SectionItem {...props} />);

    expect(dragHandleRenderCount.current).toBe(initialRenderCount);
  });
});
