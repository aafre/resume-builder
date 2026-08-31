-- Lock down migrate_user_preferences(uuid, uuid).
--
-- The function is SECURITY DEFINER and no migration ever revoked the default
-- EXECUTE grant to PUBLIC, so PostgREST exposed it to `anon`: anyone holding the
-- publishable key could call it directly and move or delete any user's
-- preferences row, bypassing Flask entirely.
--
-- Flask calls this RPC on the service-role client (app.py, migrate-anonymous-resumes),
-- so restricting EXECUTE to service_role breaks nothing.
--
-- Note: no auth.uid() check is added inside the function on purpose — under
-- service-role execution auth.uid() is null, which would break the legitimate path.

REVOKE EXECUTE ON FUNCTION public.migrate_user_preferences(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.migrate_user_preferences(uuid, uuid) TO service_role;
