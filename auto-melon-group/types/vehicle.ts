export interface Vehicle {
  id: string
  make: string // Mercedes, Scania, Volvo, DAF, MAN, Iveco, Renault
  model: string
  year: number
  mileage: number // in kilometers
  price: number // base price in EUR
  currency: "EUR" | "USD"
  condition: "new" | "used" | "certified"
  category: "tractor-unit" | "tipper" | "box-truck" | "flatbed" | "refrigerated" | "tanker" | "curtainside" | "dropside" | "crane-truck" | "recovery" | "concrete-mixer" | "low-loader" | "trailer" | "pickup" | "van" | "construction" | "logging" | "double-deck" | "insulated" | "specialty" | "semi-truck" | "dump-truck" | "4x4" | "other"
  engineType: "diesel" | "electric" | "hybrid" | "gas"
  transmission: "manual" | "automatic" | "automated-manual"
  enginePower: number // in HP
  engineSize?: number // in liters
  cabin?: "1" | "1.5" | "2" // cabin configuration
  tons?: "3.5" | "7.5" | "12" | "18" // weight capacity in tonnes
  location: string
  country: string
  vin: string
  sourceUrl: string // Main source link for the vehicle
  bazarakiUrl?: string // Original Bazaraki listing URL for reference
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
  axleConfiguration?: string // e.g., "6x4", "4x2", "4x4"
  gvw?: number // Gross Vehicle Weight in kg
  engineCapacity?: number // in liters
  fuelTankCapacity?: number // in liters
  cabType?: string // e.g., "Sleeper", "Day Cab", "Crew Cab"
  suspension?: string // e.g., "Air Suspension", "Leaf Spring", "Coil Spring"
  brakes?: string // e.g., "Disc Brakes", "Drum Brakes", "ABS"
  wheelbase?: number // in mm
  length?: number // in mm
  width?: number // in mm
  height?: number // in mm
  emissionStandard?: string // e.g., "Euro 6", "Euro 5"
  // 4x4 and off-road specific specifications
  driveSystem?: string // e.g., "4x2", "4x4", "6x6", "8x8", "AWD"
  differentialLocks?: boolean // Has differential locks
  transferCase?: string // e.g., "Manual", "Automatic", "Electronic"
  groundClearance?: number // in mm
  approachAngle?: number // in degrees
  departureAngle?: number // in degrees
  wadingDepth?: number // in mm
  winchCapacity?: number // in kg
  // Payload and towing
  payloadCapacity?: number // in kg
  towingCapacity?: number // in kg
  // Performance specifications
  maxTorque?: number // in Nm
  topSpeed?: number // in km/h
  fuelConsumption?: string // e.g., "35 L/100km"
  // Interior and comfort
  seats?: number
  airConditioning?: boolean
  cruiseControl?: boolean
  navigationSystem?: boolean
  // Safety features
  airbags?: number
  esp?: boolean // Electronic Stability Program
  tractionControl?: boolean
  hillDescentControl?: boolean
  [key: string]: string | number | boolean | undefined
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

export const cabinTypes = [
  { value: "1", label: "Single Cabin" },
  { value: "1.5", label: "1.5" },
  { value: "2", label: "Double/Crew" },
] as const

export const tonsTypes = [
  { value: "3.5", label: "3.5 Tonnes" },
  { value: "7.5", label: "7.5 Tonnes" },
  { value: "12", label: "12 Tonnes" },
  { value: "18", label: "18 Tonnes" },
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
  "Mitsubishi",
  "Isuzu",
  "Toyota",
  "Nissan",
  "Freightliner",
  "Peterbilt",
  "Kenworth",
  "Mack",
  "Other",
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
  { value: "4x4", label: "4x4" },
  { value: "construction", label: "Construction Equipment" },
  { value: "logging", label: "Logging Truck" },
  { value: "double-deck", label: "Double Deck" },
  { value: "insulated", label: "Insulated" },
  { value: "specialty", label: "Specialty Vehicle" },
  { value: "other", label: "Other" },
] as const
