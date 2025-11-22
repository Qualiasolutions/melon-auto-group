import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import type { Locale } from '@/types/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params

  const isGreek = locale === 'el'

  const metadata = {
    en: {
      title: "Used Trucks for Sale Cyprus | Browse Our Inventory in Nicosia, Limassol, Larnaca",
      description: "Browse our extensive inventory of quality used trucks in Cyprus. Mercedes-Benz, Scania, Volvo, DAF commercial vehicles available in Nicosia, Limassol & Larnaca. EURO 6 certified trucks at competitive prices.",
      keywords: [
        "used trucks for sale cyprus",
        "truck inventory cyprus",
        "commercial vehicles for sale nicosia",
        "trucks for sale limassol",
        "trucks for sale larnaca",
        "Mercedes-Benz trucks cyprus",
        "Scania trucks for sale",
        "Volvo trucks cyprus",
        "DAF trucks for sale",
        "EURO 6 trucks cyprus",
        "buy used trucks cyprus",
      ]
    },
    el: {
      title: "Μεταχειρισμένα Φορτηγά Προς Πώληση Κύπρος | Απόθεμα Λευκωσία, Λεμεσός, Λάρνακα",
      description: "Περιηγηθείτε στο εκτενές απόθεμά μας από ποιοτικά μεταχειρισμένα φορτηγά στην Κύπρο. Mercedes-Benz, Scania, Volvo, DAF εμπορικά οχήματα διαθέσιμα στη Λευκωσία, Λεμεσό & Λάρνακα. EURO 6 πιστοποιημένα φορτηγά σε ανταγωνιστικές τιμές.",
      keywords: [
        "μεταχειρισμένα φορτηγά προς πώληση κύπρος",
        "απόθεμα φορτηγών κύπρος",
        "εμπορικά οχήματα προς πώληση λευκωσία",
        "φορτηγά προς πώληση λεμεσός",
        "φορτηγά προς πώληση λάρνακα",
        "Mercedes-Benz φορτηγά κύπρος",
        "Scania φορτηγά προς πώληση",
        "Volvo φορτηγά κύπρος",
        "DAF φορτηγά προς πώληση",
        "EURO 6 φορτηγά κύπρος",
        "αγορά μεταχειρισμένων φορτηγών κύπρος",
      ]
    }
  }

  const content = isGreek ? metadata.el : metadata.en
  const canonical = `${siteConfig.url}/${locale}/inventory`

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: {
        'en': `${siteConfig.url}/en/inventory`,
        'el': `${siteConfig.url}/el/inventory`,
        'el-CY': `${siteConfig.url}/el/inventory`,
        'x-default': `${siteConfig.url}/en/inventory`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      type: 'website',
      locale: isGreek ? 'el_CY' : 'en_US',
      alternateLocale: isGreek ? ['en_US'] : ['el_CY', 'el_GR'],
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${content.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: [`${siteConfig.url}/og-image.jpg`],
      creator: '@automelongroup',
      site: '@automelongroup',
    },
  }
}

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
