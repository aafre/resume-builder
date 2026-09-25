/// <reference types="vite/client" />

/** Build date as YYYY-MM-DD (UTC), injected by vite.config.ts `define`. */
declare const __BUILD_DATE__: string;

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_URL: string;
  /** Enable explicit ad placements (in-content, in-feed, sidebar). Default: disabled */
  readonly VITE_ENABLE_EXPLICIT_ADS: string;
  /** PostHog project API key. Leave empty to disable analytics. */
  readonly VITE_POSTHOG_KEY?: string;
  /** PostHog API host. Defaults to https://us.i.posthog.com */
  readonly VITE_POSTHOG_HOST?: string;
  /** Cloudflare Turnstile site key. Leave empty to disable entirely (no-op: no script, no token). */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Trustpilot widget global, injected on-demand by utils/trustpilot.ts */
  Trustpilot?: { loadFromElement: (node: HTMLElement) => void };
  /** Cloudflare Turnstile global, injected on-demand by utils/turnstile.ts */
  turnstile?: {
    render: (container: HTMLElement, options: Record<string, unknown>) => string;
    remove: (widgetId: string) => void;
    reset: (widgetId: string) => void;
  };
}
