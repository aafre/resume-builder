/**
 * Sitemap Generator for Resume Builder
 * Generates sitemap-static.xml with static pages + programmatic SEO job pages
 * Run during build: npm run build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { JOBS_DATABASE } from '../src/data/jobKeywords/index';
import { JOB_EXAMPLES_DATABASE } from '../src/data/jobExamples/index';
import { STATIC_URLS } from '../src/data/sitemapUrls';
import {
  HREFLANG_PAIRS,
  CV_REGIONS,
  RESUME_REGION,
  DEFAULT_REGION,
  findHreflangPair,
} from '../src/data/hreflangMappings';

// Load environment variables from .env file (for local development)
// In production (Docker), env vars are passed as build args
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Job keywords data imported from single source of truth
const JOBS = JOBS_DATABASE.map(job => ({
  slug: job.slug,
  priority: job.priority,
  lastmod: job.lastmod || new Date().toISOString().split('T')[0],
}));

// Job examples data for pSEO pages
const JOB_EXAMPLES = JOB_EXAMPLES_DATABASE.map(job => ({
  slug: job.slug,
  priority: job.priority,
  lastmod: new Date().toISOString().split('T')[0],
}));

/**
 * Escape special XML characters to ensure valid XML output
 * @param unsafe - String that may contain XML special characters
 * @returns Escaped string safe for XML
 */
export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Generate sitemap XML
 * Exported for testing
 */
export function generateSitemap(): string {
  // Load from environment variable, fallback to production URL
  // In local dev: VITE_APP_URL is loaded from .env via dotenv
  // In Docker/CI: VITE_APP_URL should be passed as build arg
  // Fallback ensures builds succeed even if not explicitly set
  const baseUrl = process.env.VITE_APP_URL || 'https://easyfreeresume.com';

  if (!process.env.VITE_APP_URL) {
    console.warn('⚠️  VITE_APP_URL not set, using default: https://easyfreeresume.com');
  }

  // Use Map to store unique URLs and prevent duplicates
  const urls = new Map<string, { lastmod: string; changefreq: string; priority: number }>();

  // Helper function to add URLs (prevents duplicates)
  const addUrl = (loc: string, details: { lastmod: string; changefreq: string; priority: number }) => {
    if (!urls.has(loc)) {
      urls.set(loc, details);
    }
  };

  // Add static URLs
  STATIC_URLS.forEach(page => {
    addUrl(page.loc, {
      lastmod: page.lastmod,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Add programmatic SEO job keywords pages
  JOBS.forEach(job => {
    addUrl(`/resume-keywords/${job.slug}`, {
      lastmod: job.lastmod,
      changefreq: 'monthly',
      priority: job.priority
    });
  });

  // Add programmatic SEO job example pages
  JOB_EXAMPLES.forEach(job => {
    addUrl(`/examples/${job.slug}`, {
      lastmod: job.lastmod,
      changefreq: 'monthly',
      priority: job.priority
    });
  });

  // Check if we have any hreflang pairs that need the xhtml namespace
  const hasHreflangPairs = HREFLANG_PAIRS.length > 0;

  // Generate XML from Map (single source of truth)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  if (hasHreflangPairs) {
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  } else {
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  }

  urls.forEach((details, loc) => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${baseUrl}${loc}`)}</loc>\n`;

    // Add hreflang links if this URL is part of a CV/Resume pair
    const hreflangPair = findHreflangPair(loc);
    if (hreflangPair) {
      // Add CV regions pointing to CV page
      CV_REGIONS.forEach(region => {
        xml += `    <xhtml:link rel="alternate" hreflang="${region}" href="${escapeXml(`${baseUrl}${hreflangPair.cv}`)}"/>\n`;
      });
      // Add US region pointing to resume page
      xml += `    <xhtml:link rel="alternate" hreflang="${RESUME_REGION}" href="${escapeXml(`${baseUrl}${hreflangPair.resume}`)}"/>\n`;
      // Add x-default pointing to resume page (default experience)
      xml += `    <xhtml:link rel="alternate" hreflang="${DEFAULT_REGION}" href="${escapeXml(`${baseUrl}${hreflangPair.resume}`)}"/>\n`;
    }

    xml += `    <lastmod>${details.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${details.changefreq}</changefreq>\n`;
    xml += `    <priority>${details.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  return xml;
}

/**
 * Write sitemap to public directory (for dev) and dist directory (for production build)
 */
function writeSitemap(): void {
  try {
    const xml = generateSitemap();
    const publicDir = path.resolve(__dirname, '../public');
    const distDir = path.resolve(__dirname, '../dist');
    const locations: string[] = [];

    // Write to public/ (for development)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicSitemapPath = path.join(publicDir, 'sitemap-static.xml');
    fs.writeFileSync(publicSitemapPath, xml, 'utf8');
    locations.push(publicSitemapPath);

    // Also write to dist/ if it exists (for production build)
    if (fs.existsSync(distDir)) {
      const distSitemapPath = path.join(distDir, 'sitemap-static.xml');
      fs.writeFileSync(distSitemapPath, xml, 'utf8');
      locations.push(distSitemapPath);
    }

    const totalUrls = STATIC_URLS.length + JOBS.length + JOB_EXAMPLES.length;
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📄 Total URLs: ${totalUrls} (${STATIC_URLS.length} static + ${JOBS.length} keyword pages + ${JOB_EXAMPLES.length} example pages)`);
    console.log(`   📍 Locations: ${locations.join(', ')}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Only run writeSitemap when script is executed directly (not imported)
// This allows the generateSitemap function to be imported for testing
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectExecution) {
  writeSitemap();
}
