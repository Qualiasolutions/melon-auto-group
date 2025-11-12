-- Supabase Storage Setup for Truck Images
-- Run this in Supabase SQL Editor

-- Create storage bucket for truck images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'truck-images',
  'truck-images',
  true,
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for truck-images bucket
-- Public read access
CREATE POLICY "Allow public read access to truck images"
ON storage.objects FOR SELECT
USING (bucket_id = 'truck-images');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated users to upload truck images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'truck-images' AND
  auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Allow users to update their own truck images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'truck-images' AND
  auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own truck images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'truck-images' AND
  auth.role() = 'authenticated'
);

-- Create functions for image management
CREATE OR REPLACE FUNCTION upload_truck_image(
  p_bucket_name TEXT DEFAULT 'truck-images',
  p_file_path TEXT,
  p_file_content BYTEA,
  p_content_type TEXT DEFAULT 'image/webp'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_file_url TEXT;
BEGIN
  -- Upload the file
  INSERT INTO storage.objects (bucket_id, name, owner, content_type, metadata)
  VALUES (
    p_bucket_name,
    p_file_path,
    auth.uid(),
    p_content_type,
    jsonb_build_object('size', octet_length(p_file_content))
  )
  ON CONFLICT (bucket_id, name) DO UPDATE
  SET
    content_type = p_content_type,
    updated_at = NOW()
  RETURNING
    storage.get_public_url(p_bucket_name, p_file_path) INTO v_file_url;

  RETURN v_file_url;
END;
$$;

-- Create image metadata table
CREATE TABLE IF NOT EXISTS image_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_url TEXT NOT NULL,
  processed_urls JSONB NOT NULL DEFAULT '{}',
  make VARCHAR(100),
  model VARCHAR(200),
  category VARCHAR(50),
  alt_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for image metadata
CREATE INDEX IF NOT EXISTS idx_image_metadata_make ON image_metadata(make);
CREATE INDEX IF NOT EXISTS idx_image_metadata_category ON image_metadata(category);
CREATE INDEX IF NOT EXISTS idx_image_metadata_created_at ON image_metadata(created_at DESC);

-- Enable RLS for image metadata
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to image metadata
CREATE POLICY "Allow public read access to image metadata"
ON image_metadata FOR SELECT
USING (true);

-- Create policy for authenticated inserts
CREATE POLICY "Allow authenticated insert on image metadata"
ON image_metadata FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for updated_at on image_metadata
CREATE TRIGGER update_image_metadata_updated_at
BEFORE UPDATE ON image_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE image_metadata IS 'Metadata for processed truck images';
COMMENT ON COLUMN image_metadata.processed_urls IS 'JSON object with different image sizes: {thumbnail: url, medium: url, large: url}';
COMMENT ON COLUMN image_metadata.metadata IS 'Additional image metadata like dimensions, size, format';