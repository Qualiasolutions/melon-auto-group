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
      title: "Contact Us | Used Trucks Cyprus - Nicosia, Limassol, Larnaca",
      description: "Contact Auto Melon Group for used trucks in Cyprus. Visit our locations in Nicosia, Limassol & Larnaca. Call +357 99107227 or WhatsApp for immediate assistance. Expert truck dealers serving all Cyprus.",
      keywords: [
        "contact truck dealer cyprus",
        "used trucks cyprus contact",
        "truck dealer nicosia contact",
        "truck dealer limassol contact",
        "truck dealer larnaca contact",
        "buy trucks cyprus",
        "truck sales cyprus",
        "commercial vehicle inquiry cyprus",
      ]
    },
    el: {
      title: "Επικοινωνήστε Μαζί Μας | Μεταχειρισμένα Φορτηγά Κύπρος - Λευκωσία, Λεμεσός, Λάρνακα",
      description: "Επικοινωνήστε με την Auto Melon Group για μεταχειρισμένα φορτηγά στην Κύπρο. Επισκεφθείτε τα καταστήματά μας στη Λευκωσία, Λεμεσό & Λάρνακα. Καλέστε +357 99107227 ή WhatsApp για άμεση εξυπηρέτηση. Ειδικοί έμποροι φορτηγών σε όλη την Κύπρο.",
      keywords: [
        "επικοινωνία έμπορος φορτηγών κύπρος",
        "μεταχειρισμένα φορτηγά κύπρος επικοινωνία",
        "έμπορος φορτηγών λευκωσία επικοινωνία",
        "έμπορος φορτηγών λεμεσός επικοινωνία",
        "έμπορος φορτηγών λάρνακα επικοινωνία",
        "αγορά φορτηγών κύπρος",
        "πωλήσεις φορτηγών κύπρος",
        "ερώτηση εμπορικού οχήματος κύπρος",
      ]
    }
  }

  const content = isGreek ? metadata.el : metadata.en
  const canonical = `${siteConfig.url}/${locale}/contact`

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: {
        'en': `${siteConfig.url}/en/contact`,
        'el': `${siteConfig.url}/el/contact`,
        'el-CY': `${siteConfig.url}/el/contact`,
        'x-default': `${siteConfig.url}/en/contact`,
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
          alt: `${siteConfig.name} - Contact`,
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
