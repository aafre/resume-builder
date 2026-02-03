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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const PRERENDER_DIR = path.join(DIST_DIR, 'prerendered');

/**
 * SEO-critical routes to prerender.
 * These are the highest-value pages that bots should see as static HTML.
 */
const ROUTES_TO_PRERENDER = [
  // High-priority landing pages
  '/',
  '/templates',
  '/templates/ats-friendly',
  '/templates/modern-resume-templates',
  '/templates/minimalist-resume-templates',
  '/templates/resume-templates-for-students',

  // SEO hub pages
  '/ats-resume-templates',
  '/resume-keywords',
  '/resume-keywords/customer-service',
  '/examples',

  // Job keyword pages (programmatic SEO)
  '/resume-keywords/software-engineer',
  '/resume-keywords/data-scientist',
  '/resume-keywords/product-manager',
  '/resume-keywords/frontend-developer',
  '/resume-keywords/backend-developer',
  '/resume-keywords/full-stack-developer',
  '/resume-keywords/devops-engineer',
  '/resume-keywords/data-analyst',
  '/resume-keywords/ux-designer',
  '/resume-keywords/project-manager',
  '/resume-keywords/registered-nurse',
  '/resume-keywords/marketing-manager',
  '/resume-keywords/financial-analyst',
  '/resume-keywords/teacher',
  '/resume-keywords/sales-representative',

  // Landing pages
  '/free-resume-builder-no-sign-up',
  '/actual-free-resume-builder',
  '/best-free-resume-builder-reddit',

  // UK/CV pages
  '/cv-templates',
  '/cv-templates/ats-friendly',
  '/free-cv-builder-no-sign-up',

  // Blog index
  '/blog',

  // Blog - comparison posts (high impression, low CTR)
  '/blog/zety-vs-easy-free-resume',
  '/blog/resume-io-vs-easy-free-resume',
  '/blog/resume-genius-vs-easy-free-resume',
  '/blog/novoresume-vs-easy-free-resume',
  '/blog/enhancv-vs-easy-free-resume',
  '/blog/canva-resume-vs-easy-free-resume',
  '/blog/flowcv-vs-easy-free-resume',

  // Blog - AI prompt posts (gaining traction)
  '/blog/chatgpt-resume-prompts',
  '/blog/claude-resume-prompts',
  '/blog/gemini-resume-prompts',

  // Blog - key guides
  '/blog/how-to-write-a-resume-guide',
  '/blog/ats-resume-optimization',
  '/blog/resume-keywords-guide',

  // Blog - high-impression posts
  '/blog/professional-summary-examples',
  '/blog/how-to-use-resume-keywords',
  '/blog/resume-no-experience',
  '/blog/resume-vs-cv-difference',

  // Info pages
  '/about',
  '/contact',
];

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

      // SPA fallback: serve index.html
      const indexPath = path.join(distDir, 'index.html');
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream(indexPath).pipe(res);
    });

    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
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

      // Save to file
      const outputPath = route === '/'
        ? path.join(PRERENDER_DIR, 'index.html')
        : path.join(PRERENDER_DIR, route.slice(1), 'index.html');

      const outputDir = path.dirname(outputPath);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputPath, html, 'utf-8');

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
