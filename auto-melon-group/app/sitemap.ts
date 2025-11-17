import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { supabase } from '@/lib/supabase/client'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          el: `${baseUrl}/el`,
        },
      },
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/inventory`,
          el: `${baseUrl}/el/inventory`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          el: `${baseUrl}/el/about`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          el: `${baseUrl}/el/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/faq`,
          el: `${baseUrl}/el/faq`,
        },
      },
    },
    {
      url: `${baseUrl}/custom-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/custom-order`,
          el: `${baseUrl}/el/custom-order`,
        },
      },
    },
  ]

  // Fetch all available vehicles for dynamic pages
  let vehiclePages: MetadataRoute.Sitemap = []

  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, updated_at, available')
      .eq('available', true)
      .order('updated_at', { ascending: false })

    if (!error && vehicles) {
      vehiclePages = vehicles.map((vehicle) => ({
        url: `${baseUrl}/inventory/${vehicle.id}`,
        lastModified: new Date(vehicle.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
        alternates: {
          languages: {
            en: `${baseUrl}/inventory/${vehicle.id}`,
            el: `${baseUrl}/el/inventory/${vehicle.id}`,
          },
        },
      }))
    }
  } catch (error) {
    console.error('Error fetching vehicles for sitemap:', error)
  }

  return [...staticPages, ...vehiclePages]
}
