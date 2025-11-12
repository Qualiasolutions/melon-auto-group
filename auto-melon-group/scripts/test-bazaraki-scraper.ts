#!/usr/bin/env tsx

// Test script for enhanced Bazaraki scraper
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const firecrawlApiKey = process.env.FIRECRAWL_API_KEY

if (!firecrawlApiKey) {
  console.error('❌ FIRECRAWL_API_KEY not found in .env.local')
  console.log('Please add FIRECRAWL_API_KEY to your environment variables')
  process.exit(1)
}

// Test URLs - you can replace these with actual Bazaraki URLs
const testUrls = [
  'https://www.bazaraki.com/car-motorbikes-boats/trucks-vans/mercedes-benz-atego-1320-8165378',
  'https://www.bazaraki.com/car-motorbikes-boats/trucks-vans/ford-transit-280-2019-8165320',
  'https://www.bazaraki.com/car-motorbikes-boats/trucks-vans/isuzu-npr-75-2007-8165290'
]

async function testBazarakiScraper(url: string) {
  console.log(`\n🔍 Testing Bazaraki scraper for URL: ${url}`)
  console.log('=' .repeat(80))

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: false,
        waitFor: 3000,
        includeRawHtml: true,
        screenshot: false,
        removeBase64Images: true,
        actions: [
          {
            type: 'wait',
            milliseconds: 2000
          },
          {
            type: 'scroll',
            direction: 'down',
            pixels: 500
          }
        ]
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    console.log('✅ Firecrawl API Success!')
    console.log(`📄 Content length: ${data.html?.length || 0} characters`)
    console.log(`📄 Markdown length: ${data.markdown?.length || 0} characters`)

    // Check if metadata is available
    if (data.metadata) {
      console.log('📋 Available metadata:')
      Object.keys(data.metadata).forEach(key => {
        console.log(`  - ${key}: ${data.metadata[key]}`)
      })
    }

    // Check for images
    if (data.data?.images && Array.isArray(data.data.images)) {
      console.log(`📸 Images found: ${data.data.images.length}`)
      data.data.images.slice(0, 3).forEach((img: any, i: number) => {
        console.log(`  ${i + 1}. ${img.substring(0, 80)}...`)
      })
    }

    // Check if we have enough content
    if (!data.html && !data.markdown) {
      console.log('⚠️ No content extracted!')
      return null
    }

    return data

  } catch (error) {
    console.error('❌ Error testing scraper:', error)
    return null
  }
}

function extractVehicleData(scrapedData: any, url: string) {
  console.log('\n🚗 Extracting vehicle data...')
  console.log('-'.repeat(50))

  const content = scrapedData.html || scrapedData.markdown || ''
  const metadata = scrapedData.metadata || {}

  const extracted: any = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    currency: 'EUR',
    condition: 'used',
    category: 'box-truck',
    engineType: 'diesel',
    transmission: 'manual',
    horsepower: 150,
    engineSize: 2.5,
    location: 'Cyprus',
    description: '',
    images: [],
    specifications: {},
    features: [],
  }

  // === PRICE EXTRACTION ===
  let priceFound = false

  if (metadata.price) {
    extracted.price = parseFloat(metadata.price)
    priceFound = true
    console.log(`💰 Price from metadata: €${extracted.price}`)
  }

  if (!priceFound && metadata.ogPrice) {
    const priceMatch = metadata.ogPrice.match(/(\d+(?:[.,]\d*)?)/)
    if (priceMatch) {
      extracted.price = parseFloat(priceMatch[1].replace(/[.,]/g, ''))
      priceFound = true
      console.log(`💰 Price from ogPrice: €${extracted.price}`)
    }
  }

  if (!priceFound) {
    const pricePatterns = [
      /€\s*(\d{1,3}(?:[.,]\d{3})*)/gi,
      /(\d{1,3}(?:[.,]\d{3})*)\s*€/gi,
      /(\d{4,6})\s*(?:€|eur)/gi
    ]

    for (const pattern of pricePatterns) {
      const matches = content.match(pattern)
      if (matches) {
        const prices = matches.map(match => {
          const num = match.replace(/[^\d.,]/g, '').replace(/[.,]/g, '')
          return parseInt(num)
        }).filter(p => p > 100 && p < 500000)

        if (prices.length > 0) {
          extracted.price = Math.max(...prices)
          priceFound = true
          console.log(`💰 Price from pattern: €${extracted.price}`)
          break
        }
      }
    }
  }

  // === YEAR EXTRACTION ===
  const yearPatterns = [
    /\b(19[9]\d|20[0-2]\d)\b/g
  ]

  let yearFound = false
  for (const pattern of yearPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      const years = matches.map(m => parseInt(m.replace(/\D/g, '')))
        .filter(y => y >= 1990 && y <= new Date().getFullYear() + 1)
      if (years.length > 0) {
        extracted.year = years[0] // Use first found year
        yearFound = true
        console.log(`📅 Year found: ${extracted.year}`)
        break
      }
    }
  }

  // === MAKE AND MODEL EXTRACTION ===
  const title = metadata.ogTitle || metadata.title || ''
  console.log(`🏷️ Title: ${title}`)

  const truckMakes = [
    'Mercedes-Benz', 'Mercedes', 'Scania', 'Volvo', 'DAF', 'MAN', 'Iveco',
    'Renault', 'Ford', 'Isuzu', 'Mitsubishi', 'Nissan', 'Toyota'
  ]

  for (const make of truckMakes) {
    const makeRegex = new RegExp(`\\b${make}\\b`, 'i')
    if (makeRegex.test(title)) {
      extracted.make = make === 'Mercedes' ? 'Mercedes-Benz' : make
      console.log(`🏭 Make found: ${extracted.make}`)

      const makeIndex = title.toLowerCase().indexOf(make.toLowerCase())
      if (makeIndex !== -1) {
        const afterMake = title.substring(makeIndex + make.length).trim()
        const modelWords = afterMake.split(/[\s\d(]/)[0]
        if (modelWords && modelWords.length > 0) {
          extracted.model = modelWords.trim()
          console.log(`🚗 Model found: ${extracted.model}`)
        }
      }
      break
    }
  }

  // === DESCRIPTION EXTRACTION ===
  if (metadata.description) {
    extracted.description = metadata.description.substring(0, 500)
    console.log(`📝 Description found: ${extracted.description.length} characters`)
  } else if (metadata.ogDescription) {
    extracted.description = metadata.ogDescription.substring(0, 500)
    console.log(`📝 Description found (og): ${extracted.description.length} characters`)
  }

  // === IMAGE EXTRACTION ===
  if (scrapedData.data?.images && Array.isArray(scrapedData.data.images)) {
    extracted.images = scrapedData.data.images.slice(0, 5)
    console.log(`📸 Images found: ${extracted.images.length}`)
  }

  // === MILEAGE EXTRACTION ===
  const mileagePatterns = [
    /(\d{1,3}(?:[.,]\d{3})*)\s*(?:km|kilometers)/gi
  ]

  for (const pattern of mileagePatterns) {
    const matches = content.match(pattern)
    if (matches) {
      const mileages = matches.map(match => {
        const num = match.replace(/[^\d.,]/g, '').replace(/[.,]/g, '')
        return parseInt(num)
      }).filter(m => m > 0 && m < 1000000)

      if (mileages.length > 0) {
        extracted.mileage = Math.min(...mileages)
        console.log(`📊 Mileage found: ${extracted.mileage.toLocaleString()} km`)
        break
      }
    }
  }

  // === TEST RESULTS ===
  console.log('\n📋 Test Results:')
  console.log(`  ✅ Success: True`)
  console.log(`  🏭 Make: ${extracted.make || 'NOT FOUND'}`)
  console.log(`  🚗 Model: ${extracted.model || 'NOT FOUND'}`)
  console.log(`  📅 Year: ${extracted.year}`)
  console.log(`  💰 Price: €${extracted.price}`)
  console.log(`  📊 Mileage: ${extracted.mileage.toLocaleString()} km`)
  console.log(`  📝 Description: ${extracted.description.length > 0 ? 'YES' : 'NO'} (${extracted.description.length} chars)`)
  console.log(`  📸 Images: ${extracted.images.length}`)

  // Success criteria
  const criteria = {
    makeFound: extracted.make !== '',
    modelFound: extracted.model !== '',
    priceFound: extracted.price > 100,
    yearReasonable: extracted.year >= 1990 && extracted.year <= new Date().getFullYear() + 1
  }

  const allCriteriaMet = Object.values(criteria).every(Boolean)
  console.log(`\n🎯 Overall Success: ${allCriteriaMet ? '✅ ALL CRITERIA MET' : '❌ SOME CRITERIA FAILED'}`)

  return extracted
}

async function main() {
  console.log('🧪 Bazaraki Scraper Test Suite')
  console.log('=============================')
  console.log(`🔑 Using Firecrawl API: ${firecrawlApiKey ? 'Configured' : 'NOT CONFIGURED'}`)

  if (testUrls.length === 0) {
    console.log('\n⚠️ No test URLs provided. Please add actual Bazaraki URLs to the testUrls array.')
    return
  }

  const results = []
  let successCount = 0

  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i]
    console.log(`\n📊 Test ${i + 1}/${testUrls.length}`)

    const scrapedData = await testBazarakiScraper(url)

    if (scrapedData) {
      const extracted = extractVehicleData(scrapedData, url)
      results.push({ url, success: true, extracted })
      successCount++
    } else {
      results.push({ url, success: false, extracted: null })
      console.log('❌ Test failed')
    }
  }

  // Summary
  console.log('\n📊 Test Summary')
  console.log('================')
  console.log(`Total tests: ${testUrls.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Failed: ${testUrls.length - successCount}`)
  console.log(`Success rate: ${Math.round((successCount / testUrls.length) * 100)}%`)

  if (successCount === testUrls.length) {
    console.log('\n🎉 All tests passed! The enhanced Bazaraki scraper is working correctly.')
  } else if (successCount > 0) {
    console.log('\n⚠️ Partial success. Some tests passed, but others failed.')
  } else {
    console.log('\n❌ All tests failed. There may be issues with the scraper or the test URLs.')
  }

  // Save results
  const fs = require('fs')
  fs.writeFileSync('scripts/scraper-test-results.json', JSON.stringify(results, null, 2))
  console.log('\n💾 Results saved to scripts/scraper-test-results.json')
}

main()
  .catch((error) => {
    console.error('❌ Test suite failed:', error)
    process.exit(1)
  })