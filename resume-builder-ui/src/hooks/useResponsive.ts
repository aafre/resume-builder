import { useState, useEffect } from "react";

/**
 * Breakpoints matching Tailwind's defaults
 * - Mobile: < 640px
 * - Tablet: 640px - 1024px
 * - Desktop: >= 1024px
 */
const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

/**
 * Hook to detect current screen size and breakpoint
 * Uses window.matchMedia for efficient breakpoint detection
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Initialize with current window size
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1024,
      };
    }

    const width = window.innerWidth;
    return {
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isDesktop: width >= BREAKPOINTS.tablet,
      width,
    };
  });

  useEffect(() => {
    // Media query lists for each breakpoint
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`
    );
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`);

    const updateState = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
        width,
      });
    };

    // Use matchMedia change events for better performance
    mobileQuery.addEventListener("change", updateState);
    tabletQuery.addEventListener("change", updateState);
    desktopQuery.addEventListener("change", updateState);

    // Also listen to resize for width updates
    window.addEventListener("resize", updateState);

    return () => {
      mobileQuery.removeEventListener("change", updateState);
      tabletQuery.removeEventListener("change", updateState);
      desktopQuery.removeEventListener("change", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  return state;
};
