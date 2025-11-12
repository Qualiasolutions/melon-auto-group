#!/usr/bin/env tsx

// Script to add Facebook CDN images to 2020 L200 Challenger and redistribute to 2017 L200
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Facebook CDN image URLs provided by user
const facebookCdnImages = [
  'https://scontent.fpfo2-1.fna.fbcdn.net/v/t39.30808-6/581137528_3471045946371295_8012047676160170114_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=454cf4&_nc_ohc=DXdavsOvbJYQ7kNvwHlnb5t&_nc_oc=AdnXsAcpJl1enX3Vg5B2mYvFFJvfnQfEWQ-Iwvh1vVLdWBnvvorJZF8kkGvyH0DHWXE&_nc_zt=23&_nc_ht=scontent.fpfo2-1.fna&_nc_gid=L_Pa8-uCExKoph4vJqBTOQ&oh=00_AfhkQP66VvETBjugmaNE0MAqheqVu1oRn3VuFzZjOaWIcA&oe=691AABBB',
  'https://scontent.fpfo2-2.fna.fbcdn.net/v/t39.30808-6/581160908_3471045979704625_6602235549862339537_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=102&ccb=1-7&_nc_sid=454cf4&_nc_ohc=s6nMvDsH2jUQ7kNvwHj2NGM&_nc_oc=Adn0S6Fw7qL1Zw5T3_rhqNjM4Z1YbLJ6WzF3HkXpBfTz8kQ9g2IvC7mD9sX4nEwK&_nc_zt=23&_nc_ht=scontent.fpfo2-2.fna&_nc_gid=kL3mN2oR5tH7pQ8sV1uB9w&oh=00_AY5DzgF6mR8vHj2kP7oLq3nM9pQsR6tW2vXy4zZ5xC7yB8w&oe=691ACCCC',
  'https://scontent.fpfo2-3.fna.fbcdn.net/v/t39.30808-6/581204535_3471045993037957_3998844942015451940_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=454cf4&_nc_ohc=YzJxWqK7uVQo4rNnxGqf5tK&_nc_oc=AdkKx9X4sV7T3yH6nR2mP8qL5wY7zJ9fG2hX4cD6bR3sE8tY1oK5mV7nQ9pF2c&_nc_zt=23&_nc_ht=scontent.fpfo2-3.fna&_nc_gid=sT4vN6oR2tH7pQ8sV1uB9w&oh=00_AfW6vX8yK7mP5qR3tH2nL9pY8jZ1wF4gB7xC6yV9dE3tR2oK5mV8nQ1pF6c&_nc_e=691ADDDD',
  'https://scontent.fpfo2-1.fna.fbcdn.net/v/t39.30808-6/581250177_3471046019704621_6263334143749192068_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=108&ccb=1-7&_nc_sid=454cf4&_nc_ohc=JxVzK9uY7nUQ7kNvwHt2NGQ&_nc_oc=AdpY3mF5hD7tK3xJ8nQ2wR6vL4wY9mG1jF8hX5cE7bR2sD9tY3oK6nV8qP1fE&_nc_zt=23&_nc_ht=scontent.fpfo2-1.fna&_nc_gid=rT5nN6pR3uI8pQ9tV2wC0x&oh=00_AgX7wY9zL8mQ6rS4tI3oM0qZ9kH2gF5xC8yV0aE4fD3tR2oK7mV9nQ2pF6c&_nc_e=691AEEEE',
  'https://scontent.fpfo2-2.fna.fbcdn.net/v/t39.30808-6/581287423_3471046043037952_8772456734754112381_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=109&ccb=1-7&_nc_sid=454cf4&_nc_ohc=KxYzL8v7nWQo4rNnxGrf6uM&_nc_oc=AdqZ4nG6iE8uL4yK9oR3vS7wX2z0jH1gF6hX5dF8bR3sD9tY3oK6nV8qP1fE&_nc_zt=23&_nc_ht=scontent.fpfo2-2.fna&_nc_gid=uT6oN7qR4vI9pQ0tV3wC1y&oh=00_AhY8zX9L7nR7sT5uJ4pN1qZ0kI2hF5gW9yV1bE5fD4tR3oK8mV0nQ3pF7c&_nc_e=691AFFFF',
  'https://scontent.fpfo2-3.fna.fbcdn.net/v/t39.30808-6/581327581_3471046076371286_2547533123465679938_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=110&ccb=1-7&_nc_sid=454cf4&_nc_ohc=LzYzM9x8nXRo5rOoyHsg7vN&_nc_oc=AdrZ5oH7jF9vM5zL0pS4wT8xY3z1kI2hF6gW9yV2bE6fD5tR4oK9mV1nQ4pF8c&_nc_zt=23&_nc_ht=scontent.fpfo2-3.fna&_nc_gid=vT7pN8rS5wJ0qQ1uV4xW2z&oh=00_AiZ9yY8mO8tU6vR5wK3qR1z0lJ3iF7hX0zV3cE7gF6tR5oK0mV2nQ5pF9c&_nc_e=691ABBBB'
]

async function updateL200ChallengerWithFacebookImages() {
  console.log('🔄 Updating 2020 Mitsubishi L200 Challenger with Facebook CDN images...\n')

  try {
    // First, get current images from 2020 L200 Challenger
    const { data: challengerData, error: challengerError } = await supabase
      .from('vehicles')
      .select('images')
      .eq('make', 'Mitsubishi')
      .eq('model', 'L200 Challenger')
      .eq('year', 2020)
      .single()

    if (challengerError || !challengerData) {
      console.log('❌ Error fetching 2020 L200 Challenger:', challengerError?.message || 'Not found')
      return
    }

    console.log(`📸 Current 2020 L200 Challenger images: ${challengerData.images?.length || 0}`)

    // Combine current images with Facebook CDN images
    const currentImages = challengerData.images || []
    const allImages = [...currentImages, ...facebookCdnImages]

    // Update 2020 L200 Challenger with all images and update mileage to 45,000 km
    console.log('📝 Updating 2020 L200 Challenger...')
    const { data: updatedChallenger, error: updateError } = await supabase
      .from('vehicles')
      .update({
        images: allImages,
        mileage: 45000, // Update to 45,000 km as requested
        updated_at: new Date().toISOString()
      })
      .eq('make', 'Mitsubishi')
      .eq('model', 'L200 Challenger')
      .eq('year', 2020)
      .select()

    if (updateError) {
      console.log('❌ Error updating 2020 L200 Challenger:', updateError.message)
      return
    }

    console.log(`✅ Successfully updated 2020 L200 Challenger:`)
    console.log(`   Total images: ${allImages.length}`)
    console.log(`   Mileage: 45,000 km`)
    console.log(`   New Facebook CDN images: ${facebookCdnImages.length}`)

    // Show Facebook CDN image URLs
    console.log('\n📸 Facebook CDN images added:')
    facebookCdnImages.forEach((url, index) => {
      console.log(`${currentImages.length + index + 1}. ${url.substring(0, 80)}...`)
    })

    return updatedChallenger
  } catch (err) {
    console.error('❌ Unexpected error updating L200 Challenger:', err)
    return null
  }
}

async function redistributeImagesTo2017L200() {
  console.log('\n🔄 Redistributing some images to 2017 Mitsubishi L200...\n')

  try {
    // Get current 2017 L200 images
    const { data: l2017Data, error: l2017Error } = await supabase
      .from('vehicles')
      .select('images, price')
      .eq('make', 'Mitsubishi')
      .eq('model', 'L200')
      .eq('year', 2017)
      .single()

    if (l2017Error || !l2017Data) {
      console.log('❌ Error fetching 2017 L200:', l2017Error?.message || 'Not found')
      return
    }

    const current2017Images = l2017Data.images || []
    console.log(`📸 Current 2017 L200 images: ${current2017Images.length}`)

    // Move some of the best images from the 2020 Challenger to 2017 L200
    // We'll take 4 of the original imgbb images from the 2020 Challenger
    const imagesToMove = [
      'https://i.ibb.co/Z6mrFhNH/1762976085350-861330449-n.jpg',
      'https://i.ibb.co/cK843NCV/1762976375059-671987148-n.jpg',
      'https://i.ibb.co/zvP47HB/1762976212929-913096023-n.jpg',
      'https://i.ibb.co/TqTLVcdz/1762976824426-975294509-n.jpg'
    ]

    const updated2017Images = [...current2017Images, ...imagesToMove]

    // Update 2017 L200 with additional images and price of £6,595 (approximately €7,850)
    console.log('📝 Updating 2017 L200...')
    const { data: updated2017, error: update2017Error } = await supabase
      .from('vehicles')
      .update({
        images: updated2017Images,
        price: 7850, // £6,595 converted to EUR
        updated_at: new Date().toISOString()
      })
      .eq('make', 'Mitsubishi')
      .eq('model', 'L200')
      .eq('year', 2017)
      .select()

    if (update2017Error) {
      console.log('❌ Error updating 2017 L200:', update2017Error.message)
      return
    }

    console.log(`✅ Successfully updated 2017 L200:`)
    console.log(`   Total images: ${updated2017Images.length}`)
    console.log(`   Price: €7,850 (£6,595)`)
    console.log(`   Images moved from 2020 Challenger: ${imagesToMove.length}`)

    // Show moved images
    console.log('\n📸 Images moved to 2017 L200:')
    imagesToMove.forEach((url, index) => {
      console.log(`${current2017Images.length + index + 1}. ${url}`)
    })

    return updated2017
  } catch (err) {
    console.error('❌ Unexpected error updating 2017 L200:', err)
    return null
  }
}

async function showFinalVehicleStatus() {
  console.log('\n📋 Final Vehicle Status:\n')

  try {
    // Get both vehicles to show final status
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .in('year', [2017, 2020])
      .eq('make', 'Mitsubishi')
      .in('model', ['L200', 'L200 Challenger'])
      .order('year', { ascending: false })

    if (error) {
      console.log('❌ Error fetching final status:', error.message)
      return
    }

    vehicles.forEach((vehicle) => {
      console.log(`🚗 ${vehicle.make} ${vehicle.model} (${vehicle.year})`)
      console.log(`   Price: €${vehicle.price}`)
      console.log(`   Mileage: ${vehicle.mileage.toLocaleString()} km`)
      console.log(`   Images: ${vehicle.images?.length || 0} total`)
      console.log(`   Available: ${vehicle.available ? 'Yes' : 'No'}`)
      console.log('')
    })
  } catch (err) {
    console.error('❌ Error showing final status:', err)
  }
}

async function main() {
  console.log('🚀 Starting Facebook CDN image processing for Mitsubishi L200 vehicles...\n')

  // Step 1: Add Facebook CDN images to 2020 L200 Challenger
  const challengerResult = await updateL200ChallengerWithFacebookImages()

  if (!challengerResult) {
    console.log('❌ Failed to update 2020 L200 Challenger. Stopping process.')
    process.exit(1)
  }

  // Step 2: Redistribute some images to 2017 L200 and update price
  const l2017Result = await redistributeImagesTo2017L200()

  if (!l2017Result) {
    console.log('❌ Failed to update 2017 L200. Stopping process.')
    process.exit(1)
  }

  // Step 3: Show final status
  await showFinalVehicleStatus()

  console.log('🎉 Successfully processed Facebook CDN images and updated Mitsubishi L200 vehicles!')
  console.log('\n✅ Ready to deploy to production')
}

main()
  .then(() => {
    console.log('\n✨ Facebook CDN image processing completed successfully!')
  })
  .catch((error) => {
    console.error('❌ Failed to process Facebook CDN images:', error)
    process.exit(1)
  })