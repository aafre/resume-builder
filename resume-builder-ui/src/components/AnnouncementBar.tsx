import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
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

  if (!shouldShow || !activeAnnouncement) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(59, 130, 246))',
        borderBottom: '1px solid rgba(147, 51, 234, 0.3)',
        position: 'relative',
        zIndex: 60
      }}
      role="region"
      aria-label="Announcement banner"
      aria-live="polite"
    >
      {/* Gradient accent line at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234), rgb(99, 102, 241))'
      }} />

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          {/* Left: Icon + Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            {activeAnnouncement.icon && (
              <span style={{ fontSize: '18px', flexShrink: 0 }} aria-hidden="true">
                {activeAnnouncement.icon}
              </span>
            )}
            <p style={{
              fontSize: '14px',
              color: 'white',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {activeAnnouncement.message}
            </p>
          </div>

          {/* Right: CTAs + Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Primary CTA Button */}
            {activeAnnouncement.primaryCta && (
              <button
                onClick={handlePrimaryCta}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: 'white',
                  color: 'rgb(147, 51, 234)',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                aria-label={activeAnnouncement.primaryCta.text}
              >
                {activeAnnouncement.primaryCta.text}
              </button>
            )}

            {/* Secondary CTA Link */}
            {activeAnnouncement.secondaryCta && (
              <Link
                to={activeAnnouncement.secondaryCta.url}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'white',
                  textDecoration: 'underline',
                  whiteSpace: 'nowrap'
                }}
                aria-label={activeAnnouncement.secondaryCta.text}
              >
                {activeAnnouncement.secondaryCta.text}
              </Link>
            )}

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              style={{
                padding: '6px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              aria-label={`Dismiss announcement: ${activeAnnouncement.message}`}
              disabled={isDismissing}
            >
              <XMarkIcon style={{ width: '16px', height: '16px', color: 'white' }} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
