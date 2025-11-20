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

  const title = locale === 'el'
    ? `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.condition} Φορτηγό προς Πώληση`
    : `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.condition} Truck for Sale`

  const description = locale === 'el'
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} προς πώληση. ${vehicle.mileage.toLocaleString()} km, €${vehicle.price.toLocaleString()}. Βρίσκεται στην Κύπρο.`
    : `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale. ${vehicle.mileage.toLocaleString()} km, €${vehicle.price.toLocaleString()}. Located in Cyprus.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/inventory/${vehicle.id}`,
      languages: {
        en: `${siteConfig.url}/en/inventory/${vehicle.id}`,
        el: `${siteConfig.url}/el/inventory/${vehicle.id}`,
      },
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

  return (
    <>      <div className="container py-8 max-w-7xl flex-1">
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
            <div className="relative bg-white rounded-lg overflow-hidden border">
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="aspect-video">
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-slate-200 flex items-center justify-center">
                  <span className="text-muted-foreground">{dict.vehicle.noImage}</span>
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {vehicle.featured && (
                  <Badge className="bg-brand-red text-white">
                    {dict.vehicle.featured}
                  </Badge>
                )}
                {vehicle.condition === 'certified' && (
                  <Badge className="bg-green-600 text-white">
                    {dict.vehicle.certified}
                  </Badge>
                )}
                {vehicle.condition === 'new' && (
                  <Badge className="bg-slate-900 text-white">
                    {dict.vehicle.new}
                  </Badge>
                )}
              </div>

              {/* Additional Images Grid */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50">
                  {vehicle.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-video rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`${vehicle.make} ${vehicle.model} - ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

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
