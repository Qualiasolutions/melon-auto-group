import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to normalize strings for matching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// Helper function to find matching images for a vehicle
function findMatchingImages(make: string, model: string, year: number): string[] {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'vehicles')

  if (!fs.existsSync(imagesDir)) {
    console.warn(`Images directory does not exist: ${imagesDir}`)
    return []
  }

  const allFiles = fs.readdirSync(imagesDir)

  // Normalize make and model for matching
  const normalizedMake = normalizeString(make)
  const normalizedModel = normalizeString(model)

  // Try exact match first
  const exactMatches = allFiles.filter(file => {
    const fileName = file.replace(/\.webp$/, '')
    const fileSlug = fileName.replace(/-\d+$/, '') // Remove trailing -1, -2, etc.

    return (
      fileSlug.includes(normalizedMake) &&
      fileSlug.includes(normalizedModel.split('-')[0]) // Match first part of model
    )
  })

  if (exactMatches.length > 0) {
    return exactMatches.map(file => `/images/vehicles/${file}`)
  }

  // Try make-only match
  const makeMatches = allFiles.filter(file => {
    const fileName = file.replace(/\.webp$/, '')
    return fileName.includes(normalizedMake)
  })

  if (makeMatches.length > 0) {
    // Return first matching make image
    return [`/images/vehicles/${makeMatches[0]}`]
  }

  return []
}

async function fixMissingImages() {
  console.log('🔍 Finding vehicles without images...\n')

  // Get all vehicles without images
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, make, model, year, category')
    .or('images.is.null,images.eq.{}')

  if (error) {
    console.error('❌ Error fetching vehicles:', error)
    return
  }

  console.log(`📊 Found ${vehicles?.length || 0} vehicles without images\n`)

  if (!vehicles || vehicles.length === 0) {
    console.log('✅ All vehicles have images!')
    return
  }

  let updated = 0
  let failed = 0
  let skipped = 0

  for (const vehicle of vehicles) {
    console.log(`\n🚛 Processing: ${vehicle.make} ${vehicle.model} (${vehicle.year})`)

    // Find matching images
    const images = findMatchingImages(vehicle.make, vehicle.model, vehicle.year)

    if (images.length > 0) {
      console.log(`   📸 Found ${images.length} matching image(s):`)
      images.forEach(img => console.log(`      - ${img}`))

      // Update vehicle with images
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ images })
        .eq('id', vehicle.id)

      if (updateError) {
        console.log(`   ❌ Failed to update: ${updateError.message}`)
        failed++
      } else {
        console.log(`   ✅ Updated successfully`)
        updated++
      }
    } else {
      console.log(`   ⚠️  No matching images found - vehicle will show placeholder`)
      skipped++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⚠️  Skipped (no match): ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log('='.repeat(60) + '\n')
}

// Run the script
fixMissingImages()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
