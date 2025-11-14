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
    <Card className="flex flex-col overflow-hidden group hover:shadow-[0_25px_60px_rgba(209,41,55,0.18)] transition-all duration-500 h-full border border-slate-200/60 rounded-2xl bg-white/99 backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.02] relative">
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      <Link href={`/inventory/${vehicle.id}`} className="flex-1 flex flex-col">
        {/* Enhanced Image Container */}
        <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 border-b border-slate-100/60">
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent z-[1] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {vehicle.images && vehicle.images.length > 0 ? (
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out filter drop-shadow-sm"
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

          {/* Enhanced No Image Placeholder */}
          <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200/40" style={{ display: vehicle.images && vehicle.images.length > 0 ? 'none' : 'flex' }}>
            <div className="text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 to-orange-500/10 rounded-full blur-xl scale-150" />
                <Icon name="directions_truck_filled" className="h-16 w-16 mx-auto text-brand-red/60 relative z-10" />
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-1">No Image Available</p>
              <p className="text-xs text-slate-400">Contact for photos</p>
            </div>
          </div>

          {/* Enhanced Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {vehicle.featured && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-orange-600 blur-sm opacity-75 rounded-lg" />
                <Badge className="relative bg-gradient-to-r from-brand-red to-orange-600 text-white shadow-xl backdrop-blur-md border-0 font-bold px-3 py-1.5 text-xs uppercase tracking-wider rounded-lg">
                  ⭐ Featured
                </Badge>
              </div>
            )}
            {vehicle.condition === 'certified' && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-green to-emerald-600 blur-sm opacity-75 rounded-lg" />
                <Badge className="relative bg-gradient-to-r from-brand-green to-emerald-600 text-white shadow-xl backdrop-blur-md border-0 font-bold px-3 py-1.5 text-xs uppercase tracking-wider rounded-lg">
                  ✓ Certified
                </Badge>
              </div>
            )}
            {vehicle.condition === 'new' && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 blur-sm opacity-75 rounded-lg" />
                <Badge className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl backdrop-blur-md border-0 font-bold px-3 py-1.5 text-xs uppercase tracking-wider rounded-lg">
                  🆕 New
                </Badge>
              </div>
            )}
          </div>

          {/* Enhanced Year Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20" />
              <div className="relative bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/60">
                <span className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{vehicle.year}</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/30">
          {/* Enhanced Title Section */}
          <div className="mb-5">
            <h3 className="font-bold text-xl text-slate-900 group-hover:text-brand-red transition-all duration-300 line-clamp-1 leading-tight mb-2">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider bg-slate-100/60 rounded-full px-3 py-1 inline-block">
              {vehicle.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
          </div>

          {/* Enhanced Price Display */}
          <div className="mb-6 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-orange-500/10 rounded-xl blur-lg" />
              <div className="relative text-3xl font-bold bg-gradient-to-r from-brand-red to-orange-600 bg-clip-text text-transparent">
                {formatPrice(vehicle.price, vehicle.currency)}
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-brand-red/20 to-transparent mt-2" />
          </div>

          {/* Enhanced Specifications Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Mileage */}
            <div className="flex items-center gap-3 group/item">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-blue-500/10 rounded-xl blur-sm group-hover/item:scale-110 transition-transform duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100/80 to-blue-50 flex items-center justify-center border border-blue-200/30">
                  <Icon name="speed" className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Mileage</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">{formatMileage(vehicle.mileage)}</p>
              </div>
            </div>

            {/* Power */}
            <div className="flex items-center gap-3 group/item">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-amber-500/10 rounded-xl blur-sm group-hover/item:scale-110 transition-transform duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100/80 to-amber-50 flex items-center justify-center border border-amber-200/30">
                  <Icon name="bolt" className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Power</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">{vehicle.enginePower} HP</p>
              </div>
            </div>

            {/* Cabin */}
            {vehicle.cabin && (
              <div className="flex items-center gap-3 group/item">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-purple-500/10 rounded-xl blur-sm group-hover/item:scale-110 transition-transform duration-300" />
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100/80 to-purple-50 flex items-center justify-center border border-purple-200/30">
                    <Icon name="weekend" className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Cabin</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {vehicle.cabin === "1" ? "Single" : vehicle.cabin === "1.5" ? "1.5" : "Double"}
                  </p>
                </div>
              </div>
            )}

            {/* Tons */}
            {vehicle.tons && (
              <div className="flex items-center gap-3 group/item">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-emerald-500/10 rounded-xl blur-sm group-hover/item:scale-110 transition-transform duration-300" />
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100/80 to-emerald-50 flex items-center justify-center border border-emerald-200/30">
                    <Icon name="inventory_2" className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Capacity</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{vehicle.tons}t</p>
                </div>
              </div>
            )}

            {/* Location */}
            {(!vehicle.cabin && !vehicle.tons) && (
              <div className="flex items-center gap-3 group/item">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-rose-500/10 rounded-xl blur-sm group-hover/item:scale-110 transition-transform duration-300" />
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-rose-100/80 to-rose-50 flex items-center justify-center border border-rose-200/30">
                    <Icon name="location_on" className="h-4 w-4 text-rose-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{vehicle.location}</p>
                </div>
              </div>
            )}

            {/* Transmission */}
            <div className="flex items-center gap-3 group/item">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-500/10 rounded-xl blur-sm group-hover/item:scale-110 transition-transform duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100/80 to-slate-50 flex items-center justify-center border border-slate-200/30">
                  <Icon name="settings_suggest" className="h-4 w-4 text-slate-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Transmission</p>
                <p className="text-sm font-bold text-slate-900 leading-tight capitalize">
                  {vehicle.transmission === 'manual' ? 'Manual' : vehicle.transmission === 'automatic' ? 'Auto' : 'Auto-Man'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Enhanced Footer Actions */}
      <CardFooter className="px-6 pb-6 pt-0 flex gap-3 mt-auto">
        <Button
          asChild
          className="flex-1 bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold h-11 text-sm rounded-xl border border-brand-red/20 group/btn"
        >
          <Link href={`/inventory/${vehicle.id}`} className="flex items-center justify-center gap-2">
            <Icon name="visibility" className="h-4 w-4" />
            <span>View Details</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="hover:bg-gradient-to-r hover:from-brand-red/10 hover:to-orange-500/10 hover:text-brand-red hover:border-brand-red/50 transition-all duration-300 border-slate-200 font-semibold h-11 text-sm rounded-xl group/inquire"
        >
          <Link href={`/contact?vehicle=${vehicle.id}`} className="flex items-center justify-center gap-2">
            <Icon name="chat" className="h-4 w-4" />
            <span>Inquire</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}