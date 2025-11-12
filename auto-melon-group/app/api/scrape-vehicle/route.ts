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

    // Call Firecrawl API with enhanced options for Bazaraki
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: false, // Get full content including metadata
        waitFor: 3000, // Wait longer for dynamic content
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

  console.log('🔍 Bazaraki Scraping - Processing content length:', content.length)
  console.log('🔍 Available metadata:', Object.keys(metadata))

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
    country: 'Cyprus',
    description: '',
    images: [],
    specifications: {},
    features: [],
  }

  // === PRICE EXTRACTION - Multiple patterns for reliability ===
  let priceFound = false

  // 1. Check metadata first (most reliable)
  if (metadata.price) {
    extracted.price = parseFloat(metadata.price)
    priceFound = true
    console.log('💰 Price from metadata:', extracted.price)
  }

  // 2. Check ogPrice if available
  if (!priceFound && metadata.ogPrice) {
    const priceMatch = metadata.ogPrice.match(/(\d+(?:[.,]\d*)?)/)
    if (priceMatch) {
      extracted.price = parseFloat(priceMatch[1].replace(/[.,]/g, ''))
      priceFound = true
      console.log('💰 Price from ogPrice:', extracted.price)
    }
  }

  // 3. Multiple Bazaraki price patterns
  if (!priceFound) {
    const pricePatterns = [
      /€\s*(\d{1,3}(?:[.,]\d{3})*)/gi,
      /(\d{1,3}(?:[.,]\d{3})*)\s*€/gi,
      /price[:\s]*€?\s*(\d+(?:[.,]\d+)*)/gi,
      /τιμή[:\s]*€?\s*(\d+(?:[.,]\d+)*)/gi,
      /(\d{4,6})\s*(?:€|eur)/gi
    ]

    for (const pattern of pricePatterns) {
      const matches = content.match(pattern)
      if (matches) {
        const prices = matches.map(match => {
          const num = match.replace(/[^\d.,]/g, '').replace(/[.,]/g, '')
          return parseInt(num)
        }).filter(p => p > 100 && p < 500000) // Reasonable price range

        if (prices.length > 0) {
          extracted.price = Math.max(...prices) // Use highest price
          priceFound = true
          console.log('💰 Price from pattern:', extracted.price)
          break
        }
      }
    }
  }

  // Extract currency
  if (metadata.priceCurrency) {
    extracted.currency = metadata.priceCurrency
  }

  // === YEAR EXTRACTION ===
  const yearPatterns = [
    /\b(19[9]\d|20[0-2]\d)\b/g,
    /κυκλοφορία[:\s]*(\d{4})/gi,
    /registration[:\s]*(\d{4})/gi,
    /reg[:\s]*(\d{4})/gi
  ]

  let yearFound = false
  for (const pattern of yearPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      const years = matches.map(m => parseInt(m.replace(/\D/g, '')))
        .filter(y => y >= 1990 && y <= new Date().getFullYear() + 1)
      if (years.length > 0) {
        // Use the most common year or most recent
        const yearCounts = years.reduce((acc: any, year) => {
          acc[year] = (acc[year] || 0) + 1
          return acc
        }, {})
        extracted.year = parseInt(Object.keys(yearCounts).reduce((a, b) =>
          yearCounts[a] > yearCounts[b] ? a : b
        ))
        yearFound = true
        console.log('📅 Year found:', extracted.year)
        break
      }
    }
  }

  // === MILEAGE EXTRACTION ===
  const mileagePatterns = [
    /(\d{1,3}(?:[.,]\d{3})*)\s*(?:km|kilometers|χιλιόμετρα|klm)/gi,
    /(\d+)\s*k\s*(?:km|klm)/gi,
    /χιλόμετρα[:\s]*(\d+(?:[.,]\d+)*)/gi
  ]

  let mileageFound = false
  for (const pattern of mileagePatterns) {
    const matches = content.match(pattern)
    if (matches) {
      const mileages = matches.map(match => {
        const num = match.replace(/[^\d.,]/g, '').replace(/[.,]/g, '')
        const isK = match.toLowerCase().includes('k')
        return parseInt(num) * (isK ? 1000 : 1)
      }).filter(m => m > 0 && m < 1000000)

      if (mileages.length > 0) {
        extracted.mileage = Math.min(...mileages) // Use lowest mileage
        mileageFound = true
        console.log('📊 Mileage found:', extracted.mileage)
        break
      }
    }
  }

  // === DESCRIPTION EXTRACTION ===
  let descriptionFound = false

  // 1. Try metadata descriptions
  if (metadata.description) {
    extracted.description = metadata.description
    descriptionFound = true
    console.log('📝 Description from metadata')
  } else if (metadata.ogDescription) {
    extracted.description = metadata.ogDescription
    descriptionFound = true
    console.log('📝 Description from ogDescription')
  }

  // 2. Extract from content if not found
  if (!descriptionFound) {
    const descPatterns = [
      /περιγραφή[:\s]+([^\n]+(?:\n[^\n]+)*)/gi,
      /description[:\s]+([^\n]+(?:\n[^\n]+)*)/gi,
      /details[:\s]+([^\n]+(?:\n[^\n]+)*)/gi
    ]

    for (const pattern of descPatterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        extracted.description = match[1].trim().substring(0, 2000)
        descriptionFound = true
        console.log('📝 Description from pattern')
        break
      }
    }

    // 3. Fallback: extract longest text blocks
    if (!descriptionFound) {
      const paragraphs = content.split('\n\n')
        .filter(p => p.trim().length > 100)
        .sort((a, b) => b.length - a.length)

      if (paragraphs.length > 0) {
        extracted.description = paragraphs[0].trim().substring(0, 2000)
        console.log('📝 Description from longest paragraph')
      }
    }
  }

  // === MAKE AND MODEL EXTRACTION ===
  const title = metadata.ogTitle || metadata.title || ''
  console.log('🏷️ Title to analyze:', title)

  const truckMakes = [
    'Mercedes-Benz', 'Mercedes', 'Scania', 'Volvo', 'DAF', 'MAN', 'Iveco',
    'Renault', 'Ford', 'Isuzu', 'Mitsubishi', 'Fuso', 'Hino', 'Freightliner',
    'Nissan', 'Toyota', 'Honda', 'Hyundai', 'Kia', 'Tata', 'Mahindra'
  ]

  const truckModels = {
    'Mercedes-Benz': ['Actros', 'Atego', 'Sprinter', 'Vario'],
    'Mercedes': ['Actros', 'Atego', 'Sprinter', 'Vario'],
    'Scania': ['R-Series', 'P-Series', 'G-Series', 'L-Series'],
    'Volvo': ['FH', 'FM', 'FL', 'FE', 'EC'],
    'DAF': ['XF', 'CF', 'LF'],
    'MAN': ['TGX', 'TGS', 'TGM', 'TGL'],
    'Iveco': ['Stralis', 'Eurocargo', 'Daily'],
    'Ford': ['Transit', 'Cargo', 'F-Series', 'Ranger'],
    'Isuzu': ['D-Max', 'Forward', 'NPR', 'NQR', 'NRR'],
    'Mitsubishi': ['L200', 'L300', 'Fuso', 'Canter', 'Fighter'],
    'Nissan': ['Navara', 'NT400', 'NT500', 'Cabstar'],
    'Toyota': ['Hilux', 'Land Cruiser', 'Coaster', 'Dyna']
  }

  // Try to extract from title first
  for (const make of truckMakes) {
    const makeRegex = new RegExp(`\\b${make}\\b`, 'i')

    if (makeRegex.test(title)) {
      extracted.make = make === 'Mercedes' ? 'Mercedes-Benz' : make
      console.log('🏭 Make found from title:', extracted.make)

      // Try to find model
      if (truckModels[extracted.make as keyof typeof truckModels]) {
        const models = truckModels[extracted.make as keyof typeof truckModels]
        for (const model of models) {
          const modelRegex = new RegExp(`\\b${model}\\b`, 'i')
          if (modelRegex.test(title)) {
            extracted.model = model
            console.log('🚗 Model found:', extracted.model)
            break
          }
        }

        // If specific model not found, try to extract what follows the make
        if (!extracted.model) {
          const makeIndex = title.toLowerCase().indexOf(make.toLowerCase())
          if (makeIndex !== -1) {
            const afterMake = title.substring(makeIndex + make.length).trim()
            const modelWords = afterMake.split(/[\s\d(]/)[0]
            if (modelWords && modelWords.length > 0) {
              extracted.model = modelWords.trim()
              console.log('🚗 Model extracted after make:', extracted.model)
            }
          }
        }
      }
      break
    }
  }

  // Fallback: search in full content
  if (!extracted.make) {
    for (const make of truckMakes) {
      const makeRegex = new RegExp(`\\b${make}\\b`, 'i')
      if (makeRegex.test(content)) {
        extracted.make = make === 'Mercedes' ? 'Mercedes-Benz' : make
        console.log('🏭 Make found from content:', extracted.make)
        break
      }
    }
  }

  // === VEHICLE CATEGORY DETECTION ===
  const contentLower = content.toLowerCase()
  if (contentLower.includes('pickup') || contentLower.includes('l200') ||
      contentLower.includes('hilux') || contentLower.includes('navara')) {
    extracted.category = 'pickup'
  } else if (extracted.make.toLowerCase().includes('mercedes') ||
             extracted.make.toLowerCase().includes('scania') ||
             extracted.make.toLowerCase().includes('volvo') ||
             extracted.make.toLowerCase().includes('daf')) {
    extracted.category = 'semi-truck'
  } else if (contentLower.includes('tipper') || contentLower.includes('dump')) {
    extracted.category = 'dump-truck'
  } else if (contentLower.includes('box') || contentLower.includes('van')) {
    extracted.category = 'box-truck'
  }

  // === ADDITIONAL SPECIFICATIONS ===

  // Horsepower
  const hpPatterns = [
    /(\d+)\s*(?:hp|bhp|ps|ίπποδ)/gi,
    /horsepower[:\s]*(\d+)/gi
  ]

  for (const pattern of hpPatterns) {
    const match = content.match(pattern)
    if (match) {
      extracted.horsepower = parseInt(match[1])
      console.log('⚡ Horsepower found:', extracted.horsepower)
      break
    }
  }

  // Engine size
  const enginePatterns = [
    /(\d+)[,.](\d+)\s*[lL]/gi,
    /(\d+)\s*liter/gi,
    /engine[:\s]*(\d+)[,.](\d)/gi,
    /κινητήρα[:\s]*(\d+)[,.](\d)/gi
  ]

  for (const pattern of enginePatterns) {
    const match = content.match(pattern)
    if (match) {
      extracted.engineSize = parseFloat(`${match[1]}.${match[2]}`)
      console.log('🔧 Engine size found:', extracted.engineSize)
      break
    }
  }

  // Transmission
  if (contentLower.includes('automatic') || contentLower.includes('αυτόματο')) {
    extracted.transmission = 'automatic'
  } else if (contentLower.includes('manual') || contentLower.includes('χειροκίνητο')) {
    extracted.transmission = 'manual'
  }

  // Engine type
  if (contentLower.includes('diesel') || contentLower.includes('πετρέλαιο')) {
    extracted.engineType = 'diesel'
  } else if (contentLower.includes('petrol') || contentLower.includes('βενζίνη')) {
    extracted.engineType = 'petrol'
  } else if (contentLower.includes('electric') || contentLower.includes('ηλεκτρικό')) {
    extracted.engineType = 'electric'
  } else if (contentLower.includes('hybrid') || contentLower.includes('υβριδικό')) {
    extracted.engineType = 'hybrid'
  }

  // Location extraction
  const locationPatterns = [
    /location[:\s]*([^\n,]+)/gi,
    /area[:\s]*([^\n,]+)/gi,
    /πόλη[:\s]*([^\n,]+)/gi,
    /περιοχή[:\s]*([^\n,]+)/gi,
    /(\w+)\s*cyprus/gi
  ]

  for (const pattern of locationPatterns) {
    const match = content.match(pattern)
    if (match && match[1]) {
      extracted.location = match[1].trim()
      console.log('📍 Location found:', extracted.location)
      break
    }
  }

  // === IMAGE EXTRACTION ===
  if (scrapedData.data?.images && Array.isArray(scrapedData.data.images)) {
    extracted.images = scrapedData.data.images.slice(0, 15)
    console.log('📸 Images found:', extracted.images.length)
  } else {
    // Fallback: extract images from HTML
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const images: string[] = []
    let imgMatch

    while ((imgMatch = imgRegex.exec(content)) !== null) {
      const imgSrc = imgMatch[1]
      if (imgSrc && (imgSrc.includes('http') || imgSrc.startsWith('/')) &&
          !imgSrc.includes('logo') && !imgSrc.includes('icon') &&
          !imgSrc.includes('avatar') && !imgSrc.includes('banner')) {
        images.push(imgSrc.startsWith('/') ? `https://www.bazaraki.com${imgSrc}` : imgSrc)
        if (images.length >= 15) break
      }
    }

    if (images.length > 0) {
      extracted.images = images
      console.log('📸 Images extracted from HTML:', images.length)
    }
  }

  // === FEATURES EXTRACTION ===
  const featurePatterns = [
    /[•\-\*]\s*([^\n]+)/g,
    /✓\s*([^\n]+)/g,
    /features[:\s]+([^\n]+)/gi
  ]

  const features: string[] = []
  for (const pattern of featurePatterns) {
    const matches = content.match(pattern)
    if (matches) {
      const cleanFeatures = matches
        .map(f => f.replace(/[•\-\*✓]\s*/, '').trim())
        .filter(f => f.length > 2 && f.length < 200 && !f.toLowerCase().includes('price'))
        .slice(0, 20)

      features.push(...cleanFeatures)
    }
  }

  if (features.length > 0) {
    extracted.features = [...new Set(features)] // Remove duplicates
    console.log('⭐ Features found:', extracted.features.length)
  }

  // === FINAL VALIDATION ===

  // Ensure we have critical data
  if (!extracted.price || extracted.price < 100) {
    console.log('⚠️ Price extraction failed or too low')
    extracted.price = 0 // Set to 0 to indicate missing
  }

  if (!extracted.make) {
    console.log('⚠️ Make extraction failed')
    extracted.make = 'Unknown'
  }

  if (!extracted.model) {
    console.log('⚠️ Model extraction failed')
    extracted.model = 'Unknown'
  }

  if (extracted.year === new Date().getFullYear()) {
    console.log('⚠️ Using current year as default - may indicate extraction failed')
  }

  // Log final extraction results
  console.log('📋 Final Extraction Results:')
  console.log(`  Make: ${extracted.make}`)
  console.log(`  Model: ${extracted.model}`)
  console.log(`  Year: ${extracted.year}`)
  console.log(`  Price: €${extracted.price}`)
  console.log(`  Mileage: ${extracted.mileage.toLocaleString()} km`)
  console.log(`  Category: ${extracted.category}`)
  console.log(`  Description length: ${extracted.description.length}`)
  console.log(`  Images: ${extracted.images.length}`)
  console.log(`  Features: ${extracted.features.length}`)

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
