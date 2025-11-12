#!/usr/bin/env tsx

// Simple Facebook vehicle import script
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import facebookVehicles from './facebook-vehicles.json'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

console.log('🔑 Using Supabase with service role key for admin operations\n')
const supabase = createClient(supabaseUrl, supabaseKey)

async function importFacebookVehicles() {
  console.log("🚚 Importing Facebook Marketplace vehicles...\n")

  for (let i = 0; i < facebookVehicles.length; i++) {
    const vehicle = facebookVehicles[i]

    console.log(`\n📋 Importing ${i + 1}/${facebookVehicles.length}:`)
    console.log(`   ${vehicle.make} ${vehicle.model} (${vehicle.year})`)
    console.log(`   Price: €${vehicle.price.toLocaleString()}`)
    console.log(`   Location: ${vehicle.location}`)

    try {
      // Convert to database format (snake_case for columns)
      const vehicleData = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        currency: vehicle.currency,
        condition: vehicle.condition,
        category: vehicle.category,
        engine_type: vehicle.engineType,
        transmission: vehicle.transmission,
        horsepower: vehicle.horsepower,
        location: vehicle.location,
        country: vehicle.country,
        vin: vehicle.vin,
        images: vehicle.images,
        specifications: vehicle.specifications,
        features: vehicle.features,
        description: vehicle.description,
        available: vehicle.available,
        featured: vehicle.featured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()

      if (error) {
        console.log(`❌ Error: ${error.message}`)
      } else {
        console.log(`✅ Success! Database ID: ${data[0].id}`)
      }
    } catch (err) {
      console.log(`❌ Unexpected error: ${err}`)
    }
  }

  console.log("\n🎉 Import completed!")

  // Show updated vehicle count
  const { count } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📊 Total vehicles in database: ${count}`)
}

importFacebookVehicles().catch(console.error)