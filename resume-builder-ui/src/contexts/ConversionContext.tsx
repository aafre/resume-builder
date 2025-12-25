import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ConversionContextType {
  hasShownDownloadToast: boolean;
  hasShownIdleNudge: boolean;
  activeNudge: string | null;
  markDownloadToastShown: () => void;
  markIdleNudgeShown: () => void;
  showNudge: (nudgeId: string) => boolean;
  dismissNudge: (nudgeId: string) => void;
  resetSession: () => void;
}

const ConversionContext = createContext<ConversionContextType | undefined>(undefined);

interface ConversionProviderProps {
  children: ReactNode;
}

/**
 * ConversionProvider manages state for conversion nudges (download toast, idle tooltip)
 *
 * Features:
 * - Session-based tracking for download toast (resets on page reload)
 * - Persistent tracking for idle nudge (localStorage, one-time ever)
 * - Nudge overlap prevention (only one active nudge at a time)
 */
export function ConversionProvider({ children }: ConversionProviderProps) {
  // Session-based: resets on page reload
  const [hasShownDownloadToast, setHasShownDownloadToast] = useState(false);

  // Persistent: stored in localStorage, persists across sessions
  const [hasShownIdleNudge, setHasShownIdleNudge] = useState(() => {
    try {
      return localStorage.getItem('idle-nudge-shown') === 'true';
    } catch (error) {
      console.warn('Failed to read idle-nudge-shown from localStorage:', error);
      return false;
    }
  });

  // Track which nudge is currently active to prevent overlaps
  const [activeNudge, setActiveNudge] = useState<string | null>(null);

  /**
   * Mark download toast as shown (session-based)
   */
  const markDownloadToastShown = useCallback(() => {
    setHasShownDownloadToast(true);
  }, []);

  /**
   * Mark idle nudge as shown (persistent via localStorage)
   */
  const markIdleNudgeShown = useCallback(() => {
    setHasShownIdleNudge(true);
    try {
      localStorage.setItem('idle-nudge-shown', 'true');
    } catch (error) {
      console.warn('Failed to save idle-nudge-shown to localStorage:', error);
    }
  }, []);

  /**
   * Attempt to show a nudge. Returns true if allowed, false if blocked.
   * Prevents multiple nudges from showing simultaneously.
   *
   * @param nudgeId - Unique identifier for the nudge (e.g., 'download-toast', 'idle-tooltip')
   * @returns true if nudge can be shown, false if blocked by another active nudge
   */
  const showNudge = useCallback((nudgeId: string): boolean => {
    if (activeNudge && activeNudge !== nudgeId) {
      console.log(`Nudge "${nudgeId}" blocked - "${activeNudge}" is already active`);
      return false;
    }
    setActiveNudge(nudgeId);
    return true;
  }, [activeNudge]);

  /**
   * Dismiss a nudge, allowing other nudges to show
   *
   * @param nudgeId - Unique identifier for the nudge to dismiss
   */
  const dismissNudge = useCallback((nudgeId: string) => {
    if (activeNudge === nudgeId) {
      setActiveNudge(null);
    }
  }, [activeNudge]);

  /**
   * Reset session-based nudge states (called on sign-in)
   * Note: Persistent nudges (idle) are NOT reset
   */
  const resetSession = useCallback(() => {
    setHasShownDownloadToast(false);
    // Don't reset hasShownIdleNudge - it's one-time ever
  }, []);

  const value: ConversionContextType = {
    hasShownDownloadToast,
    hasShownIdleNudge,
    activeNudge,
    markDownloadToastShown,
    markIdleNudgeShown,
    showNudge,
    dismissNudge,
    resetSession
  };

  return (
    <ConversionContext.Provider value={value}>
      {children}
    </ConversionContext.Provider>
  );
}

/**
 * Custom hook to access conversion context
 *
 * @throws Error if used outside ConversionProvider
 */
export function useConversion(): ConversionContextType {
  const context = useContext(ConversionContext);
  if (context === undefined) {
    throw new Error('useConversion must be used within a ConversionProvider');
  }
  return context;
}
