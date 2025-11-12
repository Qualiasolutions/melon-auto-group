"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { VehicleCard } from "@/components/sections/VehicleCard"
import { FilterSidebar } from "@/components/filters/FilterSidebar"
import { ActiveFilters } from "@/components/filters/ActiveFilters"
import { ViewOptions } from "@/components/filters/ViewOptions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Vehicle, VehicleFilters } from "@/types/vehicle"
import { Truck, Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type SortOption = NonNullable<VehicleFilters["sortBy"]>
type ViewModeOption = NonNullable<VehicleFilters["viewMode"]>
type MultiSelectFilterKey =
  | "make"
  | "category"
  | "condition"
  | "engineType"
  | "transmission"
  | "axleConfiguration"
  | "country"

const SORT_OPTIONS: SortOption[] = [
  "price-asc",
  "price-desc",
  "year-desc",
  "year-asc",
  "mileage-asc",
  "mileage-desc",
  "date-desc",
]

const VIEW_MODES: ViewModeOption[] = ["grid", "list"]

const isMultiSelectKey = (key: keyof VehicleFilters): key is MultiSelectFilterKey =>
  ["make", "category", "condition", "engineType", "transmission", "axleConfiguration", "country"].includes(key as MultiSelectFilterKey)

const isPriceKey = (key: keyof VehicleFilters): key is "priceMin" | "priceMax" =>
  key === "priceMin" || key === "priceMax"

const isYearKey = (key: keyof VehicleFilters): key is "yearMin" | "yearMax" =>
  key === "yearMin" || key === "yearMax"

const isMileageKey = (key: keyof VehicleFilters): key is "mileageMin" | "mileageMax" =>
  key === "mileageMin" || key === "mileageMax"

const parseSortParam = (value: string | null): SortOption => {
  if (value && SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption
  }
  return "date-desc"
}

const parseViewModeParam = (value: string | null): ViewModeOption => {
  if (value && VIEW_MODES.includes(value as ViewModeOption)) {
    return value as ViewModeOption
  }
  return "grid"
}

function InventoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [filters, setFilters] = useState<VehicleFilters>({
    make: searchParams.get("make") ? [searchParams.get("make")!] : undefined,
    category: searchParams.get("category") ? [searchParams.get("category")!] : undefined,
    sortBy: parseSortParam(searchParams.get("sortBy")),
    viewMode: parseViewModeParam(searchParams.get("viewMode")),
  })

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

        if (filters.certified) {
          query = query.eq('condition', 'certified')
        }

        if (searchQuery.trim()) {
          query = query.or(`make.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        }

        // Apply sorting
        switch (filters.sortBy) {
          case "price-asc":
            query = query.order('price', { ascending: true })
            break
          case "price-desc":
            query = query.order('price', { ascending: false })
            break
          case "year-desc":
            query = query.order('year', { ascending: false })
            break
          case "year-asc":
            query = query.order('year', { ascending: true })
            break
          case "mileage-asc":
            query = query.order('mileage', { ascending: true })
            break
          case "mileage-desc":
            query = query.order('mileage', { ascending: false })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }

        const { data, error } = await query

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching vehicles:', error)
          }
          setVehicles([])
        } else {
          setVehicles(data || [])
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error:', error)
        }
        setVehicles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [filters, searchQuery])

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      sortBy: filters.sortBy,
      viewMode: filters.viewMode,
    })
    setSearchQuery("")
    router.push('/inventory')
  }

  const handleFilterRemove = (key: keyof VehicleFilters, value?: string) => {
    setFilters((previousFilters) => {
      const updatedFilters: VehicleFilters = { ...previousFilters }

      if (isMultiSelectKey(key)) {
        if (value && updatedFilters[key]) {
          const filteredValues = updatedFilters[key]!.filter((entry) => entry !== value)
          updatedFilters[key] = filteredValues.length > 0 ? filteredValues : undefined
        }
      } else if (isPriceKey(key)) {
        updatedFilters.priceMin = undefined
        updatedFilters.priceMax = undefined
      } else if (isYearKey(key)) {
        updatedFilters.yearMin = undefined
        updatedFilters.yearMax = undefined
      } else if (isMileageKey(key)) {
        updatedFilters.mileageMin = undefined
        updatedFilters.mileageMax = undefined
      } else {
        updatedFilters[key] = undefined
      }

      return updatedFilters
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const gridClass = filters.viewMode === "grid"
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
    : "flex flex-col space-y-6"

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Page Header */}
      <div className="border-b bg-background">
        <div className="container py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Our Inventory</h1>
                <p className="text-muted-foreground mt-1">
                  Find your perfect commercial vehicle
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search trucks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-20 border-2 border-slate-200/80 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 p-6 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-xl backdrop-blur-sm">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {Object.keys(filters).filter(key =>
                    key !== 'search' && key !== 'sortBy' && key !== 'viewMode' && filters[key as keyof VehicleFilters] !== undefined
                  ).length > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {Object.keys(filters).filter(key =>
                        key !== 'search' && key !== 'sortBy' && key !== 'viewMode' && filters[key as keyof VehicleFilters] !== undefined
                      ).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Active Filters */}
            <div className="mb-6">
              <ActiveFilters
                filters={filters}
                onFilterRemove={handleFilterRemove}
                onClearAll={handleClearFilters}
              />
            </div>

            {/* View Options */}
            <div className="mb-8">
              <ViewOptions
                viewMode={filters.viewMode || "grid"}
                onViewModeChange={(mode) => setFilters({ ...filters, viewMode: mode })}
                sortBy={filters.sortBy || "date-desc"}
                onSortChange={(sort) => setFilters({ ...filters, sortBy: sort })}
                resultsCount={vehicles.length}
              />
            </div>

            {/* Vehicles Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading vehicles...</p>
                </div>
              </div>
            ) : vehicles.length > 0 ? (
              <div className={gridClass}>
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    viewMode={filters.viewMode || "grid"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/40 rounded-lg">
                <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Vehicles Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                    : "Try adjusting your filters or check back later for new inventory"}
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/20">
        <div className="container py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <InventoryContent />
    </Suspense>
  )
}
