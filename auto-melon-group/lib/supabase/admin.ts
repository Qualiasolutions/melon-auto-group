import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Admin client with service role key for server-side operations
// This bypasses RLS policies and should ONLY be used in admin contexts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found - admin operations may fail')
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
