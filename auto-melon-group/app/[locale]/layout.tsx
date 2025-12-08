import type { Metadata } from 'next'
import type { Locale } from '@/types/i18n'
import { siteConfig } from '@/config/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  return {
    title: siteConfig.name,
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
