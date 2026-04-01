import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration for Resume Builder
 *
 * Tier 1: Anonymous critical path tests (no auth, no Supabase)
 * Tier 2: Auth flows (future - requires Supabase test project)
 *
 * Tests use ?__test=1 flag to disable tour/animations in the app.
 */
export default defineConfig({
  testDir: './e2e/tests',
  testMatch: ['**/*.spec.ts'],
  // Sitemap tests run separately via: npx playwright test --project=sitemap
  testIgnore: ['**/sitemap-validation.spec.ts'],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
  },

  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: process.env.CI ? 10_000 : 5_000 },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Sitemap validation - run separately: npx playwright test --project=sitemap
    {
      name: 'sitemap',
      testMatch: 'sitemap-validation.spec.ts',
      testIgnore: [],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    cwd: './resume-builder-ui',
    timeout: 120_000, // 2 min for CI cold start
  },
});
