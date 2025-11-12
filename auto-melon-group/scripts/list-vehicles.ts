import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { Vehicle } from '../types/vehicle'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function listVehicles() {
  console.log('📊 Listing all vehicles in database...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching vehicles:', error.message)
      process.exit(1)
    }

    if (!vehicles || vehicles.length === 0) {
      console.log('ℹ️  No vehicles found in database')
      return
    }

    console.log(`Found ${vehicles.length} vehicle(s):\n`)
    vehicles.forEach((vehicle: Vehicle, index: number) => {
      console.log(`${index + 1}. ${vehicle.make} ${vehicle.model}`)
      console.log(`   Year: ${vehicle.year}`)
      console.log(`   Price: €${vehicle.price}`)
      console.log(`   Mileage: ${vehicle.mileage} km`)
      console.log(`   Location: ${vehicle.location}`)
      console.log(`   Featured: ${vehicle.featured}`)
      console.log(`   ID: ${vehicle.id}`)
      console.log('')
    })

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

listVehicles()
