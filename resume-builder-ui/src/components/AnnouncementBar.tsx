import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Transition } from '@headlessui/react';
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

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // Get active announcement for current route
  const activeAnnouncement = useMemo(
    () => getActiveAnnouncement(location.pathname, preferences.announcement_dismissals),
    [location.pathname, preferences.announcement_dismissals]
  );

  // Should show: has announcement, not loading, not currently authenticated
  const shouldShow = !isLoading && !!activeAnnouncement && !session?.user?.email;

  // Mount animation - delay slightly for smooth entrance
  useEffect(() => {
    if (shouldShow) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow]);

  // Dismiss handler with optimistic UI and database persistence
  const handleDismiss = async () => {
    if (isDismissing || !activeAnnouncement) return;

    setIsDismissing(true);
    setIsVisible(false);

    // Wait for animation to complete before persisting
    setTimeout(async () => {
      await addDismissedAnnouncement(activeAnnouncement.id);
      setIsDismissing(false);
    }, 300);
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

  if (!shouldShow || !activeAnnouncement) return null;

  // Variant-specific styling (more visible, less subtle)
  const variantStyles = {
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-900',
      accent: 'bg-gradient-to-r from-blue-500 to-blue-600',
      buttonBg: 'bg-blue-600 text-white hover:bg-blue-700',
      buttonHover: 'hover:bg-blue-200',
    },
    feature: {
      bg: 'bg-gradient-to-r from-purple-100 via-blue-50 to-indigo-100',
      border: 'border-purple-300',
      text: 'text-purple-900',
      accent: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700',
      buttonBg: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white hover:shadow-lg',
      buttonHover: 'hover:bg-purple-200',
    },
    success: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-900',
      accent: 'bg-gradient-to-r from-green-500 to-green-600',
      buttonBg: 'bg-green-600 text-white hover:bg-green-700',
      buttonHover: 'hover:bg-green-200',
    },
    warning: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      text: 'text-amber-900',
      accent: 'bg-gradient-to-r from-amber-500 to-amber-600',
      buttonBg: 'bg-amber-600 text-white hover:bg-amber-700',
      buttonHover: 'hover:bg-amber-200',
    },
  };

  const variant = activeAnnouncement.variant || 'feature';
  const styles = variantStyles[variant];

  return (
    <Transition
      show={isVisible}
      enter="transition-all duration-300 ease-out"
      enterFrom="max-h-0 opacity-0 -translate-y-full"
      enterTo="max-h-20 opacity-100 translate-y-0"
      leave="transition-all duration-300 ease-in"
      leaveFrom="max-h-20 opacity-100 translate-y-0"
      leaveTo="max-h-0 opacity-0 -translate-y-full"
    >
      <div
        className={`relative overflow-hidden ${styles.bg} border-b-2 ${styles.border} shadow-md z-[60]`}
        role="region"
        aria-label="Announcement banner"
        aria-live="polite"
      >
        {/* Gradient accent line at top for visual prominence */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${styles.accent}`} />

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {activeAnnouncement.icon && (
                <span className="text-lg flex-shrink-0" aria-hidden="true">
                  {activeAnnouncement.icon}
                </span>
              )}
              <p className={`text-xs sm:text-sm ${styles.text} font-semibold truncate`}>
                {activeAnnouncement.message}
              </p>
            </div>

            {/* Right: CTAs + Close */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Primary CTA Button */}
              {activeAnnouncement.primaryCta && (
                <button
                  onClick={handlePrimaryCta}
                  className={`
                    px-3 py-1.5 sm:px-4 sm:py-2
                    text-xs sm:text-sm font-bold
                    ${styles.buttonBg}
                    rounded-lg shadow-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                    whitespace-nowrap
                    hover:scale-105
                  `}
                  aria-label={activeAnnouncement.primaryCta.text}
                >
                  {activeAnnouncement.primaryCta.text}
                </button>
              )}

              {/* Secondary CTA Link */}
              {activeAnnouncement.secondaryCta && (
                <Link
                  to={activeAnnouncement.secondaryCta.url}
                  className={`
                    text-xs sm:text-sm font-bold
                    ${styles.text}
                    underline hover:no-underline
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:rounded
                    whitespace-nowrap
                    hover:opacity-70
                  `}
                  aria-label={activeAnnouncement.secondaryCta.text}
                >
                  {activeAnnouncement.secondaryCta.text}
                </Link>
              )}

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className={`
                  p-1.5 rounded-lg
                  ${styles.buttonHover}
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  flex-shrink-0
                `}
                aria-label={`Dismiss announcement: ${activeAnnouncement.message}`}
                disabled={isDismissing}
              >
                <XMarkIcon className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
