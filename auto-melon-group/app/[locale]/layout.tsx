import type { Metadata } from 'next'
import type { Locale } from '@/types/i18n'
import { englishMetadata, greekMetadata } from '@/config/metadata'
import { siteConfig } from '@/config/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isGreek = locale === 'el'
  const metadata = isGreek ? greekMetadata : englishMetadata
  const url = `${siteConfig.url}/${locale}`

  return {
    title: {
      default: metadata.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en`,
        el: `${siteConfig.url}/el`,
        'el-CY': `${siteConfig.url}/el`,
        'x-default': `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isGreek ? 'el_CY' : 'en_US',
      alternateLocale: isGreek ? ['en_US'] : ['el_GR', 'el_CY'],
      url,
      title: metadata.title,
      description: metadata.description,
      siteName: siteConfig.name,
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['/og-image.jpg'],
    },
  }
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  return <>{children}</>
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'el' }]
}
