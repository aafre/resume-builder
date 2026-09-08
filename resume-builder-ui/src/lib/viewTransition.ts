import { flushSync } from "react-dom";

/**
 * Run a React state update inside a View Transition so the browser can morph
 * between the two rendered states (shared `view-transition-name` elements
 * animate from where they were to where they end up).
 *
 * `flushSync` is required: `startViewTransition` snapshots the DOM when its
 * callback returns, and React's default async commit would land after that.
 *
 * Falls through to a plain update when the API is missing (Firefox) or the
 * user asked for reduced motion — the state change still happens, it just
 * cuts instead of morphing.
 */
export function withViewTransition(update: () => void): Promise<void> {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const start = (
    document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    }
  ).startViewTransition;

  if (reduceMotion || typeof start !== "function") {
    update();
    return Promise.resolve();
  }

  // `finished` rejects if the transition is skipped (e.g. another one starts).
  // The update still applied, so swallow it and resolve either way.
  return start.call(document, () => flushSync(update)).finished.catch(() => {});
}
