/// <reference types="vitest" />
import { describe, it, expect, beforeAll } from 'vitest';
import { STATIC_URLS } from '../data/sitemapUrls';
import { JOBS_DATABASE } from '../data/jobKeywords';
import { JOB_EXAMPLES_DATABASE } from '../data/jobExamples';
import {
  HREFLANG_PAIRS,
  CV_REGIONS,
  RESUME_REGION,
  DEFAULT_REGION,
} from '../data/hreflangMappings';
import { generateSitemap, escapeXml } from '../../scripts/generateSitemap';

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
