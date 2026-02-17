-- Ensure pg_cron is available
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function: find and delete anon users with no resumes, older than 7 days
CREATE OR REPLACE FUNCTION public.cleanup_stale_anon_users(
  grace_interval INTERVAL DEFAULT INTERVAL '7 days',
  batch_size INTEGER DEFAULT 1000
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH stale_anon AS (
    SELECT u.id
    FROM auth.users u
    LEFT JOIN public.resumes r ON r.user_id = u.id
    WHERE u.is_anonymous = true
      AND r.id IS NULL
      AND u.created_at < NOW() - grace_interval
    LIMIT batch_size
  )
  DELETE FROM auth.users
  WHERE id IN (SELECT id FROM stale_anon);

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RAISE LOG 'cleanup_stale_anon_users: deleted % anonymous users with no resumes', deleted_count;

  RETURN deleted_count;
END;
$$;

-- Restrict execution to postgres only (SECURITY DEFINER deletes from auth.users)
REVOKE ALL ON FUNCTION public.cleanup_stale_anon_users FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_stale_anon_users TO postgres;

-- Schedule: daily at 3:00 AM UTC (idempotent: remove existing job first)
SELECT cron.unschedule('cleanup-stale-anon-users')
  WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'cleanup-stale-anon-users'
  );

SELECT cron.schedule(
  'cleanup-stale-anon-users',
  '0 3 * * *',
  'SELECT public.cleanup_stale_anon_users()'
);
