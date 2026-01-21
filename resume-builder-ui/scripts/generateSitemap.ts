/**
 * Sitemap Generator for Resume Builder
 * Generates sitemap.xml with static pages + programmatic SEO job pages
 * Run during build: npm run build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { JOBS_DATABASE } from '../src/data/jobKeywords/index';
import { JOB_EXAMPLES_DATABASE } from '../src/data/jobExamples/index';

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

// Static URLs (from existing sitemap.xml)
const STATIC_URLS = [
  // High Priority Landing Pages (1.0)
  { loc: '/', priority: 1.0, changefreq: 'weekly', lastmod: '2025-10-26' },

  // New SEO Landing Pages (0.9)
  { loc: '/actual-free-resume-builder', priority: 0.9, changefreq: 'monthly', lastmod: '2025-10-26' },
  { loc: '/free-resume-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-01' },
  { loc: '/best-free-resume-builder-reddit', priority: 0.9, changefreq: 'monthly', lastmod: '2025-10-26' },

  // UK CV Market Pages (0.9)
  { loc: '/free-cv-builder-no-sign-up', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-18' },
  { loc: '/cv-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/cv-templates/ats-friendly', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-18' },

  // Core App Pages (0.8)
  { loc: '/templates', priority: 0.8, changefreq: 'weekly', lastmod: '2025-10-26' },

  // Hub Pages (0.8)
  { loc: '/ats-resume-templates', priority: 0.8, changefreq: 'monthly', lastmod: '2025-10-26' },
  { loc: '/resume-keywords', priority: 0.8, changefreq: 'monthly', lastmod: '2025-10-26' },
  { loc: '/examples', priority: 0.8, changefreq: 'weekly', lastmod: '2026-01-21' },

  // Template Pages (0.7)
  { loc: '/templates/ats-friendly', priority: 0.7, changefreq: 'monthly', lastmod: '2025-10-26' },
  { loc: '/templates/modern-resume-templates', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/templates/minimalist-resume-templates', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/templates/resume-templates-for-students', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-21' },

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

  // New AI Blog Posts (0.5)
  { loc: '/blog/chatgpt-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/ai-resume-writing-guide', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/claude-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/gemini-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/grok-resume-prompts', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/ai-job-description-analyzer', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/ai-resume-review', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },

  // Competitor Comparison Posts (0.5)
  { loc: '/blog/resume-io-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/resume-genius-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/novoresume-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/enhancv-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/canva-resume-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },
  { loc: '/blog/flowcv-vs-easy-free-resume', priority: 0.5, changefreq: 'monthly', lastmod: '2026-01-21' },

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

  // Generate XML from Map (single source of truth)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach((details, loc) => {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${baseUrl}${loc}`)}</loc>\n`;
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
    const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(publicSitemapPath, xml, 'utf8');
    locations.push(publicSitemapPath);

    // Also write to dist/ if it exists (for production build)
    if (fs.existsSync(distDir)) {
      const distSitemapPath = path.join(distDir, 'sitemap.xml');
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

// Run generator
writeSitemap();
