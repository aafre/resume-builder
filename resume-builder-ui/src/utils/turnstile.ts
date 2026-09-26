/**
 * On-demand loader + helpers for Cloudflare Turnstile (invisible bot check).
 *
 * No-op everywhere when VITE_TURNSTILE_SITE_KEY is unset (e.g. local dev,
 * or before the owner creates the widget): no script is injected, no token
 * requested, callers get `null` and behave exactly as before Turnstile
 * existed. This mirrors utils/trustpilot.ts's lazy-script pattern.
 */

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise: Promise<void> | null = null;

function ensureScriptLoaded(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-turnstile-loader', '');
    script.addEventListener('load', () => resolve(), { once: true });
    // On error, resolve anyway so callers don't hang; token/pre-clearance simply won't happen.
    script.addEventListener('error', () => resolve(), { once: true });
    document.head.appendChild(script);
  });
  return scriptPromise;
}

const TOKEN_TIMEOUT_MS = 15_000;

/**
 * Get a single-use Turnstile token for the resume import request.
 * Resolves `null` immediately (no script loaded) when no site key is
 * configured, or if the widget fails/expires/times out before solving.
 */
export function getTurnstileToken(): Promise<string | null> {
  if (!SITE_KEY || typeof document === 'undefined') {
    return Promise.resolve(null);
  }

  return ensureScriptLoaded().then(
    () =>
      new Promise<string | null>((resolve) => {
        if (!window.turnstile) {
          resolve(null);
          return;
        }

        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);

        let widgetId: string;
        let done = false;
        // Callbacks are the only resolve path - cap the wait so a silent widget can't hang import.
        const timer = setTimeout(() => finish(null), TOKEN_TIMEOUT_MS);
        const finish = (token: string | null) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          try {
            window.turnstile?.remove(widgetId);
          } catch {
            // widget already gone - ignore
          }
          container.remove();
          resolve(token);
        };

        widgetId = window.turnstile.render(container, {
          sitekey: SITE_KEY,
          callback: (token: string) => finish(token),
          'error-callback': () => finish(null),
          'expired-callback': () => finish(null),
        });
      })
  );
}

/**
 * Mount a persistent, invisible Turnstile widget so the browser earns
 * Cloudflare pre-clearance (the `cf_clearance` cookie) for the jobs API WAF
 * rule. Call once from the /jobs page and the editor - no backend change
 * needed; a passed widget just sets the cookie for subsequent same-origin
 * fetches. No-op when no site key is configured. Idempotent per page load.
 */
let preClearanceMounted = false;
export function ensureTurnstilePreClearance(): void {
  if (!SITE_KEY || typeof document === 'undefined' || preClearanceMounted) return;
  preClearanceMounted = true;
  ensureScriptLoaded().then(() => {
    if (!window.turnstile) return;
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);
    window.turnstile.render(container, { sitekey: SITE_KEY });
  });
}
