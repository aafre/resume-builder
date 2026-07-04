/**
 * On-demand loader for the Trustpilot widget bootstrap script.
 *
 * The script used to load eagerly in index.html's <head> on every page, but it
 * is only consumed by the post-download celebration modal. Loading it lazily
 * removes a render-blocking-adjacent third-party request from the landing page
 * and every other route, improving mobile LCP/INP — with zero ad-revenue impact
 * (Trustpilot is a review widget, not an ad).
 */

const TRUSTPILOT_SRC =
  "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

let loadPromise: Promise<void> | null = null;

/**
 * Inject the Trustpilot bootstrap script once and resolve when it has loaded.
 * Idempotent: concurrent or repeat calls share a single injection/promise, and
 * it resolves immediately if `window.Trustpilot` is already available.
 */
export function ensureTrustpilotLoaded(): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }
  if (typeof window !== "undefined" && window.Trustpilot) {
    return Promise.resolve();
  }
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = TRUSTPILOT_SRC;
    script.async = true;
    script.setAttribute("data-trustpilot-loader", "");
    script.addEventListener("load", () => resolve(), { once: true });
    // On error, resolve anyway so callers don't hang; the widget simply won't render.
    script.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(script);
  });
  return loadPromise;
}
