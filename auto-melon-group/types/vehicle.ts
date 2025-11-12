export interface Vehicle {
  id: string
  make: string // Mercedes, Scania, Volvo, DAF, MAN, Iveco, Renault
  model: string
  year: number
  mileage: number // in kilometers
  price: number // base price in EUR
  currency: "EUR" | "USD"
  condition: "new" | "used" | "certified"
  category: "tractor-unit" | "tipper" | "box-truck" | "flatbed" | "refrigerated" | "tanker" | "curtainside" | "dropside" | "crane-truck" | "recovery" | "concrete-mixer" | "low-loader" | "trailer" | "pickup" | "van" | "construction" | "logging" | "double-deck" | "insulated" | "specialty" | "semi-truck" | "dump-truck" | "other"
  engineType: "diesel" | "electric" | "hybrid" | "gas"
  transmission: "manual" | "automatic" | "automated-manual"
  horsepower: number
  location: string
  country: string
  vin: string
  reference_url?: string // Original listing URL
  images: string[] // Array of image URLs
  specifications: VehicleSpecifications
  features: string[]
  description: string
  available: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface VehicleSpecifications {
  axleConfiguration?: string // e.g., "6x4", "4x2"
  gvw?: number // Gross Vehicle Weight in kg
  engineCapacity?: number // in liters
  fuelTankCapacity?: number // in liters
  cabType?: string // e.g., "Sleeper", "Day Cab"
  suspension?: string
  brakes?: string
  wheelbase?: number // in mm
  length?: number // in mm
  width?: number // in mm
  height?: number // in mm
  emissionStandard?: string // e.g., "Euro 6", "Euro 5"
  [key: string]: string | number | undefined
}

export interface VehicleFilters {
  make?: string[]
  category?: string[]
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  mileageMin?: number
  mileageMax?: number
  condition?: string[]
  engineType?: string[]
  transmission?: string[]
  axleConfiguration?: string[]
  country?: string[]
  featured?: boolean
  certified?: boolean
  location?: string
  search?: string
  sortBy?: "price-asc" | "price-desc" | "year-desc" | "year-asc" | "mileage-asc" | "mileage-desc" | "date-desc"
  viewMode?: "grid" | "list"
}

export const engineTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "gas", label: "Gas" },
] as const

export const transmissionTypes = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "automated-manual", label: "Automated Manual" },
] as const

export const axleConfigurations = [
  { value: "4x2", label: "4x2" },
  { value: "6x2", label: "6x2" },
  { value: "6x4", label: "6x4" },
  { value: "8x4", label: "8x4" },
  { value: "8x6", label: "8x6" },
] as const

export const conditionTypes = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified", label: "Certified Pre-Owned" },
] as const

export const europeanCountries = [
  "Germany", "France", "Italy", "Spain", "Netherlands",
  "Belgium", "Poland", "Sweden", "Austria", "Czech Republic",
  "United Kingdom", "Portugal", "Greece", "Hungary", "Romania"
] as const

export const vehicleMakes = [
  "Mercedes-Benz",
  "Scania",
  "Volvo",
  "DAF",
  "MAN",
  "Iveco",
  "Renault",
  "Freightliner",
  "Peterbilt",
  "Kenworth",
  "Mack",
] as const

export const vehicleCategories = [
  { value: "tractor-unit", label: "Tractor Unit" },
  { value: "semi-truck", label: "Semi Truck" },
  { value: "tipper", label: "Tipper" },
  { value: "dump-truck", label: "Dump Truck" },
  { value: "box-truck", label: "Box Truck" },
  { value: "flatbed", label: "Flatbed" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "tanker", label: "Tanker" },
  { value: "curtainside", label: "Curtainside" },
  { value: "dropside", label: "Dropside" },
  { value: "crane-truck", label: "Crane Truck" },
  { value: "recovery", label: "Recovery Vehicle" },
  { value: "concrete-mixer", label: "Concrete Mixer" },
  { value: "low-loader", label: "Low Loader" },
  { value: "trailer", label: "Trailer" },
  { value: "pickup", label: "Pickup" },
  { value: "van", label: "Van" },
  { value: "construction", label: "Construction Equipment" },
  { value: "logging", label: "Logging Truck" },
  { value: "double-deck", label: "Double Deck" },
  { value: "insulated", label: "Insulated" },
  { value: "specialty", label: "Specialty Vehicle" },
  { value: "other", label: "Other" },
] as const
