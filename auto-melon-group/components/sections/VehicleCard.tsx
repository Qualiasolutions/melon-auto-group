"use client"

import Link from "next/link"
import Image from "next/image"
import { Vehicle } from "@/types/vehicle"
import { Icon } from "@/components/ui/icon"
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
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      {/* Image Container */}
      <Link href={`/${locale}/inventory/${vehicle.id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
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
          className="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-50"
          style={{ display: vehicle.images && vehicle.images.length > 0 ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <Icon name="directions_truck_filled" className="h-16 w-16 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-400">No Image Available</p>
          </div>
        </div>

        {/* Status Badges */}
        {(vehicle.featured || vehicle.condition === 'new' || vehicle.condition === 'certified') && (
          <div className="absolute top-3 left-3 flex gap-2">
            {vehicle.featured && (
              <div className="bg-brand-red text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                Featured
              </div>
            )}
            {vehicle.condition === 'new' && (
              <div className="bg-gray-900 text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                New
              </div>
            )}
            {vehicle.condition === 'certified' && (
              <div className="bg-brand-green text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                Certified
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-5">
        {/* Category & Year */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {vehicle.category?.replace(/-/g, ' ')}
          </span>
          <span className="text-xs font-semibold text-gray-700">{vehicle.year}</span>
        </div>

        {/* Vehicle Title */}
        <Link href={`/${locale}/inventory/${vehicle.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-brand-red transition-colors line-clamp-2 leading-snug">
            {vehicle.make} {vehicle.model}
          </h3>
        </Link>

        {/* Key Specs */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Icon name="speed" className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{formatMileage(vehicle.mileage)} km</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="text-sm text-gray-600">
            <span className="font-medium capitalize">{vehicle.engineType}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(vehicle.price, vehicle.currency)}
            </div>
          </div>
          <Link
            href={`/${locale}/inventory/${vehicle.id}`}
            className="bg-brand-red hover:bg-brand-red/90 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
