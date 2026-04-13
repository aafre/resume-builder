-- Drop the updated_at auto-update trigger from resumes table.
--
-- The "smart" trigger (20251230000001) cannot distinguish between
-- "preserve current value" and "not explicitly set" — any UPDATE
-- that doesn't change updated_at to a DIFFERENT value resets it
-- to NOW(). This corrupts timestamps on metadata-only operations:
--   - GET /api/resumes/<id> (last_accessed_at update)
--   - Thumbnail generation (thumbnail_url/pdf_generated_at update)
--   - Anonymous→auth migration (user_id update)
--
-- The application already sets updated_at = NOW() explicitly for
-- intentional content changes (save, rename). No trigger needed.

DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;

-- Keep the function and user_preferences trigger intact:
--   update_updated_at_column() is still used by
--   update_user_preferences_updated_at ON public.user_preferences
