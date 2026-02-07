// src/components/editor/EditorHeader.tsx
// Header component for Editor with status indicators, idle tooltip, and job match badge

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Briefcase, X } from 'lucide-react';
import { SaveStatus, ContactInfo, Section } from '../../types';
import { SaveStatusIndicator } from '../SaveStatusIndicator';
import { affiliateConfig } from '../../config/affiliate';
import { extractJobSearchParams } from '../../utils/resumeDataExtractor';
import { searchJobs } from '../../services/jobs';

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
 * - Job match badge when job search affiliate is enabled
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
  const [loading, setLoading] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showMobileBanner, setShowMobileBanner] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>('');
  const hasAnimatedRef = useRef(false);
  const mobileBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobCount = useCallback(async () => {
    if (!affiliateConfig.jobSearch.enabled) return;

    const params = extractJobSearchParams(contactInfo, sections);
    if (!params) {
      setJobCount(null);
      return;
    }

    const cacheKey = `${params.query}|${params.location}|${params.country}`;
    if (cacheKey === lastQueryRef.current) return;
    lastQueryRef.current = cacheKey;

    setLoading(true);
    try {
      const result = await searchJobs(params.query, params.location, params.country, params.category);
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

  // First-appearance bounce animation for desktop badge
  useEffect(() => {
    if (hasAnimatedRef.current) return;
    if (jobCount !== null && jobCount > 0 && !loading) {
      hasAnimatedRef.current = true;
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [jobCount, loading]);

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
        }));
      } catch { /* ignore */ }
    }
  };

  return (
    <>
      {/* Header Bar - Fixed position at top right, hidden on mobile (mobile has MobileActionBar) */}
      <div className="fixed top-4 right-6 z-[65] hidden lg:flex items-center gap-3">
        {/* Job Match Badge */}
        {showBadge && (
          <Link
            to="/jobs"
            onClick={handleBadgeClick}
            className={`bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100 ${isBouncing ? 'animate-bounce' : ''}`}
          >
            {loading ? (
              <div className="w-3 h-3 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
            ) : (
              <Briefcase className="w-3 h-3" />
            )}
            <span>
              {loading ? 'Checking...' : `${jobCount} matches`}
            </span>
            <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              NEW
            </span>
          </Link>
        )}

        {/* Save Status for authenticated users */}
        {isAuthenticated && saveStatus && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200/60">
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>
        )}
      </div>

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
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">
                {jobCount} matching jobs found
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
