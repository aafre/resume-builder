import { useEffect, useState } from 'react';
import { affiliateConfig } from '../config/affiliate';

// Last answer, so repeat visits render the nav without waiting on the request.
const CACHE_KEY = 'efr-jobs-available';

let request: Promise<boolean> | null = null;

function readCache(): boolean | null {
  try {
    const v = localStorage.getItem(CACHE_KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

/**
 * Asks the backend whether a configured job feed serves the visitor's country
 * (Cloudflare CF-IPCountry). Fails open on any error, like the backend does
 * when the header is missing. One request per page load.
 */
function fetchJobsAvailable(): Promise<boolean> {
  request ??= fetch('/api/jobs/availability')
    .then((r) => (r.ok ? r.json() : { available: true }))
    .then((d: { available?: boolean }) => d.available !== false)
    .catch(() => true)
    .then((available) => {
      try {
        localStorage.setItem(CACHE_KEY, available ? '1' : '0');
      } catch {
        /* storage blocked: fine, we just refetch next load */
      }
      return available;
    });
  return request;
}

/**
 * Whether the jobs feature (nav link, /jobs, post-download listings, editor
 * badge) should show: the master flag is on and the visitor's country is
 * served. null while not yet known on a first visit.
 *
 * Links (header, footer) treat null as available so they don't shift in late.
 * Anything that calls Adzuna waits for a definite true.
 */
export function useJobsAvailable(): boolean | null {
  const enabled = affiliateConfig.jobSearch.enabled;
  const [available, setAvailable] = useState<boolean | null>(() => (enabled ? readCache() : false));

  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fetchJobsAvailable().then((a) => {
      if (live) setAvailable(a);
    });
    return () => {
      live = false;
    };
  }, [enabled]);

  return available;
}
