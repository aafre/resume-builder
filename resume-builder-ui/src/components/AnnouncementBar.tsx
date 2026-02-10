import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import usePreferencePersistence from '../hooks/usePreferencePersistence';
import { getActiveAnnouncement } from '../config/announcements';

/**
 * AnnouncementBar - Reusable notification banner for app-wide announcements
 *
 * Features:
 * - Shows contextually based on current route
 * - Persists dismissals to Supabase database
 * - Supports multiple CTA types (sign-in button, learn more link)
 * - Smooth slide-down/up animations
 * - Fully accessible (ARIA, keyboard navigation)
 * - Responsive design
 */
export default function AnnouncementBar() {
  const location = useLocation();
  const { session, loading: authLoading, showAuthModal } = useAuth();
  const { preferences, addDismissedAnnouncement, isLoading } = usePreferencePersistence({
    session,
    authLoading,
  });

  const [isDismissing, setIsDismissing] = useState(false);

  // Get active announcement for current route
  const activeAnnouncement = useMemo(
    () => getActiveAnnouncement(location.pathname, preferences.announcement_dismissals),
    [location.pathname, preferences.announcement_dismissals]
  );

  // Should show: has announcement, not loading, not currently authenticated
  const shouldShow = !isLoading && !!activeAnnouncement && !session?.user?.email;

  // Dismiss handler with optimistic UI and database persistence
  const handleDismiss = async () => {
    if (isDismissing || !activeAnnouncement) return;
    setIsDismissing(true);
    await addDismissedAnnouncement(activeAnnouncement.id);
    setIsDismissing(false);
  };

  // Primary CTA handler (Sign In or Link navigation)
  const handlePrimaryCta = () => {
    if (!activeAnnouncement?.primaryCta) return;

    if (activeAnnouncement.primaryCta.action === 'sign-in') {
      showAuthModal();
    } else if (activeAnnouncement.primaryCta.url) {
      window.location.href = activeAnnouncement.primaryCta.url;
    }
  };

  if (!shouldShow || !activeAnnouncement) {
    // On the landing page, render an invisible placeholder ONLY while auth/preferences
    // are still loading. Once resolved, return null to avoid empty space for logged-in users.
    if (location.pathname === '/' && (authLoading || isLoading)) {
      return (
        <div className="bg-ink" style={{ minHeight: '43px', visibility: 'hidden' }} />
      );
    }
    return null;
  }

  return (
    <div
      className="bg-ink border-b border-white/10 relative z-[60]"
      role="region"
      aria-label="Announcement banner"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-3 py-2.5 relative">
        {/* Desktop: Centered layout */}
        <div className="hidden sm:flex items-center justify-center gap-3">
          {/* Center: Icon + Message + CTAs */}
          <div className="flex items-center gap-3">
            {activeAnnouncement.icon && (
              <span className="text-lg flex-shrink-0" aria-hidden="true">
                {activeAnnouncement.icon}
              </span>
            )}
            <p className="text-sm text-white font-display font-semibold whitespace-nowrap">
              {activeAnnouncement.message}
            </p>

            {/* Primary CTA Button */}
            {activeAnnouncement.primaryCta && (
              <button
                onClick={handlePrimaryCta}
                className="px-4 py-1.5 text-xs font-bold bg-accent text-ink rounded-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer"
                aria-label={activeAnnouncement.primaryCta.text}
              >
                {activeAnnouncement.primaryCta.text}
              </button>
            )}

            {/* Secondary CTA Link */}
            {activeAnnouncement.secondaryCta && (
              <a
                href={activeAnnouncement.secondaryCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-white/70 underline hover:text-white transition-colors whitespace-nowrap"
                aria-label={activeAnnouncement.secondaryCta.text}
              >
                {activeAnnouncement.secondaryCta.text}
              </a>
            )}
          </div>

          {/* Close Button - Absolute positioned to right */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label={`Dismiss announcement: ${activeAnnouncement.message}`}
            disabled={isDismissing}
          >
            <XMarkIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile: Ticker animation with CTA buttons */}
        <div className="flex sm:hidden items-center gap-2 relative">
          {/* Fixed left side: Icon + CTA button */}
          <div className="flex items-center gap-1.5 flex-shrink-0 z-[2]">
            {activeAnnouncement.icon && (
              <span className="text-lg" aria-hidden="true">
                {activeAnnouncement.icon}
              </span>
            )}
            {activeAnnouncement.primaryCta && (
              <button
                onClick={handlePrimaryCta}
                className="px-2.5 py-1 text-[11px] font-bold bg-accent text-ink rounded-md shadow-sm whitespace-nowrap cursor-pointer"
                aria-label={activeAnnouncement.primaryCta.text}
              >
                {activeAnnouncement.primaryCta.text}
              </button>
            )}
          </div>

          {/* Ticker container (scrolling text) */}
          <div
            className="flex-1 overflow-hidden relative h-5"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            <div
              className="inline-block whitespace-nowrap"
              style={{
                animation: 'ticker 12s linear infinite',
                paddingLeft: '100%'
              }}
            >
              <span className="text-xs text-white font-display font-semibold">
                {activeAnnouncement.message}
              </span>
            </div>
          </div>

          {/* Fixed right side: Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-all flex-shrink-0 z-[2] cursor-pointer"
            aria-label="Dismiss"
            disabled={isDismissing}
          >
            <XMarkIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Ticker animation keyframes */}
        <style>{`
          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
