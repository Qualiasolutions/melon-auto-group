import { supabase } from "@/lib/supabase/client"
import { Vehicle } from "@/types/vehicle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VehicleCard } from "@/components/sections/VehicleCard"
import Link from "next/link"
import { Calendar, Gauge, MapPin, Phone, Mail, MessageCircle } from "lucide-react"
import { notFound } from "next/navigation"
import { siteConfig } from "@/config/site"
import { VehicleGallery } from "@/components/sections/VehicleGallery"

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

async function getSimilarVehicles(make: string, currentId: string) {
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('make', make)
    .eq('available', true)
    .neq('id', currentId)
    .limit(3)

  if (error) {
    return []
  }

  return vehicles || []
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vehicle = await getVehicle(id)

  if (!vehicle) {
    notFound()
  }

  const similarVehicles = await getSimilarVehicles(vehicle.make, vehicle.id)

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km'
  }

  return (
    <div className="container py-8 max-w-7xl">
      {/* Premium Breadcrumb */}
      <div className="text-sm text-slate-500 mb-8 flex items-center gap-3">
        <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
        <span className="text-slate-300">›</span>
        <Link href="/inventory" className="hover:text-brand-red transition-colors font-medium">Inventory</Link>
        <span className="text-slate-300">›</span>
        <span className="text-slate-900 font-semibold">{vehicle.make} {vehicle.model}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Left Column - Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Vehicle Gallery */}
          <div className="relative">
            <VehicleGallery
              images={vehicle.images || []}
              altText={`${vehicle.make} ${vehicle.model}`}
            />

            {/* Premium Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {vehicle.featured && (
                <Badge className="bg-brand-red text-white shadow-md backdrop-blur-md border-0 font-medium px-3 py-1.5 text-xs uppercase tracking-wider">
                  Featured
                </Badge>
              )}
              {vehicle.condition === 'certified' && (
                <Badge className="bg-brand-green text-white shadow-md backdrop-blur-md border-0 font-medium px-3 py-1.5 text-xs uppercase tracking-wider">
                  Certified
                </Badge>
              )}
              {vehicle.condition === 'new' && (
                <Badge className="bg-slate-900 text-white shadow-md backdrop-blur-md border-0 font-medium px-3 py-1.5 text-xs uppercase tracking-wider">
                  New
                </Badge>
              )}
            </div>
          </div>

          {/* Premium Description Card */}
          <Card className="border border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-brand-red rounded-full"></div>
                Vehicle Description
              </h2>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed text-base">
                {vehicle.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>

          {/* Premium Specifications Card */}
          <Card className="border border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-brand-red rounded-full"></div>
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Make</p>
                  <p className="font-semibold">{vehicle.make}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-semibold">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-semibold">{formatMileage(vehicle.mileage)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engine Power</p>
                  <p className="font-semibold">{vehicle.enginePower} HP</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engine Type</p>
                  <p className="font-semibold capitalize">{vehicle.engineType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-semibold capitalize">{vehicle.transmission.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-semibold capitalize">{vehicle.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{vehicle.location}, {vehicle.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-mono text-sm">{vehicle.vin}</p>
                </div>

                {/* Additional Specs from JSON */}
                {vehicle.specifications && Object.entries(vehicle.specifications).map(([key, value]) => (
                  value && (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Right Column - Price & Contact */}
        <div className="space-y-6">
          <Card className="sticky top-24 border border-slate-200/60 shadow-lg rounded-xl bg-white">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-3 text-slate-900">
                {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center gap-3 text-slate-600 mb-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{vehicle.year}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5" />
                  <span>{formatMileage(vehicle.mileage)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 mb-6 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                <span>{vehicle.location}, {vehicle.country}</span>
              </div>

              <div className="h-px bg-slate-200 my-6" />

              <div className="mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Price</p>
                <div className="text-4xl font-bold text-brand-red">
                  {formatPrice(vehicle.price, vehicle.currency)}
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full bg-brand-red hover:bg-brand-red-dark text-white shadow-sm hover:shadow-lg transition-all" size="lg">
                  <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Inquiry
                  </a>
                </Button>

                <Button asChild variant="outline" className="w-full hover:bg-slate-50 hover:text-brand-red hover:border-brand-red border-slate-200" size="lg">
                  <a href={`tel:${siteConfig.contact.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </a>
                </Button>

                <Button asChild variant="outline" className="w-full hover:bg-slate-50 hover:text-brand-red hover:border-brand-red border-slate-200" size="lg">
                  <Link href={`/contact?vehicle=${vehicle.id}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Inquiry
                  </Link>
                </Button>
              </div>

              <div className="h-px bg-slate-200 my-6" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0"></div>
                  <span>Worldwide shipping available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0"></div>
                  <span>Export documentation included</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0"></div>
                  <span>Inspection reports available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0"></div>
                  <span>Secure payment options</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Similar Vehicles Section */}
      {similarVehicles.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-semibold mb-8 text-slate-900 flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-red rounded-full"></div>
            Similar Trucks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map((vehicle: Vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
