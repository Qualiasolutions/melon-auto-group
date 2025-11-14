#!/usr/bin/env tsx

/**
 * AutoTrader Scraper Demo - Simplified version for testing
 * This demonstrates the scraping logic without requiring API keys
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mock AutoTrader data for demonstration
// In production, this would be scraped from actual AutoTrader pages
const mockAutoTraderData = [
  {
    make: 'MITSUBISHI',
    model: 'L200 Double Cab DI-D 178 Barbarian',
    title: 'Mitsubishi L200 Double Cab DI-D 178 Barbarian 4WD',
    url: 'https://www.autotrader.co.uk/car-details/202411141234567',
    adId: 'AT202411141234567',
    year: 2020,
    mileage: 45000,
    engineSize: 2.3,
    transmission: 'Automatic',
    price: 28995,
    sellerType: 'Dealer',
    location: 'Manchester, UK',
    images: [
      'https://images.autotrader.co.uk/l200-front.jpg',
      'https://images.autotrader.co.uk/l200-side.jpg',
      'https://images.autotrader.co.uk/l200-rear.jpg',
      'https://images.autotrader.co.uk/l200-interior.jpg'
    ],
    description: 'Excellent condition Mitsubishi L200 Barbarian. Full service history, one owner from new. Leather seats, sat nav, reverse camera, and all the premium features.',
    features: [
      'Leather Seats',
      'Sat Nav',
      'Reverse Camera',
      'Cruise Control',
      'Climate Control',
      'Alloy Wheels',
      'Bluetooth',
      'DAB Radio',
      '4WD',
      'Tow Bar'
    ],
    specifications: {
      fuelType: 'Diesel',
      doors: 4,
      seats: 5,
      color: 'Grey',
      bodyType: 'Pickup',
      driveType: '4WD',
      mpg: 32.8,
      co2Emissions: 169
    }
  },
  {
    make: 'DAF',
    model: 'CF 75.310',
    title: 'DAF CF 75.310 Euro 6 Box Truck with Tail Lift',
    url: 'https://www.autotrader.co.uk/commercial-details/202411147654321',
    adId: 'AT202411147654321',
    year: 2019,
    mileage: 125000,
    engineSize: 6.7,
    transmission: 'Manual',
    price: 42500,
    sellerType: 'Trade',
    location: 'Birmingham, UK',
    images: [
      'https://images.autotrader.co.uk/daf-cf-front.jpg',
      'https://images.autotrader.co.uk/daf-cf-side.jpg',
      'https://images.autotrader.co.uk/daf-cf-box.jpg'
    ],
    description: 'Well-maintained DAF CF box truck with tail lift. Euro 6 compliant, perfect for urban deliveries. Full service history available.',
    features: [
      'Tail Lift',
      'Euro 6',
      'Air Suspension',
      'Cruise Control',
      'Air Conditioning',
      '26ft Box Body',
      'Barn Doors',
      'Load Lock Rails'
    ],
    specifications: {
      fuelType: 'Diesel',
      bodyType: 'Box Truck',
      gvw: 18000,
      payloadCapacity: 9500,
      boxLength: 26,
      euroStandard: 'Euro 6'
    }
  },
  {
    make: 'MERCEDES-BENZ',
    model: 'Actros 2545',
    title: 'Mercedes-Benz Actros 2545 BigSpace Euro 6',
    url: 'https://www.autotrader.co.uk/truck-details/202411149876543',
    adId: 'AT202411149876543',
    year: 2021,
    mileage: 89000,
    engineSize: 12.8,
    transmission: 'Automatic',
    price: 78950,
    sellerType: 'Dealer',
    location: 'Leeds, UK',
    images: [
      'https://images.autotrader.co.uk/actros-front.jpg',
      'https://images.autotrader.co.uk/actros-side.jpg',
      'https://images.autotrader.co.uk/actros-cab.jpg'
    ],
    description: 'Premium Mercedes-Benz Actros tractor unit with BigSpace cab. Excellent fuel economy, predictive powertrain control, and full Mercedes warranty remaining.',
    features: [
      'BigSpace Cab',
      'Predictive Powertrain Control',
      'Active Brake Assist 5',
      'MirrorCam',
      'Multimedia Cockpit',
      'Premium Seats',
      'Fridge',
      'Microwave',
      'Night Heater'
    ],
    specifications: {
      fuelType: 'Diesel',
      bodyType: 'Tractor Unit',
      power: 450,
      torque: 2200,
      axleConfiguration: '6x2',
      euroStandard: 'Euro 6',
      wheelbase: 3900
    }
  }
]

class AutoTraderDemoScraper {
  private vehicles: any[] = []
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

  async scrapeDemo() {
    this.logMessage('🚛 Starting AutoTrader Demo Scraper', 'info')
    this.logMessage('Using mock data for demonstration (no API key required)', 'warning')

    // Simulate scraping process
    for (const vehicle of mockAutoTraderData) {
      this.logMessage(`Processing ${vehicle.make} ${vehicle.model}...`, 'info')
      await this.delay(500) // Simulate network delay

      // Transform to our database format
      const transformedVehicle = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        currency: 'GBP',
        condition: vehicle.year >= 2022 ? 'new' : 'used',
        category: this.determineCategory(vehicle),
        engine_type: vehicle.specifications.fuelType?.toLowerCase() || 'diesel',
        transmission: vehicle.transmission.toLowerCase() as any,
        engine_power: vehicle.specifications.power || null,
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
        description: vehicle.description,
        available: true,
        featured: false
      }

      this.vehicles.push(transformedVehicle)
      this.logMessage(`✓ Processed: ${vehicle.make} ${vehicle.model} - £${vehicle.price.toLocaleString()}`, 'success')
    }

    this.logMessage(`\n✅ Demo scraping complete! Found ${this.vehicles.length} vehicles`, 'success')

    // Save to file
    const filename = `scripts/autotrader-demo-${Date.now()}.json`
    fs.writeFileSync(filename, JSON.stringify(this.vehicles, null, 2))
    this.logMessage(`Results saved to ${filename}`, 'success')

    return this.vehicles
  }

  private determineCategory(vehicle: any): string {
    const model = vehicle.model.toLowerCase()
    const bodyType = vehicle.specifications.bodyType?.toLowerCase() || ''

    if (bodyType.includes('pickup') || model.includes('l200')) {
      return 'pickup'
    } else if (bodyType.includes('box')) {
      return 'box-truck'
    } else if (bodyType.includes('tractor')) {
      return 'semi-truck'
    } else if (model.includes('sprinter') || model.includes('transit')) {
      return 'van'
    }

    return 'other'
  }

  async saveToDatabase(): Promise<number> {
    this.logMessage('\n💾 Saving vehicles to database...', 'info')

    let savedCount = 0
    let errorCount = 0

    for (const vehicle of this.vehicles) {
      try {
        // Check for duplicates
        const { data: existing } = await supabase
          .from('vehicles')
          .select('id')
          .eq('vin', vehicle.vin)
          .single()

        if (existing) {
          this.logMessage(`Vehicle already exists: ${vehicle.make} ${vehicle.model}`, 'warning')
          continue
        }

        // Insert vehicle
        const { error } = await supabase
          .from('vehicles')
          .insert(vehicle)

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

  getVehicles() {
    return this.vehicles
  }
}

async function main() {
  console.log('🚛 AutoTrader UK Commercial Vehicle Scraper - DEMO MODE')
  console.log('=======================================================')
  console.log('This demo uses mock data to demonstrate the scraping process')
  console.log('For production use, you\'ll need a Firecrawl API key\n')

  const scraper = new AutoTraderDemoScraper()

  try {
    // Run demo scraping
    const vehicles = await scraper.scrapeDemo()

    // Display summary
    console.log(`\n📊 Demo Results:`)
    vehicles.forEach((v, i) => {
      console.log(`${i + 1}. ${v.make} ${v.model} (${v.year}) - £${v.price.toLocaleString()}`)
      console.log(`   Category: ${v.category} | Mileage: ${v.mileage.toLocaleString()} miles`)
      console.log(`   Location: ${v.location}`)
    })

    // Ask to save to database
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

      console.log('\n📝 Note: This is demo data. For real AutoTrader scraping:')
      console.log('   1. Get a Firecrawl API key from https://firecrawl.dev')
      console.log('   2. Add it to .env.local as FIRECRAWL_API_KEY=your_key')
      console.log('   3. Run: npm run scrape-autotrader')

      console.log('\n✨ Demo complete!')
      readline.close()
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Demo failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { AutoTraderDemoScraper }