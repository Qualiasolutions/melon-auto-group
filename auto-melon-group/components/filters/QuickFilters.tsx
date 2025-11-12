"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  vehicleMakes,
  vehicleCategories,
  conditionTypes,
  type VehicleFilters,
} from "@/types/vehicle"
import { Filter, X } from "lucide-react"

interface QuickFiltersProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
}

const priceRanges = [
  { value: "all", label: "All Prices", min: undefined, max: undefined },
  { value: "0-30000", label: "Under €30,000", min: 0, max: 30000 },
  { value: "30000-60000", label: "€30,000 - €60,000", min: 30000, max: 60000 },
  { value: "60000-90000", label: "€60,000 - €90,000", min: 60000, max: 90000 },
  { value: "90000-120000", label: "€90,000 - €120,000", min: 90000, max: 120000 },
  { value: "120000+", label: "€120,000+", min: 120000, max: undefined },
]

const yearRanges = [
  { value: "all", label: "All Years", min: undefined, max: undefined },
  { value: "2020+", label: "2020 or Newer", min: 2020, max: undefined },
  { value: "2015-2019", label: "2015 - 2019", min: 2015, max: 2019 },
  { value: "2010-2014", label: "2010 - 2014", min: 2010, max: 2014 },
  { value: "2005-2009", label: "2005 - 2009", min: 2005, max: 2009 },
  { value: "pre-2005", label: "Before 2005", min: undefined, max: 2004 },
]

export function QuickFilters({ filters, onFiltersChange }: QuickFiltersProps) {
  const handleMakeChange = (value: string) => {
    if (value === "all") {
      onFiltersChange({ ...filters, make: undefined })
    } else {
      onFiltersChange({ ...filters, make: [value] })
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onFiltersChange({ ...filters, category: undefined })
    } else {
      onFiltersChange({ ...filters, category: [value] })
    }
  }

  const handlePriceChange = (value: string) => {
    const range = priceRanges.find(r => r.value === value)
    if (range) {
      onFiltersChange({
        ...filters,
        priceMin: range.min,
        priceMax: range.max,
      })
    }
  }

  const handleYearChange = (value: string) => {
    const range = yearRanges.find(r => r.value === value)
    if (range) {
      onFiltersChange({
        ...filters,
        yearMin: range.min,
        yearMax: range.max,
      })
    }
  }

  const handleConditionChange = (value: string) => {
    if (value === "all") {
      onFiltersChange({ ...filters, condition: undefined })
    } else {
      onFiltersChange({ ...filters, condition: [value] })
    }
  }

  const getCurrentPriceRange = () => {
    const range = priceRanges.find(
      r => r.min === filters.priceMin && r.max === filters.priceMax
    )
    return range?.value || "all"
  }

  const getCurrentYearRange = () => {
    const range = yearRanges.find(
      r => r.min === filters.yearMin && r.max === filters.yearMax
    )
    return range?.value || "all"
  }

  const hasActiveFilters = !!(
    filters.make ||
    filters.category ||
    filters.condition ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.yearMin !== undefined ||
    filters.yearMax !== undefined
  )

  const clearQuickFilters = () => {
    onFiltersChange({
      ...filters,
      make: undefined,
      category: undefined,
      condition: undefined,
      priceMin: undefined,
      priceMax: undefined,
      yearMin: undefined,
      yearMax: undefined,
    })
  }

  return (
    <div className="space-y-3">
      {/* Filter Label and Clear Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Quick Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQuickFilters}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Quick Filters
          </Button>
        )}
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Make Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Make</label>
          <Select
            value={filters.make?.[0] || "all"}
            onValueChange={handleMakeChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Makes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {vehicleMakes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Vehicle Type</label>
          <Select
            value={filters.category?.[0] || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Price Range</label>
          <Select
            value={getCurrentPriceRange()}
            onValueChange={handlePriceChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Range Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Year</label>
          <Select
            value={getCurrentYearRange()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              {yearRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Condition</label>
          <Select
            value={filters.condition?.[0] || "all"}
            onValueChange={handleConditionChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {conditionTypes.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.make && filters.make[0] && (
            <Badge variant="secondary" className="text-xs">
              {filters.make[0]}
            </Badge>
          )}
          {filters.category && filters.category[0] && (
            <Badge variant="secondary" className="text-xs">
              {vehicleCategories.find(c => c.value === filters.category?.[0])?.label}
            </Badge>
          )}
          {filters.condition && filters.condition[0] && (
            <Badge variant="secondary" className="text-xs">
              {conditionTypes.find(c => c.value === filters.condition?.[0])?.label}
            </Badge>
          )}
          {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
            <Badge variant="secondary" className="text-xs">
              {priceRanges.find(
                r => r.min === filters.priceMin && r.max === filters.priceMax
              )?.label || "Custom Price"}
            </Badge>
          )}
          {(filters.yearMin !== undefined || filters.yearMax !== undefined) && (
            <Badge variant="secondary" className="text-xs">
              {yearRanges.find(
                r => r.min === filters.yearMin && r.max === filters.yearMax
              )?.label || "Custom Year"}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
