#!/usr/bin/env tsx

/**
 * AutoTrader UK Scraper for Commercial Vehicles
 * Based on Python Scrapy implementation: https://github.com/kurt213/scraper-auto-trader
 *
 * This TypeScript implementation uses Firecrawl API for web scraping
 * and follows AutoTrader's three-stage scraping approach:
 * 1. Get vehicle makes
 * 2. Get models for each make
 * 3. Scrape individual vehicle ads
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { FirecrawlApp } from '@mendable/firecrawl-js'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

if (!firecrawlApiKey) {
  console.error('❌ Missing Firecrawl API key - required for AutoTrader scraping')
  console.log('Get your API key at: https://www.firecrawl.dev')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })

interface AutoTraderVehicle {
  make: string
  model: string
  title: string
  url: string
  adId: string
  year: number
  mileage: number
  engineSize?: number
  transmission: string
  price: number
  sellerType: string
  location: string
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, any>
}

class AutoTraderScraper {
  private baseUrl = 'https://www.autotrader.co.uk'
  private commercialUrl = '/vans/search'
  private truckMakes = [
    'DAF', 'IVECO', 'MAN', 'MERCEDES-BENZ', 'MITSUBISHI',
    'NISSAN', 'PEUGEOT', 'RENAULT', 'SCANIA', 'TOYOTA',
    'VOLKSWAGEN', 'VOLVO', 'FORD', 'ISUZU', 'FUSO'
  ]
  private log: string[] = []
  private vehicles: AutoTraderVehicle[] = []

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

  /**
   * Extract key specs from AutoTrader listing
   * Similar to keySpecs() function in Python implementation
   */
  private extractKeySpecs(content: string): Record<string, any> {
    const specs: Record<string, any> = {}

    // Extract year
    const yearMatch = content.match(/(?:Reg|Year)[:\s]*(\d{4})/i) ||
                     content.match(/\b(20\d{2})\s+(?:reg|plate|year)/i)
    if (yearMatch) specs.year = parseInt(yearMatch[1])

    // Extract mileage
    const mileageMatch = content.match(/(\d{1,3}(?:,\d{3})*)\s*miles/i)
    if (mileageMatch) specs.mileage = parseInt(mileageMatch[1].replace(/,/g, ''))

    // Extract engine size
    const engineMatch = content.match(/(\d+\.?\d*)\s*(?:L|litre|liter|cc)/i)
    if (engineMatch) specs.engineSize = parseFloat(engineMatch[1])

    // Extract transmission
    if (content.match(/manual/i)) specs.transmission = 'Manual'
    else if (content.match(/automatic/i)) specs.transmission = 'Automatic'
    else if (content.match(/semi[\s-]?auto/i)) specs.transmission = 'Semi-Auto'

    // Extract fuel type
    if (content.match(/diesel/i)) specs.fuelType = 'Diesel'
    else if (content.match(/petrol/i)) specs.fuelType = 'Petrol'
    else if (content.match(/electric/i)) specs.fuelType = 'Electric'
    else if (content.match(/hybrid/i)) specs.fuelType = 'Hybrid'

    // Extract doors
    const doorsMatch = content.match(/(\d+)\s*door/i)
    if (doorsMatch) specs.doors = parseInt(doorsMatch[1])

    return specs
  }

  /**
   * Parse individual vehicle listing page
   */
  private async parseVehiclePage(url: string): Promise<AutoTraderVehicle | null> {
    try {
      this.logMessage(`Scraping vehicle: ${url}`, 'info')

      const response = await firecrawl.scrapeUrl(url, {
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 2000
      })

      if (!response.success) {
        this.logMessage(`Failed to scrape ${url}: ${response.error}`, 'error')
        return null
      }

      const html = response.html || ''
      const markdown = response.markdown || ''

      // Extract ad ID from URL
      const adIdMatch = url.match(/\/car-details\/(\w+)/i)
      const adId = adIdMatch ? adIdMatch[1] : ''

      // Extract title
      const titleMatch = html.match(/<h1[^>]*>([^<]+)</h1>/i)
      const title = titleMatch ? titleMatch[1].trim() : ''

      // Parse make and model from title
      const makeModelMatch = title.match(/^(\w+(?:-\w+)?)\s+(.+?)(?:\s+\d+\.?\d*)?/i)
      const make = makeModelMatch ? makeModelMatch[1].toUpperCase() : ''
      const model = makeModelMatch ? makeModelMatch[2] : ''

      // Extract price
      const priceMatch = html.match(/£(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i)
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0

      // Extract key specs
      const specs = this.extractKeySpecs(html + ' ' + markdown)

      // Extract images
      const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["'][^"']*vehicle[^"']*["'][^>]*>/gi
      const images: string[] = []
      let imageMatch
      while ((imageMatch = imageRegex.exec(html)) !== null && images.length < 20) {
        const imgSrc = imageMatch[1]
        if (imgSrc && !imgSrc.includes('placeholder') && !imgSrc.includes('logo')) {
          images.push(imgSrc)
        }
      }

      // Extract seller type
      const sellerMatch = html.match(/seller[:\s]*([^<,]+)/i)
      const sellerType = sellerMatch ? sellerMatch[1].trim() : 'Dealer'

      // Extract location
      const locationMatch = html.match(/location[:\s]*([^<,]+)/i)
      const location = locationMatch ? locationMatch[1].trim() : 'UK'

      // Extract description
      const descMatch = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)</gi)
      const description = descMatch ? descMatch[0].replace(/<[^>]+>/g, '').trim() : ''

      // Extract features
      const features: string[] = []
      const featureMatches = html.match(/<li[^>]*class="[^"]*spec[^"]*"[^>]*>([^<]+)</gi)
      if (featureMatches) {
        featureMatches.forEach(match => {
          const feature = match.replace(/<[^>]+>/g, '').trim()
          if (feature && feature.length > 2) {
            features.push(feature)
          }
        })
      }

      const vehicle: AutoTraderVehicle = {
        make,
        model,
        title,
        url,
        adId,
        year: specs.year || new Date().getFullYear(),
        mileage: specs.mileage || 0,
        engineSize: specs.engineSize,
        transmission: specs.transmission || 'Manual',
        price,
        sellerType,
        location,
        images,
        description,
        features,
        specifications: specs
      }

      this.logMessage(`Extracted: ${make} ${model} - £${price.toLocaleString()}`, 'success')
      return vehicle

    } catch (error) {
      this.logMessage(`Error parsing vehicle page ${url}: ${error}`, 'error')
      return null
    }
  }

  /**
   * Get search results for a specific make
   */
  private async searchMake(make: string, maxPages: number = 3): Promise<string[]> {
    const urls: string[] = []

    try {
      // Build search URL for commercial vehicles of this make
      const searchUrl = `${this.baseUrl}${this.commercialUrl}?make=${make}&postcode=WC2N5DU&radius=1500&onesearchad=Used&onesearchad=Nearly%20New&onesearchad=New`

      this.logMessage(`Searching for ${make} vehicles...`, 'info')

      const response = await firecrawl.scrapeUrl(searchUrl, {
        formats: ['html'],
        onlyMainContent: true
      })

      if (!response.success) {
        this.logMessage(`Failed to search ${make}: ${response.error}`, 'error')
        return urls
      }

      const html = response.html || ''

      // Extract total results count
      const countMatch = html.match(/(\d+)\s+(?:cars?|vehicles?|results?)\s+found/i)
      const totalResults = countMatch ? parseInt(countMatch[1]) : 0
      const resultsPerPage = 10
      const totalPages = Math.min(Math.ceil(totalResults / resultsPerPage), maxPages)

      this.logMessage(`Found ${totalResults} ${make} vehicles, scraping ${totalPages} pages`, 'info')

      // Extract vehicle URLs from search results
      const vehicleUrlRegex = /href=["'](\/car-details\/[^"']+)["']/gi
      let match
      while ((match = vehicleUrlRegex.exec(html)) !== null) {
        const vehicleUrl = `${this.baseUrl}${match[1]}`
        if (!urls.includes(vehicleUrl)) {
          urls.push(vehicleUrl)
        }
      }

      // Get additional pages if needed
      for (let page = 2; page <= totalPages; page++) {
        await this.delay(2000) // Rate limiting

        const pageUrl = `${searchUrl}&page=${page}`
        const pageResponse = await firecrawl.scrapeUrl(pageUrl, {
          formats: ['html'],
          onlyMainContent: true
        })

        if (pageResponse.success && pageResponse.html) {
          let pageMatch
          while ((pageMatch = vehicleUrlRegex.exec(pageResponse.html)) !== null) {
            const vehicleUrl = `${this.baseUrl}${pageMatch[1]}`
            if (!urls.includes(vehicleUrl)) {
              urls.push(vehicleUrl)
            }
          }
        }
      }

      this.logMessage(`Found ${urls.length} ${make} vehicle URLs`, 'success')

    } catch (error) {
      this.logMessage(`Error searching ${make}: ${error}`, 'error')
    }

    return urls
  }

  /**
   * Main scraping pipeline
   */
  async scrape(options: {
    makes?: string[],
    maxVehiclesPerMake?: number,
    saveToFile?: boolean
  } = {}) {
    const makes = options.makes || this.truckMakes
    const maxVehiclesPerMake = options.maxVehiclesPerMake || 10
    const saveToFile = options.saveToFile !== false

    this.logMessage('🚛 Starting AutoTrader Commercial Vehicle Scraper', 'info')
    this.logMessage(`Scraping makes: ${makes.join(', ')}`, 'info')

    for (const make of makes) {
      this.logMessage(`\n📋 Processing ${make}...`, 'info')

      // Get vehicle URLs for this make
      const vehicleUrls = await this.searchMake(make)

      if (vehicleUrls.length === 0) {
        this.logMessage(`No vehicles found for ${make}`, 'warning')
        continue
      }

      // Scrape individual vehicles
      const vehiclesToScrape = Math.min(vehicleUrls.length, maxVehiclesPerMake)
      for (let i = 0; i < vehiclesToScrape; i++) {
        const vehicle = await this.parseVehiclePage(vehicleUrls[i])

        if (vehicle) {
          this.vehicles.push(vehicle)
        }

        // Rate limiting
        await this.delay(3000)
      }
    }

    this.logMessage(`\n✅ Scraping complete! Found ${this.vehicles.length} vehicles`, 'success')

    // Save results to file
    if (saveToFile && this.vehicles.length > 0) {
      const filename = `scripts/autotrader-vehicles-${Date.now()}.json`
      fs.writeFileSync(filename, JSON.stringify(this.vehicles, null, 2))
      this.logMessage(`Results saved to ${filename}`, 'success')
    }

    return this.vehicles
  }

  /**
   * Convert AutoTrader vehicles to our database format
   */
  async saveToDatabase(): Promise<number> {
    this.logMessage('\n💾 Saving vehicles to database...', 'info')

    let savedCount = 0
    let errorCount = 0

    for (const vehicle of this.vehicles) {
      try {
        // Map to our database schema
        const dbVehicle = {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          price: vehicle.price,
          currency: 'GBP',
          condition: vehicle.year === new Date().getFullYear() ? 'new' : 'used',
          category: this.determineCategory(vehicle),
          engine_type: vehicle.specifications.fuelType?.toLowerCase() || 'diesel',
          transmission: vehicle.transmission.toLowerCase() as any,
          engine_power: null,
          engine_size: vehicle.engineSize || null,
          location: vehicle.location,
          country: 'United Kingdom',
          vin: `AT-${vehicle.adId}`,
          images: vehicle.images,
          specifications: {
            ...vehicle.specifications,
            autotraderUrl: vehicle.url,
            sellerType: vehicle.sellerType,
            scrapedAt: new Date().toISOString()
          },
          features: vehicle.features,
          description: vehicle.description || `${vehicle.title} - Imported from AutoTrader UK`,
          available: true,
          featured: false
        }

        // Check for duplicates
        const { data: existing } = await supabase
          .from('vehicles')
          .select('id')
          .eq('vin', dbVehicle.vin)
          .single()

        if (existing) {
          this.logMessage(`Vehicle already exists: ${vehicle.make} ${vehicle.model}`, 'warning')
          continue
        }

        // Insert vehicle
        const { error } = await supabase
          .from('vehicles')
          .insert(dbVehicle)

        if (error) {
          this.logMessage(`Error saving ${vehicle.make} ${vehicle.model}: ${error.message}`, 'error')
          errorCount++
        } else {
          this.logMessage(`Saved: ${vehicle.make} ${vehicle.model} (${vehicle.year})`, 'success')
          savedCount++
        }

      } catch (error) {
        this.logMessage(`Unexpected error: ${error}`, 'error')
        errorCount++
      }
    }

    this.logMessage(`\n📊 Database import complete: ${savedCount} saved, ${errorCount} errors`, 'info')
    return savedCount
  }

  /**
   * Determine vehicle category based on model and specs
   */
  private determineCategory(vehicle: AutoTraderVehicle): string {
    const model = vehicle.model.toLowerCase()
    const title = vehicle.title.toLowerCase()

    if (model.includes('sprinter') || model.includes('transit') || model.includes('crafter')) {
      return 'van'
    } else if (model.includes('actros') || model.includes('axor') || model.includes('atego')) {
      return 'semi-truck'
    } else if (title.includes('tipper') || title.includes('dump')) {
      return 'tipper'
    } else if (title.includes('box') || title.includes('luton')) {
      return 'box-truck'
    } else if (title.includes('pickup') || model.includes('l200') || model.includes('hilux')) {
      return 'pickup'
    } else if (title.includes('flatbed') || title.includes('dropside')) {
      return 'flatbed'
    } else if (title.includes('refrigerated') || title.includes('fridge')) {
      return 'refrigerated'
    }

    return 'other'
  }

  getVehicles(): AutoTraderVehicle[] {
    return this.vehicles
  }

  getLog(): string[] {
    return this.log
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚛 AutoTrader UK Commercial Vehicle Scraper')
  console.log('==========================================\n')

  const scraper = new AutoTraderScraper()

  try {
    // Scrape vehicles
    const vehicles = await scraper.scrape({
      makes: ['MITSUBISHI', 'DAF', 'MERCEDES-BENZ'], // Start with a few makes for testing
      maxVehiclesPerMake: 5, // Limit for testing
      saveToFile: true
    })

    if (vehicles.length === 0) {
      console.log('No vehicles found. Check your configuration.')
      process.exit(0)
    }

    // Display summary
    console.log(`\n📊 Scraped ${vehicles.length} vehicles:`)
    vehicles.forEach((v, i) => {
      console.log(`${i + 1}. ${v.make} ${v.model} (${v.year}) - £${v.price.toLocaleString()}`)
    })

    // Optionally save to database
    console.log('\n💾 Save to database? (y/n)')
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    readline.question('> ', async (answer: string) => {
      if (answer.toLowerCase() === 'y') {
        const savedCount = await scraper.saveToDatabase()
        console.log(`\n✅ Successfully saved ${savedCount} vehicles`)
      }

      console.log('\n✨ Scraping complete!')
      readline.close()
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Scraping failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { AutoTraderScraper }