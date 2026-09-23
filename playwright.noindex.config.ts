import { defineConfig, devices } from '@playwright/test';

/**
 * Standalone config for the noindex regression audit (T1).
 *
 * Deliberately separate from playwright.config.ts: that config's
 * `globalSetup` (./e2e/global-setup.ts) throws unless VITE_SUPABASE_URL,
 * SUPABASE_SECRET_KEY and TEST_USER_EMAIL are set, because it provisions a
 * signed-in session for the auth/cloud-save specs. This audit needs none of
 * that — it walks public routes and reads a meta tag — so it must not
 * inherit a setup step that can fail on missing secrets. The bug this audit
 * guards against (see e2e/tests/noindex-audit.spec.ts) hid for seven months
 * partly because nothing ran automatically; a check that only works with
 * credentials in a `.env.test` file is the same failure mode with extra
 * steps.
 *
 * Run: npx playwright test --config=playwright.noindex.config.ts
 * (No .env.test, no Supabase project, no CI wiring required.)
 */
export default defineConfig({
  testDir: './e2e/tests',
  testMatch: 'noindex-audit.spec.ts',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [['list']],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  timeout: 30000,
  expect: { timeout: 5000 },

  projects: [
    {
      name: 'noindex-audit',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Vite preview server on a non-default port so this never collides with a
  // `vite dev`/`vite preview` a person already has running on 4173/5173.
  webServer: {
    command: 'npm run preview -- --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: !process.env.CI,
    cwd: './resume-builder-ui',
    timeout: 120000,
  },

  // No globalSetup — see module doc comment above.
});
