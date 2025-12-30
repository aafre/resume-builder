-- ==============================================================================
-- MIGRATION: Add Hash Diffing + User Preferences
-- ==============================================================================
-- Purpose: Add json_hash column for smart diffing and user_preferences table
-- for tracking last edited resume (session continuity).
--
-- Run this after 20250101000000_init_schema.sql
-- ==============================================================================

-- ==============================================================================
-- 1. ADD json_hash COLUMN TO resumes TABLE
-- ==============================================================================

-- Add hash column for diffing (hash of JSON representation)
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS json_hash VARCHAR(64);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_resumes_json_hash ON public.resumes(json_hash);

-- ==============================================================================
-- 2. CREATE user_preferences TABLE
-- ==============================================================================

-- Table: User Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    last_edited_resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- ==============================================================================
-- 3. ADD TRIGGER FOR user_preferences
-- ==============================================================================

-- Auto-update 'updated_at' trigger for user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY FOR user_preferences
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own preferences
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert own preferences
CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update own preferences
CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
