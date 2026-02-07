// src/utils/countryDetector.ts

const ADZUNA_COUNTRIES = new Set([
  'gb', 'us', 'at', 'au', 'be', 'br', 'ca', 'ch',
  'de', 'es', 'fr', 'in', 'it', 'mx', 'nl', 'nz', 'pl', 'sg', 'za',
]);

const COUNTRY_NAMES: Record<string, string> = {
  'united kingdom': 'gb',
  'united states': 'us',
  'australia': 'au',
  'austria': 'at',
  'belgium': 'be',
  'brazil': 'br',
  'canada': 'ca',
  'switzerland': 'ch',
  'germany': 'de',
  'spain': 'es',
  'france': 'fr',
  'india': 'in',
  'italy': 'it',
  'mexico': 'mx',
  'netherlands': 'nl',
  'new zealand': 'nz',
  'poland': 'pl',
  'singapore': 'sg',
  'south africa': 'za',
};

const ABBREVIATIONS: Record<string, string> = {
  'uk': 'gb',
  'us': 'us',
  'usa': 'us',
};

// 2-letter US state abbreviations
const US_STATES = new Set([
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
  'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
  'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
  'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
  'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy',
  'dc',
]);

const CITY_TO_COUNTRY: Record<string, string> = {
  'london': 'gb',
  'manchester': 'gb',
  'birmingham': 'gb',
  'edinburgh': 'gb',
  'glasgow': 'gb',
  'brighton': 'gb',
  'bristol': 'gb',
  'leeds': 'gb',
  'liverpool': 'gb',
  'cambridge': 'gb',
  'oxford': 'gb',
  'cardiff': 'gb',
  'belfast': 'gb',
  'nottingham': 'gb',
  'sheffield': 'gb',
  'newcastle': 'gb',
  'toronto': 'ca',
  'vancouver': 'ca',
  'montreal': 'ca',
  'ottawa': 'ca',
  'calgary': 'ca',
  'mumbai': 'in',
  'bangalore': 'in',
  'bengaluru': 'in',
  'delhi': 'in',
  'new delhi': 'in',
  'hyderabad': 'in',
  'chennai': 'in',
  'pune': 'in',
  'kolkata': 'in',
  'gurugram': 'in',
  'gurgaon': 'in',
  'noida': 'in',
  'sydney': 'au',
  'melbourne': 'au',
  'brisbane': 'au',
  'perth': 'au',
  'berlin': 'de',
  'munich': 'de',
  'hamburg': 'de',
  'frankfurt': 'de',
  'paris': 'fr',
  'lyon': 'fr',
  'marseille': 'fr',
  'amsterdam': 'nl',
  'rotterdam': 'nl',
  'madrid': 'es',
  'barcelona': 'es',
  'rome': 'it',
  'milan': 'it',
  'zurich': 'ch',
  'geneva': 'ch',
  'warsaw': 'pl',
  'krakow': 'pl',
  'mexico city': 'mx',
  'sao paulo': 'br',
  'rio de janeiro': 'br',
  'cape town': 'za',
  'johannesburg': 'za',
  'auckland': 'nz',
  'wellington': 'nz',
  'vienna': 'at',
  'brussels': 'be',
};

/**
 * Detects an Adzuna country code from a free-text location string.
 * Falls back to 'us' if no match is found.
 */
export function detectCountryCode(location: string): string {
  if (!location || !location.trim()) return 'us';

  const lower = location.trim().toLowerCase();
  const parts = lower.split(/[,\s]+/).map(p => p.trim()).filter(Boolean);

  // 1. Check for country names at end of string
  for (const [name, code] of Object.entries(COUNTRY_NAMES)) {
    if (lower.endsWith(name)) return code;
  }

  // 2. Check for country abbreviations (last token)
  const lastToken = parts[parts.length - 1];
  if (lastToken && ABBREVIATIONS[lastToken]) {
    return ABBREVIATIONS[lastToken];
  }

  // 3. Check for US state abbreviations (last token or second-to-last)
  if (lastToken && US_STATES.has(lastToken)) return 'us';
  if (parts.length >= 2) {
    const secondLast = parts[parts.length - 2];
    if (US_STATES.has(secondLast)) return 'us';
  }

  // 3b. Check for UK postcode pattern (e.g. "BN1 9JA", "SW1A 1AA", "EC2R 8AH")
  if (/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i.test(location)) return 'gb';

  // 4. Check for well-known city names (try multi-word first, then single word)
  // Try the full string and substrings for multi-word cities
  for (const [city, code] of Object.entries(CITY_TO_COUNTRY)) {
    if (lower.includes(city)) return code;
  }

  // 5. Default
  return 'us';
}

/**
 * Strips country names / abbreviations from a location string so
 * that Adzuna's `where` param gets only the city/region/postcode.
 * The country is already conveyed via the URL path (e.g. /jobs/gb/search).
 *
 * "London, UK"            → "London"
 * "Mumbai, India"         → "Mumbai"
 * "New York, NY, USA"     → "New York, NY"
 * "Brighton, BN1 9JA"     → "Brighton, BN1 9JA" (no country to strip)
 */
export function sanitizeLocationForSearch(location: string): string {
  if (!location || !location.trim()) return '';

  let result = location.trim();

  // Strip trailing country abbreviation (", UK" / ", US" / ", USA")
  for (const abbr of Object.keys(ABBREVIATIONS)) {
    const re = new RegExp(`[,\\s]+${abbr}\\s*$`, 'i');
    if (re.test(result)) {
      result = result.replace(re, '').trim();
      return result;
    }
  }

  // Strip trailing country name (", United Kingdom" / ", India" etc.)
  for (const name of Object.keys(COUNTRY_NAMES)) {
    const re = new RegExp(`[,\\s]+${name}\\s*$`, 'i');
    if (re.test(result)) {
      result = result.replace(re, '').trim();
      return result;
    }
  }

  return result;
}
