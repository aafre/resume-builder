/**
 * Sitemap URL Validation Test
 *
 * Validates that all URLs defined in the sitemap are accessible (not 404)
 * and have valid page titles.
 *
 * Uses the same data sources as the sitemap generator to ensure consistency.
 * Each URL is tested independently to enable parallel execution.
 *
 * Run: npm run test:sitemap
 */

import { test, expect } from '@playwright/test';
import { getAllSitemapUrls, getUrlCounts } from '../utils/sitemap-helpers';

const urls = getAllSitemapUrls();
const counts = getUrlCounts();

test.describe('Sitemap URL Validation', () => {
  // Log summary once before all tests in this suite
  test.beforeAll(() => {
    console.log(`\nValidating ${counts.total} URLs:`);
    console.log(`  - Static pages: ${counts.static}`);
    console.log(`  - Job keyword pages: ${counts.jobKeywords}`);
    console.log(`  - Job example pages: ${counts.jobExamples}\n`);
  });

  // Generate a test for each URL to run in parallel
  for (const path of urls) {
    test(`URL '${path}' should be valid and have a non-empty title`, async ({ page }) => {
      const response = await page.goto(path, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // Assert that the response is successful (status 200-299)
      expect(response?.ok(), `URL '${path}' returned status ${response?.status()}`).toBe(true);

      // Assert that the page has a non-empty title
      const title = await page.title();
      expect(title?.trim(), `URL '${path}' should have a non-empty title`).not.toBe('');
    });
  }
});
