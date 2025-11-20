import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

interface UploadResult {
  url: string
  path: string
  error?: string
}

/**
 * Downloads an image from a URL and uploads it to Supabase Storage
 * @param imageUrl - The external image URL to download
 * @param vehicleId - Optional vehicle ID for organizing images
 * @returns Public URL of the uploaded image
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  vehicleId?: string
): Promise<UploadResult> {
  try {
    console.log('📥 Downloading image:', imageUrl)

    // Download the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }

    // Get the image as a blob
    const blob = await response.blob()

    // Validate it's an image
    if (!blob.type.startsWith('image/')) {
      throw new Error(`Invalid image type: ${blob.type}`)
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = blob.type.split('/')[1] || 'jpg'
    const filename = vehicleId
      ? `${vehicleId}/${timestamp}-${random}.${ext}`
      : `${timestamp}-${random}.${ext}`

    console.log('📤 Uploading to Supabase Storage:', filename)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('vehicle-images')
      .upload(filename, blob, {
        contentType: blob.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('vehicle-images')
      .getPublicUrl(data.path)

    console.log('✅ Image uploaded successfully:', publicUrl)

    return {
      url: publicUrl,
      path: data.path
    }

  } catch (error) {
    console.error('❌ Image upload failed:', error)
    return {
      url: imageUrl, // Fallback to original URL
      path: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Downloads and uploads multiple images in parallel
 * @param imageUrls - Array of external image URLs
 * @param vehicleId - Optional vehicle ID for organizing images
 * @returns Array of public URLs
 */
export async function downloadAndUploadImages(
  imageUrls: string[],
  vehicleId?: string
): Promise<string[]> {
  console.log(`📥 Processing ${imageUrls.length} images...`)

  const uploadPromises = imageUrls.map(url =>
    downloadAndUploadImage(url, vehicleId)
  )

  const results = await Promise.allSettled(uploadPromises)

  const successfulUploads = results
    .filter((result): result is PromiseFulfilledResult<UploadResult> =>
      result.status === 'fulfilled'
    )
    .map(result => result.value.url)

  console.log(`✅ Successfully processed ${successfulUploads.length}/${imageUrls.length} images`)

  return successfulUploads
}

/**
 * Delete an image from Supabase Storage
 * @param path - The storage path of the image
 */
export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage
      .from('vehicle-images')
      .remove([path])

    if (error) {
      throw error
    }

    console.log('✅ Image deleted:', path)
    return true

  } catch (error) {
    console.error('❌ Image deletion failed:', error)
    return false
  }
}

/**
 * Delete multiple images from Supabase Storage
 * @param paths - Array of storage paths
 */
export async function deleteImages(paths: string[]): Promise<number> {
  try {
    const { error } = await supabaseAdmin.storage
      .from('vehicle-images')
      .remove(paths)

    if (error) {
      throw error
    }

    console.log(`✅ Deleted ${paths.length} images`)
    return paths.length

  } catch (error) {
    console.error('❌ Bulk image deletion failed:', error)
    return 0
  }
}
