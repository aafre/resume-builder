/**
 * Sitemap URL Validation Test
 *
 * Validates that all URLs defined in the sitemap are accessible (not 404).
 * Uses the same data sources as the sitemap generator to ensure consistency.
 *
 * Run: npm run test:sitemap
 */

import { test, expect } from '@playwright/test';
import { getAllSitemapUrls, getUrlCounts } from '../utils/sitemap-helpers';

test.describe('Sitemap URL Validation', () => {
  // Use a longer timeout since we're testing many URLs
  test.setTimeout(300000); // 5 minutes

  test('all sitemap URLs should not return 404', async ({ page }) => {
    const urls = getAllSitemapUrls();
    const counts = getUrlCounts();

    console.log(`\nValidating ${counts.total} URLs:`);
    console.log(`  - Static pages: ${counts.static}`);
    console.log(`  - Job keyword pages: ${counts.jobKeywords}`);
    console.log(`  - Job example pages: ${counts.jobExamples}\n`);

    const failures: { url: string; status: number | null; error?: string }[] = [];
    const successes: string[] = [];

    for (const path of urls) {
      try {
        const response = await page.goto(path, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        const status = response?.status();

        if (status === 404) {
          failures.push({ url: path, status });
          console.log(`  [FAIL] ${path} - 404 Not Found`);
        } else if (status && status >= 400) {
          // Also catch other error status codes
          failures.push({ url: path, status });
          console.log(`  [FAIL] ${path} - ${status}`);
        } else {
          successes.push(path);
          // Only log successes in verbose mode to reduce noise
          if (process.env.VERBOSE) {
            console.log(`  [OK] ${path}`);
          }
        }
      } catch (error) {
        failures.push({
          url: path,
          status: null,
          error: error instanceof Error ? error.message : String(error),
        });
        console.log(`  [ERROR] ${path} - ${error instanceof Error ? error.message : error}`);
      }
    }

    // Summary
    console.log(`\n--- Summary ---`);
    console.log(`Passed: ${successes.length}/${urls.length}`);
    console.log(`Failed: ${failures.length}/${urls.length}`);

    if (failures.length > 0) {
      console.log(`\nFailed URLs:`);
      failures.forEach(({ url, status, error }) => {
        if (error) {
          console.log(`  - ${url}: ${error}`);
        } else {
          console.log(`  - ${url}: ${status}`);
        }
      });
    }

    // Assert no failures
    expect(
      failures,
      `${failures.length} URL(s) returned errors:\n${failures
        .map((f) => `  ${f.url}: ${f.error || f.status}`)
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('all pages should have non-empty titles', async ({ page }) => {
    const urls = getAllSitemapUrls();

    console.log(`\nValidating page titles for ${urls.length} URLs...\n`);

    const emptyTitles: string[] = [];

    for (const path of urls) {
      try {
        const response = await page.goto(path, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });

        // Skip pages that already failed (404s, etc)
        if (response?.status() !== 200) {
          continue;
        }

        const title = await page.title();

        if (!title || title.trim() === '') {
          emptyTitles.push(path);
          console.log(`  [WARN] ${path} - Empty title`);
        }
      } catch {
        // Errors already reported in the 404 test
      }
    }

    if (emptyTitles.length > 0) {
      console.log(`\nPages with empty titles:`);
      emptyTitles.forEach((url) => console.log(`  - ${url}`));
    }

    expect(
      emptyTitles,
      `${emptyTitles.length} page(s) have empty titles:\n${emptyTitles.join('\n')}`
    ).toHaveLength(0);
  });
});
