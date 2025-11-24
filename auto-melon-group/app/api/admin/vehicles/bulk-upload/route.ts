import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { withAdminAuth } from "@/lib/auth/admin-middleware"

// Helper function to generate a URL-safe filename
function generateFileName(make: string, model: string, index: number, extension: string): string {
  const slug = `${make}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${slug}-${Date.now()}-${index}.${extension}`
}

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData()
    const vehicleId = formData.get("vehicleId") as string
    const files = formData.getAll("images") as File[]

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 }
      )
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
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

    // Process each file and upload to Supabase Storage
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.warn(`Skipping non-image file: ${file.name}`)
        continue
      }

      // Get file extension
      const extension = file.name.split(".").pop() || "jpg"

      // Generate unique filename
      const fileName = generateFileName(vehicle.make, vehicle.model, i + 1, extension)
      const storagePath = `${vehicleId}/${fileName}`

      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('vehicle-images')
          .upload(storagePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error(`Error uploading file ${file.name}:`, uploadError)
          continue
        }

        // Get the public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('vehicle-images')
          .getPublicUrl(uploadData.path)

        uploadedUrls.push(publicUrl)
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: "No files were successfully uploaded" },
        { status: 500 }
      )
    }

    // Combine existing images with new uploads
    const currentImages = vehicle.images || []
    const newImages = [...currentImages, ...uploadedUrls]

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
      uploadedCount: uploadedUrls.length,
      totalImages: newImages.length,
      uploadedUrls,
    })
  } catch (error) {
    console.error("Bulk file upload error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
})
