-- Add AI import metadata columns to resumes table
-- These columns store warnings and confidence scores from AI-powered resume parsing

ALTER TABLE public.resumes
  ADD COLUMN ai_import_warnings JSONB,
  ADD COLUMN ai_import_confidence DECIMAL(3,2);

-- Add helpful comments
COMMENT ON COLUMN public.resumes.ai_import_warnings IS 'AI parsing warnings when resume was imported from PDF/DOCX';
COMMENT ON COLUMN public.resumes.ai_import_confidence IS 'AI confidence score (0.00-1.00) when resume was imported';
