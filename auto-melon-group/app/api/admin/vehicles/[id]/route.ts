import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { withAdminAuth } from '@/lib/auth/admin-middleware'

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = value
  }
  return result
}

// Helper function to convert snake_case to camelCase
function toCamelCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = value
  }
  return result
}

// GET - Get single vehicle
export const GET = withAdminAuth(async (
  request: NextRequest,
  user: any,
  context?: { params: Promise<{ id: string }> }
) => {
  try {
    // Handle params from context (Next.js 15+ pattern)
    const params = context?.params || (request as any).params
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert snake_case to camelCase
    const mappedData = toCamelCase(data)

    return NextResponse.json({ data: mappedData }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
})

// PATCH - Update vehicle
export const PATCH = withAdminAuth(async (
  request: NextRequest,
  user: any,
  context?: { params: Promise<{ id: string }> }
) => {
  try {
    // Handle params from context (Next.js 15+ pattern)
    const params = context?.params || (request as any).params
    const { id } = await params
    const body = await request.json()

    // Convert camelCase to snake_case for database
    const dbData = toSnakeCase(body)

    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
})

// DELETE - Delete vehicle
export const DELETE = withAdminAuth(async (
  request: NextRequest,
  user: any,
  context?: { params: Promise<{ id: string }> }
) => {
  try {
    // Handle params from context (Next.js 15+ pattern)
    const params = context?.params || (request as any).params
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
})
