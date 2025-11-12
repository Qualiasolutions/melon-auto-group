-- Add 2020 Mitsubishi L200 from Facebook Marketplace
-- Run this SQL in your Supabase SQL Editor

INSERT INTO vehicles (
  make,
  model,
  year,
  mileage,
  price,
  currency,
  condition,
  category,
  engine_type,
  transmission,
  horsepower,
  location,
  country,
  vin,
  images,
  specifications,
  features,
  description,
  available,
  featured
) VALUES (
  'Mitsubishi',
  'L200',
  2020,
  0,
  12250.00,
  'GBP',
  'used',
  'other',
  'diesel',
  'manual',
  150,
  'Buxton, United Kingdom',
  'United Kingdom',
  'FB-2550308978683881',
  '{}',
  '{"body_type": "Pickup Truck", "fuel_type": "Diesel", "engine_size": "2.4L", "listing_source": "Facebook Marketplace", "reference_url": "https://www.facebook.com/marketplace/item/2550308978683881"}',
  ARRAY['MOT recently completed', 'Good tyres', 'Very clean condition', 'Drives well'],
  'Very very clean Pickup. Just had MOT. Tyres are good. Drives well. Sale is plus VAT.',
  true,
  false
)
RETURNING id, make, model, year, price, location;
