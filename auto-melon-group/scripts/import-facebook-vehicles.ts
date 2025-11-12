#!/usr/bin/env tsx

// Import Facebook Marketplace vehicles to Supabase database
// This script processes and imports vehicles scraped from Facebook Marketplace

import { createClient } from '@/lib/supabase/client'
import { facebookScrapedVehicles, convertFacebookToVehicleFormat } from './facebook-vehicles-scraped'

// Initialize Supabase client
const supabase = createClient()

async function importFacebookVehicles() {
  console.log("🚚 Importing Facebook Marketplace vehicles to database...\n")

  try {
    // Convert Facebook data to vehicle format
    const vehiclesToImport = convertFacebookToVehicleFormat(facebookScrapedVehicles)

    console.log(`Processing ${vehiclesToImport.length} vehicles:\n`)

    for (let i = 0; i < vehiclesToImport.length; i++) {
      const vehicle = vehiclesToImport[i]

      console.log(`\n📋 Vehicle ${i + 1}/${vehiclesToImport.length}:`)
      console.log(`   Make: ${vehicle.make}`)
      console.log(`   Model: ${vehicle.model}`)
      console.log(`   Year: ${vehicle.year}`)
      console.log(`   Price: £${vehicle.price.toLocaleString()}`)
      console.log(`   Location: ${vehicle.location}`)
      console.log(`   Category: ${vehicle.category}`)

      try {
        // Create proper vehicle data structure for Supabase
        const vehicleData = {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          price: vehicle.price,
          currency: vehicle.currency,
          condition: "used",
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

        // Insert vehicle into database
        const { data, error } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select()

        if (error) {
          console.log(`❌ Error importing vehicle: ${error.message}`)

          // Check if it's a duplicate VIN error
          if (error.message.includes('duplicate key') || error.message.includes('unique')) {
            console.log(`⚠️  Vehicle with VIN ${vehicle.vin} may already exist`)
          }
        } else {
          console.log(`✅ Successfully imported vehicle!`)
          console.log(`   Database ID: ${data[0].id}`)
          console.log(`   VIN: ${vehicle.vin}`)
        }
      } catch (err) {
        console.log(`❌ Unexpected error processing vehicle: ${err}`)
      }
    }

    console.log("\n🎉 Import process completed!")

    // Show summary
    const { data: allVehicles, error: fetchError } = await supabase
      .from('vehicles')
      .select('make, model, year, price, location')
      .eq('make', 'Mitsubishi')
      .eq('model', 'ilike.%L200%')
      .order('created_at', { ascending: false })
      .limit(10)

    if (!fetchError && allVehicles) {
      console.log(`\n📊 Current Mitsubishi L200 vehicles in database:`)
      allVehicles.forEach((v, index) => {
        console.log(`${index + 1}. ${v.make} ${v.model} (${v.year}) - £${v.price.toLocaleString()} - ${v.location}`)
      })
    }

  } catch (error) {
    console.error("❌ Fatal error during import:", error)
  }
}

// Function to check if source_url column exists, and add it if needed
async function ensureSourceUrlColumn() {
  try {
    const { error } = await supabase
      .from('vehicles')
      .select('source_url')
      .limit(1)

    if (error && error.message.includes('column "source_url" does not exist')) {
      console.log("⚠️  source_url column doesn't exist. You may want to add it to track Facebook sources:")
      console.log("ALTER TABLE vehicles ADD COLUMN source_url TEXT;")
    }
  } catch (err) {
    // Ignore column check errors
  }
}

// Main execution
async function main() {
  console.log("=== Facebook Marketplace Vehicle Import ===\n")

  await ensureSourceUrlColumn()

  console.log("Facebook vehicles to import:")
  facebookScrapedVehicles.forEach((vehicle, index) => {
    console.log(`${index + 1}. ${vehicle.make} ${vehicle.model} (${vehicle.year}) - £${vehicle.price.toLocaleString()}`)
  })

  console.log("\n" + "=".repeat(50))

  const confirm = await new Promise<boolean>((resolve) => {
    process.stdout.write("\nContinue with import? (y/N): ")
    process.stdin.once('data', (data) => {
      const input = data.toString().trim().toLowerCase()
      resolve(input === 'y' || input === 'yes')
    })
  })

  if (confirm) {
    await importFacebookVehicles()
  } else {
    console.log("❌ Import cancelled by user")
  }
}

// Run the script if executed directly
if (require.main === module) {
  // Enable stdin input for confirmation
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
  }

  main()
    .then(() => {
      console.log("\n✅ Script completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("\n❌ Script failed:", error)
      process.exit(1)
    })
}

export { importFacebookVehicles, facebookScrapedVehicles }