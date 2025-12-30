-- ==============================================================================
-- MIGRATION: Add Boolean Preference Columns
-- ==============================================================================
-- Purpose: Add dedicated boolean columns for user preferences
-- Background: Supabase anonymous users have real UUIDs, so we can store
--             preferences in DB for everyone (no localStorage needed)
-- Date: 2025-12-29
-- ==============================================================================

-- Add tour_completed column
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS tour_completed BOOLEAN DEFAULT FALSE;

-- Add idle_nudge_shown column
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS idle_nudge_shown BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN public.user_preferences.tour_completed
  IS 'Whether user completed onboarding tour (persistent for all users)';

COMMENT ON COLUMN public.user_preferences.idle_nudge_shown
  IS 'Whether idle conversion nudge was shown to user (one-time ever for all users)';

-- Note: Existing RLS policies already cover these columns
-- Note: Existing updated_at trigger already handles these columns
-- Note: Keep preferences JSONB column for future extensibility
