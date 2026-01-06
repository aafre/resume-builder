// src/hooks/editor/__tests__/useSectionNavigation.test.ts
// Tests for useSectionNavigation hook

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSectionNavigation } from '../useSectionNavigation';
import { Section } from '../../../types';
import { RefObject } from 'react';

/**
 * Helper to create a mock ref object
 */
const createMockRef = <T,>(value: T): RefObject<T> => ({
  current: value,
});

/**
 * Helper to create a mock HTMLDivElement with getBoundingClientRect
 */
const createMockDiv = (top: number, height: number): HTMLDivElement => {
  const div = document.createElement('div');
  vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
  return div;
};

describe('useSectionNavigation', () => {
  let sections: Section[];
  let contactInfoRef: RefObject<HTMLDivElement>;
  let sectionRefs: RefObject<(HTMLDivElement | null)[]>;
  let setContextIsSidebarCollapsed: ReturnType<typeof vi.fn>;
  let originalScrollY: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Setup test sections
    sections = [
      { name: 'Experience', type: 'experience', content: [] },
      { name: 'Education', type: 'education', content: [] },
      { name: 'Skills', type: 'bulleted-list', content: ['JavaScript', 'TypeScript'] },
    ];

    // Setup mock refs with getBoundingClientRect
    const contactDiv = createMockDiv(0, 200); // Contact at top, 200px tall
    const section0Div = createMockDiv(200, 300); // Section 0: 200-500
    const section1Div = createMockDiv(500, 250); // Section 1: 500-750
    const section2Div = createMockDiv(750, 200); // Section 2: 750-950

    contactInfoRef = createMockRef(contactDiv);
    sectionRefs = createMockRef([section0Div, section1Div, section2Div]);

    setContextIsSidebarCollapsed = vi.fn();

    // Save and mock window properties
    originalScrollY = window.scrollY;
    originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, writable: true, configurable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true, configurable: true });

    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore window properties
    Object.defineProperty(window, 'scrollY', { value: originalScrollY, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true, configurable: true });
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize and run scroll check (activeSectionIndex determined by scroll)', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      // Initial scroll check runs on mount
      // At scrollY=0, viewport middle = 300, which is in section 0 (200-500)
      expect(result.current.activeSectionIndex).toBe(0);
    });

    it('should initialize with isSidebarCollapsed = false', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      expect(result.current.isSidebarCollapsed).toBe(false);
    });

    it('should expose all required methods', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      expect(typeof result.current.setActiveSectionIndex).toBe('function');
      expect(typeof result.current.setIsSidebarCollapsed).toBe('function');
      expect(typeof result.current.scrollToSection).toBe('function');
    });
  });

  describe('setIsSidebarCollapsed', () => {
    it('should update local state when collapsed', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.setIsSidebarCollapsed(true);
      });

      expect(result.current.isSidebarCollapsed).toBe(true);
    });

    it('should update local state when expanded', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      // Collapse first
      act(() => {
        result.current.setIsSidebarCollapsed(true);
      });

      // Then expand
      act(() => {
        result.current.setIsSidebarCollapsed(false);
      });

      expect(result.current.isSidebarCollapsed).toBe(false);
    });

    it('should call setContextIsSidebarCollapsed when collapsing', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.setIsSidebarCollapsed(true);
      });

      expect(setContextIsSidebarCollapsed).toHaveBeenCalledTimes(1);
      expect(setContextIsSidebarCollapsed).toHaveBeenCalledWith(true);
    });

    it('should call setContextIsSidebarCollapsed when expanding', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.setIsSidebarCollapsed(false);
      });

      expect(setContextIsSidebarCollapsed).toHaveBeenCalledTimes(1);
      expect(setContextIsSidebarCollapsed).toHaveBeenCalledWith(false);
    });
  });

  describe('scrollToSection', () => {
    let scrollToMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      scrollToMock = vi.fn();
      window.scrollTo = scrollToMock;
    });

    it('should scroll to contact info when index is -1', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.scrollToSection(-1);
      });

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith({
        top: -100, // 0 (top) + 0 (pageYOffset) - 100 (yOffset)
        behavior: 'smooth',
      });
    });

    it('should scroll to first section when index is 0', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.scrollToSection(0);
      });

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 100, // 200 (top) + 0 (pageYOffset) - 100 (yOffset)
        behavior: 'smooth',
      });
    });

    it('should scroll to second section when index is 1', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.scrollToSection(1);
      });

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 400, // 500 (top) + 0 (pageYOffset) - 100 (yOffset)
        behavior: 'smooth',
      });
    });

    it('should update activeSectionIndex when scrolling', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.scrollToSection(2);
      });

      expect(result.current.activeSectionIndex).toBe(2);
    });

    it('should not crash if target ref is null', () => {
      const nullSectionRefs = createMockRef([null, null, null]);

      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs: nullSectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.scrollToSection(0);
      });

      // Should not call scrollTo since ref is null
      expect(scrollToMock).not.toHaveBeenCalled();
      // But activeSectionIndex should still update
      expect(result.current.activeSectionIndex).toBe(0);
    });

    it('should not crash if contactInfoRef is null', () => {
      const nullContactRef = createMockRef(null);

      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef: nullContactRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.scrollToSection(-1);
      });

      // Should not call scrollTo since ref is null
      expect(scrollToMock).not.toHaveBeenCalled();
      // But activeSectionIndex should still update
      expect(result.current.activeSectionIndex).toBe(-1);
    });
  });

  describe('scroll detection', () => {
    it('should detect first section as active on initial load', () => {
      const { result, unmount } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      // At scrollY=0, viewport middle = 300, which is in Section0 (200-500)
      expect(result.current.activeSectionIndex).toBe(0);

      unmount();
    });

    it('should use passive scroll listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      );
    });

    it('should remove scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('should re-run scroll detection when sections.length changes', () => {
      const { result, rerender } = renderHook(
        ({ sections }) =>
          useSectionNavigation({
            sections,
            contactInfoRef,
            sectionRefs,
            setContextIsSidebarCollapsed,
          }),
        { initialProps: { sections } }
      );

      // Initial state
      const initialActive = result.current.activeSectionIndex;

      // Add a new section
      const newSections = [
        ...sections,
        { name: 'Projects', type: 'bulleted-list', content: [] },
      ];

      rerender({ sections: newSections });

      // Should re-run scroll check (though active section might stay the same)
      // Just verifying it doesn't crash
      expect(result.current.activeSectionIndex).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty sections array', () => {
      const emptySections: Section[] = [];
      const emptySectionRefs = createMockRef([]);

      const { result } = renderHook(() =>
        useSectionNavigation({
          sections: emptySections,
          contactInfoRef,
          sectionRefs: emptySectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      expect(result.current.activeSectionIndex).toBe(-1);
    });

    it('should handle null contactInfoRef gracefully', () => {
      const nullContactRef = createMockRef(null);

      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef: nullContactRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      // Should not crash, should detect section based on sectionRefs
      expect(result.current.activeSectionIndex).toBeDefined();
    });

    it('should handle null sectionRefs gracefully', () => {
      const nullSectionRefs = createMockRef([null, null, null]);

      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs: nullSectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      // Should not crash, might detect contact
      expect(result.current.activeSectionIndex).toBeDefined();
    });

    it('should handle manual setActiveSectionIndex', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      act(() => {
        result.current.setActiveSectionIndex(1);
      });

      expect(result.current.activeSectionIndex).toBe(1);
    });
  });

  describe('integration scenarios', () => {
    it('should handle collapse + scroll sequence', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      // Collapse sidebar
      act(() => {
        result.current.setIsSidebarCollapsed(true);
      });

      // Scroll to section
      act(() => {
        result.current.scrollToSection(1);
      });

      expect(result.current.isSidebarCollapsed).toBe(true);
      expect(result.current.activeSectionIndex).toBe(1);
      expect(setContextIsSidebarCollapsed).toHaveBeenCalledWith(true);
    });

    it('should maintain state across multiple scroll operations', () => {
      const { result } = renderHook(() =>
        useSectionNavigation({
          sections,
          contactInfoRef,
          sectionRefs,
          setContextIsSidebarCollapsed,
        })
      );

      // Scroll to section 0
      act(() => {
        result.current.scrollToSection(0);
      });
      expect(result.current.activeSectionIndex).toBe(0);

      // Scroll to section 2
      act(() => {
        result.current.scrollToSection(2);
      });
      expect(result.current.activeSectionIndex).toBe(2);

      // Scroll back to contact
      act(() => {
        result.current.scrollToSection(-1);
      });
      expect(result.current.activeSectionIndex).toBe(-1);
    });
  });
});
