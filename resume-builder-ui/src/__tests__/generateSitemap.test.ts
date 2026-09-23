/// <reference types="vitest" />
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeAll } from 'vitest';
import { STATIC_URLS } from '../data/sitemapUrls';
import { JOBS_DATABASE } from '../data/jobKeywords';
import { JOB_EXAMPLES_DATABASE } from '../data/jobExamples';
import { blogPosts } from '../data/blogPosts';
import {
  HREFLANG_PAIRS,
  CV_REGIONS,
  RESUME_REGION,
  DEFAULT_REGION,
} from '../data/hreflangMappings';
import { generateSitemap, escapeXml } from '../../scripts/generateSitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Pull the <lastmod> that sits inside the <url> block for a given loc. */
function lastmodFor(xml: string, loc: string, baseUrl: string): string | null {
  const locTag = `<loc>${baseUrl}${loc}</loc>`;
  const blockStart = xml.indexOf(locTag);
  if (blockStart === -1) return null;
  const blockEnd = xml.indexOf('</url>', blockStart);
  const block = xml.slice(blockStart, blockEnd);
  const match = block.match(/<lastmod>([^<]+)<\/lastmod>/);
  return match ? match[1] : null;
}

describe('Sitemap XML Generation', () => {
  const baseUrl = 'https://easyfreeresume.com';
  let xml: string;

  beforeAll(() => {
    // Set env var for consistent base URL in tests
    process.env.VITE_APP_URL = baseUrl;
    xml = generateSitemap();
  });

  describe('XML Structure', () => {
    it('should start with XML declaration', () => {
      expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    });

    it('should have urlset root element', () => {
      expect(xml).toContain('<urlset');
      expect(xml).toContain('</urlset>');
    });

    it('should include sitemap namespace', () => {
      expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    });

    it('should include xhtml namespace when hreflang pairs exist', () => {
      if (HREFLANG_PAIRS.length > 0) {
        expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
      }
    });

    it('should have properly closed url elements', () => {
      const openCount = (xml.match(/<url>/g) || []).length;
      const closeCount = (xml.match(/<\/url>/g) || []).length;
      expect(openCount).toBe(closeCount);
      expect(openCount).toBeGreaterThan(0);
    });

    it('should have loc, lastmod, changefreq, and priority for each url', () => {
      const urlBlocks = xml.split('<url>').slice(1);
      urlBlocks.forEach(block => {
        expect(block).toContain('<loc>');
        expect(block).toContain('</loc>');
        expect(block).toContain('<lastmod>');
        expect(block).toContain('<changefreq>');
        expect(block).toContain('<priority>');
      });
    });
  });

  describe('Hreflang Links in XML', () => {
    it('should include hreflang links for CV pages', () => {
      HREFLANG_PAIRS.forEach(pair => {
        const cvUrlInXml = `<loc>${baseUrl}${pair.cv}</loc>`;
        expect(xml).toContain(cvUrlInXml);

        // Check that CV page has hreflang links
        const cvBlockStart = xml.indexOf(cvUrlInXml);
        expect(cvBlockStart).toBeGreaterThan(-1);
      });
    });

    it('should include hreflang links for resume pages', () => {
      HREFLANG_PAIRS.forEach(pair => {
        const resumeUrlInXml = `<loc>${baseUrl}${pair.resume}</loc>`;
        expect(xml).toContain(resumeUrlInXml);
      });
    });

    it('should have all CV regions in hreflang links', () => {
      HREFLANG_PAIRS.forEach(pair => {
        CV_REGIONS.forEach(region => {
          const hreflangLink = `hreflang="${region}" href="${baseUrl}${pair.cv}"`;
          expect(xml).toContain(hreflangLink);
        });
      });
    });

    it('should have en-US region pointing to resume pages', () => {
      HREFLANG_PAIRS.forEach(pair => {
        const enUsLink = `hreflang="${RESUME_REGION}" href="${baseUrl}${pair.resume}"`;
        expect(xml).toContain(enUsLink);
      });
    });

    it('should have x-default pointing to resume pages', () => {
      HREFLANG_PAIRS.forEach(pair => {
        const xDefaultLink = `hreflang="${DEFAULT_REGION}" href="${baseUrl}${pair.resume}"`;
        expect(xml).toContain(xDefaultLink);
      });
    });

    it('should have bidirectional hreflang: both CV and resume pages link to each other', () => {
      HREFLANG_PAIRS.forEach(pair => {
        // Find the URL block for CV page
        const cvLoc = `<loc>${baseUrl}${pair.cv}</loc>`;
        const cvBlockStart = xml.indexOf(cvLoc);
        const cvBlockEnd = xml.indexOf('</url>', cvBlockStart);
        const cvBlock = xml.slice(cvBlockStart, cvBlockEnd);

        // CV page should have link to resume page
        expect(cvBlock).toContain(`href="${baseUrl}${pair.resume}"`);

        // Find the URL block for resume page
        const resumeLoc = `<loc>${baseUrl}${pair.resume}</loc>`;
        const resumeBlockStart = xml.indexOf(resumeLoc);
        const resumeBlockEnd = xml.indexOf('</url>', resumeBlockStart);
        const resumeBlock = xml.slice(resumeBlockStart, resumeBlockEnd);

        // Resume page should have link to CV page
        expect(resumeBlock).toContain(`href="${baseUrl}${pair.cv}"`);
      });
    });
  });

  describe('All regions coverage', () => {
    it('should include all 5 hreflang annotations per paired page (3 CV + US + x-default)', () => {
      const expectedRegionCount = CV_REGIONS.length + 2; // CV regions + en-US + x-default

      HREFLANG_PAIRS.forEach(pair => {
        // Check resume page has all 5 hreflang links
        const resumeLoc = `<loc>${baseUrl}${pair.resume}</loc>`;
        const resumeBlockStart = xml.indexOf(resumeLoc);
        const resumeBlockEnd = xml.indexOf('</url>', resumeBlockStart);
        const resumeBlock = xml.slice(resumeBlockStart, resumeBlockEnd);

        const resumeHreflangCount = (resumeBlock.match(/xhtml:link.*hreflang/g) || []).length;
        expect(resumeHreflangCount).toBe(expectedRegionCount);

        // Check CV page has all 5 hreflang links
        const cvLoc = `<loc>${baseUrl}${pair.cv}</loc>`;
        const cvBlockStart = xml.indexOf(cvLoc);
        const cvBlockEnd = xml.indexOf('</url>', cvBlockStart);
        const cvBlock = xml.slice(cvBlockStart, cvBlockEnd);

        const cvHreflangCount = (cvBlock.match(/xhtml:link.*hreflang/g) || []).length;
        expect(cvHreflangCount).toBe(expectedRegionCount);
      });
    });
  });

  describe('Non-hreflang URLs', () => {
    it('should not have hreflang links for pages without pairs', () => {
      // Check a page that shouldn't have hreflang (like /about)
      const aboutLoc = `<loc>${baseUrl}/about</loc>`;
      if (xml.includes(aboutLoc)) {
        const aboutBlockStart = xml.indexOf(aboutLoc);
        const aboutBlockEnd = xml.indexOf('</url>', aboutBlockStart);
        const aboutBlock = xml.slice(aboutBlockStart, aboutBlockEnd);

        expect(aboutBlock).not.toContain('xhtml:link');
      }
    });

    it('should not have hreflang links for job keyword pages', () => {
      const testSlug = JOBS_DATABASE[0]?.slug;
      if (testSlug) {
        const keywordLoc = `<loc>${baseUrl}/resume-keywords/${testSlug}</loc>`;
        if (xml.includes(keywordLoc)) {
          const blockStart = xml.indexOf(keywordLoc);
          const blockEnd = xml.indexOf('</url>', blockStart);
          const block = xml.slice(blockStart, blockEnd);

          expect(block).not.toContain('xhtml:link');
        }
      }
    });
  });

  describe('URL count', () => {
    it('should include all static URLs', () => {
      STATIC_URLS.forEach(page => {
        expect(xml).toContain(`<loc>${baseUrl}${page.loc}</loc>`);
      });
    });

    it('should include all job keyword URLs', () => {
      JOBS_DATABASE.forEach(job => {
        expect(xml).toContain(`<loc>${baseUrl}/resume-keywords/${job.slug}</loc>`);
      });
    });

    it('should include all job example URLs', () => {
      JOB_EXAMPLES_DATABASE.forEach(job => {
        expect(xml).toContain(`<loc>${baseUrl}/examples/${job.slug}</loc>`);
      });
    });
  });

  describe('Lastmod honesty', () => {
    it('derives /blog/* lastmod as the LATER of lastUpdated and curated sitemapUrls value, else publishDate, never the build date', () => {
      const today = new Date().toISOString().split('T')[0];
      let checked = 0;
      blogPosts.forEach(post => {
        const loc = `/blog/${post.slug}`;
        const actual = lastmodFor(xml, loc, baseUrl);
        if (actual === null) return; // post isn't in the sitemap (e.g. still comingSoon)
        checked += 1;
        const curated = STATIC_URLS.find(p => p.loc === loc)?.lastmod;
        const candidates = [post.lastUpdated, curated].filter((d): d is string => !!d);
        const expected = candidates.length > 0 ? candidates.sort().pop()! : post.publishDate;
        expect(actual).toBe(expected);
        // The later of the two curated dates must win — a stale/older lastUpdated
        // must never regress an already-newer curated sitemapUrls value. That is the
        // regression this test exists to catch.
        if (post.lastUpdated && curated) {
          expect(actual >= post.lastUpdated).toBe(true);
          expect(actual >= curated).toBe(true);
        }
      });
      // Sanity check the assertion actually ran against real data, and that at least
      // one post's real date differs from "today" (proving we didn't just get lucky
      // because the build date happens to match).
      expect(checked).toBeGreaterThan(0);
      expect(
        blogPosts.some(p => {
          const curated = STATIC_URLS.find(sp => sp.loc === `/blog/${p.slug}`)?.lastmod;
          const candidates = [p.lastUpdated, curated].filter((d): d is string => !!d);
          const expected = candidates.length > 0 ? candidates.sort().pop()! : p.publishDate;
          return expected !== today;
        })
      ).toBe(true);
    });

    it('never regresses lastmod below either source date, even when lastUpdated predates the curated value', () => {
      // Regression guard for the specific bug found on the current tip: several posts
      // have a lastUpdated older than sitemapUrls' curated lastmod, which the old
      // `lastUpdated ?? curated ?? publishDate` precedence silently discarded in
      // favor of the older lastUpdated.
      let checked = 0;
      blogPosts.forEach(post => {
        const loc = `/blog/${post.slug}`;
        const actual = lastmodFor(xml, loc, baseUrl);
        if (actual === null) return;
        const curated = STATIC_URLS.find(p => p.loc === loc)?.lastmod;
        if (!curated) return;
        checked += 1;
        expect(actual >= curated).toBe(true);
        if (post.lastUpdated) {
          expect(actual >= post.lastUpdated).toBe(true);
        }
      });
      expect(checked).toBeGreaterThan(0);
    });

    it('produces identical lastmod values across two consecutive builds with no content change', () => {
      const xmlSecondBuild = generateSitemap();
      const extractAll = (doc: string) => {
        const result: Record<string, string> = {};
        const blocks = doc.split('<url>').slice(1);
        blocks.forEach(block => {
          const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
          const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
          if (loc && lastmod) result[loc] = lastmod;
        });
        return result;
      };
      expect(extractAll(xmlSecondBuild)).toEqual(extractAll(xml));
    });
  });

  describe('NOINDEX_ROUTES consistency', () => {
    it('has no path from app.py NOINDEX_ROUTES present in the generated sitemap', () => {
      const appPyPath = path.resolve(__dirname, '../../../app.py');
      const appPySource = fs.readFileSync(appPyPath, 'utf8');
      const setMatch = appPySource.match(/NOINDEX_ROUTES\s*=\s*\{([\s\S]*?)\n\}/);
      expect(setMatch).toBeTruthy();

      const routes = [...(setMatch?.[1] ?? '').matchAll(/["']([^"']+)["']/g)].map(m => m[1]);
      expect(routes.length).toBeGreaterThan(0);

      routes.forEach(route => {
        const loc = `/${route.replace(/^\/+|\/+$/g, '')}`;
        expect(xml).not.toContain(`<loc>${baseUrl}${loc}</loc>`);
      });
    });
  });
});

describe('XML Escaping', () => {
  it('should escape ampersands correctly', () => {
    expect(escapeXml('foo & bar')).toBe('foo &amp; bar');
  });

  it('should escape less-than correctly', () => {
    expect(escapeXml('foo < bar')).toBe('foo &lt; bar');
  });

  it('should escape greater-than correctly', () => {
    expect(escapeXml('foo > bar')).toBe('foo &gt; bar');
  });

  it('should escape quotes correctly', () => {
    expect(escapeXml('foo "bar"')).toBe('foo &quot;bar&quot;');
  });

  it('should escape apostrophes correctly', () => {
    expect(escapeXml("foo 'bar'")).toBe('foo &apos;bar&apos;');
  });

  it('should handle multiple special characters', () => {
    expect(escapeXml('<foo & "bar">')).toBe('&lt;foo &amp; &quot;bar&quot;&gt;');
  });
});
