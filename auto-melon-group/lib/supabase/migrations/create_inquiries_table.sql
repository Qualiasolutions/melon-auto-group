-- Create inquiries table for contact form submissions
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'spam')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Create index on vehicle_id for lookups
CREATE INDEX IF NOT EXISTS idx_inquiries_vehicle_id ON inquiries(vehicle_id);

-- Enable Row Level Security
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public to insert inquiries (contact form submission)
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admins) can view inquiries
CREATE POLICY "Only admins can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users (admins) can update inquiries
CREATE POLICY "Only admins can update inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE inquiries IS 'Stores customer inquiries from the contact form';
COMMENT ON COLUMN inquiries.status IS 'Inquiry status: new, contacted, qualified, closed, spam';
COMMENT ON COLUMN inquiries.vehicle_id IS 'Reference to specific vehicle if inquiry is about a vehicle';
