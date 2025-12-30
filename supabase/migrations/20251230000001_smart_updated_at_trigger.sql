-- Make updated_at trigger smarter: only auto-update if not explicitly set
-- This allows migration to preserve original timestamps

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Only auto-update if updated_at wasn't explicitly changed
    -- Check if OLD.updated_at equals NEW.updated_at (unchanged)
    IF OLD.updated_at IS NULL OR OLD.updated_at = NEW.updated_at THEN
        NEW.updated_at = NOW();
    END IF;
    -- If updated_at was explicitly set to a different value, preserve it
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

COMMENT ON FUNCTION update_updated_at_column()
IS 'Trigger function to automatically update updated_at column. Only sets to NOW() if not explicitly changed. Uses fixed search_path for security.';

-- Re-attach triggers (they were dropped with CASCADE above)
DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
