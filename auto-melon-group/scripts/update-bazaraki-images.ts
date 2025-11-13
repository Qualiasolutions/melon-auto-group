import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// Mapping of Bazaraki URLs to their high-quality image URLs (scraped via Firecrawl)
const imageUpdates: Record<string, string[]> = {
  'https://www.bazaraki.com/adv/6075356_daf-2016-7-5t/': [
    'https://cdn1.bazaraki.com/media/cache1/6c/87/6c879ac1e5a914956777dc74cb567120.webp',
    'https://cdn1.bazaraki.com/media/cache1/52/eb/52eb6178899bee1ddeb7cb5c3b6f76a8.webp',
    'https://cdn1.bazaraki.com/media/cache1/a1/19/a1194c99b9cb5af0d0209b0a2451631c.webp'
  ],
  'https://www.bazaraki.com/adv/6075341_2016-isuzu-grafter-3-5t/': [
    'https://cdn1.bazaraki.com/media/cache1/88/e6/88e6fc095f1a3e0a0212bfc36ddbca61.webp',
    'https://cdn1.bazaraki.com/media/cache1/bd/72/bd72c4d55e93eec31850c691cc9fefc5.webp',
    'https://cdn1.bazaraki.com/media/cache1/3a/ba/3abafc1d2d00087d3b672499042c3d23.webp',
    'https://cdn1.bazaraki.com/media/cache1/28/d6/28d6c806a336c7eaf3b75eb7ac1fed67.webp'
  ],
  'https://www.bazaraki.com/adv/6073536_isuzu-d-max-2-5l-2015/': [
    'https://cdn1.bazaraki.com/media/cache1/3e/59/3e59b64fccfa1127e7736b23da15bd01.webp',
    'https://cdn1.bazaraki.com/media/cache1/35/81/358167955c7919ac06ee83058d283805.webp',
    'https://cdn1.bazaraki.com/media/cache1/64/1d/641d5c37ef9d5f6adbd55dc437271e9c.webp',
    'https://cdn1.bazaraki.com/media/cache1/60/be/60be2cdb3a1d274a762ba0a7fe7ce815.webp'
  ],
  'https://www.bazaraki.com/adv/6071111_toyota-hilux-2-2l-2015/': [
    'https://cdn1.bazaraki.com/media/cache1/4e/ea/4eea9df30ff2a914b9d894deca8b4ff9.webp'
  ],
  'https://www.bazaraki.com/adv/6071109_nissan-navara-2-2l-2013/': [
    'https://cdn1.bazaraki.com/media/cache1/ed/ab/edabd4bf01d3804c305c6e85dbf2349d.webp',
    'https://cdn1.bazaraki.com/media/cache1/3f/3f/3f3f1ce8063d32bd95c93d1f523464e9.webp',
    'https://cdn1.bazaraki.com/media/cache1/2b/6d/2b6dc85df342d2a23fca53a11dd4bb9a.webp',
    'https://cdn1.bazaraki.com/media/cache1/0f/37/0f37c14c5ca326311a8feeb57715f4d0.webp'
  ],
  'https://www.bazaraki.com/adv/6071107_isuzu-rodeo-2-2l-2011/': [
    'https://cdn1.bazaraki.com/media/cache1/a4/69/a4696c4a661eaee7662f89fcd0458dae.webp',
    'https://cdn1.bazaraki.com/media/cache1/a7/16/a716bc1580e5bf5c4f1544903c27cce9.webp',
    'https://cdn1.bazaraki.com/media/cache1/3f/61/3f6181080746301b52cdbaeccb58c9f2.webp',
    'https://cdn1.bazaraki.com/media/cache1/18/0d/180dc06bc0bb1612d9eb6190b436f439.webp',
    'https://cdn1.bazaraki.com/media/cache1/1e/07/1e079f1c7265666ae4ee6ee88e6491c0.webp',
    'https://cdn1.bazaraki.com/media/cache1/2e/be/2ebeecd071583c37775dd564b811614f.webp'
  ],
  'https://www.bazaraki.com/adv/6063516_mitsubishi-l200-2-3l-2020/': [
    'https://cdn1.bazaraki.com/media/cache1/94/bd/94bda0dd848082328e88b793db3c12e5.webp',
    'https://cdn1.bazaraki.com/media/cache1/8e/d0/8ed04c63f6ce951c6a43da883b02a47c.webp',
    'https://cdn1.bazaraki.com/media/cache1/1a/92/1a92d11852fc4bfde9a22b87700e8859.webp',
    'https://cdn1.bazaraki.com/media/cache1/ce/18/ce18fdfedbc927a54f02e76885e6cee9.webp',
    'https://cdn1.bazaraki.com/media/cache1/90/47/9047dcb95db3808875bb07660b8ea499.webp'
  ],
  'https://www.bazaraki.com/adv/6066453_isuzu-d-max-2-2l-2018/': [
    'https://cdn1.bazaraki.com/media/cache1/1d/37/1d37c5f037aa3eaf996be2b313ef43b8.webp',
    'https://cdn1.bazaraki.com/media/cache1/04/b7/04b7d41686ac2a937375aab7375e70b8.webp',
    'https://cdn1.bazaraki.com/media/cache1/5f/18/5f18050c8f738129fab4c7c0adec763b.webp',
    'https://cdn1.bazaraki.com/media/cache1/f2/fd/f2fdfebd2ade01328e340a4ce0964b51.webp',
    'https://cdn1.bazaraki.com/media/cache1/63/38/6338be2625e9088add7954f5d1de92d3.webp',
    'https://cdn1.bazaraki.com/media/cache1/34/ce/34cec98a2c54e656ef0b85b1c2855c41.webp',
    'https://cdn1.bazaraki.com/media/cache1/14/07/140730ad0f76179e5951322b3175bd42.webp',
    'https://cdn1.bazaraki.com/media/cache1/3d/64/3d64336ad5cdf2f33281ae99bc1f645e.webp',
    'https://cdn1.bazaraki.com/media/cache1/dd/38/dd387c2a66c3c52a80abcd84e75b57ff.webp',
    'https://cdn1.bazaraki.com/media/cache1/01/aa/01aa76be557cc1f18e7b3a4c594f35c5.webp',
    'https://cdn1.bazaraki.com/media/cache1/9a/3f/9a3f4b3bd3780ecedc60c88bd6df5a17.webp'
  ],
  'https://www.bazaraki.com/adv/6070583_daf-7-5-tonne-2018/': [
    'https://cdn1.bazaraki.com/media/cache1/42/f6/42f673d0664eae666c5a4d8499ed71ec.webp',
    'https://cdn1.bazaraki.com/media/cache1/ee/af/eeaf6e30d30c30d737623b802c73007e.webp'
  ],
  'https://www.bazaraki.com/adv/6067385_isuzu-7-5-tonne-2016/': [
    'https://cdn1.bazaraki.com/media/cache1/9d/9c/9d9c3b625e9b32163732ab5410585296.webp',
    'https://cdn1.bazaraki.com/media/cache1/c6/fb/c6fb1d371895a8a4517eec42e9604116.webp',
    'https://cdn1.bazaraki.com/media/cache1/87/79/87791c1942e5607f0643a3b2c0d51b25.webp'
  ],
  'https://www.bazaraki.com/adv/6063230_2011-man-with-crane-flat-back/': [
    'https://cdn1.bazaraki.com/media/cache1/85/00/85006c5ac404a469e0fe7fd54924bb30.webp',
    'https://cdn1.bazaraki.com/media/cache1/8d/18/8d188e5c2fd0b81b3d8d986758d53c80.webp',
    'https://cdn1.bazaraki.com/media/cache1/9a/b3/9ab3fbdc872df46520d3cdfd5b94ec36.webp',
    'https://cdn1.bazaraki.com/media/cache1/85/b0/85b085924d4e6242653875757df741a3.webp',
    'https://cdn1.bazaraki.com/media/cache1/51/b1/51b1049914d98a639c1016d839fa116f.webp',
    'https://cdn1.bazaraki.com/media/cache1/bb/39/bb392fbe200ceb731b7288575c0f5990.webp',
    'https://cdn1.bazaraki.com/media/cache1/55/6d/556d3f0a9afd44202deebd3a11109993.webp',
    'https://cdn1.bazaraki.com/media/cache1/26/96/2696b378fbc89cc12d12236e0afa8969.webp'
  ],
  'https://www.bazaraki.com/adv/6055003_daf-box-2016/': [
    'https://cdn1.bazaraki.com/media/cache1/d4/44/d44468499e6acdd33cf7274224ecd25f.webp',
    'https://cdn1.bazaraki.com/media/cache1/d2/83/d283a62c2ac7bbef130176bd61383589.webp',
    'https://cdn1.bazaraki.com/media/cache1/9f/ff/9fff8a2bfd4c634ea8b86a37d8775246.webp',
    'https://cdn1.bazaraki.com/media/cache1/01/5e/015e4878d5b07ffb1b705825b3180643.webp',
    'https://cdn1.bazaraki.com/media/cache1/43/a8/43a865494c1b893cf37a4baf87180987.webp'
  ],
  'https://www.bazaraki.com/adv/6048844_ford-transit-tipper-2016/': [
    'https://cdn1.bazaraki.com/media/cache1/6c/cf/6ccfaf50f5534fe385524926fad53ee7.webp',
    'https://cdn1.bazaraki.com/media/cache1/5c/75/5c75ee9cac98bf7ed366710e57a087b7.webp',
    'https://cdn1.bazaraki.com/media/cache1/98/1b/981ba13498e9f148067d2f315b730298.webp',
    'https://cdn1.bazaraki.com/media/cache1/70/f2/70f2f4a8ed00fc44610732010bc76d17.webp',
    'https://cdn1.bazaraki.com/media/cache1/80/4c/804c1121263408d9fe754bba79d9eba2.webp',
    'https://cdn1.bazaraki.com/media/cache1/67/5e/675ed393e979e362f7a84b73cc5e3057.webp'
  ],
  'https://www.bazaraki.com/adv/6048846_iveco-with-crane-6-5-tonne/': [
    'https://cdn1.bazaraki.com/media/cache1/b3/6b/b36b24149513f8c868a9209fdf42d248.webp',
    'https://cdn1.bazaraki.com/media/cache1/03/30/033048d2984fb8cf9b4477ee7ae80b2a.webp',
    'https://cdn1.bazaraki.com/media/cache1/f2/e7/f2e7aad18cf64fc52ec618ceacc095b3.webp',
    'https://cdn1.bazaraki.com/media/cache1/c5/3a/c53ae9c8c1107ea361f4edd037167788.webp',
    'https://cdn1.bazaraki.com/media/cache1/04/cd/04cd1e2f22155364079357175d8b5378.webp',
    'https://cdn1.bazaraki.com/media/cache1/1d/57/1d576901349c43d66f012d2bbda67f8c.webp'
  ],
  'https://www.bazaraki.com/adv/6047893_isuzu-forward-n75-190-auto/': [
    'https://cdn1.bazaraki.com/media/cache1/51/02/510272c025e5850ab9217a838ce8f1a9.webp',
    'https://cdn1.bazaraki.com/media/cache1/dd/33/dd33033ffca3ae9d045cd8dc7927a4a7.webp',
    'https://cdn1.bazaraki.com/media/cache1/d9/a3/d9a35856b2b976d5075634c89b95ce8a.webp',
    'https://cdn1.bazaraki.com/media/cache1/f8/7c/f87cd552e010626b3e4d61e9f25b12a4.webp',
    'https://cdn1.bazaraki.com/media/cache1/ab/0f/ab0fe72f6d8aa632ced53a076bb69cf9.webp',
    'https://cdn1.bazaraki.com/media/cache1/38/cf/38cf096fc73e6feb9dbfd28319eab806.webp',
    'https://cdn1.bazaraki.com/media/cache1/b7/82/b782a7522d9c81c083bd7f7bd57f12f7.webp',
    'https://cdn1.bazaraki.com/media/cache1/11/15/111574c20321f5bc9034a17e2672b23b.webp',
    'https://cdn1.bazaraki.com/media/cache1/1f/9e/1f9ee132b74b9b9b5c8d0c4676863f41.webp'
  ]
}

async function updateVehicleImages() {
  console.log('🚀 Starting image URL updates...\n')

  let updated = 0
  let failed = 0
  let notFound = 0

  for (const [bazarakiUrl, newImages] of Object.entries(imageUpdates)) {
    try {
      console.log(`\n📋 Processing: ${bazarakiUrl}`)

      // Find vehicle by bazaraki_url
      const { data: vehicles, error: fetchError } = await supabase
        .from('vehicles')
        .select('id, make, model, year, images')
        .eq('bazaraki_url', bazarakiUrl)

      if (fetchError) {
        console.error(`   ❌ Fetch error: ${fetchError.message}`)
        failed++
        continue
      }

      if (!vehicles || vehicles.length === 0) {
        console.log(`   ⚠️  Vehicle not found in database`)
        notFound++
        continue
      }

      const vehicle = vehicles[0]
      console.log(`   🚗 Found: ${vehicle.year} ${vehicle.make} ${vehicle.model}`)
      console.log(`   📸 Old images: ${vehicle.images?.length || 0}`)
      console.log(`   📸 New images: ${newImages.length}`)

      // Update images
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ images: newImages })
        .eq('id', vehicle.id)

      if (updateError) {
        console.error(`   ❌ Update error: ${updateError.message}`)
        failed++
        continue
      }

      console.log(`   ✅ Successfully updated images`)
      updated++

    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Update Summary:')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⚠️  Not found: ${notFound}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📦 Total: ${Object.keys(imageUpdates).length}`)
  console.log('='.repeat(60))
}

updateVehicleImages().catch(console.error)
