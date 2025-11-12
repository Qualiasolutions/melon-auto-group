import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

type VehicleJsonRecord = {
  price?: number
  mileage?: number
  images?: string[]
  description?: string
}

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function checkSetup() {
  console.log('🔍 Checking Auto Melon Group Setup...\n')

  let hasErrors = false

  // Check 1: Environment Variables
  console.log('1️⃣  Checking Environment Variables...')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Missing Supabase credentials in .env.local')
    console.log('   ℹ️  Make sure you have:')
    console.log('      - NEXT_PUBLIC_SUPABASE_URL')
    console.log('      - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    hasErrors = true
  } else {
    console.log('   ✅ Environment variables found')
    console.log(`   📍 Supabase URL: ${supabaseUrl}`)
  }

  // Check 2: Supabase Connection
  console.log('\n2️⃣  Checking Supabase Connection...')
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
      const { error } = await supabase
        .from('vehicles')
        .select('count')
        .limit(1)

      if (error) {
        console.log(`   ❌ Database connection error: ${error.message}`)
        console.log('   ℹ️  Make sure:')
        console.log('      - Your Supabase project is active')
        console.log('      - The vehicles table exists')
        console.log('      - RLS policies are configured')
        hasErrors = true
      } else {
        console.log('   ✅ Successfully connected to Supabase')

        // Count existing vehicles
        const { count } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })

        console.log(`   📊 Current vehicles in database: ${count || 0}`)
      }
    } catch (err) {
      console.log(`   ❌ Unexpected error: ${err}`)
      hasErrors = true
    }
  }

  // Check 3: Data File
  console.log('\n3️⃣  Checking Data Files...')
  const dataFilePath = path.join(__dirname, 'bazaraki-vehicles.json')

  if (!fs.existsSync(dataFilePath)) {
    console.log('   ❌ bazaraki-vehicles.json not found')
    hasErrors = true
  } else {
    console.log('   ✅ bazaraki-vehicles.json found')

    try {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
      const vehicles: VehicleJsonRecord[] = JSON.parse(fileContent)

      console.log(`   📦 Total vehicles in JSON: ${vehicles.length}`)

      // Check how many have required data
      const withPrice = vehicles.filter((v) => typeof v.price === 'number' && v.price > 0).length
      const withMileage = vehicles.filter((v) => typeof v.mileage === 'number' && v.mileage > 0).length
      const withImages = vehicles.filter((v) => Array.isArray(v.images) && v.images.length > 0).length
      const withDescription = vehicles.filter((v) => typeof v.description === 'string' && v.description.length > 10).length

      console.log(`   💰 Vehicles with price: ${withPrice}/${vehicles.length}`)
      console.log(`   📏 Vehicles with mileage: ${withMileage}/${vehicles.length}`)
      console.log(`   🖼️  Vehicles with images: ${withImages}/${vehicles.length}`)
      console.log(`   📝 Vehicles with description: ${withDescription}/${vehicles.length}`)

      if (withPrice < vehicles.length || withMileage < vehicles.length) {
        console.log('\n   ⚠️  Some vehicles are missing required data')
        console.log('   ℹ️  Fill in price and mileage for all vehicles before importing')
      }

    } catch (err) {
      console.log(`   ❌ Error reading JSON file: ${err}`)
      hasErrors = true
    }
  }

  // Check 4: Dependencies
  console.log('\n4️⃣  Checking Dependencies...')
  const ensureDependency = async (pkg: string, label: string) => {
    try {
      await import(pkg)
      console.log(`   ✅ ${label} installed`)
    } catch {
      console.log(`   ❌ ${label} not found`)
      console.log('   ℹ️  Run: npm install')
      hasErrors = true
    }
  }

  await ensureDependency('@supabase/supabase-js', '@supabase/supabase-js')
  await ensureDependency('dotenv', 'dotenv')

  // Summary
  console.log('\n' + '='.repeat(60))
  if (hasErrors) {
    console.log('❌ Setup has issues - please fix the errors above')
    console.log('='.repeat(60))
    process.exit(1)
  } else {
    console.log('✅ Setup looks good! You\'re ready to import vehicles')
    console.log('='.repeat(60))
    console.log('\n📝 Next steps:')
    console.log('   1. Fill in vehicle data in scripts/bazaraki-vehicles.json')
    console.log('   2. Run: npm run import-vehicles')
    console.log('   3. Visit http://localhost:3000/inventory to see your vehicles\n')
  }
}

// Run the check
checkSetup()
