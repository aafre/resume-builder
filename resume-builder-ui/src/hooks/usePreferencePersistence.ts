import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

type PreferenceKey = 'tour_completed' | 'idle_nudge_shown';

interface UsePreferencePersistenceProps {
  session: Session | null;
  authLoading: boolean;
}

interface PreferenceState {
  tour_completed: boolean;
  idle_nudge_shown: boolean;
}

interface UsePreferencePersistenceReturn {
  preferences: PreferenceState;
  setPreference: (key: PreferenceKey, value: boolean) => Promise<void>;
  isLoading: boolean;
}

/**
 * Unified hook for managing user preferences with database persistence
 *
 * Features:
 * - Works for both anonymous and authenticated users (both have real user_id in Supabase)
 * - Database is single source of truth (no localStorage needed)
 * - Auto-creates user_preferences row if missing (on first load)
 * - Uses upsert with onConflict: 'user_id' for atomic updates
 * - Graceful error handling (fails silently to avoid blocking UX)
 *
 * Why this works:
 * Supabase anonymous users are real users in auth.users table with valid UUIDs.
 * When they sign up, their user_id stays the same - only their auth provider changes.
 * This means preferences stored under their anonymous user_id automatically travel
 * with them when they convert to authenticated users.
 *
 * @param session - The user's Supabase session (anonymous or authenticated)
 * @param authLoading - Whether auth is still loading
 * @returns Object with preferences state, setPreference function, and isLoading state
 */
export default function usePreferencePersistence({
  session,
  authLoading
}: UsePreferencePersistenceProps): UsePreferencePersistenceReturn {
  const [preferences, setPreferences] = useState<PreferenceState>({
    tour_completed: false,
    idle_nudge_shown: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from database on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (!session) {
        // No session yet - wait for auth to load
        setIsLoading(authLoading);
        return;
      }

      if (!supabase) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('tour_completed, idle_nudge_shown')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          // Log any errors (maybeSingle doesn't throw for missing rows)
          console.warn('Failed to fetch preferences from database:', error);
        }

        if (data) {
          // User has preferences in database
          setPreferences({
            tour_completed: data.tour_completed || false,
            idle_nudge_shown: data.idle_nudge_shown || false
          });
        } else if (supabase) {
          // New user - create preferences row with defaults
          const { error: upsertError } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: session.user.id,
              tour_completed: false,
              idle_nudge_shown: false,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (upsertError) {
            console.warn('Failed to create preferences row:', upsertError);
          }

          // Set default preferences in state
          setPreferences({
            tour_completed: false,
            idle_nudge_shown: false
          });
        }
      } catch (error) {
        console.warn('Failed to load preferences:', error);
        // Fail gracefully with defaults
        setPreferences({
          tour_completed: false,
          idle_nudge_shown: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadPreferences();
    }
  }, [authLoading, session]);

  /**
   * Set a preference value (updates database immediately)
   *
   * @param key - The preference key to update
   * @param value - The new boolean value
   */
  const setPreference = useCallback(async (key: PreferenceKey, value: boolean) => {
    if (!session) {
      console.warn(`Cannot set preference ${key}: no session`);
      return;
    }

    if (!supabase) {
      console.warn('Supabase not initialized');
      return;
    }

    // Update local state immediately for responsive UI
    setPreferences(prev => ({ ...prev, [key]: value }));

    // Update database
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          [key]: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.warn(`Failed to save ${key} to database:`, error);
        // Revert local state on error
        setPreferences(prev => ({ ...prev, [key]: !value }));
      }
    } catch (error) {
      console.warn(`Failed to save ${key} to database:`, error);
      // Revert local state on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
    }
  }, [session]);

  return { preferences, setPreference, isLoading };
}
