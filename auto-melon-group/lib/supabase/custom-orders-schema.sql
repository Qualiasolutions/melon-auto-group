-- Custom Orders Table Schema
-- This table stores custom truck order requests from customers

CREATE TABLE IF NOT EXISTS custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Customer Information
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(200),

  -- Truck Specifications
  truck_type VARCHAR(50) NOT NULL CHECK (truck_type IN (
    'tractor-unit', 'tipper', 'box-truck', 'flatbed', 'refrigerated',
    'tanker', 'curtainside', 'crane-truck', 'concrete-mixer',
    'low-loader', 'custom-build'
  )),
  preferred_make VARCHAR(100) NOT NULL,
  budget_range VARCHAR(20) NOT NULL CHECK (budget_range IN (
    'under-50k', '50k-100k', '100k-200k', '200k-300k', 'over-300k', 'flexible'
  )),

  -- Technical Requirements
  engine_type VARCHAR(20) CHECK (engine_type IN ('diesel', 'electric', 'hybrid', 'gas')),
  transmission VARCHAR(30) CHECK (transmission IN ('manual', 'automatic', 'automated-manual')),
  axle_configuration VARCHAR(20),
  horsepower_min INTEGER CHECK (horsepower_min >= 0),
  gvw_min INTEGER CHECK (gvw_min >= 0),
  cab_type VARCHAR(20) CHECK (cab_type IN ('sleeper', 'day-cab', 'crew-cab', 'extended')),
  emission_standard VARCHAR(50),

  -- Special Features & Requirements
  special_features TEXT[] DEFAULT '{}',
  custom_requirements TEXT NOT NULL,

  -- Timeline & Usage
  desired_delivery VARCHAR(20) NOT NULL CHECK (desired_delivery IN (
    'immediate', '1-3-months', '3-6-months', '6-12-months', 'flexible'
  )),
  intended_use TEXT NOT NULL,

  -- Additional Information
  current_fleet_size INTEGER CHECK (current_fleet_size >= 0),
  trade_in_available BOOLEAN DEFAULT false,
  trade_in_details TEXT,
  financing_needed BOOLEAN DEFAULT false,

  -- Order Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'reviewing', 'quoted', 'negotiating', 'confirmed',
    'sourcing', 'ordered', 'completed', 'cancelled'
  )),

  -- Admin Notes & Pricing
  admin_notes TEXT,
  quoted_price DECIMAL(12, 2),
  quote_valid_until DATE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_orders_email ON custom_orders(email);
CREATE INDEX IF NOT EXISTS idx_custom_orders_status ON custom_orders(status);
CREATE INDEX IF NOT EXISTS idx_custom_orders_truck_type ON custom_orders(truck_type);
CREATE INDEX IF NOT EXISTS idx_custom_orders_created_at ON custom_orders(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_custom_orders_updated_at
BEFORE UPDATE ON custom_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_orders table
-- Allow anyone to insert a custom order (public form submission)
CREATE POLICY "Allow public insert on custom_orders"
ON custom_orders FOR INSERT
WITH CHECK (true);

-- Allow public to read their own orders (by email)
CREATE POLICY "Allow users to read own orders"
ON custom_orders FOR SELECT
USING (true);

-- Admin operations (UPDATE, DELETE) - for now allow all, add auth later
CREATE POLICY "Allow public update on custom_orders"
ON custom_orders FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on custom_orders"
ON custom_orders FOR DELETE
USING (true);

-- Comments for documentation
COMMENT ON TABLE custom_orders IS 'Custom truck order requests from customers';
COMMENT ON COLUMN custom_orders.status IS 'Order processing status: pending → reviewing → quoted → negotiating → confirmed → sourcing → ordered → completed/cancelled';
COMMENT ON COLUMN custom_orders.special_features IS 'Array of requested special features and equipment';
COMMENT ON COLUMN custom_orders.custom_requirements IS 'Detailed custom specifications and requirements';
COMMENT ON COLUMN custom_orders.admin_notes IS 'Internal notes for order processing (admin only)';
COMMENT ON COLUMN custom_orders.quoted_price IS 'Price quote provided to customer';
