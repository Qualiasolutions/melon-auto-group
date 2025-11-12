# Custom Order Form - Quick Setup

## 1-Minute Setup

### Apply Database Schema

1. Open Supabase Dashboard → SQL Editor
2. Copy/paste this SQL:

```sql
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Orders Table
CREATE TABLE IF NOT EXISTS custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Customer Information
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(200),

  -- Truck Specifications
  truck_type VARCHAR(50) NOT NULL,
  preferred_make VARCHAR(100) NOT NULL,
  budget_range VARCHAR(20) NOT NULL,

  -- Technical Requirements
  engine_type VARCHAR(20),
  transmission VARCHAR(30),
  axle_configuration VARCHAR(20),
  horsepower_min INTEGER,
  gvw_min INTEGER,
  cab_type VARCHAR(20),
  emission_standard VARCHAR(50),

  -- Special Features & Requirements
  special_features TEXT[] DEFAULT '{}',
  custom_requirements TEXT NOT NULL,

  -- Timeline & Usage
  desired_delivery VARCHAR(20) NOT NULL,
  intended_use TEXT NOT NULL,

  -- Additional Information
  current_fleet_size INTEGER,
  trade_in_available BOOLEAN DEFAULT false,
  trade_in_details TEXT,
  financing_needed BOOLEAN DEFAULT false,

  -- Order Status
  status VARCHAR(20) DEFAULT 'pending',

  -- Admin Fields
  admin_notes TEXT,
  quoted_price DECIMAL(12, 2),
  quote_valid_until DATE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_custom_orders_email ON custom_orders(email);
CREATE INDEX idx_custom_orders_status ON custom_orders(status);
CREATE INDEX idx_custom_orders_truck_type ON custom_orders(truck_type);
CREATE INDEX idx_custom_orders_created_at ON custom_orders(created_at DESC);

-- Enable RLS
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert on custom_orders"
ON custom_orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow users to read own orders"
ON custom_orders FOR SELECT
USING (true);

CREATE POLICY "Allow public update on custom_orders"
ON custom_orders FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on custom_orders"
ON custom_orders FOR DELETE
USING (true);
```

3. Click "Run"
4. Done!

## Verify Setup

```sql
-- Check table exists
SELECT * FROM custom_orders LIMIT 1;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'custom_orders';
```

## Test the Form

1. Go to: `/custom-order`
2. Fill in the form
3. Click "Submit Custom Order"
4. Should see success message

## View Submitted Orders

```sql
-- View all orders
SELECT
  full_name,
  email,
  truck_type,
  budget_range,
  status,
  created_at
FROM custom_orders
ORDER BY created_at DESC;
```

## Common Queries

```sql
-- Pending orders
SELECT * FROM custom_orders WHERE status = 'pending';

-- Orders needing financing
SELECT * FROM custom_orders WHERE financing_needed = true;

-- Orders with trade-ins
SELECT * FROM custom_orders WHERE trade_in_available = true;

-- Count by truck type
SELECT truck_type, COUNT(*)
FROM custom_orders
GROUP BY truck_type;
```

That's it! The form is ready to use. 🎉
