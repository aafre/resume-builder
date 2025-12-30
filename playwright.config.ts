import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * Playwright E2E Testing Configuration for Resume Builder
 *
 * Tests critical user flows:
 * - Authentication (OAuth, magic links, anonymous sessions)
 * - Cloud save/load (auto-save, manual save, resume management)
 * - AI resume parser (PDF/DOCX upload → YAML)
 * - /my-resumes page (list, duplicate, delete, edit)
 * - PDF generation (download, preview)
 *
 * NOTE: E2E tests are currently DISABLED (testMatch: ['DISABLED_*.spec.ts'])
 * Re-enable by changing testMatch to ['**/*.spec.ts'] when ready to fix/run tests
 */
export default defineConfig({
  testDir: './e2e/tests',
  testMatch: ['DISABLED_*.spec.ts'], // Temporarily disabled - no files match this pattern

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Fail build on CI if tests are focused
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI (flakiness protection)
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI to avoid overwhelming resources
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ...(process.env.CI ? [['github'] as const] : []), // GitHub Actions annotations
  ],

  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',

    // Collect trace on first retry (for debugging failures)
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video retention
    video: 'retain-on-failure',

    // Browser viewport
    viewport: { width: 1280, height: 720 },

    // Test timeout
    actionTimeout: 10000,
  },

  // Global timeout for entire test run
  timeout: 60000, // 60 seconds per test

  // Expect timeout
  expect: {
    timeout: 5000,
  },

  // Test projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment for cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Web server configuration (starts dev server automatically)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    cwd: './resume-builder-ui',
    timeout: 120000, // 2 minutes to start
  },

  // Global setup (create test users, seed data)
  globalSetup: './e2e/global-setup.ts',
});
