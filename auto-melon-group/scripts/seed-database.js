require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Get environment variables from Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'placeholder') {
  console.error('❌ Supabase credentials not found!')
  console.log('Run: vercel env pull .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('🌱 Seeding database with sample trucks...\n')

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

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(sampleVehicles)
      .select()

    if (error) {
      console.error('❌ Error inserting data:', error)
      process.exit(1)
    }

    console.log('✅ Successfully inserted', data.length, 'vehicles!\n')
    data.forEach(v => {
      console.log(`   • ${v.make} ${v.model} (${v.year}) - ${v.price} ${v.currency}`)
    })
    console.log('\n🎉 Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seedDatabase()
