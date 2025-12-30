-- ==============================================================================
-- MIGRATION: Add thumbnail_url column to resumes table
-- ==============================================================================
-- Purpose: Add thumbnail_url column for storing resume thumbnail previews
-- Date: 2025-12-29
-- ==============================================================================

-- Add thumbnail_url column
ALTER TABLE public.resumes
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.resumes.thumbnail_url
  IS 'Public URL to the resume thumbnail image stored in Supabase Storage';

-- Note: Existing RLS policies already cover this column
