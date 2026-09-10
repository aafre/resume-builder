/**
 * Snapshots of JSON payloads embedded in prerendered HTML.
 *
 * Why this has to run from the entry bundle rather than from the page that
 * needs the data:
 *
 * Route components are `lazy()`, so while a route's chunk downloads React
 * renders the route's Suspense fallback — and that fallback *replaces* the
 * children of `#root`, which is where the prerenderer put both the page content
 * and any payload tag. Measured on `/examples/receptionist`: the fallback lands
 * at ~119ms and the payload tag is gone with it, so by the time the page
 * component first renders there is nothing left to read.
 *
 * Capturing here, before `hydrateRoot`, happens while the prerendered DOM is
 * still intact.
 *
 * A page emits its payload as
 * `<script type="application/json" data-prerender-payload id="...">`, which the
 * prerenderer captures like any other DOM.
 */

const snapshots = new Map<string, unknown>();

/**
 * Read every payload tag in the current document. Call once, before React
 * hydrates. Malformed payloads are skipped rather than thrown — a broken
 * payload should cost a page its fast path, not its render.
 */
export function capturePrerenderPayloads(): void {
  if (typeof document === 'undefined') return;

  for (const el of document.querySelectorAll('script[data-prerender-payload]')) {
    const id = el.id;
    const raw = el.textContent;
    if (!id || !raw) continue;
    try {
      snapshots.set(id, JSON.parse(raw));
    } catch {
      // Ignore: the page falls back to fetching its own data.
    }
  }
}

/**
 * Read a captured payload. Returns null when this page was not prerendered, or
 * on a client-side navigation, where the caller's normal load path applies.
 */
export function getPrerenderPayload<T>(id: string): T | null {
  return (snapshots.get(id) as T | undefined) ?? null;
}
