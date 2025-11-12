#!/usr/bin/env tsx

// Script to check vehicle data integrity and find potential issues
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkVehicleDataIntegrity() {
  console.log('🔍 Checking vehicle data integrity...\n')

  try {
    // Get all vehicles
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')

    if (error) {
      console.log('❌ Error fetching vehicles:', error.message)
      return
    }

    console.log(`📋 Found ${vehicles?.length || 0} total vehicles\n`)

    let issueCount = 0
    const issues: string[] = []

    vehicles?.forEach((vehicle, index) => {
      console.log(`\n${index + 1}. Checking: ${vehicle.make} ${vehicle.model} (${vehicle.year})`)
      console.log(`   ID: ${vehicle.id}`)

      // Check required fields
      const requiredFields = ['id', 'make', 'model', 'year', 'price', 'currency']
      const missingFields = requiredFields.filter(field => !vehicle[field as keyof typeof vehicle])

      if (missingFields.length > 0) {
        issues.push(`Vehicle ${vehicle.id}: Missing required fields: ${missingFields.join(', ')}`)
        console.log(`   ❌ Missing required fields: ${missingFields.join(', ')}`)
        issueCount++
      } else {
        console.log(`   ✅ All required fields present`)
      }

      // Check images array
      if (!vehicle.images) {
        issues.push(`Vehicle ${vehicle.id}: Images array is null/undefined`)
        console.log(`   ❌ Images array is null/undefined`)
        issueCount++
      } else if (!Array.isArray(vehicle.images)) {
        issues.push(`Vehicle ${vehicle.id}: Images is not an array (type: ${typeof vehicle.images})`)
        console.log(`   ❌ Images is not an array (type: ${typeof vehicle.images})`)
        issueCount++
      } else {
        console.log(`   ✅ Images array: ${vehicle.images.length} images`)

        // Check individual image URLs
        vehicle.images.forEach((image, imgIndex) => {
          if (typeof image !== 'string') {
            issues.push(`Vehicle ${vehicle.id}: Image ${imgIndex} is not a string (type: ${typeof image})`)
            console.log(`   ❌ Image ${imgIndex}: not a string (${typeof image})`)
            issueCount++
          } else if (!image.startsWith('http')) {
            if (image.startsWith('/')) {
              console.log(`   ⚠️  Image ${imgIndex}: Local path (${image})`)
            } else {
              issues.push(`Vehicle ${vehicle.id}: Image ${imgIndex}: Invalid URL (${image})`)
              console.log(`   ❌ Image ${imgIndex}: Invalid URL (${image})`)
              issueCount++
            }
          }
        })
      }

      // Check specifications
      if (vehicle.specifications) {
        if (typeof vehicle.specifications !== 'object' || Array.isArray(vehicle.specifications)) {
          issues.push(`Vehicle ${vehicle.id}: Specifications is not an object (type: ${typeof vehicle.specifications})`)
          console.log(`   ❌ Specifications: not an object (${typeof vehicle.specifications})`)
          issueCount++
        } else {
          console.log(`   ✅ Specifications: ${Object.keys(vehicle.specifications).length} properties`)
        }
      }

      // Check features array
      if (vehicle.features) {
        if (!Array.isArray(vehicle.features)) {
          issues.push(`Vehicle ${vehicle.id}: Features is not an array (type: ${typeof vehicle.features})`)
          console.log(`   ❌ Features: not an array (${typeof vehicle.features})`)
          issueCount++
        } else {
          console.log(`   ✅ Features: ${vehicle.features.length} items`)
        }
      }

      // Check numeric fields
      const numericFields = ['year', 'mileage', 'price', 'horsepower']
      numericFields.forEach(field => {
        const value = vehicle[field as keyof typeof vehicle]
        if (value !== null && value !== undefined && (typeof value !== 'number' || isNaN(value))) {
          issues.push(`Vehicle ${vehicle.id}: ${field} should be number, got ${typeof value} (${value})`)
          console.log(`   ❌ ${field}: should be number, got ${typeof value} (${value})`)
          issueCount++
        }
      })

      // Check string fields
      const stringFields = ['make', 'model', 'condition', 'category', 'engine_type', 'transmission', 'location', 'country']
      stringFields.forEach(field => {
        const value = vehicle[field as keyof typeof vehicle]
        if (value !== null && value !== undefined && typeof value !== 'string') {
          issues.push(`Vehicle ${vehicle.id}: ${field} should be string, got ${typeof value} (${value})`)
          console.log(`   ❌ ${field}: should be string, got ${typeof value} (${value})`)
          issueCount++
        }
      })
    })

    console.log(`\n📊 Summary:`)
    console.log(`Total vehicles: ${vehicles?.length || 0}`)
    console.log(`Issues found: ${issueCount}`)

    if (issues.length > 0) {
      console.log(`\n🚨 All Issues:`)
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })

      console.log(`\n💡 Recommendations:`)
      console.log('1. Fix vehicles with missing required fields')
      console.log('2. Convert images arrays to proper string arrays')
      console.log('3. Fix non-numeric values in numeric fields')
      console.log('4. Fix non-string values in string fields')
    } else {
      console.log(`\n✅ All vehicle data integrity checks passed!`)
    }

  } catch (err) {
    console.error('❌ Error checking vehicle data integrity:', err)
  }
}

checkVehicleDataIntegrity()