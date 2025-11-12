import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

console.log('🔑 Using Supabase with service role key for admin operations\n')
const supabase = createClient(supabaseUrl, supabaseKey)

type VehicleSpecificationsInput = Record<string, string | number | null | undefined>

interface VehicleInput {
  bazarakiUrl: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  currency: string
  condition: string
  category: string
  engineType: string
  transmission: string
  horsepower: number
  location: string
  country: string
  vin: string
  images: string[]
  specifications: VehicleSpecificationsInput
  features: string[]
  description: string
  available: boolean
  featured: boolean
}

async function importVehicles() {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, 'bazaraki-vehicles.json')
    const jsonData = fs.readFileSync(jsonPath, 'utf-8')
    const vehicles: VehicleInput[] = JSON.parse(jsonData)

    console.log(`📦 Found ${vehicles.length} vehicles to import\n`)

    let successCount = 0
    let errorCount = 0
    const errors: Array<{ vehicle: string; error: string }> = []

    for (const vehicle of vehicles) {
      // Convert camelCase to snake_case for database
      const dbVehicle = {
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
        horsepower: vehicle.horsepower > 0 ? vehicle.horsepower : null, // Only include if > 0
        location: vehicle.location,
        country: vehicle.country,
        vin: vehicle.vin,
        images: vehicle.images,
        specifications: vehicle.specifications,
        features: vehicle.features,
        description: vehicle.description,
        available: vehicle.available,
        featured: vehicle.featured,
      }

      // Validate required fields
      if (!vehicle.price || vehicle.price === 0) {
        console.log(`⚠️  Skipping ${vehicle.make} ${vehicle.model} (${vehicle.year}) - Missing price`)
        errorCount++
        errors.push({
          vehicle: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
          error: 'Missing price',
        })
        continue
      }

      if (!vehicle.mileage || vehicle.mileage === 0) {
        console.log(`⚠️  Skipping ${vehicle.make} ${vehicle.model} (${vehicle.year}) - Missing mileage`)
        errorCount++
        errors.push({
          vehicle: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
          error: 'Missing mileage',
        })
        continue
      }

      // Insert into database
      const { error } = await supabase
        .from('vehicles')
        .insert(dbVehicle)
        .select()

      if (error) {
        console.log(`❌ Error inserting ${vehicle.make} ${vehicle.model}: ${error.message}`)
        errorCount++
        errors.push({
          vehicle: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
          error: error.message,
        })
      } else {
        console.log(`✅ Imported: ${vehicle.make} ${vehicle.model} (${vehicle.year}) - €${vehicle.price}`)
        successCount++
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully imported: ${successCount} vehicles`)
    console.log(`❌ Failed/Skipped: ${errorCount} vehicles`)
    console.log(`📦 Total processed: ${vehicles.length} vehicles\n`)

    if (errors.length > 0) {
      console.log('❌ ERRORS:')
      errors.forEach((err, idx) => {
        console.log(`${idx + 1}. ${err.vehicle}: ${err.error}`)
      })
      console.log('')
    }

    if (successCount > 0) {
      console.log('🎉 Vehicle import completed!')
      console.log('Visit http://localhost:3000/inventory to see your vehicles\n')
    } else {
      console.log('⚠️  No vehicles were imported. Please check the errors above.\n')
    }
  } catch (error) {
    console.error('❌ Fatal error during import:', error)
    process.exit(1)
  }
}

// Run the import
importVehicles()
