-- ==============================================================================
-- MIGRATION: Increase Icon Size Limit
-- ==============================================================================
-- Purpose: Increase resume_icons file size limit from 50KB to 500KB
-- Reason: Real-world company logos and icons often exceed 50KB
-- Date: 2025-12-29
-- ==============================================================================

-- Drop the old constraint
ALTER TABLE public.resume_icons
  DROP CONSTRAINT IF EXISTS resume_icons_size_check;

-- Add new constraint with 500KB limit (512000 bytes)
ALTER TABLE public.resume_icons
  ADD CONSTRAINT resume_icons_size_check CHECK (file_size <= 512000);

-- Update comment
COMMENT ON CONSTRAINT resume_icons_size_check ON public.resume_icons
  IS 'Maximum file size: 500KB (512000 bytes)';
