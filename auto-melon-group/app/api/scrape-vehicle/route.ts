import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Here we'll use Firecrawl API to scrape the vehicle data
    // You'll need to add your Firecrawl API key to environment variables
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY

    if (!firecrawlApiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      )
    }

    // Call Firecrawl API
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to scrape URL')
    }

    const data = await response.json()

    // Extract vehicle information from the scraped content
    // This is a basic extraction - you may need to enhance this based on your needs
    const extractedData = extractVehicleData(data)

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('Error in scrape-vehicle API:', error)
    return NextResponse.json(
      { error: 'Failed to scrape vehicle data' },
      { status: 500 }
    )
  }
}

function extractVehicleData(scrapedData: any) {
  // Extract vehicle information from scraped content
  // This is a placeholder implementation - enhance based on actual data structure
  const content = scrapedData.markdown || scrapedData.html || ''

  const extracted: any = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    description: content.substring(0, 500), // First 500 chars as description
    images: scrapedData.images || [],
  }

  // Try to extract common patterns
  // Year pattern: 2020, 2021, etc.
  const yearMatch = content.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    extracted.year = parseInt(yearMatch[0])
  }

  // Price pattern: €50,000 or EUR 50000
  const priceMatch = content.match(/[€$£]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)|(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:EUR|USD|GBP)/)
  if (priceMatch) {
    const priceStr = (priceMatch[1] || priceMatch[2]).replace(/,/g, '')
    extracted.price = parseFloat(priceStr)
  }

  // Mileage pattern: 150,000 km or 150000km
  const mileageMatch = content.match(/(\d{1,3}(?:,\d{3})*)\s*(?:km|kilometers)/i)
  if (mileageMatch) {
    const mileageStr = mileageMatch[1].replace(/,/g, '')
    extracted.mileage = parseInt(mileageStr)
  }

  // Make and Model - try to find truck manufacturers
  const truckMakes = ['Mercedes-Benz', 'Scania', 'Volvo', 'DAF', 'MAN', 'Iveco', 'Renault', 'Ford']
  for (const make of truckMakes) {
    if (content.includes(make)) {
      extracted.make = make
      break
    }
  }

  return extracted
}
