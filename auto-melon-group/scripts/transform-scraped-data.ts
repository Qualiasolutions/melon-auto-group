/**
 * Transform Firecrawl scraped data into vehicle schema format
 * This script takes the scraped data and updates bazaraki-vehicles.json
 */

import * as fs from 'fs'
import * as path from 'path'

// Scraped data from Firecrawl (from previous session)
const scrapedData = [
  {
    url: "https://www.bazaraki.com/adv/6075356_daf-2016-7-5t/",
    make: "DAF",
    model: "LF 45-150",
    year: 2016,
    price: 18000,
    mileage: 245000,
    horsepower: 150,
    transmission: "manual",
    description: "Daf Lf 45-150 hp low mileage 245k KLM's runs and drives really nice 6 speed manual. 20ft box",
    images: ["https://cdn1.bazaraki.com/media/cache1/6c/87/6c879ac1e5a914956777dc74cb567120.webp"],
    features: ["6 speed manual", "20ft box"]
  },
  {
    url: "https://www.bazaraki.com/adv/6075341_2016-isuzu-grafter-3-5t/",
    make: "Isuzu",
    model: "Grafter 3.5T",
    year: 2016,
    price: 14000,
    mileage: 347000,
    transmission: "manual",
    description: "2016 ISUZU GRAFTER 3.5T 347K KLM'S 20FT BOX WITH LIFT RUNS AND DRIVES REALLY WELL",
    images: ["https://cdn1.bazaraki.com/media/cache1/34/2a/342a8e2dc99cd79b7c0e55a4be5ef5bc.webp"],
    features: ["20ft box", "Tail lift"]
  },
  {
    url: "https://www.bazaraki.com/adv/6073536_isuzu-d-max-2-5l-2015/",
    make: "Isuzu",
    model: "D-Max 2.5L",
    year: 2015,
    price: 13000,
    mileage: 310000,
    engineCapacity: 2.5,
    transmission: "manual",
    description: "Isuzu 2.5 D-Max 4x4 2015 Only 310,000 klms Starts runs and drives lovely Very reliable Strong truck",
    images: ["https://cdn1.bazaraki.com/media/cache1/bc/66/bc66e4ff0e9b4adc0e5f1a8bae089bbb.webp"],
    features: ["4x4"]
  },
  {
    url: "https://www.bazaraki.com/adv/6071111_toyota-hilux-2-2l-2015/",
    make: "Toyota",
    model: "Hilux 2.2L",
    year: 2015,
    price: 17000,
    mileage: 285000,
    engineCapacity: 2.2,
    transmission: "manual",
    description: "Toyota Hilux 2.2 4x4 285k klms Clean truck runs and drives lovely",
    images: ["https://cdn1.bazaraki.com/media/cache1/95/e1/95e141be9abcc8e7c19f11f3743f6bcc.webp"],
    features: ["4x4"]
  },
  {
    url: "https://www.bazaraki.com/adv/6071109_nissan-navara-2-2l-2013/",
    make: "Nissan",
    model: "Navara 2.2L",
    year: 2013,
    price: 10500,
    mileage: 278000,
    engineCapacity: 2.2,
    transmission: "manual",
    description: "Nissan Navara 2.2 4x4 278k klms Starts runs and drives lovely",
    images: ["https://cdn1.bazaraki.com/media/cache1/d9/49/d94960485c959bf31cce4b0cd8ed1fcd.webp"],
    features: ["4x4"]
  },
  {
    url: "https://www.bazaraki.com/adv/6071107_isuzu-rodeo-2-2l-2011/",
    make: "Isuzu",
    model: "Rodeo 2.2L",
    year: 2011,
    price: 12500,
    mileage: 182000,
    engineCapacity: 2.2,
    transmission: "manual",
    description: "Isuzu rodeo 2.2 4x4 182k klm and ful service history. Has been maintained nice. Starts runs and drives brilliant. Has lift kit, roof rack, new tires all round, bash plates and plenty of under body and chassis protection.",
    images: ["https://cdn1.bazaraki.com/media/cache1/3f/ef/3fefd9e006caa35df6f98c91ef0cd72a.webp"],
    features: ["4x4", "Lift kit", "Roof rack", "New tires", "Bash plates", "Chassis protection"]
  },
  {
    url: "https://www.bazaraki.com/adv/6063516_mitsubishi-l200-2-3l-2020/",
    make: "Mitsubishi",
    model: "L200 2.3L",
    year: 2020,
    price: 23500,
    mileage: 166000,
    engineCapacity: 2.3,
    transmission: "automatic",
    description: "Mitsubishi l200 2.3 4x4 automatic with only 166k klms Starts runs and drives lovely",
    images: ["https://cdn1.bazaraki.com/media/cache1/f0/b9/f0b9aaf2dae134f66e850f1c95e33b16.webp"],
    features: ["4x4", "Automatic"]
  },
  {
    url: "https://www.bazaraki.com/adv/6066453_isuzu-d-max-2-2l-2018/",
    make: "Isuzu",
    model: "D-Max 2.2L",
    year: 2018,
    price: 14000,
    mileage: 224000,
    engineCapacity: 2.2,
    transmission: "manual",
    description: "Isuzu Dmax 2.2 King cab 2018 with only 224k klms Has a service history and has been well maintained Clean truck runs and drives lovely",
    images: ["https://cdn1.bazaraki.com/media/cache1/5f/a6/5fa6f3bb0a95b71bce8e79c88e831742.webp"],
    features: ["King cab", "Service history"]
  },
  {
    url: "https://www.bazaraki.com/adv/6070583_daf-7-5-tonne-2018/",
    make: "DAF",
    model: "LF 180",
    year: 2018,
    price: 16500,
    mileage: 274000,
    horsepower: 180,
    transmission: "manual",
    description: "Daf lf 180 7.5 tonne 2018 with 274k klms. Tail lift works. Runs and drives really nice. Strong truck.",
    images: ["https://cdn1.bazaraki.com/media/cache1/52/8f/528f9063e3a48af8e6f9e91c4d4d1ad9.webp"],
    features: ["Tail lift", "7.5 tonne"],
    specifications: { gvw: 7500 }
  },
  {
    url: "https://www.bazaraki.com/adv/6067385_isuzu-7-5-tonne-2016/",
    make: "Isuzu",
    model: "Forward 7.5T",
    year: 2015,
    price: 15000,
    mileage: 200000,
    transmission: "manual",
    description: "Isuzu 7.5 tonne 2015 with only 200k klms 20ft box Runs and drives brilliant Tail lift works",
    images: ["https://cdn1.bazaraki.com/media/cache1/1b/3c/1b3cd99da0eed5d90bfacc6835b60c5a.webp"],
    features: ["20ft box", "Tail lift"],
    specifications: { gvw: 7500 }
  },
  {
    url: "https://www.bazaraki.com/adv/6063230_2011-man-with-crane-flat-back/",
    make: "MAN",
    model: "TGL 7.5T",
    year: 2011,
    price: 21500,
    mileage: 300000,
    transmission: "manual",
    description: "2011 MAN 7.5 Tonne Flat back with crane Strong truck runs drives lovely",
    images: ["https://cdn1.bazaraki.com/media/cache1/aa/59/aa59e8f56fd7fc1de4b21e61a65f2a8a.webp"],
    features: ["Crane", "Flatback"],
    specifications: { gvw: 7500 }
  },
  {
    url: "https://www.bazaraki.com/adv/6055003_daf-box-2016/",
    make: "DAF",
    model: "LF280",
    year: 2016,
    price: 27000,
    mileage: 235000,
    horsepower: 280,
    transmission: "manual",
    description: "Daf lf280 18 tonne sleeper cab 2016 with only 235k klms Runs and drives lovely Strong truck",
    images: ["https://cdn1.bazaraki.com/media/cache1/c7/ba/c7ba8dd70834d5c28b9ac30bc34de7fe.webp"],
    features: ["18 tonne", "Sleeper cab"],
    specifications: { gvw: 18000 }
  },
  {
    url: "https://www.bazaraki.com/adv/6048844_ford-transit-tipper-2016/",
    make: "Ford",
    model: "Transit Tipper",
    year: 2016,
    price: 15000,
    mileage: 150000,
    transmission: "manual",
    description: "Ford transit 2016 Tipper curtain sider £15,000 Runs and drives lovely",
    images: ["https://cdn1.bazaraki.com/media/cache1/88/dc/88dc06c13e9f5129c01a9729b8d0a1a6.webp"],
    features: ["Tipper", "Curtain sider"]
  },
  {
    url: "https://www.bazaraki.com/adv/6048846_iveco-with-crane-6-5-tonne/",
    make: "Iveco",
    model: "Daily 6.5T",
    year: 2009,
    price: 22500,
    mileage: 103000, // 64,000 miles
    transmission: "manual",
    description: "Iveco 6.5 tonne with crane 2009 with only 64k miles Runs and drives brilliant",
    images: ["https://cdn1.bazaraki.com/media/cache1/61/e3/61e347a7a5e0815fbbe0cfc67c12f61d.webp"],
    features: ["Crane", "Low mileage"],
    specifications: { gvw: 6500 }
  },
  {
    url: "https://www.bazaraki.com/adv/6047893_isuzu-forward-n75-190-auto/",
    make: "Isuzu",
    model: "Forward N75 190",
    year: 2016,
    price: 14300,
    mileage: 278000,
    horsepower: 190,
    transmission: "automatic",
    description: "Isuzu forward n75 190 automatic 2016 with 278k klms Runs and drives brilliant",
    images: ["https://cdn1.bazaraki.com/media/cache1/0c/7d/0c7da78ab9e0ccb6c12d8adbe2b38154.webp"],
    features: ["Automatic"]
  }
]

async function transformData() {
  console.log('🔄 Starting data transformation...\n')

  const jsonPath = path.join(__dirname, 'bazaraki-vehicles.json')
  const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  let updatedCount = 0
  let notFoundCount = 0

  for (let i = 0; i < existingData.length; i++) {
    const vehicle = existingData[i]
    const scraped = scrapedData.find(s => s.url === vehicle.bazarakiUrl)

    if (scraped) {
      // Update with scraped data
      existingData[i] = {
        ...vehicle,
        make: scraped.make || vehicle.make,
        model: scraped.model || vehicle.model,
        year: scraped.year || vehicle.year,
        mileage: scraped.mileage || vehicle.mileage,
        price: scraped.price || vehicle.price,
        horsepower: scraped.horsepower || vehicle.horsepower || 0,
        transmission: scraped.transmission || vehicle.transmission,
        description: scraped.description || vehicle.description,
        images: scraped.images && scraped.images.length > 0 ? scraped.images : vehicle.images,
        features: scraped.features && scraped.features.length > 0 ? scraped.features : vehicle.features,
        specifications: scraped.specifications || (scraped.engineCapacity ? {
          ...vehicle.specifications,
          engineCapacity: scraped.engineCapacity
        } : vehicle.specifications)
      }
      updatedCount++
      console.log(`✅ Updated: ${scraped.make} ${scraped.model} (${scraped.year})`)
    } else {
      notFoundCount++
      console.log(`⚠️  No scraped data for: ${vehicle.bazarakiUrl}`)
    }
  }

  // Write updated data back to file
  fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2))

  console.log('\n📊 Transformation Summary:')
  console.log(`   Updated: ${updatedCount}`)
  console.log(`   Not Found: ${notFoundCount}`)
  console.log(`   Total: ${existingData.length}`)
  console.log(`\n✨ Data saved to: ${jsonPath}`)
  console.log('\n🚀 Next step: Run npm run import-vehicles to import to Supabase')
}

transformData()
