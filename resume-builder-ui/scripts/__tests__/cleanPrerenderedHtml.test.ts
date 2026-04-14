import { describe, it, expect } from 'vitest';
import { cleanPrerenderedHtml, PRODUCTION_ORIGIN } from '../cleanPrerenderedHtml';

describe('cleanPrerenderedHtml', () => {
  const PORT = 4173;

  describe('duplicate meta tag removal', () => {
    it('removes original meta when data-rh equivalent exists', () => {
      const html = [
        '<head>',
        '  <meta name="description" content="Generic description" />',
        '  <meta name="description" content="Page-specific description" data-rh="true" />',
        '</head>',
      ].join('\n');

      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('Generic description');
      expect(result).toContain('Page-specific description');
      expect(result).toContain('data-rh="true"');
    });

    it('keeps original meta when NO data-rh equivalent exists', () => {
      const html = [
        '<head>',
        '  <meta name="description" content="Only description" />',
        '</head>',
      ].join('\n');

      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).toContain('Only description');
    });

    it('handles og: properties with special regex characters', () => {
      const html = [
        '<head>',
        '  <meta property="og:title" content="Old OG Title" />',
        '  <meta property="og:title" content="New OG Title" data-rh="true" />',
        '</head>',
      ].join('\n');

      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('Old OG Title');
      expect(result).toContain('New OG Title');
    });

    it('handles data-rh appearing before the attr in tag', () => {
      const html = [
        '<head>',
        '  <meta name="description" content="Original" />',
        '  <meta data-rh="true" name="description" content="Helmet version" />',
        '</head>',
      ].join('\n');

      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('Original');
      expect(result).toContain('Helmet version');
    });

    it('handles multiple duplicate meta tags', () => {
      const html = [
        '<head>',
        '  <meta name="description" content="Old desc" />',
        '  <meta property="og:title" content="Old og title" />',
        '  <meta name="description" content="New desc" data-rh="true" />',
        '  <meta property="og:title" content="New og title" data-rh="true" />',
        '</head>',
      ].join('\n');

      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('Old desc');
      expect(result).not.toContain('Old og title');
      expect(result).toContain('New desc');
      expect(result).toContain('New og title');
    });
  });

  describe('HTML comment stripping', () => {
    it('removes SEO Meta Tags comment', () => {
      const html = '<head><!-- SEO Meta Tags --><meta name="description" /></head>';
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('<!-- SEO Meta Tags -->');
    });

    it('removes Open Graph / Facebook comment', () => {
      const html = '<head><!-- Open Graph / Facebook --><meta property="og:type" /></head>';
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('<!-- Open Graph / Facebook -->');
    });

    it('removes Twitter comment', () => {
      const html = '<head><!-- Twitter --><meta name="twitter:card" /></head>';
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).not.toContain('<!-- Twitter -->');
    });
  });

  describe('localhost URL replacement', () => {
    it('replaces localhost URLs with production origin', () => {
      const html = `<link rel="canonical" href="http://localhost:${PORT}/templates" />`;
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).toContain(`${PRODUCTION_ORIGIN}/templates`);
      expect(result).not.toContain('localhost');
    });

    it('replaces multiple localhost URLs', () => {
      const html = [
        `<meta property="og:url" content="http://localhost:${PORT}/blog" />`,
        `<link rel="canonical" href="http://localhost:${PORT}/blog" />`,
      ].join('\n');

      const result = cleanPrerenderedHtml(html, PORT);
      const matches = result.match(new RegExp(PRODUCTION_ORIGIN, 'g'));
      expect(matches).toHaveLength(2);
      expect(result).not.toContain('localhost');
    });

    it('uses the provided port number', () => {
      const html = `<a href="http://localhost:3000/page">Link</a>`;
      const result = cleanPrerenderedHtml(html, 3000);
      expect(result).toContain(`${PRODUCTION_ORIGIN}/page`);
    });

    it('does not replace localhost with different port', () => {
      const html = `<a href="http://localhost:9999/page">Link</a>`;
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).toContain('localhost:9999');
    });

    it('does not partially match ports with shared prefix (e.g., 4173 vs 41730)', () => {
      const html = `<a href="http://localhost:41730/page">Link</a>`;
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).toContain('localhost:41730');
    });
  });

  describe('edge cases', () => {
    it('handles empty HTML', () => {
      expect(cleanPrerenderedHtml('', PORT)).toBe('');
    });

    it('handles HTML with no meta tags', () => {
      const html = '<html><head><title>Test</title></head><body>Hello</body></html>';
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).toBe(html);
    });

    it('handles all data-rh tags (no originals to remove)', () => {
      const html = '<head><meta name="description" content="Only Helmet" data-rh="true" /></head>';
      const result = cleanPrerenderedHtml(html, PORT);
      expect(result).toContain('Only Helmet');
    });
  });
});
