-- Create custom_makes table for storing custom vehicle makes
CREATE TABLE IF NOT EXISTS custom_makes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_custom_makes_name ON custom_makes(make_name);

-- Enable RLS (Row Level Security)
ALTER TABLE custom_makes ENABLE ROW LEVEL SECURITY;

-- Policy to allow all reads (public access)
CREATE POLICY "Allow all reads" ON custom_makes FOR SELECT USING (true);

-- Policy to allow admins to insert custom makes
CREATE POLICY "Allow admin inserts" ON custom_makes FOR INSERT WITH CHECK (true);

-- Policy to allow admins to update custom makes
CREATE POLICY "Allow admin updates" ON custom_makes FOR UPDATE USING (true);

-- Policy to allow admins to delete custom makes
CREATE POLICY "Allow admin deletes" ON custom_makes FOR DELETE USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_custom_makes_updated_at
  BEFORE UPDATE ON custom_makes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();