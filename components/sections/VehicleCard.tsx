import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vehicle } from "@/types/vehicle"
import { Calendar, Gauge, MapPin, Euro, Fuel, Settings, Shield, Star, Eye, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleCardProps {
  vehicle: Vehicle
  viewMode?: "grid" | "list"
}

export function VehicleCard({ vehicle, viewMode = "grid" }: VehicleCardProps) {
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

  const isNew = () => {
    const created = new Date(vehicle.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
        <div className="flex flex-col sm:flex-row">
          <Link href={`/inventory/${vehicle.id}`} className="relative sm:w-80 h-48 sm:h-auto shrink-0">
            <div className="relative w-full h-full overflow-hidden bg-slate-100">
              {vehicle.images && vehicle.images.length > 0 ? (
                <Image
                  src={vehicle.images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="320px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {isNew() && (
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">New Arrival</Badge>
                )}
                {vehicle.featured && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                {vehicle.condition === 'certified' && (
                  <Badge className="bg-green-600 hover:bg-green-700 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Certified
                  </Badge>
                )}
              </div>
            </div>
          </Link>

          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
            <div>
              <Link href={`/inventory/${vehicle.id}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(vehicle.price, vehicle.currency)}
                    </div>
                  </div>
                </div>

                {/* Key Specs - List View */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Year</div>
                      <div className="text-sm font-medium">{vehicle.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Mileage</div>
                      <div className="text-sm font-medium">{formatMileage(vehicle.mileage)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Fuel</div>
                      <div className="text-sm font-medium capitalize">{vehicle.engineType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Transmission</div>
                      <div className="text-sm font-medium capitalize">
                        {vehicle.transmission.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                {vehicle.specifications?.axleConfiguration && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {vehicle.specifications.axleConfiguration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {vehicle.horsepower} HP
                    </Badge>
                    {vehicle.specifications?.emissionStandard && (
                      <Badge variant="outline" className="text-xs">
                        {vehicle.specifications.emissionStandard}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{vehicle.location}, {vehicle.country}</span>
                </div>
              </Link>
            </div>

            <div className="flex gap-2 mt-4">
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                <Link href={`/inventory/${vehicle.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/contact?vehicle=${vehicle.id}`}>
                  Inquire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link href={`/inventory/${vehicle.id}`} className="relative">
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
          {vehicle.images && vehicle.images.length > 0 ? (
            <>
              <Image
                src={vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {vehicle.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  +{vehicle.images.length - 1} photos
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew() && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">New</Badge>
            )}
            {vehicle.featured && (
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            {vehicle.condition === 'certified' && (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Certified
              </Badge>
            )}
            {vehicle.condition === 'new' && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">New</Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/inventory/${vehicle.id}`}>
          {/* Title */}
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {vehicle.make} {vehicle.model}
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground mb-3">
            {vehicle.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </p>

          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-4">
            {formatPrice(vehicle.price, vehicle.currency)}
          </div>

          {/* Key Specs Grid */}
          <div className="space-y-2 text-sm flex-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Year
              </span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                Mileage
              </span>
              <span className="font-medium">{formatMileage(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Fuel className="h-4 w-4" />
                Fuel
              </span>
              <span className="font-medium capitalize">{vehicle.engineType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Power
              </span>
              <span className="font-medium">{vehicle.horsepower} HP</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3 pt-3 border-t">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{vehicle.location}, {vehicle.country}</span>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
          <Link href={`/inventory/${vehicle.id}`}>
            View Details
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/contact?vehicle=${vehicle.id}`} title="Inquire">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
