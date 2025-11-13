import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface BazarakiVehicle {
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
  specifications: Record<string, any>
  features: string[]
  description: string
  available: boolean
  featured: boolean
}

async function main() {
  console.log('🚀 Starting Bazaraki vehicles import with image scraping...\n')

  // Read the Bazaraki vehicles JSON
  const jsonPath = path.join(__dirname, 'bazaraki-vehicles.json')
  const rawData = fs.readFileSync(jsonPath, 'utf-8')
  const vehicles: BazarakiVehicle[] = JSON.parse(rawData)

  console.log(`📦 Found ${vehicles.length} vehicles in bazaraki-vehicles.json\n`)

  let imported = 0
  let failed = 0
  let skipped = 0

  for (const vehicle of vehicles) {
    try {
      console.log(`\n📋 Processing: ${vehicle.year} ${vehicle.make} ${vehicle.model}`)
      console.log(`   URL: ${vehicle.bazarakiUrl}`)

      // Check if vehicle already exists by VIN
      const { data: existing } = await supabase
        .from('vehicles')
        .select('id')
        .eq('vin', vehicle.vin)
        .single()

      if (existing) {
        console.log(`   ⏭️  Already exists (VIN: ${vehicle.vin})`)
        skipped++
        continue
      }

      // Prepare vehicle data for database (convert camelCase to snake_case for DB)
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
        bazaraki_url: vehicle.bazarakiUrl,
        images: vehicle.images || [], // Use existing images from JSON
        specifications: vehicle.specifications || {},
        features: vehicle.features || [],
        description: vehicle.description || '',
        available: vehicle.available ?? true,
        featured: vehicle.featured ?? false,
      }

      // Insert into database
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single()

      if (error) {
        console.error(`   ❌ Failed to insert: ${error.message}`)
        failed++
        continue
      }

      console.log(`   ✅ Imported successfully (ID: ${data.id})`)
      console.log(`   🖼️  Images: ${vehicleData.images.length} URLs included`)
      imported++

    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Import Summary:')
  console.log(`   ✅ Imported: ${imported}`)
  console.log(`   ⏭️  Skipped (already exist): ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📦 Total: ${vehicles.length}`)
  console.log('='.repeat(60))
}

main().catch(console.error)
