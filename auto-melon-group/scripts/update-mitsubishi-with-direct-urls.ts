#!/usr/bin/env tsx

// Simple script to update Mitsubishi vehicles with direct image URLs
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Load the direct URLs
const directUrlsPath = path.join(__dirname, 'complete-mitsubishi-direct-urls.json')
const directUrls = JSON.parse(fs.readFileSync(directUrlsPath, 'utf-8'))

async function updateVehiclesWithDirectUrls() {
  console.log('🔄 Updating Mitsubishi vehicles with direct image URLs...\n')

  const vehicleMappings = {
    '2018-mitsubishi-asx': { make: 'Mitsubishi', model: 'ASX', year: 2018 },
    '2020-mitsubishi-l200': { make: 'Mitsubishi', model: 'L200 Challenger', year: 2020 },
    '2017-mitsubishi-l200': { make: 'Mitsubishi', model: 'L200', year: 2017 }
  }

  for (const [vehicleKey, vehicleInfo] of Object.entries(vehicleMappings)) {
    if (directUrls[vehicleKey]) {
      console.log(`\n📸 Updating ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year})...`)
      console.log(`   Images: ${directUrls[vehicleKey].length} URLs`)

      const { data, error } = await supabase
        .from('vehicles')
        .update({
          images: directUrls[vehicleKey],
          updated_at: new Date().toISOString()
        })
        .eq('make', vehicleInfo.make)
        .eq('model', vehicleInfo.model)
        .eq('year', vehicleInfo.year)
        .select()

      if (error) {
        console.log(`❌ Error updating ${vehicleKey}: ${error.message}`)
      } else {
        console.log(`✅ Successfully updated ${vehicleKey} with ${directUrls[vehicleKey].length} direct image URLs`)

        // Show first few URLs as examples
        directUrls[vehicleKey].slice(0, 3).forEach((url, index) => {
          console.log(`   ${index + 1}. ${url}`)
        })
        if (directUrls[vehicleKey].length > 3) {
          console.log(`   ... and ${directUrls[vehicleKey].length - 3} more`)
        }
      }
    }
  }
}

updateVehiclesWithDirectUrls()
  .then(() => {
    console.log('\n🎉 Successfully updated all Mitsubishi vehicles with direct image URLs!')
    console.log('\n✅ Database updated - images should now display properly')
  })
  .catch((error) => {
    console.error('❌ Error updating vehicles:', error)
    process.exit(1)
  })