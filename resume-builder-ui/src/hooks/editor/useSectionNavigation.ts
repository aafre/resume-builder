// src/hooks/editor/useSectionNavigation.ts
// Section navigation hook (Layer 2) - manages section navigation and scroll detection

import { useState, useEffect, useCallback, useMemo, RefObject } from 'react';
import { Section } from '../../types';
import { UseSectionNavigationReturn } from '../../types/editor';

/**
 * Props for useSectionNavigation hook (dependency injection from Layer 1)
 */
export interface UseSectionNavigationProps {
  sections: Section[];
  contactInfoRef: RefObject<HTMLDivElement>;
  sectionRefs: RefObject<(HTMLDivElement | null)[]>;
  setContextIsSidebarCollapsed: (collapsed: boolean) => void;
}

/**
 * useSectionNavigation Hook
 *
 * Manages section navigation and scroll detection including:
 * - Active section tracking based on scroll position
 * - Sidebar collapse state synced with EditorContext
 * - Scroll-to-section functionality with smooth scrolling
 * - Passive scroll listener for performance
 *
 * @param props - Dependency injection props from useEditorState
 * @returns Navigation state and handlers
 *
 * @example
 * const navigation = useSectionNavigation({
 *   sections,
 *   contactInfoRef,
 *   sectionRefs,
 *   setContextIsSidebarCollapsed
 * });
 *
 * // Track active section during scroll
 * console.log(navigation.activeSectionIndex); // -1 for contact, 0+ for sections
 *
 * // Programmatic navigation
 * navigation.scrollToSection(2); // Scroll to third section
 */
export const useSectionNavigation = ({
  sections,
  contactInfoRef,
  sectionRefs,
  setContextIsSidebarCollapsed,
}: UseSectionNavigationProps): UseSectionNavigationReturn => {
  // Scroll offset to account for fixed headers (in pixels)
  const SCROLL_Y_OFFSET = -100;

  // Track active section: -1 for contact info, 0+ for sections
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(-1);

  // Track sidebar collapse state (local + context sync)
  const [isSidebarCollapsed, setIsSidebarCollapsedLocal] = useState(false);

  /**
   * Wrapper for setIsSidebarCollapsed that syncs with EditorContext
   * This ensures the footer knows about sidebar state changes
   *
   * @param collapsed - New collapsed state
   */
  const setIsSidebarCollapsed = useCallback(
    (collapsed: boolean) => {
      setIsSidebarCollapsedLocal(collapsed);
      setContextIsSidebarCollapsed(collapsed);
    },
    [setContextIsSidebarCollapsed]
  );

  /**
   * Scrolls to a specific section with smooth animation
   * -1 scrolls to contact info, 0+ scrolls to sections
   *
   * @param index - Section index (-1 for contact info, 0+ for sections)
   */
  const scrollToSection = useCallback(
    (index: number) => {
      setActiveSectionIndex(index);

      // Get target ref: contact info (-1) or section (0+)
      const targetRef =
        index === -1 ? contactInfoRef.current : sectionRefs.current?.[index];

      if (targetRef) {
        const y =
          targetRef.getBoundingClientRect().top + window.pageYOffset + SCROLL_Y_OFFSET;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    [contactInfoRef, sectionRefs]
  );

  /**
   * Update active section on scroll (passive listener for performance)
   * Uses viewport middle point (1/3 from top) to determine active section
   */
  useEffect(() => {
    const handleScroll = () => {
      // Get viewport middle point (1/3 from top for better UX)
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check contact info first
      if (contactInfoRef.current) {
        const rect = contactInfoRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (scrollPosition >= top && scrollPosition < top + rect.height) {
          setActiveSectionIndex(-1);
          return;
        }
      }

      // Check each section
      if (sectionRefs.current) {
        for (let i = 0; i < sectionRefs.current.length; i++) {
          const ref = sectionRefs.current[i];
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            if (scrollPosition >= top && scrollPosition < top + rect.height) {
              setActiveSectionIndex(i);
              return;
            }
          }
        }
      }
    };

    // Use passive listener for performance (no preventDefault)
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length, contactInfoRef, sectionRefs]);

  return useMemo(
    () => ({
      activeSectionIndex,
      setActiveSectionIndex,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      scrollToSection,
    }),
    [
      activeSectionIndex,
      setActiveSectionIndex,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      scrollToSection,
    ]
  );
};
