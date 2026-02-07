// src/components/editor/EditorHeader.tsx
// Header component for Editor with idle tooltip, job match badge (portaled to header), and mobile banner

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { JobSparkleIcon } from '../icons/JobSparkleIcon';
import { ContactInfo, Section } from '../../types';
import { affiliateConfig } from '../../config/affiliate';
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
 * - Job match badge portaled into the sticky header
 * - Mobile job notification banner (once per session)
 */
export const EditorHeader: React.FC<EditorHeaderProps> = ({
  showIdleTooltip,
  onDismissIdleTooltip,
  isAuthenticated: _isAuthenticated,
  contactInfo,
  sections,
}) => {
  const [jobCount, setJobCount] = useState<number | null>(null);
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
    if (!affiliateConfig.jobSearch.enabled) return;

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
  }, [contactInfo, sections]);

  useEffect(() => {
    if (!affiliateConfig.jobSearch.enabled) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchJobCount, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchJobCount]);

  // Mobile banner: show once per session when jobCount first loads
  useEffect(() => {
    if (!affiliateConfig.jobSearch.enabled) return;
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

  const showBadge = affiliateConfig.jobSearch.enabled && (loading || (jobCount !== null && jobCount > 0));

  const handleBadgeClick = () => {
    console.log('[affiliate] click: job-match-badge');
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
        }));
      } catch { /* ignore */ }
    }
  };

  // Badge element to portal into the header
  const badgeElement = showBadge ? (
    <Link
      to="/jobs"
      onClick={handleBadgeClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 rounded-full shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 animate-[badgeFadeIn_0.4s_ease-out] group"
    >
      {loading ? (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
      ) : (
        <JobSparkleIcon className="w-3.5 h-3.5 text-indigo-600" />
      )}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider group-hover:text-indigo-500 transition-colors">
          Matches
        </span>
        <span className="text-xs font-bold text-gray-900 tabular-nums">
          {loading ? '...' : jobCount?.toLocaleString()}
        </span>
      </div>
      {!loading && (
        <span className="relative flex h-2 w-2 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
        </span>
      )}
    </Link>
  ) : null;

  return (
    <>
      {/* Job Match Badge - Portaled into header */}
      {badgeElement && portalTarget && ReactDOM.createPortal(badgeElement, portalTarget)}

      {/* Mobile Job Notification Banner */}
      {showMobileBanner && (
        <div className="fixed top-0 left-0 right-0 z-[70] lg:hidden animate-[slideDown_0.3s_ease-out]">
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
            <Link
              to="/jobs"
              onClick={() => {
                handleBadgeClick();
                dismissMobileBanner();
              }}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <JobSparkleIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">
                {jobCount} jobs matched to your skills
              </span>
              <span className="text-xs text-indigo-200 flex-shrink-0">View &rarr;</span>
            </Link>
            <button
              onClick={dismissMobileBanner}
              className="ml-2 p-1 hover:bg-indigo-500 rounded transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Idle Nudge Tooltip - Portal to body */}
      {showIdleTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed top-20 right-6 z-[70] bg-blue-600 text-white text-sm px-4 py-3 rounded-lg shadow-xl animate-bounce"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span aria-hidden="true">💡</span>
              <span>Don't forget to save your progress permanently</span>
              <button
                onClick={onDismissIdleTooltip}
                className="ml-2 hover:opacity-75 text-white"
                aria-label="Dismiss reminder"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
