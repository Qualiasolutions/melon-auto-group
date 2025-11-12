#!/usr/bin/env tsx

// Debug script to check vehicle fetching issues
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

console.log('🔍 Debugging vehicle fetching...\n')

// Check environment variables
console.log('Environment Variables:')
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`)
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Cannot proceed: Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testVehicleFetching() {
  try {
    console.log('\n📡 Testing Supabase connection...')

    // Test 1: Basic connectivity test
    const { data: connectionTest, error: connectionError } = await supabase
      .from('vehicles')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.log('❌ Connection error:', connectionError.message)
      return
    }

    console.log('✅ Supabase connection successful')

    // Test 2: Fetch all vehicles
    console.log('\n📋 Fetching all vehicles...')
    const { data: allVehicles, error: allError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('available', true)
      .limit(5)

    if (allError) {
      console.log('❌ Error fetching vehicles:', allError.message)
      return
    }

    console.log(`✅ Found ${allVehicles?.length || 0} available vehicles`)

    // Test 3: Test individual vehicle fetch (like the detail page)
    if (allVehicles && allVehicles.length > 0) {
      const firstVehicle = allVehicles[0]
      console.log(`\n🔍 Testing individual vehicle fetch for ID: ${firstVehicle.id}`)

      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', firstVehicle.id)
        .eq('available', true)
        .single()

      if (vehicleError) {
        console.log('❌ Error fetching individual vehicle:', vehicleError.message)
        console.log('Error details:', vehicleError)
      } else {
        console.log('✅ Individual vehicle fetch successful')
        console.log(`   Vehicle: ${vehicle?.make} ${vehicle?.model} (${vehicle?.year})`)
        console.log(`   Images: ${vehicle?.images?.length || 0}`)
        console.log(`   Price: €${vehicle?.price}`)
      }
    }

    // Test 4: Test for any problematic vehicles
    console.log('\n🚨 Checking for vehicles with empty/null data...')
    const { data: problematicVehicles, error: problematicError } = await supabase
      .from('vehicles')
      .select('id, make, model, year, images, description')
      .or('images.is.null,description.is.null')

    if (problematicError) {
      console.log('❌ Error checking problematic vehicles:', problematicError.message)
    } else {
      console.log(`Found ${problematicVehicles?.length || 0} vehicles with potentially missing data`)

      problematicVehicles?.forEach((vehicle, index) => {
        console.log(`${index + 1}. ID: ${vehicle.id} - ${vehicle.make} ${vehicle.model}`)
        console.log(`   Images: ${vehicle.images ? vehicle.images.length : 'NULL'}`)
        console.log(`   Description: ${vehicle.description ? 'Present' : 'NULL'}`)
      })
    }

  } catch (err) {
    console.error('❌ Unexpected error during testing:', err)
  }
}

testVehicleFetching()
  .then(() => {
    console.log('\n✅ Debug testing completed')
  })
  .catch((error) => {
    console.error('❌ Debug testing failed:', error)
  })