#!/usr/bin/env tsx

// Advanced Automated Scraping Pipeline with MCP Integration
// Supports multiple sources: Facebook Marketplace, Bazaraki, Autotrader, eBay Motors
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { FirecrawlApp } from '@mendable/firecrawl-js'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Firecrawl API configuration
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY
const firecrawl = firecrawlApiKey ? new FirecrawlApp({ apiKey: firecrawlApiKey }) : null

interface ScrapingSource {
  name: string
  type: 'facebook' | 'bazaraki' | 'autotrader' | 'ebay' | 'general'
  baseUrl: string
  searchPaths: string[]
  selectors: {
    title: string
    price: string
    year: string
    mileage: string
    images: string
    description: string
  }
  rateLimitMs?: number
}

const scrapingSources: ScrapingSource[] = [
  {
    name: 'Facebook Marketplace - Cyprus',
    type: 'facebook',
    baseUrl: 'https://www.facebook.com',
    searchPaths: [
      '/marketplace/cyprus/vehicles',
      '/marketplace/cyprus/trucks'
    ],
    selectors: {
      title: '[data-testid="marketplace-feed-title"]',
      price: '[data-testid="marketplace-price"]',
      year: '[data-testid="marketplace-year"]',
      mileage: '[data-testid="marketplace-mileage"]',
      images: '[data-testid="marketplace-image"] img',
      description: '[data-testid="marketplace-description"]'
    },
    rateLimitMs: 2000
  },
  {
    name: 'Bazaraki - Cyprus Trucks',
    type: 'bazaraki',
    baseUrl: 'https://www.bazaraki.com',
    searchPaths: [
      '/car-motorbikes-boats/trucks-vans',
      '/car-motorbikes-boats/trucks-vans/pickups'
    ],
    selectors: {
      title: '.ad-item__title',
      price: '.ad-item__price',
      year: '.ad-item__year',
      mileage: '.ad-item__mileage',
      images: '.ad-item__image img',
      description: '.ad-item__description'
    },
    rateLimitMs: 1000
  },
  {
    name: 'General Truck Listings',
    type: 'general',
    baseUrl: 'https://www.autotrader.com',
    searchPaths: [
      '/commercial-trucks-for-sale',
      '/pickup-trucks-for-sale'
    ],
    selectors: {
      title: '.vehicle-title',
      price: '.price',
      year: '.year',
      mileage: '.mileage',
      images: '.vehicle-image img',
      description: '.vehicle-description'
    },
    rateLimitMs: 1500
  }
]

interface ScrapedVehicle {
  source: string
  url: string
  make: string
  model: string
  year: number
  price: number
  mileage?: number
  images: string[]
  description?: string
  location?: string
  condition?: string
  category: string
  scrapedAt: string
}

class AutomatedScrapingPipeline {
  private vehicles: ScrapedVehicle[] = []
  private processedUrls = new Set<string>()
  private log: string[] = []

  private logMessage(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const timestamp = new Date().toISOString()
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    this.log.push(formattedMessage)

    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m'
    }
    console.log(`${colors[level]}${formattedMessage}\x1b[0m`)
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private extractVehicleInfo(content: string, source: ScrapingSource, url: string): ScrapedVehicle | null {
    try {
      // This is a simplified extraction - in production, you'd use more sophisticated parsing
      const titleMatch = content.match(/<title[^>]*>([^<]+)</title>/i)
      const title = titleMatch ? titleMatch[1] : 'Unknown Vehicle'

      // Extract make and model from title
      const makeModelMatch = title.match(/(\w+)\s+(.+?)\s+(?:\d{4}|for sale)/i)
      const make = makeModelMatch ? makeModelMatch[1] : 'Unknown'
      const model = makeModelMatch ? makeModelMatch[2] : 'Unknown'

      // Extract year
      const yearMatch = content.match(/(?:year|©|reg)\s*:?\s*(\d{4})/i) ||
                       content.match(/\b(19|20)\d{2}\b/g)
      const year = yearMatch ? parseInt(yearMatchMatch[1] || yearMatch[0]) : new Date().getFullYear()

      // Extract price
      const priceMatch = content.match(/€(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/) ||
                       content.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*€/i) ||
                       contentMatch(/price[:\s]*€?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i)
      const price = priceMatch ? parseInt(priceMatch[1].replace(/[^\d]/g, '')) : 0

      // Extract mileage
      const mileageMatch = content.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:km|kilometers|miles)/i)
      const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/[^\d]/g, '')) : undefined

      // Extract images
      const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
      const images: string[] = []
      let imageMatch
      while ((imageMatch = imageRegex.exec(content)) !== null) {
        const imgSrc = imageMatch[1]
        if (imgSrc && (imgSrc.includes('http') || imgSrc.startsWith('/')) &&
            !imgSrc.includes('logo') && !imgSrc.includes('icon')) {
          images.push(imgSrc.startsWith('/') ? `${source.baseUrl}${imgSrc}` : imgSrc)
        }
      }

      // Determine category
      let category = 'other'
      if (model.toLowerCase().includes('pickup') || model.toLowerCase().includes('l200')) {
        category = 'pickup'
      } else if (make.toLowerCase().includes('mercedes') || make.toLowerCase().includes('scania') ||
                 make.toLowerCase().includes('volvo') || make.toLowerCase().includes('daf')) {
        category = 'semi-truck'
      } else if (model.toLowerCase().includes('transit') || model.toLowerCase().includes('sprinter')) {
        category = 'box-truck'
      }

      return {
        source: source.name,
        url,
        make,
        model,
        year,
        price,
        mileage,
        images: images.slice(0, 10), // Limit to 10 images
        description: content.slice(0, 500),
        location: 'Cyprus', // Default location
        condition: 'used',
        category,
        scrapedAt: new Date().toISOString()
      }
    } catch (error) {
      this.logMessage(`Error extracting vehicle info from ${url}: ${error}`, 'error')
      return null
    }
  }

  private async scrapeWithFirecrawl(url: string, source: ScrapingSource): Promise<ScrapedVehicle | null> {
    if (!firecrawl) {
      this.logMessage('Firecrawl API key not configured', 'warning')
      return null
    }

    try {
      const response = await firecrawl.scrapeUrl(url, {
        formats: ['markdown'],
        includeRawHtml: true
      })

      if (!response.success) {
        this.logMessage(`Firecrawl failed for ${url}: ${response.error}`, 'error')
        return null
      }

      return this.extractVehicleInfo(response.rawHtml || response.markdown || '', source, url)
    } catch (error) {
      this.logMessage(`Firecrawl error for ${url}: ${error}`, 'error')
      return null
    }
  }

  private async scrapeWithPlaywright(url: string, source: ScrapingSource): Promise<ScrapedVehicle | null> {
    try {
      // Use Playwright MCP if available
      const { mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot } = require('mcp-playwright')

      await mcp__playwright__browser_navigate({ url })
      const snapshot = await mcp__playwright__browser_snapshot()

      if (snapshot.success) {
        return this.extractVehicleInfo(snapshot.content, source, url)
      }

      return null
    } catch (error) {
      this.logMessage(`Playwright error for ${url}: ${error}`, 'error')
      return null
    }
  }

  private async processUrl(url: string, source: ScrapingSource): Promise<ScrapedVehicle | null> {
    if (this.processedUrls.has(url)) {
      return null
    }
    this.processedUrls.add(url)

    this.logMessage(`Processing: ${url}`, 'info')

    // Try Firecrawl first, fallback to Playwright
    let vehicle = await this.scrapeWithFirecrawl(url, source)

    if (!vehicle && source.type !== 'facebook') { // Skip Playwright for Facebook (anti-scraping)
      vehicle = await this.scrapeWithPlaywright(url, source)
    }

    if (vehicle) {
      this.logMessage(`Successfully scraped: ${vehicle.make} ${vehicle.model} (${vehicle.year})`, 'success')
    }

    // Rate limiting
    if (source.rateLimitMs) {
      await this.delay(source.rateLimitMs)
    }

    return vehicle
  }

  async runScraping(limit: number = 50): Promise<ScrapedVehicle[]> {
    this.logMessage('🚀 Starting automated scraping pipeline...', 'info')
    this.vehicles = []

    for (const source of scrapingSources) {
      this.logMessage(`Scraping source: ${source.name}`, 'info')

      // Generate search URLs
      const searchUrls = source.searchPaths.map(path => `${source.baseUrl}${path}`)

      for (const baseUrl of searchUrls) {
        try {
          // Get search results page
          const searchResult = await this.processUrl(baseUrl, source)

          if (this.vehicles.length >= limit) {
            break
          }

        } catch (error) {
          this.logMessage(`Error processing ${baseUrl}: ${error}`, 'error')
        }
      }

      if (this.vehicles.length >= limit) {
        break
      }
    }

    this.logMessage(`Scraping completed. Found ${this.vehicles.length} vehicles`, 'success')
    return this.vehicles
  }

  async saveToDatabase(): Promise<number> {
    this.logMessage('💾 Saving scraped vehicles to database...', 'info')

    let savedCount = 0
    let duplicateCount = 0
    let errorCount = 0

    for (const scrapedVehicle of this.vehicles) {
      try {
        // Check for duplicates based on make, model, year, and price
        const { data: existing } = await supabase
          .from('vehicles')
          .select('id')
          .eq('make', scrapedVehicle.make)
          .eq('model', scrapedVehicle.model)
          .eq('year', scrapedVehicle.year)
          .eq('price', scrapedVehicle.price)
          .limit(1)

        if (existing && existing.length > 0) {
          duplicateCount++
          continue
        }

        // Generate VIN
        const vin = `SCRAPED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        // Prepare vehicle data
        const vehicleData = {
          make: scrapedVehicle.make,
          model: scrapedVehicle.model,
          year: scrapedVehicle.year,
          mileage: scrapedVehicle.mileage || 0,
          price: scrapedVehicle.price,
          currency: 'EUR',
          condition: scrapedVehicle.condition,
          category: scrapedVehicle.category as any,
          engine_type: 'diesel', // Default
          transmission: 'manual', // Default
          horsepower: 150, // Default
          location: scrapedVehicle.location || 'Cyprus',
          country: 'Cyprus',
          vin,
          images: scrapedVehicle.images,
          specifications: {
            source: scrapedVehicle.source,
            sourceUrl: scrapedVehicle.url,
            scrapedAt: scrapedVehicle.scrapedAt
          },
          features: [],
          description: scrapedVehicle.description || `Scraped from ${scrapedVehicle.source}`,
          available: true,
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Insert into database
        const { error } = await supabase
          .from('vehicles')
          .insert(vehicleData)

        if (error) {
          this.logMessage(`Error saving vehicle ${scrapedVehicle.make} ${scrapedVehicle.model}: ${error.message}`, 'error')
          errorCount++
        } else {
          savedCount++
          this.logMessage(`Saved: ${scrapedVehicle.make} ${scrapedVehicle.model} (${scrapedVehicle.year})`, 'success')
        }

      } catch (error) {
        this.logMessage(`Unexpected error saving vehicle: ${error}`, 'error')
        errorCount++
      }
    }

    this.logMessage(`Save complete: ${savedCount} saved, ${duplicateCount} duplicates, ${errorCount} errors`, 'info')
    return savedCount
  }

  getLog(): string[] {
    return this.log
  }

  async exportResults(format: 'json' | 'csv' = 'json'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(this.vehicles, null, 2)
    } else {
      // CSV format
      const headers = ['Source', 'Make', 'Model', 'Year', 'Price', 'Mileage', 'Images', 'URL']
      const rows = this.vehicles.map(v => [
        v.source,
        v.make,
        v.model,
        v.year.toString(),
        v.price.toString(),
        v.mileage?.toString() || '',
        v.images.length.toString(),
        v.url
      ])

      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
  }
}

async function main() {
  console.log('🤖 Automated Vehicle Scraping Pipeline')
  console.log('=====================================\n')

  const pipeline = new AutomatedScrapingPipeline()

  try {
    // Run scraping
    const vehicles = await pipeline.runScraping(25) // Limit to 25 for testing

    if (vehicles.length === 0) {
      console.log('No vehicles found. Check scraping sources and configuration.')
      process.exit(0)
    }

    console.log(`\n📊 Scraped ${vehicles.length} vehicles:`)
    vehicles.forEach((v, index) => {
      console.log(`${index + 1}. ${v.make} ${v.model} (${v.year}) - €${v.price.toLocaleString()}`)
    })

    // Save to database
    const savedCount = await pipeline.saveToDatabase()
    console.log(`\n💾 Successfully saved ${savedCount} new vehicles to database`)

    // Export results
    const jsonExport = await pipeline.exportResults('json')
    require('fs').writeFileSync('scripts/scraped-vehicles.json', jsonExport)

    const csvExport = await pipeline.exportResults('csv')
    require('fs').writeFileSync('scripts/scraped-vehicles.csv', csvExport)

    console.log('\n📁 Export files created:')
    console.log('  - scripts/scraped-vehicles.json')
    console.log('  - scripts/scraped-vehicles.csv')

    // Print log
    console.log('\n📋 Execution Log:')
    pipeline.getLog().forEach(log => console.log(log))

    console.log('\n✨ Scraping pipeline completed successfully!')

  } catch (error) {
    console.error('❌ Pipeline failed:', error)
    process.exit(1)
  }
}

// Run the pipeline
if (require.main === module) {
  main()
}

export { AutomatedScrapingPipeline }