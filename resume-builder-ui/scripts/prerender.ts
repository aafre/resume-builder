/**
 * Prerender Script for SEO-critical pages
 *
 * Uses Playwright to render React SPA routes at build time, saving static HTML
 * to dist/prerendered/. Flask serves these to bot user-agents (Googlebot, etc.)
 * while normal users get the SPA.
 *
 * Usage:
 *   npx tsx scripts/prerender.ts
 *
 * Prerequisites:
 *   - npm run build (must have dist/ directory)
 *   - npx playwright install chromium (must have browser installed)
 *
 * This script:
 *   1. Starts a local static server on the built dist/ directory
 *   2. Visits each target route with Playwright
 *   3. Waits for React to hydrate and content to render
 *   4. Saves the full HTML to dist/prerendered/<path>/index.html
 *   5. Shuts down the server
 */

import { chromium } from '@playwright/test';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { STATIC_URLS } from '../src/data/sitemapUrls';
import { JOBS_DATABASE } from '../src/data/jobKeywords/index';
import { JOB_EXAMPLES_DATABASE } from '../src/data/jobExamples/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const PRERENDER_DIR = path.join(DIST_DIR, 'prerendered');
const PRODUCTION_ORIGIN = 'https://easyfreeresume.com';

/**
 * Pages we intentionally skip prerendering (low SEO value).
 */
const PRERENDER_EXCLUDE = new Set([
  '/privacy-policy',
  '/terms-of-service',
]);

/**
 * Build the prerender route list dynamically from the same data sources
 * that generate the sitemap (STATIC_URLS + JOBS_DATABASE + JOB_EXAMPLES_DATABASE).
 * This prevents drift between the sitemap and prerendered pages.
 */
function buildRoutesToPrerender(): string[] {
  const routes = new Set<string>();

  // Static pages (landing, blog, audience, CV, hub pages)
  for (const url of STATIC_URLS) {
    if (!PRERENDER_EXCLUDE.has(url.loc)) {
      routes.add(url.loc);
    }
  }

  // Programmatic SEO: job keyword pages
  for (const job of JOBS_DATABASE) {
    routes.add(`/resume-keywords/${job.slug}`);
  }

  // Programmatic SEO: job example pages
  for (const example of JOB_EXAMPLES_DATABASE) {
    routes.add(`/examples/${example.slug}`);
  }

  return Array.from(routes);
}

const ROUTES_TO_PRERENDER = buildRoutesToPrerender();

/**
 * Simple static file server for the dist directory.
 * Serves index.html for SPA routes (any path without a file extension).
 */
function createStaticServer(distDir: string, port: number): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = req.url || '/';
      const urlPath = new URL(url, `http://localhost:${port}`).pathname;

      // Prevent path traversal by ensuring the resolved path is within the dist directory
      const resolvedPath = path.resolve(path.join(distDir, urlPath));
      if (!resolvedPath.startsWith(path.resolve(distDir))) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
      }

      // Try to serve the exact file first
      let filePath = resolvedPath;
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentTypes: Record<string, string> = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.woff2': 'font/woff2',
          '.txt': 'text/plain',
        };
        res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Mock API: /api/templates — TemplateCarousel needs this during prerender
      if (urlPath === '/api/templates') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          templates: [
            { id: 'classic-alex-rivera', name: 'Professional', description: 'Clean, structured layout with traditional formatting and excellent space utilization.', image_url: '/docs/templates/alex_rivera.png' },
            { id: 'classic-jane-doe', name: 'Elegant', description: 'Refined design with sophisticated typography and organized section layout.', image_url: '/docs/templates/jane_doe.png' },
            { id: 'modern-no-icons', name: 'Minimalist', description: 'Clean and simple design focused on content clarity and easy readability.', image_url: '/docs/templates/modern-no-icons.png' },
            { id: 'modern-with-icons', name: 'Modern', description: 'Contemporary design enhanced with visual icons and dynamic styling elements.', image_url: '/docs/templates/modern-with-icons.png' },
          ]
        }));
        return;
      }

      // SPA fallback: serve index.html
      const indexPath = path.join(distDir, 'index.html');
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream(indexPath).pipe(res);
    });

    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

/**
 * Meta tag identifiers that react-helmet-async manages via data-rh="true".
 * For each identifier we check: if a data-rh version exists in the HTML,
 * remove the original non-data-rh duplicate (which came from index.html).
 * If NO data-rh version exists, keep the original as a fallback.
 */
const META_TAG_PATTERNS: { attr: string; value: string }[] = [
  // <meta name="...">
  { attr: 'name', value: 'description' },
  { attr: 'name', value: 'robots' },
  { attr: 'name', value: 'author' },
  { attr: 'name', value: 'keywords' },
  { attr: 'name', value: 'theme-color' },
  { attr: 'name', value: 'msapplication-TileColor' },
  { attr: 'name', value: 'twitter:card' },
  { attr: 'name', value: 'twitter:url' },
  { attr: 'name', value: 'twitter:title' },
  { attr: 'name', value: 'twitter:description' },
  { attr: 'name', value: 'twitter:image' },
  // <meta property="...">
  { attr: 'property', value: 'og:type' },
  { attr: 'property', value: 'og:url' },
  { attr: 'property', value: 'og:title' },
  { attr: 'property', value: 'og:description' },
  { attr: 'property', value: 'og:image' },
  { attr: 'property', value: 'og:site_name' },
];

/**
 * Post-process prerendered HTML to fix duplicate meta tags.
 *
 * react-helmet-async APPENDS new <meta> tags with data-rh="true" to <head>
 * but does NOT remove the original tags from index.html. This means Google
 * sees the generic description first (from index.html) and ignores the
 * page-specific one (from Helmet). This function strips the originals
 * when a Helmet replacement exists.
 *
 * Also replaces any localhost:PORT URLs with the production origin
 * (belt-and-suspenders for the BlogLayout.tsx fix).
 */
function cleanPrerenderedHtml(html: string, localPort: number): string {
  let cleaned = html;

  // 1. Remove duplicate non-data-rh meta tags (only when data-rh equivalent exists)
  for (const { attr, value } of META_TAG_PATTERNS) {
    // Escape special regex characters in the value (e.g., "og:title" → "og:title")
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check if a data-rh="true" version of this tag exists
    const helmetPattern = new RegExp(
      `<meta\\s+[^>]*${attr}="${escaped}"[^>]*data-rh="true"[^>]*/?>` +
      `|<meta\\s+[^>]*data-rh="true"[^>]*${attr}="${escaped}"[^>]*/?>`,
      'i'
    );

    if (helmetPattern.test(cleaned)) {
      // Helmet injected a replacement — remove the original (the one WITHOUT data-rh)
      // Match meta tags with this attr=value that do NOT contain data-rh
      const originalPattern = new RegExp(
        `\\s*<meta\\s+(?![^>]*data-rh)[^>]*${attr}=["']${escaped}["'][^>]*/?>`,
        'gi'
      );
      cleaned = cleaned.replace(originalPattern, '');
    }
  }

  // 2. Remove stale HTML comment blocks from index.html
  cleaned = cleaned.replace(/\s*<!-- SEO Meta Tags -->\s*/g, '\n    ');
  cleaned = cleaned.replace(/\s*<!-- Open Graph \/ Facebook -->\s*/g, '\n    ');
  cleaned = cleaned.replace(/\s*<!-- Twitter -->\s*/g, '\n    ');

  // 3. Replace any remaining localhost URLs with production origin
  const localhostPattern = new RegExp(`http://localhost:${localPort}`, 'g');
  cleaned = cleaned.replace(localhostPattern, PRODUCTION_ORIGIN);

  return cleaned;
}

async function prerender() {
  const port = 4173;

  // Validate dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  console.log(`Starting static server on port ${port}...`);
  const server = await createStaticServer(DIST_DIR, port);

  // Create prerender output directory
  if (fs.existsSync(PRERENDER_DIR)) {
    fs.rmSync(PRERENDER_DIR, { recursive: true });
  }
  fs.mkdirSync(PRERENDER_DIR, { recursive: true });

  console.log(`[prerender] ${ROUTES_TO_PRERENDER.length} routes to prerender`);
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'EasyFreeResume-Prerender/1.0',
  });

  let successCount = 0;
  let failCount = 0;

  for (const route of ROUTES_TO_PRERENDER) {
    const page = await context.newPage();

    try {
      const url = `http://localhost:${port}${route}`;
      console.log(`  Rendering: ${route}`);

      // Navigate and wait for network to be idle (React hydration complete)
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for React root to have content (not just the app shell)
      await page.waitForSelector('#root > *', { timeout: 10000 });

      // Small delay for any remaining async rendering
      await page.waitForTimeout(500);

      // Get the full rendered HTML
      let html = await page.content();

      // Add prerender metadata comment
      html = html.replace(
        '<head>',
        `<head>\n    <!-- Prerendered: ${new Date().toISOString()} -->`
      );

      // Strip duplicate meta tags: remove original index.html tags when
      // react-helmet-async has injected page-specific replacements (data-rh="true")
      html = cleanPrerenderedHtml(html, port);

      // Validate: reject prerendered pages that accidentally contain noindex
      // (Only ErrorPage and NotFound should have noindex, never valid pages)
      if (/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) && !html.includes('<!-- prerender-noindex-ok -->')) {
        throw new Error('Prerendered HTML contains noindex meta tag — page likely rendered ErrorPage or NotFound');
      }

      // Save to file
      const outputPath = route === '/'
        ? path.join(PRERENDER_DIR, 'index.html')
        : path.join(PRERENDER_DIR, route.slice(1), 'index.html');

      const outputDir = path.dirname(outputPath);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputPath, html, 'utf-8');

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1] : '(no title)';
      console.log(`  ✓ ${route} → "${pageTitle}"`);

      successCount++;
    } catch (error) {
      console.error(`  FAILED: ${route} - ${error instanceof Error ? error.message : error}`);
      failCount++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPrerendering complete!`);
  console.log(`  Success: ${successCount}/${ROUTES_TO_PRERENDER.length}`);
  if (failCount > 0) {
    console.log(`  Failed: ${failCount}/${ROUTES_TO_PRERENDER.length}`);
  }
  console.log(`  Output: ${PRERENDER_DIR}`);
}

prerender().catch((error) => {
  console.error('Prerendering failed:', error);
  process.exit(1);
});
