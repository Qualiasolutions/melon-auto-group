import { getDictionary } from '@/lib/i18n/get-dictionary'
import type { Locale } from '@/types/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params

  const isGreek = locale === 'el'

  const metadata = {
    en: {
      title: "About Us | Leading Used Truck Dealer in Cyprus - Nicosia, Limassol, Larnaca",
      description: "Auto Melon Group is Cyprus's trusted used truck dealer since years. We import quality UK trucks to Nicosia, Limassol & Larnaca. Specialists in Mercedes-Benz, Scania, Volvo, DAF commercial vehicles. EURO 6 certified.",
      keywords: [
        "used truck dealer cyprus",
        "about auto melon group",
        "truck dealer nicosia",
        "truck dealer limassol",
        "truck dealer larnaca",
        "UK truck importer cyprus",
        "commercial vehicle specialist cyprus",
        "trusted truck dealer cyprus",
      ]
    },
    el: {
      title: "Σχετικά με Εμάς | Κορυφαίος Έμπορος Μεταχειρισμένων Φορτηγών στην Κύπρο - Λευκωσία, Λεμεσός, Λάρνακα",
      description: "Η Auto Melon Group είναι ο αξιόπιστος έμπορος μεταχειρισμένων φορτηγών της Κύπρου. Εισάγουμε ποιοτικά φορτηγά από UK στη Λευκωσία, Λεμεσό & Λάρνακα. Ειδικοί σε Mercedes-Benz, Scania, Volvo, DAF εμπορικά οχήματα. EURO 6 πιστοποιημένα.",
      keywords: [
        "έμπορος μεταχειρισμένων φορτηγών κύπρος",
        "σχετικά auto melon group",
        "έμπορος φορτηγών λευκωσία",
        "έμπορος φορτηγών λεμεσός",
        "έμπορος φορτηγών λάρνακα",
        "εισαγωγέας φορτηγών UK κύπρος",
        "ειδικός εμπορικών οχημάτων κύπρος",
        "αξιόπιστος έμπορος φορτηγών κύπρος",
      ]
    }
  }

  const content = isGreek ? metadata.el : metadata.en
  const canonical = `${siteConfig.url}/${locale}/about`

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: {
        'en': `${siteConfig.url}/en/about`,
        'el': `${siteConfig.url}/el/about`,
        'el-CY': `${siteConfig.url}/el/about`,
        'x-default': `${siteConfig.url}/en/about`,
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
          alt: `${siteConfig.name} - About`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (
    <>      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container relative z-10">
          <Badge className="mb-4 bg-brand-red text-white">{dict.about.badge}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
            {dict.about.hero.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">{dict.about.hero.subtitle}</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">{dict.about.whatWeDo.title}</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>{dict.about.whatWeDo.description1}</p>
              <p>{dict.about.whatWeDo.description2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why UK Imports */}
      <section className="py-16 bg-muted/40">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">{dict.about.whyUKImports.title}</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-red flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {dict.about.whyUKImports.quality.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {dict.about.whyUKImports.quality.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-red flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {dict.about.whyUKImports.rightHand.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {dict.about.whyUKImports.rightHand.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-red flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {dict.about.whyUKImports.pricing.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {dict.about.whyUKImports.pricing.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{dict.about.cta.title}</h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">{dict.about.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-brand-red hover:bg-white/90"
            >
              <Link href={`/${locale}/inventory`}>{dict.about.cta.viewInventory}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-ink"
            >
              <Link href={`/${locale}/contact`}>{dict.about.cta.contactUs}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
