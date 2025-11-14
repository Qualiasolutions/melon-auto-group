"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, X } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  vehicleMakes,
  vehicleCategories,
  conditionTypes,
} from "@/types/vehicle"

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

export function SearchHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState("")
  const [selectedYearRange, setSelectedYearRange] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    switch (key) {
      case 'make':
        setSelectedMake(value)
        break
      case 'type':
        setSelectedCategory(value)
        break
      case 'price range':
        setSelectedPriceRange(value)
        break
      case 'year':
        setSelectedYearRange(value)
        break
      case 'condition':
        setSelectedCondition(value)
        break
    }
    setOpenDropdown(null)
  }

  const handleReset = () => {
    setSelectedMake("")
    setSelectedCategory("")
    setSelectedPriceRange("")
    setSelectedYearRange("")
    setSelectedCondition("")
    setSearchQuery("")
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim())
    }

    if (selectedMake) {
      params.append('make', selectedMake)
    }

    if (selectedCategory) {
      params.append('category', selectedCategory)
    }

    if (selectedCondition) {
      params.append('condition', selectedCondition)
    }

    const priceRange = priceRanges.find(r => r.label === selectedPriceRange)
    if (priceRange && priceRange.min !== undefined) {
      params.append('priceMin', priceRange.min.toString())
    }
    if (priceRange && priceRange.max !== undefined) {
      params.append('priceMax', priceRange.max.toString())
    }

    const yearRange = yearRanges.find(r => r.label === selectedYearRange)
    if (yearRange && yearRange.min !== undefined) {
      params.append('yearMin', yearRange.min.toString())
    }
    if (yearRange && yearRange.max !== undefined) {
      params.append('yearMax', yearRange.max.toString())
    }

    const queryString = params.toString()
    router.push(`/inventory${queryString ? `?${queryString}` : ''}`)
  }

  const hasActiveFilters =
    selectedMake !== "" ||
    selectedCategory !== "" ||
    selectedPriceRange !== "" ||
    selectedYearRange !== "" ||
    selectedCondition !== ""

  interface FilterDropdownProps {
    label: string
    value: string
    options: { value: string; label: string }[] | string[]
    onChange: (key: string, value: string) => void
  }

  const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => {
    const isOpen = openDropdown === label
    const displayValue = value || `All ${label}s`

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : label)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:border-brand-red transition-colors"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            <button
              onClick={() => onChange(label.toLowerCase(), "")}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-neutral-100 ${
                !value
                  ? "bg-red-50 text-red-600 font-medium"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              All {label}s
            </button>
            {options.map((option: any, idx: number) => {
              const optionValue = typeof option === 'string' ? option : option.value
              const optionLabel = typeof option === 'string' ? option : option.label

              return (
                <button
                  key={idx}
                  onClick={() => onChange(label.toLowerCase(), optionLabel)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    idx !== options.length - 1 ? "border-b border-neutral-100" : ""
                  } ${
                    optionLabel === value
                      ? "bg-red-50 text-red-600 font-medium"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {optionLabel}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-brand-ink mb-4 tracking-tight">
              Find Your Perfect <span className="text-brand-red">Commercial Truck</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Use our advanced filters to find your perfect commercial vehicle
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-full mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              placeholder="Search by make, model, type..."
              className="h-14 pl-12 pr-4 text-base border-2 border-slate-200 focus:border-brand-green shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Advanced Filters */}
          <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-neutral-900">Advanced Filters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                  Vehicle Type
                </label>
                <FilterDropdown
                  label="Type"
                  value={selectedCategory}
                  options={vehicleCategories.slice(0, 15)}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">Make</label>
                <FilterDropdown
                  label="Make"
                  value={selectedMake}
                  options={vehicleMakes.map(m => ({ value: m, label: m }))}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                  Price Range
                </label>
                <FilterDropdown
                  label="Price Range"
                  value={selectedPriceRange}
                  options={priceRanges.slice(1)}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">Year</label>
                <FilterDropdown
                  label="Year"
                  value={selectedYearRange}
                  options={yearRanges.slice(1)}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                  Condition
                </label>
                <FilterDropdown
                  label="Condition"
                  value={selectedCondition}
                  options={[...conditionTypes]}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
                Search Inventory
              </button>
              <button
                onClick={() => router.push('/inventory')}
                className="px-6 py-3.5 border border-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Active filters:</span>{" "}
                {[
                  selectedMake && `Make: ${selectedMake}`,
                  selectedCategory && `Type: ${selectedCategory}`,
                  selectedPriceRange && `Price: ${selectedPriceRange}`,
                  selectedYearRange && `Year: ${selectedYearRange}`,
                  selectedCondition && `Condition: ${selectedCondition}`
                ].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
