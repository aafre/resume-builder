import { useEffect } from "react";

/**
 * Freezes page scrolling while a modal surface is open.
 *
 * `aria-modal="true"` is a promise that the rest of the page is inert. Without
 * a scroll lock the page still scrolls behind the overlay and the user is
 * returned to a different offset when it closes.
 *
 * Body only, never `html`. Setting overflow on `html` changes viewport scroll
 * propagation, and `overflow: hidden` on a flex layout container silently
 * creates a scroll container — both have broken this app's layout before.
 */
export default function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}
