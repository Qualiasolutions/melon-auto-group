"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vehicle } from "@/types/vehicle"
import { Icon } from "@/components/ui/icon"

interface VehicleCardProps {
  vehicle: Vehicle
  viewMode?: "grid" | "list"
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
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
    <Card className="flex flex-col overflow-hidden group hover:shadow-[0_20px_50px_rgba(209,41,55,0.15)] transition-all duration-500 h-full border border-slate-200/60 rounded-xl bg-white/98 backdrop-blur-sm hover:-translate-y-1">
      <Link href={`/inventory/${vehicle.id}`} className="flex-1 flex flex-col">
        {/* Premium Image Container */}
        <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-[1] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {vehicle.images && vehicle.images.length > 0 ? (
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.parentElement?.querySelector('.image-placeholder');
                if (placeholder) {
                  (placeholder as HTMLElement).style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div className="image-placeholder absolute inset-0 flex items-center justify-center" style={{ display: vehicle.images && vehicle.images.length > 0 ? 'none' : 'flex' }}>
            <div className="text-center">
              <Icon name="local_shipping" className="h-16 w-16 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No Image Available</p>
            </div>
          </div>

          {/* Premium Status Badges - No emojis, sophisticated design */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
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

          {/* Premium Year Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
              <span className="text-sm font-bold text-slate-900">{vehicle.year}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Premium Title Section */}
          <div className="mb-4">
            <h3 className="font-semibold text-xl text-slate-900 group-hover:text-brand-red transition-colors duration-300 line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-widest">
              {vehicle.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
          </div>

          {/* Premium Price Display */}
          <div className="mb-5">
            <div className="text-3xl font-bold text-brand-red">
              {formatPrice(vehicle.price, vehicle.currency)}
            </div>
          </div>

          {/* Premium Specifications Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Mileage */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon name="speed" className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Mileage</p>
                <p className="text-sm font-semibold text-slate-900">{formatMileage(vehicle.mileage)}</p>
              </div>
            </div>

            {/* Power */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon name="bolt" className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Power</p>
                <p className="text-sm font-semibold text-slate-900">{vehicle.horsepower} HP</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon name="location_on" className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-slate-900">{vehicle.location}</p>
              </div>
            </div>

            {/* Transmission */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon name="settings" className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Trans</p>
                <p className="text-sm font-semibold text-slate-900 capitalize">{vehicle.transmission.slice(0, 4)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Premium Footer Actions */}
      <CardFooter className="px-5 pb-5 pt-0 flex gap-2 mt-auto">
        <Button
          asChild
          className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white shadow-sm hover:shadow-lg transition-all duration-300 font-medium h-10 text-sm"
        >
          <Link href={`/inventory/${vehicle.id}`}>
            View Details
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="hover:bg-slate-50 hover:text-brand-red hover:border-brand-red transition-all duration-300 border-slate-200 font-medium h-10 text-sm"
        >
          <Link href={`/contact?vehicle=${vehicle.id}`}>
            Inquire
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}