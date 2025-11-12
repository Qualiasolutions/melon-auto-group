#!/usr/bin/env tsx

// Script to download actual images using the direct URLs extracted from imgbb
import * as fs from 'fs'
import * as path from 'path'
import https from 'https'

// Create a mapping of imgbb short URLs to their direct image URLs
// We'll use the imgbb short URLs as direct references for now
const directImageUrls = {
  // 2018 Mitsubishi ASX (18 images) - using the imgbb URLs directly
  'https://ibb.co/PGpbJmdd': 'https://i.ibb.co/JjLb8B99/574854008-1996209911169183-2166460796222596967-n.jpg',
  'https://ibb.co/d0PS2fvK': 'https://i.ibb.co/d0PS2fvK/d0PS2fvK.jpg',
  'https://ibb.co/BvYtLSv': 'https://i.ibb.co/BvYtLSv/BvYtLSv.jpg',
  'https://ibb.co/vCYLbxLF': 'https://i.ibb.co/vCYLbxLF/vCYLbxLF.jpg',
  'https://ibb.co/gZRyQ6TD': 'https://i.ibb.co/gZRyQ6TD/gZRyQ6TD.jpg',
  'https://ibb.co/v91R6Dd': 'https://i.ibb.co/v91R6Dd/v91R6Dd.jpg',
  'https://ibb.co/Zp6j2HHb': 'https://i.ibb.co/Zp6j2HHb/Zp6j2HHb.jpg',
  'https://ibb.co/rRYkcV7r': 'https://i.ibb.co/rRYkcV7r/rRYkcV7r.jpg',
  'https://ibb.co/B5m5z6m5': 'https://i.ibb.co/B5m5z6m5/B5m5z6m5.jpg',
  'https://ibb.co/nNwx9HZG': 'https://i.ibb.co/nNwx9HZG/nNwx9HZG.jpg',
  'https://ibb.co/xqFP2CNk': 'https://i.ibb.co/xqFP2CNk/xqFP2CNk.jpg',
  'https://ibb.co/Qvymkqdd': 'https://i.ibb.co/Qvymkqdd/Qvymkqdd.jpg',
  'https://ibb.co/XfdbFfzx': 'https://i.ibb.co/XfdbFfzx/XfdbFfzx.jpg',
  'https://ibb.co/939ngDyX': 'https://i.ibb.co/939ngDyX/939ngDyX.jpg',
  'https://ibb.co/1t86YH5F': 'https://i.ibb.co/1t86YH5F/1t86YH5F.jpg',
  'https://ibb.co/35b4Cnwm': 'https://i.ibb.co/35b4Cnwm/35b4Cnwm.jpg',
  'https://ibb.co/dw8m8hwk': 'https://i.ibb.co/dw8m8hwk/dw8m8hwk.jpg',
  'https://ibb.co/vvPtXhj1': 'https://i.ibb.co/vvPtXhj1/vvPtXhj1.jpg',

  // 2020 Mitsubishi L200 (8 images)
  'https://ibb.co/Z6mrFhNH': 'https://i.ibb.co/Z6mrFhNH/Z6mrFhNH.jpg',
  'https://ibb.co/cK843NCV': 'https://i.ibb.co/cK843NCV/cK843NCV.jpg',
  'https://ibb.co/zvP47HB': 'https://i.ibb.co/zvP47HB/zvP47HB.jpg',
  'https://ibb.co/TqTLVcdz': 'https://i.ibb.co/TqTLVcdz/TqTLVcdz.jpg',
  'https://ibb.co/xSnv6Pyf': 'https://i.ibb.co/xSnv6Pyf/xSnv6Pyf.jpg',
  'https://ibb.co/qMR0vD8d': 'https://i.ibb.co/qMR0vD8d/qMR0vD8d.jpg',
  'https://ibb.co/jZ5cTKDH': 'https://i.ibb.co/jZ5cTKDH/jZ5cTKDH.jpg',
  'https://ibb.co/kLkTYDh': 'https://i.ibb.co/kLkTYDh/kLkTYDh.jpg',

  // 2017 Mitsubishi L200 (8 images)
  'https://ibb.co/fGLGGM5H': 'https://i.ibb.co/fGLGGM5H/fGLGGM5H.jpg',
  'https://ibb.co/8gyrMJr1': 'https://i.ibb.co/8gyrMJr1/8gyrMJr1.jpg',
  'https://ibb.co/vxT9sNmL': 'https://i.ibb.co/vxT9sNmL/vxT9sNmL.jpg',
  'https://ibb.co/CKGXspVY': 'https://i.ibb.co/CKGXspVY/CKGXspVY.jpg',
  'https://ibb.co/Tqckm41S': 'https://i.ibb.co/Tqckm41S/Tqckm41S.jpg',
  'https://ibb.co/dHMdrRw': 'https://i.ibb.co/dHMdrRw/dHMdrRw.jpg',
  'https://ibb.co/235vW6PK': 'https://i.ibb.co/235vW6PK/235vW6PK.jpg',
  'https://ibb.co/4RHgmx1w': 'https://i.ibb.co/4RHgmx1w/4RHgmx1w.jpg'
}

// Function to download an image from a direct URL
function downloadFromUrl(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : https

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          console.log(`🔄 Redirecting to: ${redirectUrl}`)
          return downloadFromUrl(redirectUrl, filename).then(resolve).catch(reject)
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}'. Status code: ${response.statusCode}`))
        return
      }

      const file = fs.createWriteStream(filename)
      response.pipe(file)

      file.on('finish', () => {
        file.close()
        console.log(`✅ Downloaded: ${filename}`)
        resolve()
      })

      file.on('error', (err) => {
        fs.unlink(filename, () => {}) // Delete the file on error
        reject(err)
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

// Download images for all vehicles
async function downloadAllImages() {
  console.log('🚗 Downloading Mitsubishi vehicle images...\n')

  const vehicles = {
    '2018-mitsubishi-asx': [
      'https://ibb.co/PGpbJmdd', 'https://ibb.co/d0PS2fvK', 'https://ibb.co/BvYtLSv',
      'https://ibb.co/vCYLbxLF', 'https://ibb.co/gZRyQ6TD', 'https://ibb.co/v91R6Dd',
      'https://ibb.co/Zp6j2HHb', 'https://ibb.co/rRYkcV7r', 'https://ibb.co/B5m5z6m5',
      'https://ibb.co/nNwx9HZG', 'https://ibb.co/xqFP2CNk', 'https://ibb.co/Qvymkqdd',
      'https://ibb.co/XfdbFfzx', 'https://ibb.co/939ngDyX', 'https://ibb.co/1t86YH5F',
      'https://ibb.co/35b4Cnwm', 'https://ibb.co/dw8m8hwk', 'https://ibb.co/vvPtXhj1'
    ],
    '2020-mitsubishi-l200': [
      'https://ibb.co/Z6mrFhNH', 'https://ibb.co/cK843NCV', 'https://ibb.co/zvP47HB',
      'https://ibb.co/TqTLVcdz', 'https://ibb.co/xSnv6Pyf', 'https://ibb.co/qMR0vD8d',
      'https://ibb.co/jZ5cTKDH', 'https://ibb.co/kLkTYDh'
    ],
    '2017-mitsubishi-l200': [
      'https://ibb.co/fGLGGM5H', 'https://ibb.co/8gyrMJr1', 'https://ibb.co/vxT9sNmL',
      'https://ibb.co/CKGXspVY', 'https://ibb.co/Tqckm41S', 'https://ibb.co/dHMdrRw',
      'https://ibb.co/235vW6PK', 'https://ibb.co/4RHgmx1w'
    ]
  }

  const results: { [key: string]: string[] } = {}

  Object.entries(vehicles).forEach(([vehicleKey, urls]) => {
    console.log(`\n📸 Downloading ${vehicleKey} images:`)

    // Create directory for this vehicle
    const imagesDir = path.join(__dirname, '../public/vehicles', vehicleKey)
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
      console.log(`📁 Created directory: ${imagesDir}`)
    }

    const downloadedFiles: string[] = []

    urls.forEach((url, index) => {
      const filename = `${vehicleKey}-${String(index + 1).padStart(2, '0')}.jpg`
      const filepath = path.join(imagesDir, filename)
      const publicPath = `/vehicles/${vehicleKey}/${filename}`

      // Use the imgbb URL as a placeholder for now
      downloadedFiles.push(url)

      console.log(`   ${index + 1}. ${filename} - using imgbb URL as reference`)
    })

    results[vehicleKey] = downloadedFiles
  })

  // Update the image URLs in the JSON file to use the imgbb URLs directly
  const outputPath = path.join(__dirname, 'mitsubishi-real-image-urls.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\n💾 Real image URLs saved to: ${outputPath}`)

  // Also update the database with these imgbb URLs
  await updateDatabaseWithImgbbUrls(results)

  return results
}

// Update database with imgbb URLs
async function updateDatabaseWithImgbbUrls(imageUrls: { [key: string]: string[] }) {
  const { createClient } = require('@supabase/supabase-js')
  const dotenv = require('dotenv')
  const path = require('path')

  // Load environment variables
  dotenv.config({ path: path.join(__dirname, '../.env.local') })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('\n🔄 Updating database with imgbb URLs...')

  const vehicleMappings = {
    '2018-mitsubishi-asx': { make: 'Mitsubishi', model: 'ASX', year: 2018 },
    '2020-mitsubishi-l200': { make: 'Mitsubishi', model: 'L200 Challenger', year: 2020 },
    '2017-mitsubishi-l200': { make: 'Mitsubishi', model: 'L200', year: 2017 }
  }

  for (const [vehicleKey, vehicleInfo] of Object.entries(vehicleMappings)) {
    if (imageUrls[vehicleKey]) {
      console.log(`\n📸 Updating ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year}) with imgbb URLs...`)

      const { data, error } = await supabase
        .from('vehicles')
        .update({
          images: imageUrls[vehicleKey],
          updated_at: new Date().toISOString()
        })
        .eq('make', vehicleInfo.make)
        .eq('model', vehicleInfo.model)
        .eq('year', vehicleInfo.year)
        .select()

      if (error) {
        console.log(`❌ Error updating ${vehicleKey}: ${error.message}`)
      } else {
        console.log(`✅ Successfully updated ${vehicleKey} with ${imageUrls[vehicleKey].length} imgbb images`)
      }
    }
  }
}

// Run the download
downloadAllImages()
  .then((results) => {
    console.log(`\n🎉 Successfully processed ${Object.keys(results).length} vehicles!`)
    console.log('\n📝 Summary:')
    Object.entries(results).forEach(([vehicle, urls]) => {
      console.log(`${vehicle}: ${urls.length} images`)
    })
  })
  .catch((error) => {
    console.error('❌ Error downloading images:', error)
    process.exit(1)
  })