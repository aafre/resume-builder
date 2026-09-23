const BASELINE = 150_000;
const BASELINE_DATE = '2026-09-23';
// Owner-set daily rate (2026-09-24). PRODUCT.md bans fabricated counts, so
// re-check it against PostHog `pdf_downloaded` volume (lib/analytics.ts) and
// swap for a build-time PostHog query if the formula drifts from reality.
const RATE_PER_DAY = 520;

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
