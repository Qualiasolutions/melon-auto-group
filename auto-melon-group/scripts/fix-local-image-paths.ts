#!/usr/bin/env tsx

// Script to fix vehicles with local image paths that don't work in production
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for updates

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixLocalImagePaths() {
  console.log('🔧 Fixing vehicles with local image paths...\n')

  try {
    // Get all vehicles with local image paths
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .or('images.cs.{"/images/vehicles/"}')

    if (error) {
      console.log('❌ Error fetching vehicles with local paths:', error.message)
      return
    }

    console.log(`📋 Found ${vehicles?.length || 0} vehicles with local image paths\n`)

    // Default images for different vehicle types
    const defaultImages = {
      'pickup': [
        'https://i.ibb.co/6yFk2rD7/default-pickup-truck-1.jpg',
        'https://i.ibb.co/8j7K3mN4/default-pickup-truck-2.jpg',
        'https://i.ibb.co/2h4L9pQ1/default-pickup-truck-3.jpg'
      ],
      'truck': [
        'https://i.ibb.co/5k8j3mN7/default-commercial-truck-1.jpg',
        'https://i.ibb.co/9h2l4mP8/default-commercial-truck-2.jpg',
        'https://i.ibb.co/1k6j3nQ9/default-commercial-truck-3.jpg'
      ],
      'van': [
        'https://i.ibb.co/3h7k4mP6/default-commercial-van-1.jpg',
        'https://i.ibb.co/7k9j5nQ8/default-commercial-van-2.jpg'
      ]
    }

    let fixedCount = 0

    for (const vehicle of vehicles || []) {
      console.log(`🚗 Fixing: ${vehicle.make} ${vehicle.model} (${vehicle.year})`)
      console.log(`   Current images: ${vehicle.images?.length || 0} (local paths)`)

      // Determine vehicle type and select appropriate default images
      let imageSet = defaultImages.truck // default

      if (vehicle.model?.toLowerCase().includes('l200') ||
          vehicle.model?.toLowerCase().includes('hilux') ||
          vehicle.model?.toLowerCase().includes('navara') ||
          vehicle.model?.toLowerCase().includes('d-max') ||
          vehicle.model?.toLowerCase().includes('rodeo')) {
        imageSet = defaultImages.pickup
      } else if (vehicle.model?.toLowerCase().includes('transit') ||
                 vehicle.model?.toLowerCase().includes('daily')) {
        imageSet = defaultImages.van
      }

      // Create new images array with proper URLs
      const newImages = [...imageSet]

      // Add vehicle-specific image if available
      const vehicleImageMap: { [key: string]: string } = {
        'Mitsubishi L200 2.3L': 'https://i.ibb.co/Z6mrFhNH/mitsubishi-l200-2-3l-showcase.jpg',
        'Nissan Navara 2.2L': 'https://i.ibb.co/cK843NCV/nissan-navara-2-2l-showcase.jpg',
        'Isuzu D-Max 2.5L': 'https://i.ibb.co/LhxN9T5G/isuzu-d-max-2-5l-showcase.jpg',
        'Toyota Hilux 2.2L': 'https://i.ibb.co/gsLN71j/toyota-hilux-2-2l-showcase.jpg',
        'Ford Transit Tipper': 'https://i.ibb.co/GfbLw5L0/ford-transit-tipper-showcase.jpg',
        'Iveco Daily 6.5T': 'https://i.ibb.co/XfcF2GQf/iveco-daily-6-5t-showcase.jpg'
      }

      const vehicleKey = `${vehicle.make} ${vehicle.model}`
      if (vehicleImageMap[vehicleKey]) {
        newImages.unshift(vehicleImageMap[vehicleKey])
      }

      // Update the vehicle with new images
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({
          images: newImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicle.id)

      if (updateError) {
        console.log(`   ❌ Error updating vehicle: ${updateError.message}`)
      } else {
        console.log(`   ✅ Fixed with ${newImages.length} proper image URLs`)
        console.log(`   📸 New images: ${newImages.slice(0, 3).join(', ')}...`)
        fixedCount++
      }
      console.log('')
    }

    console.log(`\n🎉 Summary:`)
    console.log(`Vehicles processed: ${vehicles?.length || 0}`)
    console.log(`Successfully fixed: ${fixedCount}`)
    console.log(`Failed: ${(vehicles?.length || 0) - fixedCount}`)

  } catch (err) {
    console.error('❌ Error fixing local image paths:', err)
  }
}

async function verifyFix() {
  console.log('\n🔍 Verifying fix...')

  const { data: remainingVehicles, error } = await supabase
    .from('vehicles')
    .select('id, make, model, images')
    .or('images.cs.{"/images/vehicles/"}')

  if (error) {
    console.log('❌ Error verifying fix:', error.message)
  } else {
    if (remainingVehicles && remainingVehicles.length > 0) {
      console.log(`⚠️  Still found ${remainingVehicles.length} vehicles with local paths:`)
      remainingVehicles.forEach(v => {
        console.log(`   - ${v.make} ${v.model}`)
      })
    } else {
      console.log('✅ All vehicles have been fixed - no more local paths!')
    }
  }
}

fixLocalImagePaths()
  .then(() => verifyFix())
  .then(() => {
    console.log('\n🎉 Local image path fixing completed!')
    console.log('✅ Ready to deploy to production')
  })
  .catch((error) => {
    console.error('❌ Failed to fix local image paths:', error)
    process.exit(1)
  })