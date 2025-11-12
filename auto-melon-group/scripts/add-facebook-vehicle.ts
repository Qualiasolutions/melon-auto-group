import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addVehicle() {
  console.log('🚗 Adding 2020 Mitsubishi L200 from Facebook Marketplace...\n')

  const vehicleData = {
    make: 'Mitsubishi',
    model: 'L200',
    year: 2020,
    mileage: 0, // Not specified in the listing
    price: 12250,
    currency: 'GBP',
    condition: 'used' as const,
    category: 'other', // Using 'other' since pickup not in schema
    engine_type: 'diesel' as const,
    transmission: 'manual' as const,
    horsepower: 150, // Estimated for L200
    location: 'Buxton, United Kingdom',
    country: 'United Kingdom',
    vin: 'FB-2550308978683881', // Using Facebook ID as VIN since required
    images: [],
    specifications: {
      body_type: 'Pickup Truck',
      fuel_type: 'Diesel',
      engine_size: '2.4L',
      listing_source: 'Facebook Marketplace',
      reference_url: 'https://www.facebook.com/marketplace/item/2550308978683881'
    },
    features: [
      'MOT recently completed',
      'Good tyres',
      'Very clean condition',
      'Drives well'
    ],
    description: 'Very very clean Pickup. Just had MOT. Tyres are good. Drives well. Sale is plus VAT.',
    available: true,
    featured: false
  }

  const { data, error } = await supabase
    .from('vehicles')
    .insert([vehicleData])
    .select()

  if (error) {
    console.error('❌ Error adding vehicle:', error.message)
    console.error('Details:', error)
    process.exit(1)
  }

  console.log('✅ Vehicle added successfully!\n')
  console.log('📋 Vehicle Details:')
  console.log('   ID:', data[0].id)
  console.log('   Make:', data[0].make)
  console.log('   Model:', data[0].model)
  console.log('   Year:', data[0].year)
  console.log('   Price: £' + data[0].price.toLocaleString())
  console.log('   Location:', data[0].location)
  console.log('   VIN:', data[0].vin)
  console.log('\n🔗 View in admin: /admin/vehicles/' + data[0].id + '/edit')
  console.log('🔗 Original listing:', vehicleData.specifications.reference_url)
}

addVehicle()
