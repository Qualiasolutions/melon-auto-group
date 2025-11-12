require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function setupDatabase() {
  // Parse connection string and add SSL mode
  const connectionString = process.env.POSTGRES_URL_NON_POOLING
  const urlWithSSL = connectionString.includes('?')
    ? `${connectionString}&sslmode=require`
    : `${connectionString}?sslmode=require`

  const client = new Client({
    connectionString: urlWithSSL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('🔌 Connecting to database...\n')
    await client.connect()
    console.log('✅ Connected!\n')

    // Read and execute schema
    console.log('📋 Executing schema SQL...\n')
    const schemaSQL = fs.readFileSync(path.join(__dirname, '../lib/supabase/schema.sql'), 'utf8')

    await client.query(schemaSQL)

    console.log('✅ Schema created successfully!\n')
    console.log('📊 Database is ready with 3 sample trucks')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.message.includes('already exists')) {
      console.log('\n✅ Tables already exist! Running seed data...\n')

      // If tables exist, just add sample data
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      const sampleVehicles = [
        {
          make: 'Mercedes-Benz',
          model: 'Actros 1851 LS',
          year: 2020,
          mileage: 185000,
          price: 75000,
          currency: 'EUR',
          condition: 'used',
          category: 'semi-truck',
          engine_type: 'diesel',
          transmission: 'automated-manual',
          horsepower: 510,
          location: 'Berlin',
          country: 'Germany',
          vin: 'WDB9634161L123456',
          images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800'],
          description: 'Excellent condition Mercedes-Benz Actros with full service history. Euro 6 compliant.',
          available: true,
          featured: true,
          specifications: {
            axleConfiguration: '4x2',
            gvw: 18000,
            engineCapacity: 12.8,
            emissionStandard: 'Euro 6',
            cabType: 'Sleeper'
          }
        },
        {
          make: 'Scania',
          model: 'R 500',
          year: 2019,
          mileage: 320000,
          price: 68000,
          currency: 'EUR',
          condition: 'used',
          category: 'semi-truck',
          engine_type: 'diesel',
          transmission: 'automated-manual',
          horsepower: 500,
          location: 'Rotterdam',
          country: 'Netherlands',
          vin: 'YS2R4X20005123456',
          images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'],
          description: 'Powerful Scania R 500 in great working condition. Well maintained.',
          available: true,
          featured: true,
          specifications: {
            axleConfiguration: '6x4',
            gvw: 26000,
            engineCapacity: 16.4,
            emissionStandard: 'Euro 6'
          }
        },
        {
          make: 'Volvo',
          model: 'FH16 750',
          year: 2021,
          mileage: 95000,
          price: 95000,
          currency: 'EUR',
          condition: 'certified',
          category: 'semi-truck',
          engine_type: 'diesel',
          transmission: 'automated-manual',
          horsepower: 750,
          location: 'Stockholm',
          country: 'Sweden',
          vin: 'YV2AG40B5MA123456',
          images: ['https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800'],
          description: 'Top of the line Volvo FH16 with 750hp. Like new condition with warranty.',
          available: true,
          featured: true,
          specifications: {
            axleConfiguration: '6x4',
            gvw: 32000,
            engineCapacity: 16.1,
            emissionStandard: 'Euro 6',
            cabType: 'Globetrotter XL'
          }
        }
      ]

      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert(sampleVehicles)
        .select()

      if (insertError) {
        console.error('❌ Error inserting sample data:', insertError.message)
      } else {
        console.log('✅ Added', data.length, 'sample vehicles!')
        data.forEach(v => {
          console.log(`   • ${v.make} ${v.model} (${v.year})`)
        })
      }
    }
  } finally {
    await client.end()
  }

  console.log('\n🎉 Database setup complete!')
}

setupDatabase()
