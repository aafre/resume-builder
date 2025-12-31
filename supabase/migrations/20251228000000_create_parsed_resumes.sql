-- Create parsed resumes cache table
-- This table stores AI-parsed resume data with file hash-based caching

CREATE TABLE public.parsed_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- File identification
  file_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash for deduplication
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(10) NOT NULL, -- 'pdf' or 'docx'

  -- Parsed data
  raw_text TEXT NOT NULL, -- Extracted plain text from file
  parsed_yaml TEXT NOT NULL, -- Final YAML output ready for import
  parsed_json JSONB NOT NULL, -- Structured JSON data from AI

  -- Quality metrics
  confidence_score DECIMAL(3,2) NOT NULL, -- AI confidence (0.00-1.00)
  warnings TEXT[], -- Array of parsing warnings

  -- Metadata
  openai_model VARCHAR(50) NOT NULL DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',

  -- Constraints
  CONSTRAINT file_size_check CHECK (file_size <= 10485760), -- 10MB max
  CONSTRAINT confidence_check CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Indexes for performance
CREATE INDEX idx_parsed_resumes_file_hash ON public.parsed_resumes(file_hash);
CREATE INDEX idx_parsed_resumes_user_id ON public.parsed_resumes(user_id);
CREATE INDEX idx_parsed_resumes_expires_at ON public.parsed_resumes(expires_at);

-- Row Level Security (RLS) Policies
ALTER TABLE public.parsed_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own parsed resumes"
  ON public.parsed_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create parsed resumes"
  ON public.parsed_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE public.parsed_resumes IS 'Cache table for AI-parsed resume data. Uses file hash for deduplication.';
COMMENT ON COLUMN public.parsed_resumes.file_hash IS 'SHA-256 hash of file bytes for cache lookups and deduplication';
COMMENT ON COLUMN public.parsed_resumes.confidence_score IS 'AI confidence score (0.00-1.00). <0.60 indicates likely not a resume';
COMMENT ON COLUMN public.parsed_resumes.expires_at IS 'Cache expiry date (30 days from creation). Entries auto-expire for cleanup';
