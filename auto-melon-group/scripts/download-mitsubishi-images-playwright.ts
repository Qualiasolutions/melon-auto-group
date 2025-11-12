#!/usr/bin/env tsx

// Script to download Mitsubishi images from imgbb using Playwright
import * as fs from 'fs'
import * as path from 'path'
import https from 'https'

// Image URLs organized by vehicle
const vehicles = {
  '2018-mitsubishi-asx': [
    'https://ibb.co/PGpbJmdd',
    'https://ibb.co/d0PS2fvK',
    'https://ibb.co/BvYtLSv',
    'https://ibb.co/vCYLbxLF',
    'https://ibb.co/gZRyQ6TD',
    'https://ibb.co/v91R6Dd',
    'https://ibb.co/Zp6j2HHb',
    'https://ibb.co/rRYkcV7r',
    'https://ibb.co/B5m5z6m5',
    'https://ibb.co/nNwx9HZG',
    'https://ibb.co/xqFP2CNk',
    'https://ibb.co/Qvymkqdd',
    'https://ibb.co/XfdbFfzx',
    'https://ibb.co/939ngDyX',
    'https://ibb.co/1t86YH5F',
    'https://ibb.co/35b4Cnwm',
    'https://ibb.co/dw8m8hwk',
    'https://ibb.co/vvPtXhj1'
  ],
  '2020-mitsubishi-l200': [
    'https://ibb.co/Z6mrFhNH',
    'https://ibb.co/cK843NCV',
    'https://ibb.co/zvP47HB',
    'https://ibb.co/TqTLVcdz',
    'https://ibb.co/xSnv6Pyf',
    'https://ibb.co/qMR0vD8d',
    'https://ibb.co/jZ5cTKDH',
    'https://ibb.co/kLkTYDh'
  ],
  '2017-mitsubishi-l200': [
    'https://ibb.co/fGLGGM5H',
    'https://ibb.co/8gyrMJr1',
    'https://ibb.co/vxT9sNmL',
    'https://ibb.co/CKGXspVY',
    'https://ibb.co/Tqckm41S',
    'https://ibb.co/dHMdrRw',
    'https://ibb.co/235vW6PK',
    'https://ibb.co/4RHgmx1w'
  ]
}

// Function to download an image from a direct URL
function downloadFromUrl(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : https

    protocol.get(url, (response) => {
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

// For now, let's create placeholder URLs based on the imgbb links
// These will be converted to proper image URLs later
function processImages() {
  console.log('🚗 Processing Mitsubishi vehicle images...\n')

  const results: { [key: string]: string[] } = {}

  Object.entries(vehicles).forEach(([vehicleKey, urls]) => {
    console.log(`\n📸 Processing ${vehicleKey}:`)

    // Create directory for this vehicle
    const imagesDir = path.join(__dirname, '../public/vehicles', vehicleKey)
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
      console.log(`📁 Created directory: ${imagesDir}`)
    }

    // Create placeholder image URLs
    const imageUrls = urls.map((url, index) => {
      // Convert to a format that might work
      const imageUrl = url + '.jpg'
      const filename = `${vehicleKey}-${String(index + 1).padStart(2, '0')}.jpg`
      const filepath = path.join(imagesDir, filename)
      const publicPath = `/vehicles/${vehicleKey}/${filename}`

      return publicPath
    })

    results[vehicleKey] = imageUrls
    console.log(`   Generated ${imageUrls.length} image paths`)
  })

  // Save the results to a JSON file
  const outputPath = path.join(__dirname, 'mitsubishi-image-urls.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\n💾 Image URLs saved to: ${outputPath}`)

  console.log(`\n🔗 Generated Image URLs:`)
  Object.entries(results).forEach(([vehicle, urls]) => {
    console.log(`\n${vehicle}:`)
    urls.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`)
    })
  })

  return results
}

// Run the processing
processImages()