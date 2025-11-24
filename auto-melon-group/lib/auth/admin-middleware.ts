import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * Middleware to verify admin authentication
 * Returns the authenticated user or null if not authenticated
 */
export async function verifyAdminAuth(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user from the session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Check if user has admin role in user metadata or a separate admin table
    // For now, we'll check if the user exists in an admin_emails list
    // You can expand this to check against a database table
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []

    if (!adminEmails.includes(user.email || '')) {
      return null
    }

    return user
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return null
  }
}

/**
 * Wrapper for admin API routes that require authentication
 * Usage: export const GET = withAdminAuth(async (request, user, context) => { ... })
 */
export function withAdminAuth(
  handler: (request: NextRequest, user: any, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const user = await verifyAdminAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    return handler(request, user, context)
  }
}

/**
 * Check if a user is an admin
 * This can be used in server components
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    return adminEmails.includes(user.email || '')
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}
