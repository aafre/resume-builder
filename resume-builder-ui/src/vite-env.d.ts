/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_URL: string;
  /** Enable explicit ad placements (in-content, in-feed, sidebar). Default: disabled */
  readonly VITE_ENABLE_EXPLICIT_ADS: string;
  /** App version from release pipeline (e.g. "v3.21.0"). Undefined in local dev. */
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
