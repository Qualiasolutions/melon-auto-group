"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/types/i18n"
import type { Vehicle, VehicleFilters } from "@/types/vehicle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "@/components/filters/FilterSidebar"
import { ActiveFilters } from "@/components/filters/ActiveFilters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [filters, setFilters] = useState<VehicleFilters>({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Fetch vehicles
  useEffect(() => {
    async function fetchVehicles() {
      setIsLoading(true)
      try {
        let query = supabase
          .from('vehicles')
          .select('*')
          .eq('available', true)

        // Apply filters
        if (filters.make && filters.make.length > 0) {
          query = query.in('make', filters.make)
        }
        if (filters.category && filters.category.length > 0) {
          query = query.in('category', filters.category)
        }
        if (filters.condition && filters.condition.length > 0) {
          query = query.in('condition', filters.condition)
        }
        if (filters.engineType && filters.engineType.length > 0) {
          query = query.in('engine_type', filters.engineType)
        }
        if (filters.transmission && filters.transmission.length > 0) {
          query = query.in('transmission', filters.transmission)
        }
        if (filters.country && filters.country.length > 0) {
          query = query.in('country', filters.country)
        }
        if (filters.priceMin !== undefined) {
          query = query.gte('price', filters.priceMin)
        }
        if (filters.priceMax !== undefined) {
          query = query.lte('price', filters.priceMax)
        }
        if (filters.yearMin !== undefined) {
          query = query.gte('year', filters.yearMin)
        }
        if (filters.yearMax !== undefined) {
          query = query.lte('year', filters.yearMax)
        }
        if (filters.mileageMin !== undefined) {
          query = query.gte('mileage', filters.mileageMin)
        }
        if (filters.mileageMax !== undefined) {
          query = query.lte('mileage', filters.mileageMax)
        }
        if (filters.featured) {
          query = query.eq('featured', true)
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'price-asc':
            query = query.order('price', { ascending: true })
            break
          case 'price-desc':
            query = query.order('price', { ascending: false })
            break
          case 'year-asc':
            query = query.order('year', { ascending: true })
            break
          case 'year-desc':
            query = query.order('year', { ascending: false })
            break
          case 'mileage-asc':
            query = query.order('mileage', { ascending: true })
            break
          case 'mileage-desc':
            query = query.order('mileage', { ascending: false })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }

        const { data, error } = await query

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
  }, [filters])

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

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  const handleFilterRemove = (key: keyof VehicleFilters, value?: string) => {
    const newFilters = { ...filters }

    if (value && Array.isArray(newFilters[key])) {
      const arrayKey = key as 'make' | 'category' | 'condition' | 'engineType' | 'transmission' | 'axleConfiguration' | 'country'
      newFilters[arrayKey] = (newFilters[arrayKey] as string[]).filter(v => v !== value)
      if (newFilters[arrayKey]?.length === 0) {
        delete newFilters[arrayKey]
      }
    } else if (key === 'priceMin' || key === 'priceMax') {
      delete newFilters.priceMin
      delete newFilters.priceMax
    } else if (key === 'yearMin' || key === 'yearMax') {
      delete newFilters.yearMin
      delete newFilters.yearMax
    } else if (key === 'mileageMin' || key === 'mileageMax') {
      delete newFilters.mileageMin
      delete newFilters.mileageMax
    } else {
      delete newFilters[key]
    }

    setFilters(newFilters)
  }

  return (
    <>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-white via-slate-50 to-slate-100 border-b">
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              {dict.inventory.title}
            </h1>
            <p className="text-lg text-muted-foreground">{dict.inventory.subtitle}</p>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={dict.inventory.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base border-2 focus:border-brand-red shadow-sm rounded-xl"
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={filters.sortBy || "date-desc"} onValueChange={(value) => handleFiltersChange({ ...filters, sortBy: value as VehicleFilters['sortBy'] })}>
              <SelectTrigger className="w-full sm:w-[220px] h-14 border-2 shadow-sm rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="year-desc">Year: Newest</SelectItem>
                <SelectItem value="year-asc">Year: Oldest</SelectItem>
                <SelectItem value="mileage-asc">Mileage: Low to High</SelectItem>
                <SelectItem value="mileage-desc">Mileage: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-14 sm:hidden border-2 rounded-xl shadow-sm relative">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                  {Object.keys(filters).filter(key =>
                    key !== 'search' && key !== 'sortBy' && key !== 'viewMode' && filters[key as keyof VehicleFilters] !== undefined
                  ).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {Object.keys(filters).filter(key =>
                        key !== 'search' && key !== 'sortBy' && key !== 'viewMode' && filters[key as keyof VehicleFilters] !== undefined
                      ).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] p-0 flex flex-col">
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <SheetTitle className="text-xl">Filter Vehicles</SheetTitle>
                </SheetHeader>
                <div className="flex-1 px-6 py-4 overflow-hidden">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Count */}
          <div className="mt-5 flex items-center gap-2">
            {!isLoading && (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-brand-red"></div>
                <span className="text-sm font-medium text-foreground">
                  {filteredVehicles.length} {dict.inventory.vehiclesFound}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden sm:block w-full lg:w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border-2 shadow-lg p-6 h-[calc(100vh-8rem)]">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Vehicle Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onFilterRemove={handleFilterRemove}
              onClearAll={handleClearFilters}
            />

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{dict.common.loading}</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{dict.inventory.noResults}</p>
                {(searchQuery || Object.keys(filters).length > 0) && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    {dict.inventory.clearAll}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/${locale}/inventory/${vehicle.id}`}
                    className="group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-2xl hover:border-brand-red/20 transition-all duration-300"
                  >
                    {/* Vehicle Image */}
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                      {vehicle.images && vehicle.images[0] ? (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          {dict.vehicle.noImage}
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Featured Badge */}
                      {vehicle.featured && (
                        <div className="absolute top-3 right-3 bg-brand-red text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                          {dict.vehicle.featured}
                        </div>
                      )}

                      {/* Condition Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
                        {vehicle.condition === 'new' && dict.vehicle.new}
                        {vehicle.condition === 'used' && dict.vehicle.used}
                        {vehicle.condition === 'certified' && dict.vehicle.certified}
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 group-hover:text-brand-red transition-colors line-clamp-1">
                        {vehicle.make} {vehicle.model}
                      </h3>

                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {dict.vehicle.year}
                          </span>
                          <span className="font-semibold text-foreground">{vehicle.year}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {dict.vehicle.mileage}
                          </span>
                          <span className="font-semibold text-foreground">
                            {vehicle.mileage.toLocaleString()} km
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Price</p>
                          <span className="text-2xl font-bold text-brand-red">
                            €{vehicle.price.toLocaleString()}
                          </span>
                        </div>
                        <Button size="sm" className="bg-brand-red hover:bg-brand-red/90 group-hover:shadow-lg transition-shadow">
                          {dict.vehicle.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
