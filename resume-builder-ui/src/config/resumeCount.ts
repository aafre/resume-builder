const BASELINE = 150_000;
const BASELINE_DATE = '2026-09-23';
// ponytail: placeholder rate pending owner confirmation. PRODUCT.md bans
// fabricated counts — derive this from real PostHog `pdf_downloaded` volume
// (lib/analytics.ts) before relying on it; swap for a build-time PostHog query
// if the formula drifts from reality.
const RATE_PER_DAY = 100;

const DAY_MS = 86_400_000;
const utc = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Landing "Resumes Created" count for a YYYY-MM-DD build date. */
export function getResumeCount(buildDate: string): number {
  const days = Math.max(0, Math.floor((utc(buildDate) - utc(BASELINE_DATE)) / DAY_MS));
  return Math.floor((BASELINE + RATE_PER_DAY * days) / 100) * 100;
}
