-- Create resume-thumbnails bucket for storing generated thumbnail images
-- This bucket stores one thumbnail per resume (optimized storage using upsert)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resume-thumbnails',
  'resume-thumbnails',
  true,  -- Public access for thumbnail images
  5242880,  -- 5MB limit (thumbnails are small, typically ~100KB)
  ARRAY['image/png', 'image/jpeg']
);

-- Allow authenticated users to upload their own thumbnails
CREATE POLICY "Users can upload their own thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resume-thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access to all thumbnails
CREATE POLICY "Thumbnails are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resume-thumbnails');

-- Allow users to update their own thumbnails
-- This is crucial for the upsert mechanism that ensures only 1 thumbnail per resume
CREATE POLICY "Users can update their own thumbnails"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resume-thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own thumbnails
CREATE POLICY "Users can delete their own thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resume-thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text);
