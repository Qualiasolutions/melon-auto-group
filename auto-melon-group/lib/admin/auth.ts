import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  name: string
  created_at: string
  last_sign_in_at?: string
}

export interface AdminSession {
  user: AdminUser
  token: string
  expires_at: number
}

// Admin credentials (in production, use proper auth providers)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@automelon.com',
  password: process.env.ADMIN_PASSWORD || 'admin123456'
}

/**
 * Verify admin session from cookies
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    // Decode JWT token (basic validation)
    const parts = sessionToken.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp < now) {
      return null
    }

    // Verify user exists and is admin
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', payload.sub)
      .single()

    if (error || !user || !user.is_active) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      },
      token: sessionToken,
      expires_at: payload.exp
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

/**
 * Authenticate admin user
 */
export async function authenticateAdmin(email: string, password: string): Promise<AdminSession | null> {
  try {
    // Validate credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return null
    }

    // Create or update admin user
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .upsert({
        email,
        name: 'Admin User',
        role: 'admin',
        is_active: true,
        last_sign_in_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error || !user) {
      console.error('Admin user creation error:', error)
      return null
    }

    // Create session token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    const token = `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(JSON.stringify(payload)).toString('base64')}.${Buffer.from('signature').toString('base64')}`

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      },
      token,
      expires_at: payload.exp
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(session: AdminSession): Promise<void> {
  const cookieStore = cookies()
  cookieStore.set('admin_session', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })
}

/**
 * Clear admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete('admin_session')
}

/**
 * Get Supabase admin client for CRUD operations
 */
export function getSupabaseAdmin() {
  return supabaseAdmin
}

/**
 * Create admin users table if it doesn't exist
 */
export async function ensureAdminUsersTable(): Promise<void> {
  try {
    const { error } = await supabaseAdmin.rpc('create_admin_users_table')
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating admin users table:', error)
    }
  } catch (error) {
    // Table might already exist, continue
  }
}

// Initialize admin table on module load
ensureAdminUsersTable().catch(console.error)