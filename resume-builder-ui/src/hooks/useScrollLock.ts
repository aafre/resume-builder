import { useEffect } from "react";

/**
 * Freezes page scrolling while a modal surface is open.
 *
 * `aria-modal="true"` is a promise that the rest of the page is inert. Without
 * a scroll lock the page still scrolls behind the overlay and the user is
 * returned to a different offset when it closes.
 *
 * Why not simply `document.body.style.overflow = 'hidden'`, which is the usual
 * one-liner: it does nothing in this app. `styles.css` sets
 * `html, body { height: 100%; display: flex; flex-direction: column }`, and the
 * scrolling element is `html`. Measured in the running editor: with body
 * overflow hidden, `window.scrollTo(0, 1400)` still moved the page from 600 to
 * 1400 behind an open drawer.
 *
 * Putting `overflow: hidden` on `html` does lock it, but `html` is
 * `height: 100%`, so there is no scrollable overflow left and the offset is
 * clamped to 0 — the page jumps to the top every time an overlay opens, and
 * `scrollTop` cannot be restored while the lock is applied.
 *
 * So: take the offset off the document and hold it on a fixed body. Measured in
 * the running editor, `main`'s viewport rect is identical before, during and
 * after the lock, the scroll offset is restored exactly, and scrolling is
 * genuinely blocked while it is held.
 */

/** Overlays can stack (the tour hands off to AuthModal), so refcount the lock. */
let lockCount = 0;
let savedScrollY = 0;
let savedStyles: Partial<CSSStyleDeclaration> = {};

function applyLock() {
  const body = document.body;
  savedScrollY = window.scrollY;
  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
  };

  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
}

function releaseLock() {
  const body = document.body;
  body.style.position = savedStyles.position ?? "";
  body.style.top = savedStyles.top ?? "";
  body.style.left = savedStyles.left ?? "";
  body.style.right = savedStyles.right ?? "";
  body.style.width = savedStyles.width ?? "";

  // `auto` rather than the page's smooth-scroll default: restoring the offset
  // is meant to be invisible, not animated.
  //
  // Guarded because this runs in an effect cleanup, where a throw is swallowed
  // by React and can mask an unrelated error. jsdom does not implement
  // `scrollTo` and throws on it, so every overlay unmount in the test suite
  // went through here.
  try {
    window.scrollTo({ top: savedScrollY, behavior: "auto" });
  } catch {
    /* no scroll restoration available; the styles are already reverted */
  }
}

export default function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockCount += 1;
    if (lockCount === 1) applyLock();

    return () => {
      lockCount -= 1;
      if (lockCount === 0) releaseLock();
    };
  }, [isLocked]);
}
