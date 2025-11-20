-- Auto Melon Group Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(200) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 2),
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'used', 'certified')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('tractor-unit', 'semi-truck', 'tipper', 'dump-truck', 'box-truck', 'flatbed', 'refrigerated', 'tanker', 'curtainside', 'dropside', 'crane-truck', 'recovery', 'concrete-mixer', 'low-loader', 'trailer', 'pickup', 'van', '4x4', 'construction', 'logging', 'double-deck', 'insulated', 'specialty', 'other')),
  engine_type VARCHAR(20) NOT NULL CHECK (engine_type IN ('diesel', 'electric', 'hybrid', 'gas')),
  transmission VARCHAR(30) NOT NULL CHECK (transmission IN ('manual', 'automatic', 'automated-manual')),
  engine_power INTEGER CHECK (engine_power > 0),
  location VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL,
  vin VARCHAR(100) UNIQUE NOT NULL,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  description TEXT,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(available);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_vehicle_id ON inquiries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vehicles table
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to available vehicles"
ON vehicles FOR SELECT
USING (available = true);

CREATE POLICY "Allow public insert on inquiries"
ON inquiries FOR INSERT
WITH CHECK (true);

-- Sample data removed - will be populated via Firecrawl scraping and import scripts
-- Vehicles table starts empty and will be populated through the import process

-- Comments for documentation
COMMENT ON TABLE vehicles IS 'Commercial vehicles inventory';
COMMENT ON TABLE inquiries IS 'Customer inquiries about vehicles';
COMMENT ON COLUMN vehicles.specifications IS 'Additional technical specifications stored as JSON';
COMMENT ON COLUMN vehicles.images IS 'Array of image URLs for the vehicle';
COMMENT ON COLUMN vehicles.features IS 'Array of special features or options';
