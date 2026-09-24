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
 *
 * Wait-strategy note: navigation uses `domcontentloaded` + an explicit wait
 * for the route's <h1>, not `waitUntil: 'networkidle'`. `/examples/*` pages
 * render a preview <img> whose src falls back to a same-origin 404 when
 * `VITE_SUPABASE_URL` isn't configured (e.g. a bare local checkout); that
 * 404 resolves to the SPA's own index.html, which the browser can't decode
 * as an image, and something in the render path re-issues the request in a
 * tight loop — hundreds of requests per second, indefinitely. `networkidle`
 * never fires and the test times out on a page whose content and robots meta
 * are both completely fine. Confirmed directly: with `domcontentloaded` +
 * `h1`, the same page resolves in ~150ms with `robots: index, follow`.
 */

import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { getAllSitemapUrls } from '../utils/sitemap-helpers';

// Mirrors app.py NOINDEX_ROUTES (~line 1561). Update by hand if that set grows —
// it's one line today, not worth generating.
const NOINDEX_ROUTES_MIRROR = new Set<string>(['/blog/ai-cover-letter-prompts']);

const urls = getAllSitemapUrls();

/**
 * Guard: this audit is only meaningful against a prerendered build built with
 * real Supabase config.
 *
 * Trap 1 — `npm run build` does not prerender. `/examples/*`, `/resume-keywords/*`
 * and a handful of other routes seed their first render from a prerendered JSON
 * payload; without it they fall back to a client-side fetch that this suite
 * deliberately blocks (`/api/**`), which then mis-renders as phantom "failures"
 * that are really just `npm run build` instead of `npm run build:prerender`.
 * That exact confusion is what sent T1's audit sideways — see
 * handoff-seo-growth-resume-2026-09-22.md.
 *
 * Trap 2 — a fresh git worktree does not carry `resume-builder-ui/.env`
 * (gitignored), so `VITE_SUPABASE_URL` is unset at build time. Every
 * `/examples/*` page's preview <img> then points at a same-origin path that
 * 404s into the SPA shell instead of a real image, and the resulting decode
 * failure re-triggers the request in a tight loop that never lets the network
 * settle — this hit even a `waitUntil: 'domcontentloaded'` + explicit `<h1>`
 * wait when the build itself lacked the payload, and previously produced 26
 * `networkidle` timeouts that looked like real regressions on `/examples/*`
 * but were a missing-env artifact of running from a worktree, not a bug in the
 * app. Set `resume-builder-ui/.env` (copy `.env.example`, fill in
 * `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY`) and rebuild before
 * re-running this audit from a worktree.
 *
 * Fail loudly up front instead of reporting phantom regressions route by route.
 */
// __dirname is used rather than import.meta.url because this project's
// Playwright test transform runs the spec as CommonJS.
const PRERENDERED_DIR = path.resolve(__dirname, '../../resume-builder-ui/dist/prerendered');
const ENV_FILE = path.resolve(__dirname, '../../resume-builder-ui/.env');

test.beforeAll(() => {
  const populated =
    fs.existsSync(PRERENDERED_DIR) && fs.readdirSync(PRERENDERED_DIR).length > 0;
  if (!populated) {
    throw new Error(
      `\n\nnoindex-audit requires a prerendered build, but ${PRERENDERED_DIR} is missing or empty.\n` +
        `\`npm run build\` does NOT prerender — it only runs tsc + vite build + sitemap generation.\n` +
        `Run this instead, from resume-builder-ui/:\n\n` +
        `  npm run build:prerender\n\n` +
        `Then re-run: npx playwright test --config=playwright.noindex.config.ts\n`
    );
  }

  const envContent = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf-8') : '';
  const supabaseUrlMatch = envContent.match(/^VITE_SUPABASE_URL=(.+)$/m);
  const supabaseUrlSet = !!supabaseUrlMatch && supabaseUrlMatch[1].trim().length > 0;
  if (!supabaseUrlSet) {
    throw new Error(
      `\n\nnoindex-audit requires resume-builder-ui/.env with a real VITE_SUPABASE_URL, but ` +
        `${ENV_FILE} is missing or has no VITE_SUPABASE_URL set.\n` +
        `A fresh git worktree does not carry gitignored files, so .env is silently absent even\n` +
        `though the repo checkout looks complete — this is not the same trap as a missing\n` +
        `prerendered build, and the prerendered-dir check above will not catch it, because\n` +
        `\`npm run build:prerender\` "succeeds" even with an empty VITE_SUPABASE_URL. Without it,\n` +
        `every /examples/<slug> page's preview image 404s into the SPA shell and the resulting\n` +
        `decode failure re-requests in a tight loop, which used to read as 26 unrelated\n` +
        `"networkidle timeout" failures.\n\n` +
        `Copy .env.example to resume-builder-ui/.env, fill in VITE_SUPABASE_URL (and\n` +
        `VITE_SUPABASE_PUBLISHABLE_KEY), then rebuild:\n\n` +
        `  npm run build:prerender\n\n` +
        `Then re-run: npx playwright test --config=playwright.noindex.config.ts\n`
    );
  }
});

async function blockApi(page: Page) {
  await page.route('**/api/**', (route) => route.abort());
}

// Every robots meta, joined: Helmet appends its own tag after the prerendered
// one, so querySelector() returns the stale `index, follow` while Google obeys
// the most restrictive tag. Reading only the first made the audit blind to the
// exact ErrorPage defect it guards (mutation-tested 2026-09-23).
async function getRobotsMeta(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const tags = [...document.querySelectorAll('meta[name="robots"]')];
    return tags.length ? tags.map((m) => m.getAttribute('content') ?? '').join(' | ') : null;
  });
}

/**
 * Wait for the blocked-fetch → noindex race to have had a chance to resolve
 * before reading `<meta name="robots">`.
 *
 * A prerendered route ships `index, follow` and its real `<h1>` as static
 * markup — both are satisfied before React ever hydrates. The defect this
 * suite exists to catch only exists post-hydration: a component's `useEffect`
 * fires an `/api/*` call, `blockApi()` aborts it, the `.catch()` handler
 * commits a state update, and (for routes using react-helmet-async) a
 * further Helmet effect flushes the new `<meta>` tag. Reading the tag right
 * after `domcontentloaded` + `<h1>` samples the PRERENDERED value and would
 * go green even with the exact `TemplateCarousel`-renders-`<ErrorPage/>`
 * defect reintroduced — confirmed directly: with only an `<h1>` wait, the
 * mutation-tested `/templates` run passed the robots assertion and only
 * failed later, on the cards-visible assertion, an accident of that one
 * test's extra checks that the other 120 routes don't have.
 *
 * So: attach a listener for our own intercepted `/api/*` traffic BEFORE
 * navigation (a listener attached after `goto()` can miss a request an
 * effect fires within the first tick), then once the page is interactive,
 * give any such request a window to appear and — if one did — hold for one
 * more settle window covering the `.catch()` → setState → re-render →
 * Helmet-effect chain. This is bounded and scoped to traffic *we* blocked —
 * not `networkidle`, which hangs on unrelated background noise (ads,
 * analytics, a flaky image CDN) that has nothing to do with whether the
 * route is indexable.
 */
function watchForApiRequest(page: Page): { seen: () => boolean; dispose: () => void } {
  let seen = false;
  const onRequest = (req: { url: () => string }) => {
    if (req.url().includes('/api/')) seen = true;
  };
  page.on('request', onRequest);
  return { seen: () => seen, dispose: () => page.off('request', onRequest) };
}

async function waitForNoindexRaceToSettle(page: Page, apiWatcher: { seen: () => boolean }): Promise<void> {
  // Detection window: an effect that fires an /api/* call on mount does so
  // within a tick or two of commit, not hundreds of ms — 300ms is generous
  // headroom, not a guess at network latency (the request is aborted
  // locally, no round trip involved). Kept short because most routes in the
  // sitemap make no /api/* call at all and would otherwise pay this on every
  // one of 121 tests for nothing.
  const deadline = Date.now() + 300;
  while (!apiWatcher.seen() && Date.now() < deadline) {
    await page.waitForTimeout(25);
  }
  if (apiWatcher.seen()) {
    // Settle window: covers .catch() -> setState -> re-render -> (for
    // react-helmet-async routes) the Helmet effect that actually writes the
    // new <meta> tag to the DOM.
    await page.waitForTimeout(400);
  }
}

test.describe('Noindex audit — /api/* blocked', () => {
  for (const path of urls) {
    const expectNoindex = NOINDEX_ROUTES_MIRROR.has(path);

    test(`'${path}' does not go noindex on a blocked API${expectNoindex ? ' (expected noindex)' : ''}`, async ({ page }) => {
      await blockApi(page);
      const apiWatcher = watchForApiRequest(page);
      // `waitUntil: 'networkidle'` is deliberately avoided: pages with a
      // preview <img> whose src 404s into the SPA shell (e.g. no
      // VITE_SUPABASE_URL configured locally) retry-render in a tight loop
      // that never lets the network settle, timing out a perfectly healthy,
      // correctly-indexable page. `domcontentloaded` + waiting for the route's
      // own <h1> is both faster and immune to unrelated background traffic
      // (ads, analytics, a flaky image CDN) that has nothing to do with
      // whether this route is indexable.
      const response = await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      expect(response?.ok(), `'${path}' returned status ${response?.status()}`).toBe(true);
      await page.waitForSelector('h1', { timeout: 15000 }).catch(() => {});
      await waitForNoindexRaceToSettle(page, apiWatcher);
      apiWatcher.dispose();

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
    const apiWatcher = watchForApiRequest(page);
    await page.goto('/templates', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('h1', { timeout: 15000 }).catch(() => {});
    await waitForNoindexRaceToSettle(page, apiWatcher);
    apiWatcher.dispose();

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
