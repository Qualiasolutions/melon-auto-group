import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import type { Locale } from '@/types/i18n'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { englishMetadata, greekMetadata } from '@/config/metadata'
import { siteConfig } from '@/config/site'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin', 'greek'] })

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
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'el' }]
}
