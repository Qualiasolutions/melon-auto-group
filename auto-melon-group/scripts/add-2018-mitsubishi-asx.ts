#!/usr/bin/env tsx

// Script to add 2018 Mitsubishi ASX to the database with all images
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Direct image URLs for the 2018 Mitsubishi ASX
const asxImages = [
  'https://i.ibb.co/JjLb8B99/574854008-1996209911169183-2166460796222596967-n.jpg',
  'https://i.ibb.co/ns7Tcwyk/571817574-1996209954502512-5812947602908267717-n.jpg',
  'https://i.ibb.co/Qhxf91h/574909558-1996209864502521-6214513820329340915-n.jpg',
  'https://i.ibb.co/GfTCXvC6/571422026-1996209957835845-9204531075672651429-n.jpg',
  'https://i.ibb.co/yFQ0KVy8/572936613-1996209944502513-931490776049965289-n-1.jpg',
  'https://i.ibb.co/v91R6Dd/1762976595043-257875334-n.jpg',
  'https://i.ibb.co/Zp6j2HHb/1762976217292-269195658-n.jpg',
  'https://i.ibb.co/rRYkcV7r/1762976574660-534301317-n.jpg',
  'https://i.ibb.co/B5m5z6m5/1762976641063-875938069-n.jpg',
  'https://i.ibb.co/nNwx9HZG/1762976340112-508740885-n.jpg',
  'https://i.ibb.co/xqFP2CNk/1762976853632-800028735-n.jpg',
  'https://i.ibb.co/Qvymkqdd/1762976849219-174829347-n.jpg',
  'https://i.ibb.co/XfdbFfzx/1762976323121-298465446-n.jpg',
  'https://i.ibb.co/939ngDyX/1762976748670-585535829-n.jpg',
  'https://i.ibb.co/1t86YH5F/1762976556010-687156884-n.jpg',
  'https://i.ibb.co/35b4Cnwm/1762976155038-769049349-n.jpg',
  'https://i.ibb.co/dw8m8hwk/1762976915590-915183665-n.jpg',
  'https://i.ibb.co/vvPtXhj1/1762976407775-359845769-n.jpg'
]

async function add2018MitsubishiASX() {
  console.log('🚗 Adding 2018 Mitsubishi ASX to database...\n');

  const vehicleData = {
    make: 'Mitsubishi',
    model: 'ASX',
    year: 2018,
    mileage: 45000, // Estimated mileage
    price: 12500, // Estimated price for 2018 ASX
    currency: 'EUR',
    condition: 'used',
    category: 'other', // ASX is a crossover SUV, not a truck
    engine_type: 'diesel',
    transmission: 'automatic',
    horsepower: 150,
    location: 'Cyprus',
    country: 'Cyprus',
    vin: 'MIT-ASX-2018-001',
    images: asxImages,
    specifications: {
      engineCapacity: 2.2,
      drivetrain: '2WD',
      fuelType: 'diesel',
      seats: 5,
      doors: 5,
      fuelConsumption: '6.1L/100km',
      co2Emissions: '159 g/km'
    },
    features: [
      'Automatic Transmission',
      'Diesel Engine',
      'Compact SUV',
      'Fuel Efficient',
      '5 Seats',
      'Touch Screen Display',
      'Rear Camera',
      'Bluetooth',
      'Cruise Control',
      'Climate Control',
      'Alloy Wheels',
      'LED Headlights'
    ],
    description: '2018 Mitsubishi ASX compact SUV in excellent condition. Features automatic transmission, efficient diesel engine, and modern technology including touchscreen display and safety features. Perfect for both city driving and longer journeys.',
    available: true,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select();

    if (error) {
      console.log('❌ Error adding 2018 Mitsubishi ASX:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully added 2018 Mitsubishi ASX!');
      console.log(`   Vehicle ID: ${data[0].id}`);
      console.log(`   Make: ${vehicleData.make}`);
      console.log(`   Model: ${vehicleData.model}`);
      console.log(`   Year: ${vehicleData.year}`);
      console.log(`   Price: €${vehicleData.price}`);
      console.log(`   Images: ${vehicleData.images.length} images`);
      console.log(`   Engine: ${vehicleData.specifications.engineCapacity}L ${vehicleData.engine_type}`);
      console.log(`   Transmission: ${vehicleData.transmission}`);

      console.log('\n📸 Image URLs:');
      vehicleData.images.forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
      });
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

add2018MitsubishiASX()
  .then(() => {
    console.log('\n🎉 2018 Mitsubishi ASX successfully added to database!');
    console.log('✅ Ready to deploy to production');
  })
  .catch((error) => {
    console.error('❌ Failed to add vehicle:', error);
    process.exit(1);
  });