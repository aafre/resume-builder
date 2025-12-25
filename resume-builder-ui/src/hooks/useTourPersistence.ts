import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface UseTourPersistenceProps {
  isAuthenticated: boolean;
  session: Session | null;
  authLoading: boolean;
}

interface UseTourPersistenceReturn {
  shouldShowTour: boolean;
  markTourComplete: () => Promise<void>;
  isChecking: boolean;
}

/**
 * Custom hook to manage tour persistence with hybrid strategy:
 * - Anonymous users: localStorage only
 * - Authenticated users: localStorage + Supabase cloud (multi-device sync)
 *
 * @param isAuthenticated - Whether the user is authenticated
 * @param session - The user's Supabase session
 * @param authLoading - Whether auth is still loading
 * @returns Object with shouldShowTour flag, markTourComplete function, and isChecking state
 */
export default function useTourPersistence({
  isAuthenticated,
  session,
  authLoading
}: UseTourPersistenceProps): UseTourPersistenceReturn {
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkTourStatus = async () => {
      setIsChecking(true);

      // Quick check: localStorage (works for all users)
      const localFlag = localStorage.getItem("resume-builder-tour-seen");
      if (localFlag === "true") {
        setShouldShowTour(false);
        setIsChecking(false);
        return;
      }

      // For authenticated users: also check cloud
      if (isAuthenticated && session) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('tour_completed')
            .eq('user_id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows found (expected for new users)
            console.warn('Failed to fetch tour status from cloud:', error);
          }

          if (data?.tour_completed) {
            // Sync to localStorage for faster future checks
            localStorage.setItem("resume-builder-tour-seen", "true");
            setShouldShowTour(false);
            setIsChecking(false);
            return;
          }
        } catch (error) {
          console.warn('Failed to fetch tour status from cloud:', error);
          // Continue to show tour on error (fail open)
        }
      }

      // Show tour if not seen in either location
      setShouldShowTour(true);
      setIsChecking(false);
    };

    if (!authLoading) {
      checkTourStatus();
    }
  }, [authLoading, isAuthenticated, session]);

  /**
   * Marks the tour as completed in both localStorage and cloud (for authenticated users)
   */
  const markTourComplete = async () => {
    // Always save to localStorage first (fast, synchronous)
    localStorage.setItem("resume-builder-tour-seen", "true");
    setShouldShowTour(false);

    // For authenticated users: also save to cloud
    if (isAuthenticated && session) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: session.user.id,
            tour_completed: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.warn('Failed to save tour status to cloud:', error);
          // Not critical - localStorage already saved
        }
      } catch (error) {
        console.warn('Failed to save tour status to cloud:', error);
        // Not critical - localStorage already saved
      }
    }
  };

  return { shouldShowTour, markTourComplete, isChecking };
}
