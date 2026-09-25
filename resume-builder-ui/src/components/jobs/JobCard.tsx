// A job listing from a job feed. Deliberately plain: flat white surface, ink
// type, the feed named in words — nothing that reads like an ad unit
// (no stripes, no image, no "Ad" chrome, no blue link title).
import { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AdzunaJob, JobSearchResult } from '../../services/jobs';
import { formatSalary } from '../../utils/currencyFormat';
import {
  trackJobClick,
  trackJobImpression,
  trackJobQuotaExhausted,
  type JobContext,
} from '../../lib/analytics';

const FEED_NAMES: Record<string, string> = { adzuna: 'Adzuna' };

const feedName = (feed: string) =>
  FEED_NAMES[feed] ?? feed.charAt(0).toUpperCase() + feed.slice(1);

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (!(diffMs >= 0)) return '';
  const days = Math.floor(diffMs / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

/**
 * Fire job_impression once per result set. `jobs` must be the result-set array
 * itself (stable identity per search), not a fresh slice each render.
 */
export function useJobImpression(jobs: AdzunaJob[], context: JobContext, shown = jobs.length) {
  useEffect(() => {
    const visible = jobs.slice(0, shown);
    if (visible.length === 0) return;
    const feed_mix: Record<string, number> = {};
    for (const j of visible) feed_mix[j.feed] = (feed_mix[j.feed] ?? 0) + 1;
    trackJobImpression({ context, count: visible.length, feed_mix });
  }, [jobs]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Report degraded (stale/refreshing) results; call once per search response. */
export function reportJobStatus(result: JobSearchResult, context: JobContext) {
  if (result.status === 'stale' || result.status === 'refreshing') {
    trackJobQuotaExhausted({ context, status: result.status });
  }
}

/** "Updated 5h ago" for results served from the saved copy. */
export function StaleLabel({ fetchedAt, className = '' }: { fetchedAt?: string; className?: string }) {
  const ms = fetchedAt ? Date.now() - new Date(fetchedAt).getTime() : NaN;
  if (!(ms >= 0)) return null;
  const minutes = Math.max(1, Math.round(ms / 60_000));
  const age = minutes < 60 ? `${minutes}m` : `${Math.round(minutes / 60)}h`;
  return (
    <p className={`inline-flex items-center gap-2 text-xs text-ink/60 ${className}`}>
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ink/30" />
      <span title={new Date(fetchedAt!).toLocaleString()}>Updated {age} ago</span>
    </p>
  );
}

interface JobCardProps {
  job: AdzunaJob;
  /** 1-based rank in the rendered list. */
  position: number;
  context: JobContext;
  country?: string;
  /** Show the resume match badge (only meaningful when ranked against a resume). */
  showMatch?: boolean;
  compact?: boolean;
}

export default function JobCard({ job, position, context, country, showMatch, compact }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max, country);
  const posted = timeAgo(job.created);
  const where = [job.company, job.location].filter(Boolean).join(' · ');
  const score = job.match_score != null ? Math.round(job.match_score) : null;

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() =>
        trackJobClick({ context, feed: job.feed, position, match_score: job.match_score ?? null })
      }
      className={`group flex flex-col min-w-0 bg-white border border-black/[0.08] rounded-xl transition-[box-shadow,border-color] duration-200 hover:border-black/[0.16] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 ${
        compact ? 'p-4 gap-1' : 'p-5 gap-1.5 h-full'
      }`}
    >
      <div className="flex items-start gap-3">
        <h3
          className={`flex-1 min-w-0 font-display font-bold text-ink leading-snug line-clamp-2 group-hover:underline decoration-ink/30 underline-offset-4 ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          {job.title}
        </h3>
        {showMatch && score != null && (
          <span className="shrink-0 text-xs font-semibold text-accent-text bg-accent/10 rounded-full px-2.5 py-1 tabular-nums">
            {score}% match
          </span>
        )}
      </div>

      {where && <p className="text-sm text-ink/60 truncate">{where}</p>}

      {(salary || posted) && (
        <p className="text-sm text-ink/60 flex flex-wrap gap-x-3 gap-y-1">
          {salary && (
            <span className={job.salary_is_predicted ? '' : 'font-semibold text-ink tabular-nums'}>
              {salary}
              {job.salary_is_predicted && ' (est.)'}
            </span>
          )}
          {posted && <span>{posted}</span>}
        </p>
      )}

      <p className={`flex items-center justify-between gap-3 text-xs text-ink/60 ${compact ? 'pt-1' : 'mt-auto pt-3'}`}>
        <span>via {feedName(job.feed)}</span>
        <span className="flex items-center gap-1 font-semibold text-ink">
          {compact ? 'View' : 'View job'}
          <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </span>
      </p>
    </a>
  );
}
