import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { withAdminAuth } from "@/lib/auth/admin-middleware"

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { vehicleId, urls } = body

    if (!vehicleId || !urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "Vehicle ID and URLs array are required" },
        { status: 400 }
      )
    }

    // Validate URLs
    const validUrls = urls.filter((url) => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    })

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs provided" },
        { status: 400 }
      )
    }

    // Get current vehicle data
    const { data: vehicle, error: fetchError } = await supabaseAdmin
      .from("vehicles")
      .select("id, make, model, year, images")
      .eq("id", vehicleId)
      .single()

    if (fetchError || !vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }

    // Combine existing images with new URLs
    const currentImages = vehicle.images || []
    const newImages = [...currentImages, ...validUrls]

    // Update vehicle with new images
    const { error: updateError } = await supabaseAdmin
      .from("vehicles")
      .update({
        images: newImages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", vehicleId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update vehicle images" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      vehicle: {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
      },
      addedCount: validUrls.length,
      totalImages: newImages.length,
    })
  } catch (error) {
    console.error("Bulk URL upload error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
})
