require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function setupDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  // Create client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('📋 Reading and executing schema SQL...\n')

  const schemaSQL = fs.readFileSync(
    path.join(__dirname, '../lib/supabase/schema.sql'),
    'utf8'
  )

  // Split SQL into individual statements
  const statements = schemaSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    if (statement.length < 10) continue

    console.log(`[${i + 1}/${statements.length}] Executing...`)

    try {
      // Try to execute using rpc
      const { data, error } = await supabase.rpc('exec', {
        sql: statement + ';'
      })

      if (error) {
        console.log(`   ⚠️  ${error.message}`)
        errorCount++
      } else {
        console.log('   ✅ Success')
        successCount++
      }
    } catch (err) {
      console.log(`   ⚠️  ${err.message}`)
      errorCount++
    }
  }

  console.log(`\n📊 Summary: ${successCount} succeeded, ${errorCount} failed/skipped`)
  console.log('\n💡 Note: Some statements may need to be run manually in Supabase Dashboard SQL Editor:')
  console.log(`   ${supabaseUrl}/project/_/sql/new`)
  console.log('\n🎉 Setup process complete!')
}

setupDatabase()
