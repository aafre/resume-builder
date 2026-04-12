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

export const PRODUCTION_ORIGIN = 'https://easyfreeresume.com';

/**
 * Meta tag identifiers that react-helmet-async manages via data-rh="true".
 * For each identifier we check: if a data-rh version exists in the HTML,
 * remove the original non-data-rh duplicate (which came from index.html).
 * If NO data-rh version exists, keep the original as a fallback.
 */
export const META_TAG_PATTERNS: { attr: string; value: string }[] = [
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

export function cleanPrerenderedHtml(html: string, localPort: number): string {
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
