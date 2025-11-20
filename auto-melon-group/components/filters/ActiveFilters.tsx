"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { VehicleFilters } from "@/types/vehicle"

interface ActiveFiltersProps {
  filters: VehicleFilters
  onFilterRemove: (key: keyof VehicleFilters, value?: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onFilterRemove, onClearAll }: ActiveFiltersProps) {
  const activeFilters: Array<{ key: keyof VehicleFilters; label: string; value?: string }> = []

  // Make filters
  if (filters.make && filters.make.length > 0) {
    filters.make.forEach((make) => {
      activeFilters.push({ key: "make", label: make, value: make })
    })
  }

  // Category filters
  if (filters.category && filters.category.length > 0) {
    filters.category.forEach((category) => {
      const label = category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
      activeFilters.push({ key: "category", label, value: category })
    })
  }

  // Price range
  if (filters.priceMin || filters.priceMax) {
    const label = `€${filters.priceMin || 0} - €${filters.priceMax || "150k"}+`
    activeFilters.push({ key: "priceMin", label })
  }

  // Year range
  if (filters.yearMin || filters.yearMax) {
    const label = `${filters.yearMin || 2010} - ${filters.yearMax || new Date().getFullYear()}`
    activeFilters.push({ key: "yearMin", label })
  }

  // Mileage range
  if (filters.mileageMin || filters.mileageMax) {
    const label = `${filters.mileageMin || 0}km - ${filters.mileageMax || "500k"}km`
    activeFilters.push({ key: "mileageMin", label })
  }

  // Condition
  if (filters.condition && filters.condition.length > 0) {
    filters.condition.forEach((condition) => {
      const label = condition.charAt(0).toUpperCase() + condition.slice(1)
      activeFilters.push({ key: "condition", label, value: condition })
    })
  }

  // Engine type
  if (filters.engineType && filters.engineType.length > 0) {
    filters.engineType.forEach((engine) => {
      const label = engine.charAt(0).toUpperCase() + engine.slice(1)
      activeFilters.push({ key: "engineType", label, value: engine })
    })
  }

  // Transmission
  if (filters.transmission && filters.transmission.length > 0) {
    filters.transmission.forEach((trans) => {
      const label = trans.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
      activeFilters.push({ key: "transmission", label, value: trans })
    })
  }

  // Axle configuration
  if (filters.axleConfiguration && filters.axleConfiguration.length > 0) {
    filters.axleConfiguration.forEach((axle) => {
      activeFilters.push({ key: "axleConfiguration", label: axle, value: axle })
    })
  }

  // Country
  if (filters.country && filters.country.length > 0) {
    filters.country.forEach((country) => {
      activeFilters.push({ key: "country", label: country, value: country })
    })
  }

  // Special features
  if (filters.featured) {
    activeFilters.push({ key: "featured", label: "Featured" })
  }

  if (filters.certified) {
    activeFilters.push({ key: "certified", label: "Certified" })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3 p-5 mb-6 bg-slate-50 rounded-xl border border-slate-200">
      <span className="text-sm font-semibold text-slate-700">Active Filters:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value || filter.label}-${index}`}
          variant="secondary"
          className="gap-2 pl-3 pr-2 py-1.5 bg-white border border-slate-200 hover:border-brand-red/50 shadow-sm transition-all"
        >
          <span className="text-sm font-medium">{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-red-50 rounded-full transition-colors"
            onClick={() => onFilterRemove(filter.key, filter.value)}
          >
            <X className="h-3.5 w-3.5 text-slate-500 hover:text-brand-red" />
            <span className="sr-only">Remove {filter.label} filter</span>
          </Button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="h-8 px-4 text-xs font-semibold text-brand-red border-brand-red/30 hover:bg-red-50 hover:border-brand-red transition-all"
        >
          Clear all filters
        </Button>
      )}
    </div>
  )
}
