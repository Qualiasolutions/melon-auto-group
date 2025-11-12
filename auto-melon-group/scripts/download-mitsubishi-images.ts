#!/usr/bin/env tsx

// Script to download Mitsubishi ASX images from imgbb links
import * as fs from 'fs'
import * as path from 'path'
import https from 'https'
import http from 'http'

// Image URLs provided by the user
const imageUrls = [
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
]

// Function to download an image
function downloadImage(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Convert imgbb URL to direct image URL
    const directUrl = url + '.jpg'

    const protocol = directUrl.startsWith('https') ? https : http

    protocol.get(directUrl, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          console.log(`Redirecting to: ${redirectUrl}`)
          return downloadImage(redirectUrl, filename).then(resolve).catch(reject)
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${directUrl}'. Status code: ${response.statusCode}`))
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

async function downloadAllImages() {
  console.log('🚗 Downloading Mitsubishi ASX images...\n')

  // Create images directory
  const imagesDir = path.join(__dirname, '../public/vehicles/mitsubishi-asx-2018')

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
    console.log(`📁 Created directory: ${imagesDir}`)
  }

  const downloadedFiles: string[] = []

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const filename = path.join(imagesDir, `mitsubishi-asx-2018-${String(i + 1).padStart(2, '0')}.jpg`)

    try {
      await downloadImage(url, filename)
      downloadedFiles.push(`/vehicles/mitsubishi-asx-2018/mitsubishi-asx-2018-${String(i + 1).padStart(2, '0')}.jpg`)
    } catch (error) {
      console.log(`❌ Failed to download ${url}: ${error}`)
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Total URLs: ${imageUrls.length}`)
  console.log(`   Downloaded: ${downloadedFiles.length}`)
  console.log(`   Failed: ${imageUrls.length - downloadedFiles.length}`)

  if (downloadedFiles.length > 0) {
    console.log(`\n📁 Images saved to: ${imagesDir}`)

    // Save the file paths to a JSON file for later use
    const outputPath = path.join(__dirname, 'mitsubishi-asx-2018-images.json')
    fs.writeFileSync(outputPath, JSON.stringify(downloadedFiles, null, 2))
    console.log(`💾 Image paths saved to: ${outputPath}`)

    console.log(`\n🔗 Image URLs for database:`)
    downloadedFiles.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`)
    })
  }

  return downloadedFiles
}

// Run the download
downloadAllImages()
  .then((files) => {
    console.log(`\n🎉 Successfully downloaded ${files.length} images!`)
  })
  .catch((error) => {
    console.error('❌ Error downloading images:', error)
    process.exit(1)
  })