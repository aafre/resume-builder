// src/hooks/editor/useTourFlow.ts
// Tour flow hook (Layer 3) - manages welcome tour and idle nudge logic

import { useState, useEffect, useRef, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { UseTourFlowReturn } from '../../types/editor';

/**
 * Props for useTourFlow hook (dependency injection from contexts and hooks)
 */
export interface UseTourFlowProps {
  // Auth state
  session: Session | null;
  isAnonymous: boolean;
  anonMigrationInProgress: boolean;
  authLoading: boolean;

  // Preferences state
  tourCompleted: boolean;
  prefsLoading: boolean;
  setPreference: (key: 'tour_completed', value: boolean) => Promise<void>;

  // Conversion tracking
  hasShownIdleNudge: boolean;
  markIdleNudgeShown: () => Promise<void>;
}

/**
 * useTourFlow Hook
 *
 * Manages welcome tour and idle nudge flows including:
 * - Initial tour launch with 1.5s delay for new users
 * - Tour re-launch after OAuth sign-in and migration completion
 * - Idle nudge tooltip after 5 minutes for anonymous users
 * - Infinite loop prevention with refs
 *
 * @param props - Dependency injection props from auth context and preference hooks
 * @returns Tour flow state and handlers
 *
 * @example
 * const tour = useTourFlow({
 *   session,
 *   isAnonymous,
 *   anonMigrationInProgress,
 *   authLoading,
 *   tourCompleted: preferences.tour_completed,
 *   prefsLoading,
 *   setPreference,
 *   hasShownIdleNudge,
 *   markIdleNudgeShown,
 * });
 *
 * // Use in JSX
 * <ContextAwareTour
 *   isOpen={tour.showWelcomeTour}
 *   onComplete={tour.handleTourComplete}
 * />
 */
export const useTourFlow = ({
  session,
  isAnonymous,
  anonMigrationInProgress,
  authLoading,
  tourCompleted,
  prefsLoading,
  setPreference,
  hasShownIdleNudge,
  markIdleNudgeShown,
}: UseTourFlowProps): UseTourFlowReturn => {
  // Tour state
  const [showWelcomeTour, setShowWelcomeTour] = useState<boolean>(false);

  // Idle nudge state
  const [showIdleTooltip, setShowIdleTooltip] = useState<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sign-in from tour tracking
  const [isSigningInFromTour, setIsSigningInFromTour] = useState<boolean>(false);

  // Refs to prevent infinite loops
  const hasLaunchedTourAfterSignIn = useRef<boolean>(false);
  const justSignedInFromTour = useRef<boolean>(false);

  // Derived: should we show tour for new users?
  const shouldShowTour = !tourCompleted && !prefsLoading;

  /**
   * Initial tour launch effect
   * Shows tour after 1.5s delay for new users who haven't completed it
   */
  useEffect(() => {
    if (shouldShowTour) {
      const timer = setTimeout(() => setShowWelcomeTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowTour]);

  /**
   * Tour re-launch after sign-in effect
   * Re-launches tour after successful OAuth sign-in and migration completion
   * with comprehensive guard conditions to prevent infinite loops
   */
  useEffect(() => {
    // Only proceed if:
    // 1. User just signed in from tour (not a regular page load)
    // 2. User is authenticated (not anonymous anymore)
    // 3. Migration has completed
    // 4. Tour is not already showing
    // 5. Haven't already launched tour after this sign-in (prevents infinite loop)
    // 6. User hasn't completed tour yet (prevents re-launch on page reload)

    if (
      justSignedInFromTour.current &&
      !isAnonymous &&
      session &&
      !anonMigrationInProgress &&
      !authLoading &&
      !prefsLoading &&
      !tourCompleted &&
      !showWelcomeTour &&
      !hasLaunchedTourAfterSignIn.current
    ) {
      // Small delay to let UI settle after migration
      const timer = setTimeout(() => {
        setShowWelcomeTour(true);
        // No toast needed - tour showing "Cloud Saving Active" is sufficient
        hasLaunchedTourAfterSignIn.current = true; // Mark as launched to prevent loop
        justSignedInFromTour.current = false; // Reset the flag
        setIsSigningInFromTour(false); // Reset signing-in flag
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [
    isAnonymous,
    session,
    anonMigrationInProgress,
    authLoading,
    prefsLoading,
    tourCompleted,
    showWelcomeTour,
  ]);

  /**
   * Idle nudge timer effect
   * Shows tooltip after 5 minutes for anonymous users who haven't seen it
   * Auto-dismisses after 10 seconds
   */
  useEffect(() => {
    if (isAnonymous && !hasShownIdleNudge && !authLoading) {
      // Start 5-minute timer
      idleTimerRef.current = setTimeout(() => {
        setShowIdleTooltip(true);
        markIdleNudgeShown();

        // Auto-dismiss after 10 seconds (track timer for cleanup)
        idleDismissTimerRef.current = setTimeout(() => setShowIdleTooltip(false), 10000);
      }, 5 * 60 * 1000); // 5 minutes

      return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (idleDismissTimerRef.current) clearTimeout(idleDismissTimerRef.current);
      };
    }
  }, [isAnonymous, hasShownIdleNudge, authLoading, markIdleNudgeShown]);

  /**
   * Complete the welcome tour
   * Closes tour modal and persists completion to database
   */
  const handleTourComplete = useCallback(async () => {
    setShowWelcomeTour(false);
    await setPreference('tour_completed', true);
    hasLaunchedTourAfterSignIn.current = false; // Reset for future sign-ins
  }, [setPreference]);

  /**
   * Dismiss the idle tooltip
   * Called when user clicks the close button on the tooltip
   */
  const dismissIdleTooltip = useCallback(() => {
    setShowIdleTooltip(false);
  }, []);

  /**
   * Handle sign-in initiated from tour
   * Sets flags to track that user is signing in from the tour flow
   * This enables tour re-launch after migration completes
   */
  const handleSignInFromTour = useCallback(() => {
    setIsSigningInFromTour(true);
    justSignedInFromTour.current = true;
  }, []);

  /**
   * Handle successful sign-in from tour
   * Called by AuthModal onSuccess callback
   * Note: Tour will auto-relaunch via useEffect watching migration state
   */
  const handleSignInSuccess = useCallback(() => {
    // Tour will auto-relaunch via useEffect watching migration state
    // No action needed here - refs are already set by handleSignInFromTour
  }, []);

  return {
    showWelcomeTour,
    setShowWelcomeTour,
    handleTourComplete,
    showIdleTooltip,
    dismissIdleTooltip,
    isSigningInFromTour,
    handleSignInFromTour,
    handleSignInSuccess,
  };
};
