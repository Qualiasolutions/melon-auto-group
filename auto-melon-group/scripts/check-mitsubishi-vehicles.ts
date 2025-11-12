#!/usr/bin/env tsx

// Script to check what Mitsubishi vehicles are in the database
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkAllMitsubishiVehicles() {
  console.log('🔍 Checking all Mitsubishi vehicles in database...\n');

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('make', 'Mitsubishi')
    .order('year', { ascending: false });

  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log(`✅ Found ${data.length} Mitsubishi vehicles:`);

    data.forEach((vehicle, index) => {
      console.log(`\n${index + 1}. ${vehicle.make} ${vehicle.model} (${vehicle.year})`);
      console.log(`   Price: €${vehicle.price}`);
      console.log(`   Category: ${vehicle.category}`);
      console.log(`   Images: ${vehicle.images ? vehicle.images.length : 0} images`);
      console.log(`   Available: ${vehicle.available ? 'Yes' : 'No'}`);
      console.log(`   Featured: ${vehicle.featured ? 'Yes' : 'No'}`);

      if (vehicle.images && vehicle.images.length > 0) {
        console.log('   First 2 images:');
        vehicle.images.slice(0, 2).forEach((img, i) => {
          console.log(`     ${i + 1}. ${img.substring(0, 50)}...`);
        });
      }
    });
  } else {
    console.log('❌ No Mitsubishi vehicles found in database');
  }
}

checkAllMitsubishiVehicles();