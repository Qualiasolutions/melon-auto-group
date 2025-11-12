require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')

async function executeSQLViaAPI() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  console.log('📋 Reading schema SQL...\n')
  const schemaSQL = fs.readFileSync(
    path.join(__dirname, '../lib/supabase/schema.sql'),
    'utf8'
  )

  console.log('🔌 Executing SQL via Supabase REST API...\n')

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: schemaSQL
      })
    })

    const result = await response.text()
    console.log('Response status:', response.status)
    console.log('Response:', result)

    if (response.ok) {
      console.log('\n✅ SQL executed successfully!')
      console.log('📊 Database is ready!')
    } else {
      console.log('\n⚠️  API approach may not work - let\'s use Supabase client instead')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Alternative: Execute SQL manually in Supabase Dashboard')
    console.log(`   URL: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new`)
  }
}

executeSQLViaAPI()
