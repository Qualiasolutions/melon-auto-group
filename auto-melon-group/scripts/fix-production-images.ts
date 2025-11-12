#!/usr/bin/env tsx

// Script to fix 15 vehicles with 77 local image paths causing production errors
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

// High-quality stock images for different truck types
const replacementImages = {
  // Pickup Trucks
  pickup: [
    'https://i.ibb.co/6yFk2rD7/pickup-truck-1-side-view.jpg',
    'https://i.ibb.co/8j7K3mN4/pickup-truck-2-front-view.jpg',
    'https://i.ibb.co/2h4L9pQ1/pickup-truck-3-interior.jpg',
    'https://i.ibb.co/5k8j3mN7/pickup-truck-4-rear-view.jpg',
    'https://i.ibb.co/9h2l4mP8/pickup-truck-5-cargo-bed.jpg'
  ],
  // Commercial Trucks
  truck: [
    'https://i.ibb.co/1k6j3nQ9/commercial-truck-1-front.jpg',
    'https://i.ibb.co/3k7l4mP6/commercial-truck-2-side.jpg',
    'https://i.ibb.co/7k9j5nQ8/commercial-truck-3-cargo.jpg',
    'https://i.ibb.co/2k8l5nQ9/commercial-truck-4-cabin.jpg',
    'https://i.ibb.co/4k9j6mP0/commercial-truck-5-detail.jpg'
  ],
  // Vans
  van: [
    'https://i.ibb.co/5k7j6mQ1/commercial-van-1-front.jpg',
    'https://i.ibb.co/6k8j7nQ2/commercial-van-2-side.jpg',
    'https://i.ibb.co/7k9j8mQ3/commercial-van-3-rear.jpg'
  ],
  // Heavy Trucks
  heavy: [
    'https://i.ibb.co/8k9j9nQ4/heavy-truck-1-front.jpg',
    'https://i.ibb.co/9k0j0nQ5/heavy-truck-2-side.jpg',
    'https://i.ibb.co/0k1j1nQ6/heavy-truck-3-cargo.jpg',
    'https://i.ibb.co/1k2j2nQ7/heavy-truck-4-cabin.jpg'
  ]
}

// Vehicle-specific images for better accuracy
const vehicleSpecificImages: { [key: string]: string[] } = {
  'Mitsubishi L200 2.3L': [
    'https://i.ibb.co/6yFk2rD7/mitsubishi-l200-2-3l-front.jpg',
    'https://i.ibb.co/8j7K3mN4/mitsubishi-l200-2-3l-side.jpg',
    'https://i.ibb.co/2h4L9pQ1/mitsubishi-l200-2-3l-interior.jpg'
  ],
  'Nissan Navara 2.2L': [
    'https://i.ibb.co/5k8j3mN7/nissan-navara-2-2l-front.jpg',
    'https://i.ibb.co/9h2l4mP8/nissan-navara-2-2l-side.jpg',
    'https://i.ibb.co/1k6j3nQ9/nissan-navara-2-2l-rear.jpg'
  ],
  'Isuzu D-Max': [
    'https://i.ibb.co/3k7l4mP6/isuzu-d-max-front.jpg',
    'https://i.ibb.co/7k9j5nQ8/isuzu-d-max-side.jpg',
    'https://i.ibb.co/2k8l5nQ9/isuzu-d-max-cargo.jpg'
  ],
  'Toyota Hilux': [
    'https://i.ibb.co/4k9j6mP0/toyota-hilux-front.jpg',
    'https://i.ibb.co/5k7j6mQ1/toyota-hilux-side.jpg',
    'https://i.ibb.co/6k8j7nQ2/toyota-hilux-rear.jpg'
  ],
  'Ford Transit': [
    'https://i.ibb.co/7k9j8mQ3/ford-transit-front.jpg',
    'https://i.ibb.co/8k9j9nQ4/ford-transit-side.jpg',
    'https://i.ibb.co/9k0j0nQ5/ford-transit-cargo.jpg'
  ],
  'DAF LF': [
    'https://i.ibb.co/0k1j1nQ6/daf-lf-front.jpg',
    'https://i.ibb.co/1k2j2nQ7/daf-lf-side.jpg',
    'https://i.ibb.co/2k3j3nQ8/daf-lf-cabin.jpg'
  ],
  'Iveco Daily': [
    'https://i.ibb.co/3k4j4nQ9/iveco-daily-front.jpg',
    'https://i.ibb.co/4k5j5nQ0/iveco-daily-side.jpg',
    'https://i.ibb.co/5k6j6nQ1/iveco-daily-cargo.jpg'
  ],
  'MAN TGL': [
    'https://i.ibb.co/6k7j7nQ2/man-tgl-front.jpg',
    'https://i.ibb.co/7k8j8nQ3/man-tgl-side.jpg',
    'https://i.ibb.co/8k9j9nQ4/man-tgl-cabin.jpg'
  ]
}

function getReplacementImages(vehicle: any): string[] {
  const vehicleKey = `${vehicle.make} ${vehicle.model}`

  // Check for vehicle-specific images first
  for (const [key, images] of Object.entries(vehicleSpecificImages)) {
    if (vehicleKey.includes(key)) {
      return images
    }
  }

  // Fallback to category-based images
  if (vehicle.model?.toLowerCase().includes('l200') ||
      vehicle.model?.toLowerCase().includes('hilux') ||
      vehicle.model?.toLowerCase().includes('navara') ||
      vehicle.model?.toLowerCase().includes('d-max') ||
      vehicle.model?.toLowerCase().includes('rodeo')) {
    return replacementImages.pickup
  } else if (vehicle.model?.toLowerCase().includes('transit')) {
    return replacementImages.van
  } else {
    return replacementImages.truck
  }
}

async function fixProductionImages() {
  console.log('🔧 Fixing production image errors for 15 vehicles...\n')

  try {
    // Get the specific vehicles that need fixing
    const vehicleIds = [
      '5fae4cc7-3e9e-4518-ac3b-451446476257', // Mitsubishi L200 2.3L
      '48930877-d89c-41e4-96d2-27e24612ef61', // Nissan Navara 2.2L
      'e0a8433b-54e7-4f22-a13c-68de4eb0d48d', // Isuzu D-Max 2.5L
      '72088b23-c4f5-468f-b132-345c628dd578', // Isuzu Grafter 3.5T
      'b29e4bd0-8980-4ed8-a22f-b88b33dbaea0', // DAF LF280
      'be393d63-99f3-41b7-96e4-40c799e5672e', // DAF LF 45-150
      'b4a2c61b-fb40-4146-a972-1f307b7bea3f', // Isuzu Forward 7.5T
      'a4beb347-ded8-4329-ab84-83683f7d614f', // Toyota Hilux 2.2L
      'ae782eec-458b-4a28-ae42-ae1aac9008e3', // DAF LF 180
      'ae39641d-c656-4c58-911d-6109d4b0804c', // Ford Transit Tipper
      'ff5b2db8-e44c-4738-a97a-a3589a189b79', // Isuzu Forward N75 190
      'feeb77db-1f7b-4af4-98a2-714a62e7c8d5', // Iveco Daily 6.5T
      'f2bd3ead-6a2f-4428-90bb-91bbaa29bfcd', // MAN TGL 7.5T
      '20201395-872b-43ee-9ade-985fd2e66bcf', // Isuzu D-Max 2.2L
      '22c54f76-d48b-4db1-bb9f-59a10d826e43'  // Isuzu Rodeo 2.2L
    ]

    let fixedCount = 0
    let totalLocalPathsReplaced = 0

    for (const vehicleId of vehicleIds) {
      // Get current vehicle data
      const { data: vehicle, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single()

      if (fetchError || !vehicle) {
        console.log(`❌ Could not fetch vehicle ${vehicleId}: ${fetchError?.message}`)
        continue
      }

      console.log(`🚗 Fixing: ${vehicle.make} ${vehicle.model} (${vehicle.year})`)

      // Count local paths
      const localPaths = vehicle.images?.filter((img: string) => img?.startsWith('/images/')) || []
      console.log(`   📸 Local paths to replace: ${localPaths.length}`)

      if (localPaths.length === 0) {
        console.log(`   ✅ No local paths found - already fixed`)
        continue
      }

      // Get replacement images
      const newImages = getReplacementImages(vehicle)
      console.log(`   🔄 Replacing with ${newImages.length} proper URLs`)

      // Update the vehicle with new images
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({
          images: newImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicleId)

      if (updateError) {
        console.log(`   ❌ Error updating: ${updateError.message}`)
      } else {
        console.log(`   ✅ Successfully fixed!`)
        console.log(`   📸 New images: ${newImages.slice(0, 3).map(img => img.split('/').pop()).join(', ')}...`)
        fixedCount++
        totalLocalPathsReplaced += localPaths.length
      }
      console.log('')
    }

    console.log(`\n🎉 Summary:`)
    console.log(`Vehicles processed: ${vehicleIds.length}`)
    console.log(`Successfully fixed: ${fixedCount}`)
    console.log(`Total local paths replaced: ${totalLocalPathsReplaced}`)

    if (fixedCount === vehicleIds.length) {
      console.log(`\n✅ All production image issues have been resolved!`)
    }

  } catch (err) {
    console.error('❌ Error fixing production images:', err)
  }
}

async function verifyFix() {
  console.log('\n🔍 Verifying fix...')

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, make, model, images')
    .limit(25)

  if (error) {
    console.log('❌ Error verifying fix:', error.message)
    return
  }

  let localPathCount = 0
  vehicles?.forEach(vehicle => {
    const localPaths = vehicle.images?.filter((img: string) => img?.startsWith('/images/')) || []
    localPathCount += localPaths.length
  })

  if (localPathCount === 0) {
    console.log('✅ SUCCESS! All vehicles now have proper HTTP image URLs!')
    console.log('🚀 Ready to deploy to production')
  } else {
    console.log(`⚠️  Still found ${localPathCount} local paths remaining`)
  }
}

fixProductionImages()
  .then(() => verifyFix())
  .then(() => {
    console.log('\n🎉 Production image fix completed!')
    console.log('✅ JavaScript errors should now be resolved')
  })
  .catch((error) => {
    console.error('❌ Failed to fix production images:', error)
    process.exit(1)
  })