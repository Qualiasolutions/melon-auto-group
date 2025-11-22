import { supabase } from "@/lib/supabase/client"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/types/i18n"
import type { Vehicle } from "@/types/vehicle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Gauge, MapPin, Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { VehicleGallery } from "@/components/sections/VehicleGallery"
import { getBreadcrumbSchema, getVehicleSchema } from "@/config/metadata"
import { StructuredData } from "@/components/StructuredData"

async function getVehicle(id: string): Promise<Vehicle | null> {
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .eq('available', true)
    .single()

  if (error || !vehicle) {
    return null
  }

  return vehicle as Vehicle
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>
}): Promise<Metadata> {
  const { id, locale } = await params
  const vehicle = await getVehicle(id)

  if (!vehicle) {
    return {
      title: locale === 'el' ? "Όχημα Δεν Βρέθηκε" : "Vehicle Not Found",
      description: locale === 'el'
        ? "Το ζητούμενο όχημα δεν είναι πλέον διαθέσιμο."
        : "The requested vehicle is no longer available.",
    }
  }

  const isGreek = locale === 'el'

  const title = isGreek
    ? `${vehicle.make} ${vehicle.model} ${vehicle.year} - Μεταχειρισμένο Φορτηγό Κύπρος | Auto Melon Group`
    : `${vehicle.make} ${vehicle.model} ${vehicle.year} - Used Truck Cyprus | Auto Melon Group`

  const description = isGreek
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} προς πώληση στην Κύπρο. ${vehicle.mileage.toLocaleString()} χλμ, €${vehicle.price.toLocaleString()}. ${vehicle.engineType}, ${vehicle.transmission}. EURO ${vehicle.specifications?.emissionStandard || '6'}. Διαθέσιμο στη Λεμεσό, εξυπηρετούμε Λευκωσία & Λάρνακα.`
    : `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Cyprus. ${vehicle.mileage.toLocaleString()} km, €${vehicle.price.toLocaleString()}. ${vehicle.engineType}, ${vehicle.transmission}. EURO ${vehicle.specifications?.emissionStandard || '6'}. Available in Limassol, serving Nicosia & Larnaca.`

  const keywords = isGreek
    ? [
        `${vehicle.make} ${vehicle.model} κύπρος`,
        `${vehicle.make} φορτηγό κύπρος`,
        `μεταχειρισμένο ${vehicle.make} ${vehicle.year}`,
        `${vehicle.category} κύπρος`,
        "μεταχειρισμένα φορτηγά κύπρος",
        "φορτηγά προς πώληση λεμεσός",
        "εμπορικά οχήματα κύπρος",
      ]
    : [
        `${vehicle.make} ${vehicle.model} cyprus`,
        `${vehicle.make} truck cyprus`,
        `used ${vehicle.make} ${vehicle.year}`,
        `${vehicle.category} cyprus`,
        "used trucks cyprus",
        "trucks for sale limassol",
        "commercial vehicles cyprus",
      ]

  const canonical = `${siteConfig.url}/${locale}/inventory/${vehicle.id}`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.url}/en/inventory/${vehicle.id}`,
        el: `${siteConfig.url}/el/inventory/${vehicle.id}`,
        'el-CY': `${siteConfig.url}/el/inventory/${vehicle.id}`,
        'x-default': `${siteConfig.url}/en/inventory/${vehicle.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: isGreek ? 'el_CY' : 'en_US',
      alternateLocale: isGreek ? ['en_US'] : ['el_CY', 'el_GR'],
      siteName: siteConfig.name,
      images: vehicle.images && vehicle.images.length > 0
        ? [
            {
              url: vehicle.images[0],
              width: 1200,
              height: 630,
              alt: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
            },
          ]
        : [
            {
              url: `${siteConfig.url}/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: siteConfig.name,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: vehicle.images && vehicle.images.length > 0 ? [vehicle.images[0]] : [`${siteConfig.url}/og-image.jpg`],
      creator: '@automelongroup',
      site: '@automelongroup',
    },
  }
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>
}) {
  const { id, locale } = await params
  const vehicle = await getVehicle(id)
  const dict = await getDictionary(locale)

  if (!vehicle) {
    notFound()
  }

  // Generate breadcrumb schema
  const breadcrumbItems = locale === 'el'
    ? [
        { name: 'Αρχική', url: `/${locale}` },
        { name: 'Απόθεμα', url: `/${locale}/inventory` },
        { name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`, url: `/${locale}/inventory/${vehicle.id}` },
      ]
    : [
        { name: 'Home', url: `/${locale}` },
        { name: 'Inventory', url: `/${locale}/inventory` },
        { name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`, url: `/${locale}/inventory/${vehicle.id}` },
      ]

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems)
  const vehicleSchema = getVehicleSchema(vehicle)

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={[breadcrumbSchema, vehicleSchema]} />

      <div className="container py-8 max-w-7xl flex-1">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href={`/${locale}/inventory`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {dict.common.back} {dict.nav.inventory}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Gallery */}
            <VehicleGallery
              images={vehicle.images || []}
              altText={`${vehicle.make} ${vehicle.model}`}
            />

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{dict.vehicle.description}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {vehicle.description || (
                    locale === 'el'
                      ? 'Δεν υπάρχει διαθέσιμη περιγραφή για αυτό το όχημα.'
                      : 'No description available for this vehicle.'
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{dict.vehicle.specifications}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">{dict.search.make}</span>
                    <p className="font-medium">{vehicle.make}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {locale === 'el' ? 'Μοντέλο' : 'Model'}
                    </span>
                    <p className="font-medium">{vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{dict.vehicle.year}</span>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{dict.vehicle.mileage}</span>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {locale === 'el' ? 'Κινητήρας' : 'Engine'}
                    </span>
                    <p className="font-medium capitalize">{vehicle.engineType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {locale === 'el' ? 'Μετάδοση' : 'Transmission'}
                    </span>
                    <p className="font-medium capitalize">{vehicle.transmission}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {locale === 'el' ? 'Κατηγορία' : 'Category'}
                    </span>
                    <p className="font-medium capitalize">{vehicle.category?.replace(/-/g, ' ')}</p>
                  </div>
                  {vehicle.horsepower && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {locale === 'el' ? 'Ιπποδύναμη' : 'Horsepower'}
                      </span>
                      <p className="font-medium">{vehicle.horsepower} HP</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">{dict.vehicle.location}</span>
                    <p className="font-medium">{vehicle.location || vehicle.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact and Info */}
          <div className="space-y-6">
            {/* Price and Title */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                </p>

                <div className="text-3xl font-bold text-brand-red mb-6">
                  €{vehicle.price.toLocaleString()}
                </div>

                {/* Key Stats */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{dict.vehicle.year}:</span>
                    <span className="font-medium ml-auto">{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{dict.vehicle.mileage}:</span>
                    <span className="font-medium ml-auto">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{dict.vehicle.location}:</span>
                    <span className="font-medium ml-auto">
                      {locale === 'el' ? 'Κύπρος' : 'Cyprus'}
                    </span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <a
                      href={siteConfig.links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {dict.vehicle.whatsappInquiry}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href={`tel:${siteConfig.contact.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {dict.vehicle.callUs}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link href={`/${locale}/contact?vehicle=${vehicle.id}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      {dict.vehicle.emailInquiry}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
