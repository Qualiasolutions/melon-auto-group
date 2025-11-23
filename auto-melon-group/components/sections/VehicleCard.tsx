"use client"

import Link from "next/link"
import Image from "next/image"
import { Vehicle } from "@/types/vehicle"
import { Truck, Gauge, Settings, MapPin, ShieldCheck } from "lucide-react"
import { usePathname } from "next/navigation"

interface VehicleCardProps {
  vehicle: Vehicle
  viewMode?: "grid" | "list"
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-brand-red/30 transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
      {/* Image Container */}
      <Link href={`/${locale}/inventory/${vehicle.id}`} className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        {/* No Image Placeholder */}
        <div
          className="image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
          style={{ display: vehicle.images && vehicle.images.length > 0 ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <Truck className="h-16 w-16 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-400">No Image Available</p>
          </div>
        </div>

        {/* Status Badges */}
        {(vehicle.featured || vehicle.condition === 'new' || vehicle.condition === 'certified') && (
          <div className="absolute top-4 left-4 flex gap-2">
            {vehicle.featured && (
              <div className="bg-brand-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                FEATURED
              </div>
            )}
            {vehicle.condition === 'new' && (
              <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                NEW
              </div>
            )}
            {vehicle.condition === 'certified' && (
              <div className="bg-brand-green text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                CERTIFIED
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-6">
        {/* Category & Year Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wide">
            {vehicle.category?.replace(/-/g, ' ')}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-red/10 text-brand-red text-xs font-bold">
            {vehicle.year}
          </span>
        </div>

        {/* Vehicle Title */}
        <Link href={`/${locale}/inventory/${vehicle.id}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-4 hover:text-brand-red transition-colors line-clamp-2 leading-tight group-hover:text-brand-red">
            {vehicle.make} {vehicle.model}
          </h3>
        </Link>

        {/* Detailed Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Mileage */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
            <Gauge className="h-5 w-5 text-brand-red flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-500 font-medium">Mileage</span>
              <span className="text-sm font-bold text-slate-900 truncate">{formatMileage(vehicle.mileage)} km</span>
            </div>
          </div>

          {/* Transmission */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
            <Settings className="h-5 w-5 text-brand-red flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-500 font-medium">Transmission</span>
              <span className="text-sm font-bold text-slate-900 capitalize truncate">{vehicle.transmission || 'Manual'}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
            <MapPin className="h-5 w-5 text-brand-red flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-500 font-medium">Location</span>
              <span className="text-sm font-bold text-slate-900 truncate">{vehicle.location || vehicle.country}</span>
            </div>
          </div>

          {/* Condition */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
            <ShieldCheck className="h-5 w-5 text-brand-red flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-500 font-medium">Condition</span>
              <span className="text-sm font-bold text-slate-900 capitalize truncate">{vehicle.condition}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5"></div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between gap-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium mb-1">Price</span>
            <div className="text-3xl font-bold text-slate-900">
              {formatPrice(vehicle.price, vehicle.currency)}
            </div>
          </div>
          <Link
            href={`/${locale}/inventory/${vehicle.id}`}
            className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:scale-105 text-sm whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
