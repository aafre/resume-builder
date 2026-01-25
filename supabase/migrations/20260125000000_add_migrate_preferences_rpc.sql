-- RPC function to atomically migrate user preferences
-- Handles race conditions by performing check-and-update in a single transaction

CREATE OR REPLACE FUNCTION migrate_user_preferences(old_uid uuid, new_uid uuid)
RETURNS void AS $$
BEGIN
  -- Check if the new user already has preferences
  IF EXISTS (SELECT 1 FROM public.user_preferences WHERE user_id = new_uid) THEN
    -- New user has preferences, delete the old anonymous user's preferences
    DELETE FROM public.user_preferences WHERE user_id = old_uid;
  ELSE
    -- New user has no preferences, migrate the anonymous user's preferences
    UPDATE public.user_preferences
    SET user_id = new_uid
    WHERE user_id = old_uid;
  END IF;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

COMMENT ON FUNCTION migrate_user_preferences(uuid, uuid)
IS 'Atomically migrates user preferences from anonymous to authenticated user. If the authenticated user already has preferences, deletes the anonymous preferences. Otherwise, transfers ownership.';
