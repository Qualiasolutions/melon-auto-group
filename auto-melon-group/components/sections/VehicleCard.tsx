"use client"

import Link from "next/link"
import Image from "next/image"
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
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#D12937]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D12937]/5 h-full flex flex-col">
      {/* Image Container */}
      <Link href={`/inventory/${vehicle.id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
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

        {/* Year Badge */}
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded shadow-md">
          <span className="text-sm font-bold text-gray-900">{vehicle.year}</span>
        </div>

        {/* Status Badges */}
        {(vehicle.featured || vehicle.condition === 'new' || vehicle.condition === 'certified') && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {vehicle.featured && (
              <div className="bg-[#D12937] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                Featured
              </div>
            )}
            {vehicle.condition === 'new' && (
              <div className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                New
              </div>
            )}
            {vehicle.condition === 'certified' && (
              <div className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                Certified
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-6">
        {/* Vehicle Title */}
        <Link href={`/inventory/${vehicle.id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#D12937] transition-colors line-clamp-2">
            {vehicle.make} {vehicle.model}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-[#D12937]">
            {formatPrice(vehicle.price, vehicle.currency)}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/inventory/${vehicle.id}`}
            className="flex-1 bg-[#D12937] hover:bg-[#B01F2D] text-white font-bold py-3 px-4 rounded text-center transition-colors text-sm uppercase tracking-wide"
          >
            View Details
          </Link>
          <Link
            href={`/contact?vehicle=${vehicle.id}`}
            className="flex-1 bg-white hover:bg-gray-50 text-[#D12937] font-bold py-3 px-4 rounded text-center transition-colors text-sm uppercase tracking-wide border-2 border-[#D12937]"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
  )
}
