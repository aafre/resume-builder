-- Migration: Create user_preferences table for SaaS platform features
-- Purpose: Store user preferences including tour completion status for multi-device sync
-- Date: 2025-12-25

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_preferences TO authenticated;

-- Comments for documentation
COMMENT ON TABLE user_preferences IS 'Stores user preferences including tour completion status for multi-device sync';
COMMENT ON COLUMN user_preferences.user_id IS 'Foreign key to auth.users, primary key';
COMMENT ON COLUMN user_preferences.tour_completed IS 'Whether the user has completed the onboarding tour';
COMMENT ON COLUMN user_preferences.created_at IS 'Timestamp when the preference row was created';
COMMENT ON COLUMN user_preferences.updated_at IS 'Timestamp when the preference row was last updated';
