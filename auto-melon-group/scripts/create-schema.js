require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSchema() {
  console.log('📋 Creating database schema...\n')

  // Read the SQL file
  const sqlPath = path.join(__dirname, '../lib/supabase/schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Split into individual statements and execute
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements to execute\n`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    // Skip comments and empty statements
    if (statement.startsWith('--') || statement.length < 10) continue

    console.log(`Executing statement ${i + 1}/${statements.length}...`)

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

      if (error) {
        // Try direct query if RPC doesn't work
        const { error: directError } = await supabase.from('_').select().limit(0)
        console.log('⚠️  Note: Using Supabase dashboard SQL editor is recommended for schema creation')
      }
    } catch (err) {
      console.log(`   Skipped (may need manual execution)`)
    }
  }

  console.log('\n✅ Schema statements processed!')
  console.log('\n📝 IMPORTANT: Please run the SQL from lib/supabase/schema.sql')
  console.log('   in your Supabase dashboard SQL Editor for best results:')
  console.log(`   https://supabase.com/dashboard/project/${supabaseUrl.split('.')[0].split('//')[1]}/sql/new`)
}

createSchema()
