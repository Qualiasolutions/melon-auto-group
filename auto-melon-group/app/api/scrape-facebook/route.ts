import { NextRequest, NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

// Initialize Apify client
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchQuery, location, minPrice, maxPrice, maxResults = 20 } = body

    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Starting Facebook Marketplace scrape...')
    console.log('Search query:', searchQuery)
    console.log('Location:', location)
    console.log('Price range:', minPrice, '-', maxPrice)

    // Build the Facebook Marketplace search URL
    const locationSlug = location ? location.toLowerCase().replace(/\s+/g, '-') : 'cyprus'
    let searchUrl = `https://www.facebook.com/marketplace/${locationSlug}/search/?query=${encodeURIComponent(searchQuery)}`

    // Add price filters if provided
    if (minPrice) searchUrl += `&minPrice=${minPrice}`
    if (maxPrice) searchUrl += `&maxPrice=${maxPrice}`

    // Prepare input for the Facebook Marketplace scraper
    const input = {
      startUrls: [
        {
          url: searchUrl
        }
      ],
      resultsLimit: maxResults,
    }

    console.log('📋 Actor input:', input)

    // Run the actor (apify/facebook-marketplace-scraper)
    const run = await client.actor('apify/facebook-marketplace-scraper').call(input)

    console.log('✅ Actor run completed:', run.id)
    console.log('Status:', run.status)

    // Fetch the results from the dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    console.log(`📦 Found ${items.length} items`)

    // Transform the scraped data to match your vehicle schema
    const vehicles = items.map((item: any) => {
      // Extract relevant fields - adjust based on the actual structure
      // returned by the Facebook Marketplace scraper
      return {
        title: item.title || item.name || '',
        price: parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0'),
        currency: item.currency || 'EUR',
        make: extractMake(item.title || ''),
        model: extractModel(item.title || ''),
        year: extractYear(item.title || item.description || ''),
        mileage: extractMileage(item.description || ''),
        location: item.location || location || 'Cyprus',
        description: item.description || '',
        images: item.images || [],
        url: item.url || '',
        source: 'Facebook Marketplace',
        scrapedAt: new Date().toISOString(),
        // Add any additional fields from the scraper output
        rawData: item, // Keep the original data for reference
      }
    })

    return NextResponse.json({
      success: true,
      count: vehicles.length,
      vehicles,
      runId: run.id,
    })

  } catch (error: any) {
    console.error('❌ Error scraping Facebook Marketplace:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to scrape Facebook Marketplace',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}

// Helper functions to extract vehicle information
function extractMake(text: string): string {
  const makes = [
    'Mercedes-Benz', 'Mercedes', 'Scania', 'Volvo', 'DAF', 'MAN', 'Iveco',
    'Renault', 'Mitsubishi', 'Isuzu', 'Hino', 'Fuso', 'UD', 'Nissan',
    'Toyota', 'Ford', 'Freightliner', 'Kenworth', 'Peterbilt', 'Mack'
  ]

  for (const make of makes) {
    if (text.toLowerCase().includes(make.toLowerCase())) {
      return make
    }
  }

  // Try to get the first word as make
  const firstWord = text.split(/[\s-]/)[0]
  return firstWord || 'Unknown'
}

function extractModel(text: string): string {
  // Remove the make from the title to get the model
  const make = extractMake(text)
  let model = text.replace(new RegExp(make, 'i'), '').trim()

  // Clean up common patterns
  model = model.replace(/^\s*-\s*/, '')
  model = model.split(/[,\(\)]/)[0].trim()

  return model || 'Unknown'
}

function extractYear(text: string): number {
  // Look for 4-digit year (1900-2099)
  const yearMatch = text.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    return parseInt(yearMatch[0])
  }
  return new Date().getFullYear()
}

function extractMileage(text: string): number {
  // Look for mileage patterns like "150,000 km" or "150000km"
  const mileageMatch = text.match(/(\d+[,\s]?\d+)\s*(km|kilometers|miles)/i)
  if (mileageMatch) {
    const mileage = parseInt(mileageMatch[1].replace(/[,\s]/g, ''))
    // Convert miles to km if needed
    if (mileageMatch[2].toLowerCase().includes('mile')) {
      return Math.round(mileage * 1.60934)
    }
    return mileage
  }
  return 0
}
