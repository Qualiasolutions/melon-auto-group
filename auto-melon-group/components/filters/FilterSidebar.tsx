"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  vehicleMakes,
  vehicleCategories,
  engineTypes,
  transmissionTypes,
  axleConfigurations,
  conditionTypes,
  europeanCountries,
  type VehicleFilters,
} from "@/types/vehicle"
import { FilterX } from "lucide-react"

interface FilterSidebarProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
  onClearFilters: () => void
}

export function FilterSidebar({ filters, onFiltersChange, onClearFilters }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([filters.priceMin || 0, filters.priceMax || 150000])
  const [yearRange, setYearRange] = useState([filters.yearMin || 2010, filters.yearMax || new Date().getFullYear()])
  const [mileageRange, setMileageRange] = useState([filters.mileageMin || 0, filters.mileageMax || 500000])

  // Sync local state with filter props
  useEffect(() => {
    setPriceRange([filters.priceMin || 0, filters.priceMax || 150000])
    setYearRange([filters.yearMin || 2010, filters.yearMax || new Date().getFullYear()])
    setMileageRange([filters.mileageMin || 0, filters.mileageMax || 500000])
  }, [filters])

  const handleMakeToggle = (make: string) => {
    const currentMakes = filters.make || []
    const newMakes = currentMakes.includes(make)
      ? currentMakes.filter(m => m !== make)
      : [...currentMakes, make]
    onFiltersChange({ ...filters, make: newMakes.length > 0 ? newMakes : undefined })
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.category || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    onFiltersChange({ ...filters, category: newCategories.length > 0 ? newCategories : undefined })
  }

  const handleEngineTypeToggle = (engineType: string) => {
    const currentTypes = filters.engineType || []
    const newTypes = currentTypes.includes(engineType)
      ? currentTypes.filter(t => t !== engineType)
      : [...currentTypes, engineType]
    onFiltersChange({ ...filters, engineType: newTypes.length > 0 ? newTypes : undefined })
  }

  const handleTransmissionToggle = (transmission: string) => {
    const currentTransmissions = filters.transmission || []
    const newTransmissions = currentTransmissions.includes(transmission)
      ? currentTransmissions.filter(t => t !== transmission)
      : [...currentTransmissions, transmission]
    onFiltersChange({ ...filters, transmission: newTransmissions.length > 0 ? newTransmissions : undefined })
  }

  const handleAxleConfigToggle = (axleConfig: string) => {
    const currentConfigs = filters.axleConfiguration || []
    const newConfigs = currentConfigs.includes(axleConfig)
      ? currentConfigs.filter(a => a !== axleConfig)
      : [...currentConfigs, axleConfig]
    onFiltersChange({ ...filters, axleConfiguration: newConfigs.length > 0 ? newConfigs : undefined })
  }

  const handleConditionToggle = (condition: string) => {
    const currentConditions = filters.condition || []
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition]
    onFiltersChange({ ...filters, condition: newConditions.length > 0 ? newConditions : undefined })
  }

  const handleCountryToggle = (country: string) => {
    const currentCountries = filters.country || []
    const newCountries = currentCountries.includes(country)
      ? currentCountries.filter(c => c !== country)
      : [...currentCountries, country]
    onFiltersChange({ ...filters, country: newCountries.length > 0 ? newCountries : undefined })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      priceMin: values[0] === 0 ? undefined : values[0],
      priceMax: values[1] === 150000 ? undefined : values[1]
    })
  }

  const handleYearChange = (values: number[]) => {
    setYearRange(values)
    onFiltersChange({
      ...filters,
      yearMin: values[0] === 2010 ? undefined : values[0],
      yearMax: values[1] === new Date().getFullYear() ? undefined : values[1]
    })
  }

  const handleMileageChange = (values: number[]) => {
    setMileageRange(values)
    onFiltersChange({
      ...filters,
      mileageMin: values[0] === 0 ? undefined : values[0],
      mileageMax: values[1] === 500000 ? undefined : values[1]
    })
  }

  const activeFilterCount = Object.keys(filters).filter(key =>
    key !== 'search' && key !== 'sortBy' && key !== 'viewMode' && filters[key as keyof VehicleFilters] !== undefined
  ).length

  return (
    <div className="flex flex-col h-full">
      {/* Header - Fixed */}
      <div className="shrink-0 pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="h-6 min-w-6 px-2 bg-brand-red hover:bg-brand-red">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-brand-red hover:text-brand-red hover:bg-red-50 h-8 px-3"
            >
              <FilterX className="h-4 w-4 mr-1.5" />
              Clear
            </Button>
          )}
        </div>
        {activeFilterCount > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''} applied
          </p>
        )}
      </div>

      {/* Scrollable Filters Area */}
      <ScrollArea className="flex-1 -mx-6 px-6">
        <Accordion type="multiple" defaultValue={["price", "year"]} className="w-full pt-4">
          {/* Make/Brand Filter */}
          <AccordionItem value="make" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Make/Brand</span>
                {filters.make && filters.make.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.make.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3 pb-2">
                  {vehicleMakes.map((make) => (
                    <div key={make} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={`make-${make}`}
                        checked={filters.make?.includes(make)}
                        onCheckedChange={() => handleMakeToggle(make)}
                        className="border-slate-300"
                      />
                      <label
                        htmlFor={`make-${make}`}
                        className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                      >
                        {make}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Category Filter */}
          <AccordionItem value="category" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Vehicle Type</span>
                {filters.category && filters.category.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.category.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {vehicleCategories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={filters.category?.includes(category.value)}
                      onCheckedChange={() => handleCategoryToggle(category.value)}
                      className="border-slate-300"
                    />
                    <label
                      htmlFor={`category-${category.value}`}
                      className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                    >
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range Filter */}
          <AccordionItem value="price" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-5 pb-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-slate-700">
                    €{priceRange[0].toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">to</span>
                  <span className="text-sm font-medium text-slate-700">
                    €{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={150000}
                  step={5000}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="price-min" className="text-xs font-medium text-slate-600">
                      Minimum
                    </Label>
                    <Input
                      id="price-min"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="h-9 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="price-max" className="text-xs font-medium text-slate-600">
                      Maximum
                    </Label>
                    <Input
                      id="price-max"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || 150000])}
                      className="h-9 text-sm"
                      placeholder="150000"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Year Filter */}
          <AccordionItem value="year" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              Year
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-5 pb-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-slate-700">{yearRange[0]}</span>
                  <span className="text-xs text-muted-foreground">to</span>
                  <span className="text-sm font-medium text-slate-700">{yearRange[1]}</span>
                </div>
                <Slider
                  min={2010}
                  max={new Date().getFullYear()}
                  step={1}
                  value={yearRange}
                  onValueChange={handleYearChange}
                  className="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Mileage Filter */}
          <AccordionItem value="mileage" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              Mileage
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-5 pb-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-slate-700">
                    {mileageRange[0].toLocaleString()} km
                  </span>
                  <span className="text-xs text-muted-foreground">to</span>
                  <span className="text-sm font-medium text-slate-700">
                    {mileageRange[1].toLocaleString()} km
                  </span>
                </div>
                <Slider
                  min={0}
                  max={500000}
                  step={10000}
                  value={mileageRange}
                  onValueChange={handleMileageChange}
                  className="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Condition Filter */}
          <AccordionItem value="condition" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Condition</span>
                {filters.condition && filters.condition.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.condition.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {conditionTypes.map((condition) => (
                  <div key={condition.value} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`condition-${condition.value}`}
                      checked={filters.condition?.includes(condition.value)}
                      onCheckedChange={() => handleConditionToggle(condition.value)}
                      className="border-slate-300"
                    />
                    <label
                      htmlFor={`condition-${condition.value}`}
                      className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                    >
                      {condition.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Engine Type Filter */}
          <AccordionItem value="engineType" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Fuel Type</span>
                {filters.engineType && filters.engineType.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.engineType.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {engineTypes.map((engine) => (
                  <div key={engine.value} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`engine-${engine.value}`}
                      checked={filters.engineType?.includes(engine.value)}
                      onCheckedChange={() => handleEngineTypeToggle(engine.value)}
                      className="border-slate-300"
                    />
                    <label
                      htmlFor={`engine-${engine.value}`}
                      className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                    >
                      {engine.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Transmission Filter */}
          <AccordionItem value="transmission" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Transmission</span>
                {filters.transmission && filters.transmission.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.transmission.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {transmissionTypes.map((transmission) => (
                  <div key={transmission.value} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`transmission-${transmission.value}`}
                      checked={filters.transmission?.includes(transmission.value)}
                      onCheckedChange={() => handleTransmissionToggle(transmission.value)}
                      className="border-slate-300"
                    />
                    <label
                      htmlFor={`transmission-${transmission.value}`}
                      className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                    >
                      {transmission.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Axle Configuration Filter */}
          <AccordionItem value="axleConfiguration" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Axle Configuration</span>
                {filters.axleConfiguration && filters.axleConfiguration.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.axleConfiguration.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {axleConfigurations.map((axle) => (
                  <div key={axle.value} className="flex items-center space-x-3 group">
                    <Checkbox
                      id={`axle-${axle.value}`}
                      checked={filters.axleConfiguration?.includes(axle.value)}
                      onCheckedChange={() => handleAxleConfigToggle(axle.value)}
                      className="border-slate-300"
                    />
                    <label
                      htmlFor={`axle-${axle.value}`}
                      className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                    >
                      {axle.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Country Filter */}
          <AccordionItem value="country" className="border-b">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <span>Location</span>
                {filters.country && filters.country.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {filters.country.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3 pb-2">
                  {europeanCountries.map((country) => (
                    <div key={country} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={`country-${country}`}
                        checked={filters.country?.includes(country)}
                        onCheckedChange={() => handleCountryToggle(country)}
                        className="border-slate-300"
                      />
                      <label
                        htmlFor={`country-${country}`}
                        className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                      >
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Special Features */}
          <AccordionItem value="features" className="border-none">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
              Special Features
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                <div className="flex items-center space-x-3 group">
                  <Checkbox
                    id="featured"
                    checked={filters.featured || false}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, featured: checked ? true : undefined })}
                    className="border-slate-300"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                  >
                    Featured Only
                  </label>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Checkbox
                    id="certified"
                    checked={filters.certified || false}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, certified: checked ? true : undefined })}
                    className="border-slate-300"
                  />
                  <label
                    htmlFor="certified"
                    className="text-sm leading-none cursor-pointer select-none group-hover:text-brand-red transition-colors"
                  >
                    Certified Only
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  )
}
