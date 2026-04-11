/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_URL: string;
  /** Enable explicit ad placements (in-content, in-feed, sidebar). Default: disabled */
  readonly VITE_ENABLE_EXPLICIT_ADS: string;
  /** App version from release pipeline (e.g. "v3.21.0"). Undefined in local dev. */
  readonly VITE_APP_VERSION?: string;
  /** PostHog project API key. Leave empty to disable analytics. */
  readonly VITE_POSTHOG_KEY?: string;
  /** PostHog API host. Defaults to https://us.i.posthog.com */
  readonly VITE_POSTHOG_HOST?: string;
}

declare const __GIT_HASH__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
