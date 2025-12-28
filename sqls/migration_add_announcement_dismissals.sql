-- Migration: Add announcement_dismissals column to user_preferences table
-- Purpose: Support dismissal tracking for the announcement bar system
-- Date: 2025-12-28
-- Author: Resume Builder Team

-- Add announcement_dismissals column to user_preferences table
-- This stores an array of dismissed announcement IDs for each user
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS announcement_dismissals TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.user_preferences.announcement_dismissals
  IS 'Array of dismissed announcement IDs for the announcement bar system. Each ID corresponds to a unique announcement that the user has dismissed.';

-- Verify column was added (optional - for migration testing)
-- This query should return a row showing the new column
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'user_preferences'
--   AND column_name = 'announcement_dismissals';
