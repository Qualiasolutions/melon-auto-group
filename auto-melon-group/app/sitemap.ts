import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { supabase } from '@/lib/supabase/client'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages with both English and Greek versions
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          el: `${baseUrl}/el`,
          'x-default': `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/el`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          el: `${baseUrl}/el`,
          'x-default': `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en/inventory`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/inventory`,
          el: `${baseUrl}/el/inventory`,
        },
      },
    },
    {
      url: `${baseUrl}/el/inventory`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/inventory`,
          el: `${baseUrl}/el/inventory`,
        },
      },
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
          el: `${baseUrl}/el/about`,
        },
      },
    },
    {
      url: `${baseUrl}/el/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
          el: `${baseUrl}/el/about`,
        },
      },
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contact`,
          el: `${baseUrl}/el/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/el/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contact`,
          el: `${baseUrl}/el/contact`,
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
      vehiclePages = vehicles.flatMap((vehicle) => [
        {
          url: `${baseUrl}/en/inventory/${vehicle.id}`,
          lastModified: new Date(vehicle.updated_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
          alternates: {
            languages: {
              en: `${baseUrl}/en/inventory/${vehicle.id}`,
              el: `${baseUrl}/el/inventory/${vehicle.id}`,
            },
          },
        },
        {
          url: `${baseUrl}/el/inventory/${vehicle.id}`,
          lastModified: new Date(vehicle.updated_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
          alternates: {
            languages: {
              en: `${baseUrl}/en/inventory/${vehicle.id}`,
              el: `${baseUrl}/el/inventory/${vehicle.id}`,
            },
          },
        },
      ])
    }
  } catch (error) {
    console.error('Error fetching vehicles for sitemap:', error)
  }

  return [...staticPages, ...vehiclePages]
}
