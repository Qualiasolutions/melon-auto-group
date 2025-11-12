import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { Vehicle } from '../types/vehicle'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function removeVehicles() {
  console.log('🗑️  Removing incorrect vehicles...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for delete operations

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Vehicle IDs to remove (from list-vehicles output)
    const vehicleIds = [
      'f4db6583-a525-4ad4-b116-06732b3e42e2', // Scania R 500
      '018b8beb-0265-4a68-bd46-d6798b399a3f', // Volvo FH16 750
      '1cf875ba-b152-4dcf-9203-62a1a5d62c03', // Mercedes-Benz Actros 1851 LS
    ]

    // First, find the vehicles to confirm
    console.log('🔍 Finding vehicles to remove...')
    const { data: vehicles, error: findError } = await supabase
      .from('vehicles')
      .select('*')
      .in('id', vehicleIds)

    if (findError) {
      console.error('❌ Error finding vehicles:', findError.message)
      process.exit(1)
    }

    if (!vehicles || vehicles.length === 0) {
      console.log('ℹ️  No matching vehicles found')
      return
    }

    console.log(`\n📊 Found ${vehicles.length} vehicle(s) to remove:`)
    vehicles.forEach((vehicle: Vehicle) => {
      console.log(`   - ${vehicle.make} ${vehicle.model} (${vehicle.year}) - €${vehicle.price} - ${vehicle.location}`)
    })

    // Delete the vehicles
    console.log('\n🗑️  Deleting vehicles...')

    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .in('id', vehicleIds)

    if (deleteError) {
      console.error('❌ Error deleting vehicles:', deleteError.message)
      process.exit(1)
    }

    console.log('✅ Successfully removed all vehicles')

    // Verify deletion
    console.log('\n🔍 Verifying deletion...')
    const { count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Remaining vehicles in database: ${count || 0}`)

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

removeVehicles()
