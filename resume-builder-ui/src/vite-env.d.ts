/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_URL: string;
  /** Enable explicit ad placements (in-content, in-feed, sidebar). Default: disabled */
  readonly VITE_ENABLE_EXPLICIT_ADS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
