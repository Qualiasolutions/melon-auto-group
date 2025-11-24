import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { withAdminAuth } from '@/lib/auth/admin-middleware'
import { z } from 'zod'

// Validation schema for vehicle creation
const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  mileage: z.number().int().min(0),
  price: z.number().min(0),
  currency: z.enum(['EUR', 'USD']).default('EUR'),
  condition: z.enum(['new', 'used', 'certified']),
  category: z.string().min(1),
  engineType: z.string().optional(),
  transmission: z.string().optional(),
  horsepower: z.number().int().min(0).optional(),
  location: z.string().min(1),
  country: z.string().min(1),
  vin: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  specifications: z.record(z.any()).optional(),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
})

// GET - List all vehicles (admin view)
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vehicles:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
})

// POST - Create new vehicle
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createVehicleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Convert camelCase to snake_case for database
    const dbData = {
      make: validatedData.make,
      model: validatedData.model,
      year: validatedData.year,
      mileage: validatedData.mileage,
      price: validatedData.price,
      currency: validatedData.currency,
      condition: validatedData.condition,
      category: validatedData.category,
      engine_type: validatedData.engineType,
      transmission: validatedData.transmission,
      horsepower: validatedData.horsepower,
      location: validatedData.location,
      country: validatedData.country,
      vin: validatedData.vin,
      images: validatedData.images,
      specifications: validatedData.specifications,
      features: validatedData.features,
      description: validatedData.description,
      available: validatedData.available,
      featured: validatedData.featured,
    }

    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      console.error('Error creating vehicle:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
})
