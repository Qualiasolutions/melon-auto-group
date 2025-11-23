import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to generate a URL-safe filename
function generateFileName(make: string, model: string, index: number, extension: string): string {
  const slug = `${make}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${slug}-${Date.now()}-${index}.${extension}`
}

export async function POST(request: NextRequest) {
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
    const { data: vehicle, error: fetchError } = await supabase
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

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "images", "vehicles")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Process each file
    const uploadedPaths: string[] = []

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
      const filePath = path.join(uploadDir, fileName)

      try {
        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Store the public URL path
        uploadedPaths.push(`/images/vehicles/${fileName}`)
      } catch (fileError) {
        console.error(`Error saving file ${file.name}:`, fileError)
      }
    }

    if (uploadedPaths.length === 0) {
      return NextResponse.json(
        { error: "No files were successfully uploaded" },
        { status: 500 }
      )
    }

    // Combine existing images with new uploads
    const currentImages = vehicle.images || []
    const newImages = [...currentImages, ...uploadedPaths]

    // Update vehicle with new images
    const { error: updateError } = await supabase
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
      uploadedCount: uploadedPaths.length,
      totalImages: newImages.length,
      uploadedPaths,
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
}
