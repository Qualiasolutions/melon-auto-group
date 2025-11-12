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

    // Detect platform
    const platform = detectPlatform(url)

    if (!platform) {
      return NextResponse.json(
        { error: 'Unsupported platform. Please use Bazaraki or Facebook Marketplace URLs.' },
        { status: 400 }
      )
    }

    // Use Firecrawl API to scrape the vehicle data
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY

    if (!firecrawlApiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured. Please add FIRECRAWL_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    // Call Firecrawl API with enhanced options
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
        waitFor: 2000, // Wait for dynamic content to load
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Firecrawl API error:', errorText)
      throw new Error(`Failed to scrape URL: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract vehicle information based on platform
    const extractedData = platform === 'bazaraki'
      ? extractBazarakiData(data)
      : extractFacebookMarketplaceData(data)

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('Error in scrape-vehicle API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scrape vehicle data' },
      { status: 500 }
    )
  }
}

function detectPlatform(url: string): 'bazaraki' | 'facebook' | null {
  const urlLower = url.toLowerCase()
  if (urlLower.includes('bazaraki.com')) return 'bazaraki'
  if (urlLower.includes('facebook.com/marketplace')) return 'facebook'
  return null
}

function extractBazarakiData(scrapedData: any) {
  const content = scrapedData.markdown || scrapedData.html || ''
  const text = content.toLowerCase()
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
    horsepower: 0,
    engineSize: 0,
    location: 'Cyprus',
    country: 'Cyprus',
    description: '',
    images: [],
    specifications: {},
    features: [],
  }

  // Extract price from metadata first (most reliable)
  if (metadata.price) {
    extracted.price = parseFloat(metadata.price)
  } else {
    // Fallback: Extract from content - Bazaraki format: €18,000 or 18000
    const priceMatch = content.match(/€\s*(\d{1,3}(?:[,.\s]\d{3})*)/i) || content.match(/(\d{4,})\s*€/i)
    if (priceMatch) {
      extracted.price = parseInt(priceMatch[1].replace(/[,\s.]/g, ''))
    }
  }

  // Extract currency
  if (metadata.priceCurrency) {
    extracted.currency = metadata.priceCurrency
  }

  // Extract description from metadata (cleaner)
  if (metadata.description || metadata.ogDescription) {
    extracted.description = metadata.description || metadata.ogDescription
  }

  // Extract title from metadata
  const title = metadata.ogTitle || metadata.title || ''

  // Extract year from title or content - 4-digit year between 1990-2027
  const yearMatch = title.match(/\b(19[9]\d|20[0-2]\d)\b/) || content.match(/\b(19[9]\d|20[0-2]\d)\b/)
  if (yearMatch) {
    extracted.year = parseInt(yearMatch[0])
  }

  // Extract mileage - "128000 kilometers" or "245,000 km"
  const mileageMatch = content.match(/(\d{1,3}(?:[,\s]\d{3})*)\s*(?:km|kilometers|klm)/i) || content.match(/(\d+)k\s*(?:km|klm)/i)
  if (mileageMatch) {
    const mileageStr = mileageMatch[1].replace(/[,\s]/g, '')
    extracted.mileage = parseInt(mileageStr) * (mileageMatch[0].includes('k') ? 1000 : 1)
  }

  // Extract horsepower - "150 hp" or "150hp"
  const horsepowerMatch = content.match(/(\d+)\s*(?:hp|bhp|ps)/i)
  if (horsepowerMatch) {
    extracted.horsepower = parseInt(horsepowerMatch[1])
  }

  // Extract engine size - "2,0l" or "3.0L" or "2.0 liter"
  const engineSizeMatch = title.match(/(\d+)[,.](\d+)\s*[lL]/i) || content.match(/(\d+)[,.](\d+)\s*(?:l|liter|litre)/i)
  if (engineSizeMatch) {
    extracted.engineSize = parseFloat(`${engineSizeMatch[1]}.${engineSizeMatch[2]}`)
  }

  // Extract make and model from title (most reliable)
  const truckMakes = [
    'Mercedes-Benz', 'Mercedes', 'Scania', 'Volvo', 'DAF', 'MAN', 'Iveco',
    'Renault', 'Ford', 'Isuzu', 'Mitsubishi', 'Fuso', 'Hino', 'Freightliner'
  ]

  // Try title first (e.g., "Ford transit 2,0l 2021")
  for (const make of truckMakes) {
    const makeRegex = new RegExp(`\\b${make}\\b`, 'i')
    if (makeRegex.test(title)) {
      extracted.make = make === 'Mercedes' ? 'Mercedes-Benz' : make

      // Extract model from title after make
      const titleLower = title.toLowerCase()
      const makeIndex = titleLower.indexOf(make.toLowerCase())
      if (makeIndex !== -1) {
        const afterMake = title.substring(makeIndex + make.length).trim()
        // Take first part before numbers/symbols (e.g., "transit" from "transit 2,0l 2021")
        const modelMatch = afterMake.match(/^([A-Za-z][A-Za-z0-9\s-]*?)(?:\s+\d|€|$)/i)
        if (modelMatch) {
          extracted.model = modelMatch[1].trim()
        }
      }
      break
    }
  }

  // Fallback: try content if not found in title
  if (!extracted.make) {
    for (const make of truckMakes) {
      const makeRegex = new RegExp(`\\b${make}\\b`, 'i')
      if (makeRegex.test(content)) {
        extracted.make = make === 'Mercedes' ? 'Mercedes-Benz' : make

        // Try to extract model after make
        const modelMatch = content.match(new RegExp(`${make}\\s+([A-Za-z0-9\\s-]+)`, 'i'))
        if (modelMatch) {
          // Clean up model (take first 2-3 words after make)
          const modelParts = modelMatch[1].trim().split(/[\s,\n]/).filter(p => p.length > 0)
          extracted.model = modelParts.slice(0, 2).join(' ')
        }
        break
      }
    }
  }

  // Extract transmission
  if (text.includes('automatic') || text.includes('auto')) {
    extracted.transmission = 'automatic'
  } else if (text.includes('manual')) {
    extracted.transmission = 'manual'
  }

  // Extract engine type
  if (text.includes('diesel')) {
    extracted.engineType = 'diesel'
  } else if (text.includes('electric')) {
    extracted.engineType = 'electric'
  } else if (text.includes('hybrid')) {
    extracted.engineType = 'hybrid'
  }

  // Extract location
  const locationMatch = content.match(/(?:Location|Area|City):\s*([^\n,]+)/i)
  if (locationMatch) {
    extracted.location = locationMatch[1].trim()
  }

  // Extract description (first paragraph or main content)
  const descLines = content.split('\n').filter(line => line.trim().length > 50)
  if (descLines.length > 0) {
    extracted.description = descLines.slice(0, 3).join('\n').substring(0, 1000)
  }

  // Extract images
  if (scrapedData.data?.images) {
    extracted.images = scrapedData.data.images.slice(0, 10)
  }

  // Extract features from bullet points
  const featureMatches = content.match(/[•\-\*]\s*([^\n]+)/g)
  if (featureMatches) {
    extracted.features = featureMatches
      .map(f => f.replace(/[•\-\*]\s*/, '').trim())
      .filter(f => f.length > 3 && f.length < 100)
      .slice(0, 10)
  }

  return extracted
}

function extractFacebookMarketplaceData(scrapedData: any) {
  const content = scrapedData.markdown || scrapedData.html || ''
  const text = content.toLowerCase()

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
    horsepower: 0,
    engineSize: 0,
    location: 'Cyprus',
    country: 'Cyprus',
    description: '',
    images: [],
    specifications: {},
    features: [],
  }

  // Facebook Marketplace price patterns
  const priceMatch = content.match(/€(\d{1,3}(?:[,\s]\d{3})*)/i) || content.match(/(\d{4,})\s*EUR/i)
  if (priceMatch) {
    extracted.price = parseInt(priceMatch[1].replace(/[,\s]/g, ''))
  }

  // Extract year
  const yearMatch = content.match(/\b(19[9]\d|20[0-2]\d)\b/)
  if (yearMatch) {
    extracted.year = parseInt(yearMatch[0])
  }

  // Extract mileage
  const mileageMatch = content.match(/(\d{1,3}(?:[,\s]\d{3})*)\s*(?:km|kilometers)/i)
  if (mileageMatch) {
    extracted.mileage = parseInt(mileageMatch[1].replace(/[,\s]/g, ''))
  }

  // Extract make and model
  const truckMakes = [
    'Mercedes-Benz', 'Mercedes', 'Scania', 'Volvo', 'DAF', 'MAN', 'Iveco',
    'Renault', 'Ford', 'Isuzu', 'Mitsubishi', 'Fuso', 'Hino', 'Freightliner'
  ]

  for (const make of truckMakes) {
    const makeRegex = new RegExp(`\\b${make}\\b`, 'i')
    if (makeRegex.test(content)) {
      extracted.make = make === 'Mercedes' ? 'Mercedes-Benz' : make

      const modelMatch = content.match(new RegExp(`${make}\\s+([A-Za-z0-9\\s-]+)`, 'i'))
      if (modelMatch) {
        const modelParts = modelMatch[1].trim().split(/[\s,\n]/).filter(p => p.length > 0)
        extracted.model = modelParts.slice(0, 2).join(' ')
      }
      break
    }
  }

  // Extract description
  const descMatch = content.match(/Description[:\s]+([^\n]+(?:\n[^\n]+)*)/i)
  if (descMatch) {
    extracted.description = descMatch[1].trim().substring(0, 1000)
  } else {
    const descLines = content.split('\n').filter(line => line.trim().length > 50)
    if (descLines.length > 0) {
      extracted.description = descLines.slice(0, 3).join('\n').substring(0, 1000)
    }
  }

  // Extract images
  if (scrapedData.data?.images) {
    extracted.images = scrapedData.data.images.slice(0, 10)
  }

  // Detect condition
  if (text.includes('new') || text.includes('brand new')) {
    extracted.condition = 'new'
  } else if (text.includes('certified')) {
    extracted.condition = 'certified'
  }

  return extracted
}
