"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/types/i18n"
import type { Vehicle } from "@/types/vehicle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function InventoryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const dictPromise = getDictionary(locale)
  const dict = use(dictPromise)

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch vehicles
  useEffect(() => {
    async function fetchVehicles() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('available', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        const vehicleData = (data as Vehicle[]) || []
        setVehicles(vehicleData)
        setFilteredVehicles(vehicleData)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        setVehicles([])
        setFilteredVehicles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Filter vehicles based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = vehicles.filter((vehicle) => {
      return (
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.category.toLowerCase().includes(query) ||
        (vehicle.description && vehicle.description.toLowerCase().includes(query))
      )
    })

    setFilteredVehicles(filtered)
  }, [searchQuery, vehicles])

  return (
    <>      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">{dict.inventory.title}</h1>
          <p className="text-muted-foreground mb-6">{dict.inventory.subtitle}</p>

          {/* Search Bar */}
          <div className="max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={dict.inventory.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {!isLoading && (
              <span>
                {filteredVehicles.length} {dict.inventory.vehiclesFound}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="container py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{dict.common.loading}</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{dict.inventory.noResults}</p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                {dict.inventory.clearAll}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
              >
                {/* Vehicle Image */}
                <div className="aspect-video bg-slate-200 relative">
                  {vehicle.images && vehicle.images[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {dict.vehicle.noImage}
                    </div>
                  )}

                  {/* Featured Badge */}
                  {vehicle.featured && (
                    <div className="absolute top-2 right-2 bg-brand-red text-white text-xs px-2 py-1 rounded">
                      {dict.vehicle.featured}
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">
                    {vehicle.make} {vehicle.model}
                  </h3>

                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <div className="flex justify-between">
                      <span>{dict.vehicle.year}:</span>
                      <span className="font-medium text-foreground">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{dict.vehicle.mileage}:</span>
                      <span className="font-medium text-foreground">
                        {vehicle.mileage.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{dict.search.condition}:</span>
                      <span className="font-medium text-foreground capitalize">
                        {vehicle.condition === 'new' && dict.vehicle.new}
                        {vehicle.condition === 'used' && dict.vehicle.used}
                        {vehicle.condition === 'certified' && dict.vehicle.certified}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-red">
                      €{vehicle.price.toLocaleString()}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/${locale}/inventory/${vehicle.id}`}>
                        {dict.vehicle.viewDetails}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
