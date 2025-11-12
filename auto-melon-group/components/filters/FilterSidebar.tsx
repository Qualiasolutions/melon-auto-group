"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Icon } from "@/components/ui/icon"

interface FilterSidebarProps {
  filters: VehicleFilters
  onFiltersChange: (filters: VehicleFilters) => void
  onClearFilters: () => void
}

export function FilterSidebar({ filters, onFiltersChange, onClearFilters }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([filters.priceMin || 0, filters.priceMax || 150000])
  const [yearRange, setYearRange] = useState([filters.yearMin || 2010, filters.yearMax || new Date().getFullYear()])
  const [mileageRange, setMileageRange] = useState([filters.mileageMin || 0, filters.mileageMax || 500000])

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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <p className="text-sm text-muted-foreground">{activeFilterCount} active</p>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <Icon name="close" className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Filters Accordion */}
      <Accordion type="multiple" defaultValue={["make", "price", "year"]} className="w-full">
        {/* Make/Brand Filter */}
        <AccordionItem value="make">
          <AccordionTrigger className="text-sm font-medium">
            Make/Brand {filters.make && filters.make.length > 0 && `(${filters.make.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {vehicleMakes.map((make) => (
                <div key={make} className="flex items-center space-x-2">
                  <Checkbox
                    id={`make-${make}`}
                    checked={filters.make?.includes(make)}
                    onCheckedChange={() => handleMakeToggle(make)}
                  />
                  <label
                    htmlFor={`make-${make}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {make}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">
            Vehicle Type {filters.category && filters.category.length > 0 && `(${filters.category.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {vehicleCategories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={filters.category?.includes(category.value)}
                    onCheckedChange={() => handleCategoryToggle(category.value)}
                  />
                  <label
                    htmlFor={`category-${category.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range (EUR)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  €{priceRange[0].toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  €{priceRange[1].toLocaleString()}+
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price-min" className="text-xs">Min</Label>
                  <Input
                    id="price-min"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="price-max" className="text-xs">Max</Label>
                  <Input
                    id="price-max"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || 150000])}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Year Filter */}
        <AccordionItem value="year">
          <AccordionTrigger className="text-sm font-medium">Year</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{yearRange[0]}</span>
                <span className="text-sm text-muted-foreground">{yearRange[1]}</span>
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
        <AccordionItem value="mileage">
          <AccordionTrigger className="text-sm font-medium">Mileage (km)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {mileageRange[0].toLocaleString()} km
                </span>
                <span className="text-sm text-muted-foreground">
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
        <AccordionItem value="condition">
          <AccordionTrigger className="text-sm font-medium">
            Condition {filters.condition && filters.condition.length > 0 && `(${filters.condition.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {conditionTypes.map((condition) => (
                <div key={condition.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition.value}`}
                    checked={filters.condition?.includes(condition.value)}
                    onCheckedChange={() => handleConditionToggle(condition.value)}
                  />
                  <label
                    htmlFor={`condition-${condition.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {condition.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Engine Type Filter */}
        <AccordionItem value="engineType">
          <AccordionTrigger className="text-sm font-medium">
            Fuel Type {filters.engineType && filters.engineType.length > 0 && `(${filters.engineType.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {engineTypes.map((engine) => (
                <div key={engine.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`engine-${engine.value}`}
                    checked={filters.engineType?.includes(engine.value)}
                    onCheckedChange={() => handleEngineTypeToggle(engine.value)}
                  />
                  <label
                    htmlFor={`engine-${engine.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {engine.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Transmission Filter */}
        <AccordionItem value="transmission">
          <AccordionTrigger className="text-sm font-medium">
            Transmission {filters.transmission && filters.transmission.length > 0 && `(${filters.transmission.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {transmissionTypes.map((transmission) => (
                <div key={transmission.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transmission-${transmission.value}`}
                    checked={filters.transmission?.includes(transmission.value)}
                    onCheckedChange={() => handleTransmissionToggle(transmission.value)}
                  />
                  <label
                    htmlFor={`transmission-${transmission.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {transmission.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Axle Configuration Filter */}
        <AccordionItem value="axleConfiguration">
          <AccordionTrigger className="text-sm font-medium">
            Axle Configuration {filters.axleConfiguration && filters.axleConfiguration.length > 0 && `(${filters.axleConfiguration.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {axleConfigurations.map((axle) => (
                <div key={axle.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`axle-${axle.value}`}
                    checked={filters.axleConfiguration?.includes(axle.value)}
                    onCheckedChange={() => handleAxleConfigToggle(axle.value)}
                  />
                  <label
                    htmlFor={`axle-${axle.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {axle.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Country Filter */}
        <AccordionItem value="country">
          <AccordionTrigger className="text-sm font-medium">
            Location {filters.country && filters.country.length > 0 && `(${filters.country.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 max-h-64 overflow-y-auto">
              {europeanCountries.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={filters.country?.includes(country)}
                    onCheckedChange={() => handleCountryToggle(country)}
                  />
                  <label
                    htmlFor={`country-${country}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {country}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Special Features */}
        <AccordionItem value="features">
          <AccordionTrigger className="text-sm font-medium">Special Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={filters.featured || false}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, featured: checked ? true : undefined })}
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Featured Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certified"
                  checked={filters.certified || false}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, certified: checked ? true : undefined })}
                />
                <label
                  htmlFor="certified"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Certified Only
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
