import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export const getFocusableElements = (container: HTMLElement | null) => {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && !element.hidden
  );
};

/**
 * Focus management for modal surfaces (drawers, dialogs).
 *
 * While `isOpen`:
 * - moves focus into the container
 * - traps Tab/Shift+Tab inside it, including the case where the container
 *   itself holds focus (tabIndex={-1} after a tap on a non-interactive area),
 *   which is the hole most hand-rolled traps leave open
 * - closes on Escape
 * - restores focus to the previously focused element on close
 *
 * Extracted verbatim from MobileNavigationDrawer so the editor drawer and the
 * global navigation drawer share one implementation.
 */
export default function useFocusTrap(
  isOpen: boolean,
  containerRef: { current: HTMLElement | null },
  onClose: () => void,
  /**
   * Element to focus on open, when the first focusable is the wrong target —
   * e.g. a celebration dialog wants its primary CTA focused, not its close
   * button. Falls back to the first focusable if unset or not yet mounted.
   */
  initialFocusRef?: { current: HTMLElement | null }
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusableElements = getFocusableElements(containerRef.current);
    (initialFocusRef?.current ?? focusableElements[0] ?? containerRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const currentFocusableElements = getFocusableElements(containerRef.current);

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        containerRef.current?.focus();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
      const activeElement = document.activeElement;

      // Container itself is focused (tabIndex={-1}, e.g. after a tap on a
      // non-interactive area) — wrap explicitly so Shift+Tab can't escape
      if (activeElement === containerRef.current) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (!containerRef.current?.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, containerRef, initialFocusRef]);
}
