// src/components/editor/EditorHeader.tsx
// Header component for Editor with idle tooltip, job match badge (portaled to header), and mobile banner

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, X } from 'lucide-react';
import { JobSparkleIcon } from '../icons/JobSparkleIcon';
import { ContactInfo, Section, SaveStatus } from '../../types';
import { SaveStatusIndicator } from '../SaveStatusIndicator';
import { useJobsAvailable } from '../../hooks/useJobsAvailable';
import { extractJobSearchParams } from '../../utils/resumeDataExtractor';
import { searchJobs } from '../../services/jobs';
import { getSalaryFloor } from '../../utils/salaryFloor';

/**
 * Props for EditorHeader component
 */
export interface EditorHeaderProps {
  /** Whether to show the idle tooltip */
  showIdleTooltip: boolean;
  /** Callback to dismiss idle tooltip */
  onDismissIdleTooltip: () => void;
  /** Current save status */
  saveStatus: SaveStatus;
  /** Last saved timestamp */
  lastSaved: Date | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Contact info for job matching */
  contactInfo: ContactInfo | null;
  /** Resume sections for job matching */
  sections: Section[];
}

const MOBILE_BANNER_KEY = 'jobMatchBannerDismissed';

/**
 * EditorHeader Component
 *
 * Displays status indicators and tooltips for the Editor:
 * - Idle nudge tooltip (portal) for anonymous users
 * - Save status indicator for authenticated users (desktop only)
 * - Job match badge portaled into the sticky header
 * - Mobile job notification banner (once per session)
 */
export const EditorHeader: React.FC<EditorHeaderProps> = ({
  showIdleTooltip,
  onDismissIdleTooltip,
  saveStatus,
  lastSaved,
  isAuthenticated,
  contactInfo,
  sections,
}) => {
  const [jobCount, setJobCount] = useState<number | null>(null);
  const jobsAvailable = useJobsAvailable() === true;
  const [loading, setLoading] = useState(false);
  const [showMobileBanner, setShowMobileBanner] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>('');
  const mobileBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Find the portal target after mount
  useEffect(() => {
    const el = document.getElementById('header-job-badge-slot');
    setPortalTarget(el);
  }, []);

  const fetchJobCount = useCallback(async () => {
    if (!jobsAvailable) return;

    const params = extractJobSearchParams(contactInfo, sections);
    if (!params) {
      setJobCount(null);
      return;
    }

    const cacheKey = `${params.query}|${params.location}|${params.country}|${params.skills.join(',')}`;
    if (cacheKey === lastQueryRef.current) return;
    lastQueryRef.current = cacheKey;

    setLoading(true);
    try {
      const result = await searchJobs({
        query: params.query,
        location: params.location,
        country: params.country,
        category: params.category,
        skills: params.skills,
        titleOnly: true,
        maxDaysOld: 30,
        salaryMin: getSalaryFloor(params.country, params.seniorityLevel),
      });
      setJobCount(result.count);
    } catch {
      setJobCount(null);
    } finally {
      setLoading(false);
    }
  }, [contactInfo, sections, jobsAvailable]);

  useEffect(() => {
    if (!jobsAvailable) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchJobCount, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchJobCount]);

  // Mobile banner: show once per session when jobCount first loads
  useEffect(() => {
    if (!jobsAvailable) return;
    if (jobCount === null || jobCount === 0 || loading) return;

    try {
      if (sessionStorage.getItem(MOBILE_BANNER_KEY)) return;
    } catch { /* ignore */ }

    setShowMobileBanner(true);

    // Auto-dismiss after 8 seconds
    mobileBannerTimerRef.current = setTimeout(() => {
      dismissMobileBanner();
    }, 8000);

    return () => {
      if (mobileBannerTimerRef.current) clearTimeout(mobileBannerTimerRef.current);
    };
  }, [jobCount, loading]);

  const dismissMobileBanner = () => {
    setShowMobileBanner(false);
    try {
      sessionStorage.setItem(MOBILE_BANNER_KEY, '1');
    } catch { /* ignore */ }
    if (mobileBannerTimerRef.current) {
      clearTimeout(mobileBannerTimerRef.current);
      mobileBannerTimerRef.current = null;
    }
  };

  const showBadge = jobsAvailable && (loading || (jobCount !== null && jobCount > 0));

  const handleBadgeClick = () => {
    const params = extractJobSearchParams(contactInfo, sections);
    if (params) {
      try {
        sessionStorage.setItem('jobSearchPrefill', JSON.stringify({
          title: params.displayTitle,
          location: params.location,
          country: params.country,
          skills: params.skills,
          seniorityLevel: params.seniorityLevel,
          yearsExperience: params.yearsExperience,
          returnTo: window.location.pathname,
        }));
      } catch { /* ignore */ }
    }
  };

  // Badge element to portal into the header
  // One line, one number. The count is the information; a static dot marks
  // it live. No perpetual ping — motion on the workbench is feedback only.
  const badgeElement = showBadge ? (
    <Link
      to="/jobs"
      onClick={handleBadgeClick}
      aria-label={loading ? 'Finding matching jobs' : `${jobCount?.toLocaleString()} matching jobs, view`}
      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-black/[0.08] bg-white pl-3 pr-2 text-sm font-medium text-ink transition-colors hover:bg-black/[0.04] animate-[badgeFadeIn_0.4s_ease-out] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      {loading ? (
        <span className="h-3 w-8 animate-pulse rounded bg-black/10" aria-hidden="true" />
      ) : (
        <span className="font-bold tabular-nums">{jobCount?.toLocaleString()}</span>
      )}
      <span className="text-ink/60">jobs</span>
      <ChevronRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  ) : null;

  return (
    <>
      {/* Job Match Badge - Portaled into header */}
      {badgeElement && portalTarget && ReactDOM.createPortal(badgeElement, portalTarget)}

      {/* Header Bar - Fixed position at top right, hidden on mobile (mobile has MobileActionBar) */}
      <div className="fixed top-4 right-6 z-[65] hidden lg:flex items-center gap-3">
        {/* Save Status for authenticated users */}
        {isAuthenticated && saveStatus && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200/60">
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>
        )}
      </div>

      {/* Mobile Job Notification Banner */}
      {showMobileBanner && (
        <div className="fixed top-0 left-0 right-0 z-[70] lg:hidden animate-[slideDown_0.3s_ease-out]">
          <div className="bg-ink text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <Link
              to="/jobs"
              onClick={() => {
                handleBadgeClick();
                dismissMobileBanner();
              }}
              className="flex min-h-11 items-center gap-2 flex-1 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <JobSparkleIcon className="w-4 h-4 flex-shrink-0 text-accent" />
              <span className="text-sm font-medium truncate">
                {jobCount} jobs matched to your skills
              </span>
              <span className="text-xs text-white/60 flex-shrink-0">View &rarr;</span>
            </Link>
            <button
              onClick={dismissMobileBanner}
              className="ml-2 inline-flex min-h-11 min-w-11 items-center justify-center p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Idle Nudge - Portal to body.
          Five minutes in is the moment an anonymous user starts wondering what
          this is going to cost. It used to nag them to "save permanently" —
          which contradicts the header's own "Saved on device" badge and is the
          exact pressure Principle 1 rules out. It now answers the question
          instead. `role="status"` carries an implicit polite live region; the
          old `role="alert"` + `aria-live="polite"` pair was contradictory. */}
      {showIdleTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed top-20 right-6 z-[70] max-w-xs bg-ink text-white text-sm px-4 py-3 rounded-xl shadow-xl"
            role="status"
          >
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" aria-hidden="true" />
              <p className="flex-1 leading-relaxed">
                Saved on this device. Your PDF is free to download &mdash; no account needed.
              </p>
              <button
                onClick={onDismissIdleTooltip}
                className="-my-1 -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
