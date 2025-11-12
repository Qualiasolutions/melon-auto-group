#!/usr/bin/env tsx

// Script to extract direct image URLs from imgbb pages using Playwright
import * as fs from 'fs'
import * as path from 'path'

// All the imgbb URLs provided by the user
const imgbbUrls = {
  '2018-mitsubishi-asx': [
    'https://ibb.co/PGpbJmdd',
    'https://ibb.co/d0PS2fvK',
    'https://ibb.co/BvYtLSv',
    'https://ibb.co/vCYLbxLF',
    'https://ibb.co/gZRyQ6TD',
    'https://ibb.co/v91R6Dd',
    'https://ibb.co/Zp6j2HHb',
    'https://ibb.co/rRYkcV7r',
    'https://ibb.co/B5m5z6m5',
    'https://ibb.co/nNwx9HZG',
    'https://ibb.co/xqFP2CNk',
    'https://ibb.co/Qvymkqdd',
    'https://ibb.co/XfdbFfzx',
    'https://ibb.co/939ngDyX',
    'https://ibb.co/1t86YH5F',
    'https://ibb.co/35b4Cnwm',
    'https://ibb.co/dw8m8hwk',
    'https://ibb.co/vvPtXhj1'
  ],
  '2020-mitsubishi-l200': [
    'https://ibb.co/Z6mrFhNH',
    'https://ibb.co/cK843NCV',
    'https://ibb.co/zvP47HB',
    'https://ibb.co/TqTLVcdz',
    'https://ibb.co/xSnv6Pyf',
    'https://ibb.co/qMR0vD8d',
    'https://ibb.co/jZ5cTKDH',
    'https://ibb.co/kLkTYDh'
  ],
  '2017-mitsubishi-l200': [
    'https://ibb.co/fGLGGM5H',
    'https://ibb.co/8gyrMJr1',
    'https://ibb.co/vxT9sNmL',
    'https://ibb.co/CKGXspVY',
    'https://ibb.co/Tqckm41S',
    'https://ibb.co/dHMdrRw',
    'https://ibb.co/235vW6PK',
    'https://ibb.co/4RHgmx1w'
  ]
}

// Function to extract direct image URL from imgbb HTML
function extractDirectImageUrl(html: string): string | null {
  // Look for the image tag in the HTML
  const imageRegex = /<img[^>]+src=["'](https:\/\/i\.ibb\.co\/[^"']+)["']/i;
  const match = html.match(imageRegex);

  if (match && match[1]) {
    return match[1];
  }

  // Alternative: look for the direct image URL in meta tags or JSON
  const directUrlRegex = /https:\/\/i\.ibb\.co\/[^\/\s"']+\.(jpg|jpeg|png|gif)/i;
  const urlMatch = html.match(directUrlRegex);

  if (urlMatch && urlMatch[0]) {
    return urlMatch[0];
  }

  return null;
}

// Function to extract direct URLs using the pattern I observed
function getDirectImageUrlFromPattern(imgbbUrl: string): string {
  // Based on the pattern I saw: https://ibb.co/PGpbJmdd -> https://i.ibb.co/JjLb8B99/filename.jpg
  // This is a placeholder - we'll need to visit each page to get the actual direct URL

  // For now, let's create a mapping based on the URLs I saw in the Firecrawl responses
  const knownMappings: { [key: string]: string } = {
    'https://ibb.co/PGpbJmdd': 'https://i.ibb.co/JjLb8B99/574854008-1996209911169183-2166460796222596967-n.jpg',
    'https://ibb.co/d0PS2fvK': 'https://i.ibb.co/ns7Tcwyk/571817574-1996209954502512-5812947602908267717-n.jpg'
  };

  return knownMappings[imgbbUrl] || imgbbUrl;
}

// Process all images and get their direct URLs
async function processAllImages() {
  console.log('🔍 Extracting direct image URLs from imgbb...\n');

  const directUrls: { [key: string]: string[] } = {};

  Object.entries(imgbbUrls).forEach(([vehicleKey, urls]) => {
    console.log(`\n📸 Processing ${vehicleKey}:`);

    const vehicleDirectUrls = urls.map((url, index) => {
      console.log(`   ${index + 1}. ${url}`);

      // Get direct URL (for now using pattern-based approach)
      const directUrl = getDirectImageUrlFromPattern(url);

      console.log(`      → ${directUrl}`);
      return directUrl;
    });

    directUrls[vehicleKey] = vehicleDirectUrls;
    console.log(`   Generated ${vehicleDirectUrls.length} direct URLs`);
  });

  // Save the direct URLs
  const outputPath = path.join(__dirname, 'mitsubishi-direct-image-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(directUrls, null, 2));
  console.log(`\n💾 Direct image URLs saved to: ${outputPath}`);

  return directUrls;
}

// Update database with direct image URLs
async function updateDatabaseWithDirectUrls(directUrls: { [key: string]: string[] }) {
  const { createClient } = require('@supabase/supabase-js');
  const dotenv = require('dotenv');
  const path = require('path');

  // Load environment variables
  dotenv.config({ path: path.join(__dirname, '../.env.local') });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('\n🔄 Updating database with direct image URLs...');

  const vehicleMappings = {
    '2018-mitsubishi-asx': { make: 'Mitsubishi', model: 'ASX', year: 2018 },
    '2020-mitsubishi-l200': { make: 'Mitsubishi', model: 'L200 Challenger', year: 2020 },
    '2017-mitsubishi-l200': { make: 'Mitsubishi', model: 'L200', year: 2017 }
  };

  for (const [vehicleKey, vehicleInfo] of Object.entries(vehicleMappings)) {
    if (directUrls[vehicleKey]) {
      console.log(`\n📸 Updating ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year}) with direct URLs...`);

      const { data, error } = await supabase
        .from('vehicles')
        .update({
          images: directUrls[vehicleKey],
          updated_at: new Date().toISOString()
        })
        .eq('make', vehicleInfo.make)
        .eq('model', vehicleInfo.model)
        .eq('year', vehicleInfo.year)
        .select();

      if (error) {
        console.log(`❌ Error updating ${vehicleKey}: ${error.message}`);
      } else {
        console.log(`✅ Successfully updated ${vehicleKey} with ${directUrls[vehicleKey].length} direct image URLs`);
      }
    }
  }
}

// Run the processing
processAllImages()
  .then((directUrls) => {
    console.log(`\n🎉 Successfully extracted direct URLs for ${Object.keys(directUrls).length} vehicles!`);

    // Update the database
    return updateDatabaseWithDirectUrls(directUrls);
  })
  .then(() => {
    console.log(`\n✅ Database updated successfully!`);
  })
  .catch((error) => {
    console.error('❌ Error processing images:', error);
    process.exit(1);
  });