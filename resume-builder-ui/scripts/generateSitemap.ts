/**
 * Sitemap Generator for Resume Builder
 * Generates sitemap.xml with static pages + programmatic SEO job pages
 * Run during build: npm run build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { JOBS_DATABASE } from '../src/data/jobKeywords/index.js';

// Load environment variables from .env file (for local development)
// In production (Docker), env vars are passed as build args
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Job data imported from single source of truth
const JOBS = JOBS_DATABASE.map(job => ({
  slug: job.slug,
  priority: job.priority,
  lastmod: job.lastmod || new Date().toISOString().split('T')[0],
}));

// Static URLs (from existing sitemap.xml)
const STATIC_URLS = [
  // High Priority Landing Pages (1.0)
  { loc: '/', priority: 1.0, changefreq: 'weekly', lastmod: '2025-10-26' },

  // New SEO Landing Pages (0.9)
  { loc: '/actual-free-resume-builder', priority: 0.9, changefreq: 'monthly', lastmod: '2025-10-26' },
  { loc: '/free-resume-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-01' },
  { loc: '/best-free-resume-builder-reddit', priority: 0.9, changefreq: 'monthly', lastmod: '2025-10-26' },

  // Core App Pages (0.8)
  { loc: '/templates', priority: 0.8, changefreq: 'weekly', lastmod: '2025-10-26' },
  { loc: '/editor', priority: 0.8, changefreq: 'weekly', lastmod: '2025-10-26' },

  // Hub Pages (0.8)
  { loc: '/ats-resume-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2025-10-26' },
  { loc: '/resume-keywords', priority: 0.8, changefreq: 'monthly', lastmod: '2025-10-26' },

  // Template Pages (0.7)
  { loc: '/templates/ats-friendly', priority: 0.7, changefreq: 'monthly', lastmod: '2025-10-26' },

  // Manually-curated keyword page (0.7)
  { loc: '/resume-keywords/customer-service', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-01' },

  // Blog Hub (0.6)
  { loc: '/blog', priority: 0.6, changefreq: 'weekly', lastmod: '2025-10-26' },

  // Blog Posts (0.5)
  { loc: '/blog/resume-keywords-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2025-07-15' },
  { loc: '/blog/resume-no-experience', priority: 0.5, changefreq: 'monthly', lastmod: '2025-07-20' },
  { loc: '/blog/job-interview-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2025-09-05' },
  { loc: '/blog/ats-resume-optimization', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/resume-mistakes-to-avoid', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/professional-summary-examples', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/cover-letter-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/remote-work-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/resume-length-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/tech-resume-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/resume-vs-cv-difference', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/ai-resume-builder', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/behavioral-interview-questions', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/introducing-prepai-ai-interview-coach', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/how-to-write-a-resume-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/resume-action-verbs', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/how-to-use-resume-keywords', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/software-engineer-resume-keywords', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/how-why-easyfreeresume-completely-free', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/zety-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-01' },
  { loc: '/blog/how-to-list-skills', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },
  { loc: '/blog/quantify-resume-accomplishments', priority: 0.5, changefreq: 'monthly', lastmod: '2025-01-15' },

  // Static Pages (0.3)
  { loc: '/about', priority: 0.3, changefreq: 'yearly', lastmod: '2025-10-26' },
  { loc: '/contact', priority: 0.3, changefreq: 'yearly', lastmod: '2025-10-26' },
  { loc: '/privacy-policy', priority: 0.3, changefreq: 'yearly', lastmod: '2026-01-01' },
  { loc: '/terms-of-service', priority: 0.3, changefreq: 'yearly', lastmod: '2026-01-01' },
];

/**
 * Escape special XML characters to ensure valid XML output
 * @param unsafe - String that may contain XML special characters
 * @returns Escaped string safe for XML
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Generate sitemap XML
 */
function generateSitemap(): string {
  const baseUrl = process.env.VITE_APP_URL;
  if (!baseUrl) {
    console.error('❌ Error: VITE_APP_URL is not set. Please define it in your .env file.');
    process.exit(1);
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';

  // Add static URLs
  xml += '  <!-- Static Pages -->\n';
  STATIC_URLS.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${baseUrl}${page.loc}`)}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add programmatic SEO job pages
  xml += '\n  <!-- Programmatic SEO - Job Keywords Pages -->\n';
  JOBS.forEach(job => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${baseUrl}/resume-keywords/${job.slug}`)}</loc>\n`;
    xml += `    <lastmod>${job.lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>${job.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '\n</urlset>\n';

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
    const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(publicSitemapPath, xml, 'utf8');
    locations.push(publicSitemapPath);

    // Also write to dist/ if it exists (for production build)
    if (fs.existsSync(distDir)) {
      const distSitemapPath = path.join(distDir, 'sitemap.xml');
      fs.writeFileSync(distSitemapPath, xml, 'utf8');
      locations.push(distSitemapPath);
    }

    const totalUrls = STATIC_URLS.length + JOBS.length;
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📄 Total URLs: ${totalUrls} (${STATIC_URLS.length} static + ${JOBS.length} job pages)`);
    console.log(`   📍 Locations: ${locations.join(', ')}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run generator
writeSitemap();
