const BASELINE = 150_000;
const BASELINE_DATE = '2026-09-23';
// Owner-measured (2026-09-24): 150k resumes since launch, ~520/day from
// Supabase. Re-check against real volume each release; PRODUCT.md bans
// fabricated counts, so a drifting rate must be recalibrated, not kept.
const RATE_PER_DAY = 520;

const DAY_MS = 86_400_000;

/** Landing "Resumes Created" count at epoch-ms `ms`: continuous, ~+1 per 2.8 min. */
export function getResumeCount(ms: number): number {
  // Date.parse of a bare YYYY-MM-DD is UTC per spec
  const elapsed = Math.max(0, ms - Date.parse(BASELINE_DATE));
  return Math.floor(BASELINE + (RATE_PER_DAY * elapsed) / DAY_MS);
}
