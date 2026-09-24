import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Drives the single ink pill behind the header's primary nav.
 *
 * The pill is one element that travels between links rather than a background
 * on each link, so a route change reads as movement instead of a swap. It is
 * measured from real link geometry (`offsetLeft` / `offsetWidth`) because the
 * labels are text and their widths depend on the font that actually painted —
 * `font-display: optional` means Bricolage may never load, so nothing here can
 * assume a width.
 *
 * Motion is Web Animations, not CSS, which means the global
 * `prefers-reduced-motion` rule in styles.css does not reach it. The check is
 * made here instead: reduced motion gets the position with no travel.
 */
export default function useNavPill(activeKey: string | null) {
  const navRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  /** Last painted geometry, so travel starts where the pill actually is. */
  const fromRef = useRef<{ left: number; width: number } | null>(null);

  const place = useCallback(
    (animate: boolean) => {
      const nav = navRef.current;
      const pill = pillRef.current;
      if (!nav || !pill) return;

      const target = activeKey
        ? nav.querySelector<HTMLElement>(`[data-nav-key="${CSS.escape(activeKey)}"]`)
        : null;

      if (!target) {
        pill.dataset.visible = "false";
        fromRef.current = null;
        return;
      }

      const to = { left: target.offsetLeft, width: target.offsetWidth };
      const from = fromRef.current;
      fromRef.current = to;

      const apply = () => {
        pill.style.transform = `translateX(${to.left}px)`;
        pill.style.width = `${to.width}px`;
      };

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // No previous position means this is a first paint or a return from
      // "no active link" — appearing in place is correct, travelling from 0
      // would be a lie about where the pill was.
      if (!animate || !from || reduced || typeof pill.animate !== "function") {
        apply();
        pill.dataset.visible = "true";
        return;
      }

      apply();
      pill.dataset.visible = "true";

      // Stretch toward the direction of travel at the midpoint, then settle.
      // This is the whole difference between "a box moved" and "something
      // physical crossed the nav".
      const span = {
        left: Math.min(from.left, to.left),
        width: Math.abs(to.left - from.left) + Math.max(from.width, to.width),
      };
      const mid = {
        left: span.left + (span.width - span.width * 0.62) / 2,
        width: span.width * 0.62,
      };

      pill.animate(
        [
          { transform: `translateX(${from.left}px)`, width: `${from.width}px` },
          {
            transform: `translateX(${mid.left}px)`,
            width: `${mid.width}px`,
            offset: 0.45,
          },
          { transform: `translateX(${to.left}px)`, width: `${to.width}px` },
        ],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    },
    [activeKey]
  );

  useLayoutEffect(() => {
    place(true);
  }, [place]);

  // Widths move with the viewport, with the font swap, and with the count
  // badge appearing. Re-measure instead of trusting the mount-time numbers.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => place(false));
    observer.observe(nav);
    return () => observer.disconnect();
  }, [place]);

  useEffect(() => {
    if (!document.fonts?.ready) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) place(false);
    });
    return () => {
      cancelled = true;
    };
  }, [place]);

  return { navRef, pillRef };
}
