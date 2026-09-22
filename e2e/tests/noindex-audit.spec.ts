/**
 * Noindex Audit — every indexable route must survive a blocked /api/*.
 *
 * Regression test for the T1 defect: production robots.txt disallows
 * `/api/`, so Googlebot's renderer can never complete an `/api/*` fetch.
 * Several pages (TemplateCarousel-embedded routes, most visibly `/templates`)
 * responded to that failure by rendering `<ErrorPage />` / `<NotFound />`,
 * both of which emit `<meta name="robots" content="noindex, follow">` — so
 * the page Google actually renders is deindexed, even though every prod curl
 * check (Googlebot UA, no JS) looked clean.
 *
 * This walks every route the sitemap/prerender script would publish
 * (`getAllSitemapUrls()`, the same source `scripts/prerender.ts` uses) with
 * every `/api/*` request aborted, and asserts:
 *   1. `meta[name="robots"]` never contains "noindex" — unless the route is
 *      in NOINDEX_ROUTES_MIRROR (kept in sync with app.py's NOINDEX_ROUTES
 *      by hand; it's one entry today).
 *   2. the page still renders real content (non-empty title, an <h1>).
 *
 * `/templates` gets a deeper check: template cards visible, and each card's
 * CTA reaches the editor — the acceptance bar from the task card, because a
 * page that renders an empty shell without a noindex tag is still broken.
 *
 * Run: npx playwright test --project=noindex-audit
 * (Not part of the default disabled-by-default suite — see playwright.config.ts.)
 */

import { test, expect, type Page } from '@playwright/test';
import { getAllSitemapUrls } from '../utils/sitemap-helpers';

// Mirrors app.py NOINDEX_ROUTES (~line 1561). Update by hand if that set grows —
// it's one line today, not worth generating.
const NOINDEX_ROUTES_MIRROR = new Set<string>(['/blog/ai-cover-letter-prompts']);

const urls = getAllSitemapUrls();

async function blockApi(page: Page) {
  await page.route('**/api/**', (route) => route.abort());
}

async function getRobotsMeta(page: Page): Promise<string | null> {
  return page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null);
}

test.describe('Noindex audit — /api/* blocked', () => {
  for (const path of urls) {
    const expectNoindex = NOINDEX_ROUTES_MIRROR.has(path);

    test(`'${path}' does not go noindex on a blocked API${expectNoindex ? ' (expected noindex)' : ''}`, async ({ page }) => {
      await blockApi(page);
      const response = await page.goto(path, { waitUntil: 'networkidle', timeout: 30000 });
      expect(response?.ok(), `'${path}' returned status ${response?.status()}`).toBe(true);

      const robots = await getRobotsMeta(page);
      if (expectNoindex) {
        expect(robots, `'${path}' is in NOINDEX_ROUTES_MIRROR but has no noindex tag`).toContain('noindex');
      } else {
        expect(robots ?? '', `'${path}' rendered noindex with /api/* blocked`).not.toContain('noindex');
      }

      // Content still there, not an empty/error shell.
      const title = await page.title();
      expect(title.trim(), `'${path}' has an empty <title>`).not.toBe('');

      const h1Count = await page.locator('h1').count();
      expect(h1Count, `'${path}' rendered no <h1>`).toBeGreaterThan(0);
    });
  }

  test('/templates: cards visible and each CTA reaches the editor, with /api/* blocked', async ({ page }) => {
    await blockApi(page);
    await page.goto('/templates', { waitUntil: 'networkidle', timeout: 30000 });

    const robots = await getRobotsMeta(page);
    expect(robots ?? '').not.toContain('noindex');

    // The 4 static templates from services/templates.ts::STATIC_TEMPLATES.
    const cards = page.locator('img[alt="Professional"], img[alt="Elegant"], img[alt="Minimalist"], img[alt="Modern"]');
    await expect(cards).toHaveCount(4);

    const ctas = page.getByRole('button', { name: /start with this template/i });
    await expect(ctas).toHaveCount(4);

    // The inline notice should be present (API refresh failed) instead of a
    // full-page error swap.
    await expect(page.getByText(/couldn't refresh live template previews/i)).toBeVisible();

    // First CTA opens the sign-in/start flow rather than a dead button —
    // clicking navigates to the auth modal or the editor depending on
    // session state; either way the app must not be stuck on an error page.
    await ctas.first().click();
    await expect(page.locator('body')).not.toContainText('Service Temporarily Unavailable');
  });
});
