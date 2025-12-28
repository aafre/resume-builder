-- ==============================================================================
-- MIGRATION: Fix RLS Performance and Function Security Issues
-- ==============================================================================
-- Purpose: Optimize RLS policies by wrapping auth.uid() in SELECT subqueries
--          and secure update_updated_at_column() function search_path
--
-- Fixes Supabase Lints:
--   - auth_rls_initplan (CRITICAL): 10 RLS policies causing per-row evaluation
--   - function_search_path_mutable (MEDIUM): Function privilege escalation risk
--
-- Performance Impact:
--   - Before: O(n) - auth.uid() evaluated for each row
--   - After: O(1) - auth.uid() evaluated once per query via InitPlan
--
-- Background:
--   Supabase Lint Report identified that all RLS policies re-evaluate auth.uid()
--   for every row in the result set. This causes severe performance degradation
--   at scale (10-100x slower). The fix is to wrap auth.uid() in a SELECT
--   subquery, which PostgreSQL evaluates once and caches for the entire query.
--
-- Run this after: init.md, migration_add_hash_and_preferences.sql
-- ==============================================================================

-- ==============================================================================
-- 1. SECURE FUNCTION: update_updated_at_column
-- ==============================================================================
-- Issue: Function has mutable search_path which could allow privilege escalation
-- Fix: Explicitly set search_path to prevent schema poisoning attacks

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

COMMENT ON FUNCTION update_updated_at_column()
IS 'Trigger function to automatically update updated_at column. Uses fixed search_path for security.';

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

-- ==============================================================================
-- 2. OPTIMIZE RLS POLICIES: public.resumes (4 policies)
-- ==============================================================================
-- Issue: auth.uid() re-evaluated for each row (O(n) performance)
-- Fix: Wrap in SELECT subquery - evaluated once (O(1) performance)

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can create resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Users can view own resumes"
    ON public.resumes FOR SELECT
    USING ((SELECT auth.uid()) = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create resumes"
    ON public.resumes FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own resumes"
    ON public.resumes FOR UPDATE
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own resumes"
    ON public.resumes FOR DELETE
    USING ((SELECT auth.uid()) = user_id);

-- ==============================================================================
-- 3. OPTIMIZE RLS POLICIES: public.resume_icons (3 policies)
-- ==============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own icons" ON public.resume_icons;
DROP POLICY IF EXISTS "Users can insert own icons" ON public.resume_icons;
DROP POLICY IF EXISTS "Users can delete own icons" ON public.resume_icons;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Users can view own icons"
    ON public.resume_icons FOR SELECT
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own icons"
    ON public.resume_icons FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own icons"
    ON public.resume_icons FOR DELETE
    USING ((SELECT auth.uid()) = user_id);

-- ==============================================================================
-- 4. OPTIMIZE RLS POLICIES: public.user_preferences (3 policies)
-- ==============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING ((SELECT auth.uid()) = user_id);

-- ==============================================================================
-- 5. OPTIMIZE STORAGE POLICIES: storage.objects (5 policies)
-- ==============================================================================
-- Note: Storage policies require special handling due to shared objects table

-- Drop existing storage policies (must use exact names from init.md)
DROP POLICY IF EXISTS "Users manage own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public View Icons" ON storage.objects;
DROP POLICY IF EXISTS "Users manage own icons" ON storage.objects;
DROP POLICY IF EXISTS "Users update own icons" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own icons" ON storage.objects;

-- Policy 1: PDF Bucket (Private) - All operations
CREATE POLICY "Users manage own PDFs"
ON storage.objects FOR ALL
USING (
  bucket_id = 'resume-pdfs'
  AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'resume-pdfs'
  AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy 2: Icons Bucket (Public) - Anyone can view (no auth optimization needed)
CREATE POLICY "Public View Icons"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resume-icons' );

-- Policy 3: Icons Bucket - Users can insert own icons
CREATE POLICY "Users manage own icons"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resume-icons'
  AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy 4: Icons Bucket - Users can update own icons
CREATE POLICY "Users update own icons"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resume-icons'
  AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy 5: Icons Bucket - Users can delete own icons
CREATE POLICY "Users delete own icons"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resume-icons'
  AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
);

-- ==============================================================================
-- 6. COMPREHENSIVE VERIFICATION
-- ==============================================================================

-- Check 1: Verify function security settings
DO $$
DECLARE
    func_config text[];
    func_exists boolean;
BEGIN
    SELECT proconfig, true INTO func_config, func_exists
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
    AND pronamespace = 'public'::regnamespace;

    IF NOT func_exists THEN
        RAISE WARNING 'Function update_updated_at_column does not exist!';
    ELSIF func_config IS NULL OR NOT ('search_path=public, pg_temp' = ANY(func_config)) THEN
        RAISE WARNING 'Function security not set correctly! Config: %', func_config;
    ELSE
        RAISE NOTICE '✓ Function security: OK (search_path set correctly)';
    END IF;
END $$;

-- Check 2: Count optimized policies by table
SELECT
    schemaname,
    tablename,
    COUNT(*) as total_policies,
    COUNT(CASE
        WHEN qual::text LIKE '%(SELECT auth.uid())%'
        OR with_check::text LIKE '%(SELECT auth.uid())%'
        THEN 1
    END) as optimized_policies
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
  AND tablename IN ('resumes', 'resume_icons', 'user_preferences', 'objects')
GROUP BY schemaname, tablename
ORDER BY schemaname, tablename;

-- Expected results:
-- public.resumes: 4 total, 4 optimized
-- public.resume_icons: 3 total, 3 optimized
-- public.user_preferences: 3 total, 3 optimized
-- storage.objects: 5 total, 4 optimized (Public View Icons doesn't use auth)

-- Check 3: List all policies with optimization status
SELECT
    schemaname,
    tablename,
    policyname,
    CASE
        WHEN qual::text LIKE '%(SELECT auth.uid())%' THEN '✓ OPTIMIZED'
        WHEN qual::text LIKE '%auth.uid()%' THEN '✗ NEEDS_FIX'
        ELSE '- NO_AUTH'
    END as using_status,
    CASE
        WHEN with_check::text LIKE '%(SELECT auth.uid())%' THEN '✓ OPTIMIZED'
        WHEN with_check::text LIKE '%auth.uid()%' THEN '✗ NEEDS_FIX'
        ELSE '- NO_AUTH'
    END as check_status
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
  AND tablename IN ('resumes', 'resume_icons', 'user_preferences', 'objects')
ORDER BY schemaname, tablename, policyname;

-- Expected: All policies with auth.uid() should show ✓ OPTIMIZED

-- Check 4: Verify triggers are reattached
SELECT
    n.nspname as schema,
    c.relname as table_name,
    t.tgname as trigger_name,
    pg_get_triggerdef(t.oid) as trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE t.tgname LIKE '%updated_at%'
  AND n.nspname = 'public'
  AND NOT t.tgisinternal
ORDER BY n.nspname, c.relname;

-- Expected results:
-- public | resumes | update_resumes_updated_at
-- public | user_preferences | update_user_preferences_updated_at

-- Check 5: Summary report
DO $$
DECLARE
    total_policies int;
    optimized_policies int;
    function_ok boolean;
    triggers_ok boolean;
BEGIN
    -- Count policies
    SELECT
        COUNT(*),
        COUNT(CASE
            WHEN qual::text LIKE '%(SELECT auth.uid())%'
            OR with_check::text LIKE '%(SELECT auth.uid())%'
            THEN 1
        END)
    INTO total_policies, optimized_policies
    FROM pg_policies
    WHERE schemaname IN ('public', 'storage')
      AND tablename IN ('resumes', 'resume_icons', 'user_preferences', 'objects')
      AND (qual::text LIKE '%auth.uid()%' OR with_check::text LIKE '%auth.uid()%');

    -- Check function
    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'update_updated_at_column'
        AND 'search_path=public, pg_temp' = ANY(proconfig)
    ) INTO function_ok;

    -- Check triggers
    SELECT COUNT(*) = 2 INTO triggers_ok
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE t.tgname LIKE '%updated_at%'
      AND n.nspname = 'public'
      AND NOT t.tgisinternal;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION VERIFICATION SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Policies with auth.uid(): % total, % optimized', total_policies, optimized_policies;
    RAISE NOTICE 'Function search_path: %', CASE WHEN function_ok THEN '✓ SECURED' ELSE '✗ NOT SECURED' END;
    RAISE NOTICE 'Triggers reattached: %', CASE WHEN triggers_ok THEN '✓ OK (2/2)' ELSE '✗ MISSING' END;
    RAISE NOTICE '';

    IF optimized_policies = total_policies AND function_ok AND triggers_ok THEN
        RAISE NOTICE '✓ ALL CHECKS PASSED - Migration successful!';
    ELSE
        RAISE WARNING '✗ SOME CHECKS FAILED - Review output above';
    END IF;
    RAISE NOTICE '========================================';
END $$;

-- ==============================================================================
-- PERFORMANCE TESTING (Optional - Run manually to verify improvement)
-- ==============================================================================

-- This query demonstrates the performance improvement
-- Before: auth.uid() evaluated for each row
-- After: auth.uid() evaluated once via InitPlan

-- EXPLAIN ANALYZE
-- SELECT id, title, created_at
-- FROM public.resumes
-- WHERE user_id = auth.uid()
-- LIMIT 10;

-- Look for "InitPlan 1" in the output - this confirms single evaluation
-- Compare execution time before/after migration (should be 10-100x faster)

-- ==============================================================================
-- DONE
-- ==============================================================================
-- Migration complete! Summary of changes:
--   ✓ 1 function secured (update_updated_at_column with search_path)
--   ✓ 4 policies optimized (public.resumes)
--   ✓ 3 policies optimized (public.resume_icons)
--   ✓ 3 policies optimized (public.user_preferences)
--   ✓ 4 policies optimized (storage.objects)
--   ✓ 2 triggers reattached (resumes, user_preferences)
--
-- Total: 14 RLS policies optimized + 1 function secured
--
-- Next steps:
-- 1. Review verification query results above
-- 2. Test application functionality (CRUD operations on resumes)
-- 3. Run EXPLAIN ANALYZE on key queries to verify InitPlan usage
-- 4. Enable leaked password protection in Supabase Dashboard manually
--    (Authentication → Policies → Password Policies → Leaked Password Protection)
-- 5. Update SUPABASE_SETUP_RUNBOOK.md with leaked password protection steps
-- ==============================================================================
