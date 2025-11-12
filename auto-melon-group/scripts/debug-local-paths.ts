#!/usr/bin/env tsx

// Debug script to find vehicles with local image paths
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLocalPaths() {
  console.log('🔍 Debugging local image paths in vehicles...\n')

  try {
    // Get all vehicles and check for local paths manually
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, make, model, year, images')

    if (error) {
      console.log('❌ Error fetching vehicles:', error.message)
      return
    }

    console.log(`📋 Checking ${vehicles?.length || 0} total vehicles...\n`)

    let localPathCount = 0
    const vehiclesWithLocalPaths: any[] = []

    vehicles?.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.make} ${vehicle.model} (${vehicle.year})`)

      if (!vehicle.images || vehicle.images.length === 0) {
        console.log(`   📸 Images: No images`)
      } else {
        const localImages = vehicle.images.filter((img: string) =>
          img && img.startsWith('/images/')
        )

        if (localImages.length > 0) {
          console.log(`   ❌ Found ${localImages.length} local images:`)
          localImages.forEach((img, i) => {
            console.log(`     ${i + 1}. ${img}`)
          })
          localPathCount += localImages.length
          vehiclesWithLocalPaths.push(vehicle)
        } else {
          // Check for other potential issues
          const httpImages = vehicle.images.filter((img: string) =>
            img && img.startsWith('http')
          )
          console.log(`   ✅ ${httpImages.length} HTTP images`)

          if (vehicle.images.length !== httpImages.length) {
            const otherImages = vehicle.images.filter((img: string) =>
              img && !img.startsWith('http') && !img.startsWith('/images/')
            )
            if (otherImages.length > 0) {
              console.log(`   ⚠️  ${otherImages.length} other type images:`)
              otherImages.forEach((img, i) => {
                console.log(`     ${i + 1}. ${img} (type: ${typeof img})`)
              })
            }
          }
        }
      }
      console.log('')
    })

    console.log(`📊 Summary:`)
    console.log(`Total vehicles: ${vehicles?.length || 0}`)
    console.log(`Vehicles with local paths: ${vehiclesWithLocalPaths.length}`)
    console.log(`Total local image paths: ${localPathCount}`)

    if (vehiclesWithLocalPaths.length > 0) {
      console.log(`\n🚨 Vehicles that need fixing:`)
      vehiclesWithLocalPaths.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.make} ${vehicle.model} (${vehicle.year}) - ID: ${vehicle.id}`)
      })
    }

  } catch (err) {
    console.error('❌ Error debugging local paths:', err)
  }
}

debugLocalPaths()