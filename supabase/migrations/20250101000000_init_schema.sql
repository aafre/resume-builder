-- ==============================================================================
-- 1. SETUP & EXTENSIONS
-- ==============================================================================
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- Table: Resumes
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Resume',
    template_id VARCHAR(50) NOT NULL,

    -- Resume Data (JSONB)
    contact_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- PDF Snapshot (URL)
    pdf_url TEXT,
    pdf_generated_at TIMESTAMPTZ,

    -- Timestamps & Soft Delete
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Table: Resume Icons (Metadata for uploaded files)
CREATE TABLE IF NOT EXISTS public.resume_icons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    filename VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,      -- e.g. "user_123/resume_abc/icon.png"
    storage_url TEXT NOT NULL,       -- The public CDN URL
    mime_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraint: Max 50KB (51200 bytes)
    CONSTRAINT resume_icons_size_check CHECK (file_size <= 51200)
);

-- ==============================================================================
-- 3. INDEXES & TRIGGERS
-- ==============================================================================

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON public.resumes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_icons_resume_id ON public.resume_icons(resume_id);

-- Auto-update 'updated_at' function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach trigger to resumes
DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) - DATABASE
-- ==============================================================================

-- Enable RLS on Tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_icons ENABLE ROW LEVEL SECURITY;

-- Resumes: Users can only see/edit their own
CREATE POLICY "Users can view own resumes"
    ON public.resumes FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create resumes"
    ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
    ON public.resumes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
    ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Icons: Users can only see/edit their own
CREATE POLICY "Users can view own icons"
    ON public.resume_icons FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own icons"
    ON public.resume_icons FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own icons"
    ON public.resume_icons FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. STORAGE BUCKETS & POLICIES
-- ==============================================================================

-- 5A. Create Buckets (This saves you from clicking in the UI)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('resume-pdfs', 'resume-pdfs', false), -- Private (Secure)
  ('resume-icons', 'resume-icons', true)  -- Public (Fast loading)
ON CONFLICT (id) DO NOTHING;

-- 5B. Policy: PDF Bucket (Private)
-- Rule: User can only access files inside a folder matching their User ID
CREATE POLICY "Users manage own PDFs"
ON storage.objects FOR ALL
USING (
  bucket_id = 'resume-pdfs'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'resume-pdfs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5C. Policy: Icons Bucket (Public)
-- Rule: Anyone can View (SELECT), but only Owner can Upload/Delete
CREATE POLICY "Public View Icons"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resume-icons' );

CREATE POLICY "Users manage own icons"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resume-icons'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own icons"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resume-icons'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own icons"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resume-icons'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
