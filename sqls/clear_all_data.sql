-- ==============================================================================
-- CLEAR ALL DATA FROM DEV DATABASE
-- ==============================================================================
-- Purpose: Remove all user data while keeping schema intact
-- Use case: Testing Docker builds with fresh data like PROD
-- WARNING: This will DELETE ALL USER DATA but preserve schema
-- ==============================================================================
-- What this script does:
--   ✓ Deletes all rows from tables (TRUNCATE)
--   ✓ Deletes all files from storage buckets
--   ✗ Does NOT drop tables, policies, triggers, functions
--   ✗ Does NOT remove storage buckets
-- ==============================================================================
-- Usage:
--   1. Open Supabase SQL Editor
--   2. Copy and paste this entire script
--   3. Execute the script
--   4. Your schema remains intact, ready for fresh data
-- ==============================================================================

-- Safety check
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'CLEARING ALL DATA FROM DATABASE';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'This script will DELETE ALL DATA but keep schema:';
    RAISE NOTICE '  ✓ Delete all rows from: resumes, resume_icons, user_preferences';
    RAISE NOTICE '  ✓ Delete all files from: resume-pdfs, resume-icons buckets';
    RAISE NOTICE '  ✗ Keep tables, policies, triggers, functions';
    RAISE NOTICE '';
    RAISE NOTICE 'Make sure you are in the DEV environment!';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '';
END $$;

-- ==============================================================================
-- STEP 1: TRUNCATE ALL DATA FROM TABLES
-- ==============================================================================
-- Note: TRUNCATE is faster than DELETE and resets sequences
-- CASCADE option automatically handles foreign key dependencies

-- Truncate user_preferences first (has FK to resumes)
TRUNCATE TABLE public.user_preferences CASCADE;

-- Truncate resume_icons (has FK to resumes)
TRUNCATE TABLE public.resume_icons CASCADE;

-- Truncate resumes (parent table)
TRUNCATE TABLE public.resumes CASCADE;

-- ==============================================================================
-- STEP 2: DELETE ALL FILES FROM STORAGE BUCKETS
-- ==============================================================================
-- Note: This removes file metadata from storage.objects table
-- Supabase will automatically clean up the actual files

-- Delete all PDF files
DELETE FROM storage.objects WHERE bucket_id = 'resume-pdfs';

-- Delete all icon files
DELETE FROM storage.objects WHERE bucket_id = 'resume-icons';

-- ==============================================================================
-- STEP 3: VERIFICATION
-- ==============================================================================

DO $$
DECLARE
    resumes_count int;
    icons_count int;
    prefs_count int;
    pdf_files_count int;
    icon_files_count int;
BEGIN
    -- Count remaining rows in tables
    SELECT COUNT(*) INTO resumes_count FROM public.resumes;
    SELECT COUNT(*) INTO icons_count FROM public.resume_icons;
    SELECT COUNT(*) INTO prefs_count FROM public.user_preferences;

    -- Count remaining files in storage
    SELECT COUNT(*) INTO pdf_files_count FROM storage.objects WHERE bucket_id = 'resume-pdfs';
    SELECT COUNT(*) INTO icon_files_count FROM storage.objects WHERE bucket_id = 'resume-icons';

    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'DATA CLEANUP VERIFICATION';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Table Data:';
    RAISE NOTICE '  - Resumes: % rows', resumes_count;
    RAISE NOTICE '  - Resume Icons: % rows', icons_count;
    RAISE NOTICE '  - User Preferences: % rows', prefs_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Storage Files:';
    RAISE NOTICE '  - PDF files: % files', pdf_files_count;
    RAISE NOTICE '  - Icon files: % files', icon_files_count;
    RAISE NOTICE '';

    IF resumes_count = 0 AND icons_count = 0 AND prefs_count = 0
       AND pdf_files_count = 0 AND icon_files_count = 0 THEN
        RAISE NOTICE '✓ SUCCESS: All data has been cleared!';
        RAISE NOTICE '';
        RAISE NOTICE 'Your database schema is intact and ready for:';
        RAISE NOTICE '  - Fresh user registrations';
        RAISE NOTICE '  - Docker build testing';
        RAISE NOTICE '  - Production-like testing';
        RAISE NOTICE '';
        RAISE NOTICE 'No migrations needed - schema is already up to date!';
    ELSE
        RAISE WARNING '✗ WARNING: Some data remains. Review counts above.';
    END IF;
    RAISE NOTICE '============================================================';
    RAISE NOTICE '';
END $$;

-- ==============================================================================
-- OPTIONAL: VERIFY SCHEMA IS STILL INTACT
-- ==============================================================================

-- List all tables (should show resumes, resume_icons, user_preferences)
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('resumes', 'resume_icons', 'user_preferences')
ORDER BY table_name;

-- List all policies (should show all RLS policies intact)
SELECT
    schemaname,
    tablename,
    policyname,
    cmd as command_type
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('resumes', 'resume_icons', 'user_preferences')
ORDER BY tablename, policyname;

-- List storage buckets (should show resume-pdfs and resume-icons)
SELECT
    id,
    name,
    public,
    (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = b.id) as file_count
FROM storage.buckets b
WHERE id IN ('resume-pdfs', 'resume-icons')
ORDER BY id;

-- ==============================================================================
-- DONE
-- ==============================================================================
-- All user data has been cleared!
--
-- Schema status:
--   ✓ Tables: Intact with 0 rows
--   ✓ Policies: All RLS policies intact
--   ✓ Triggers: All triggers intact
--   ✓ Functions: All functions intact
--   ✓ Storage buckets: Intact with 0 files
--
-- Next steps:
--   1. Test Docker build with fresh database
--   2. Register new test users
--   3. Create test resumes
--   4. Verify all functionality works
-- ==============================================================================
