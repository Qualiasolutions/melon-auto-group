import { z } from "zod"

// Custom truck order form validation schema
export const customOrderFormSchema = z.object({
  // Customer Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  company: z.string().optional(),

  // Truck Specifications
  truckType: z.enum([
    "tractor-unit",
    "tipper",
    "box-truck",
    "flatbed",
    "refrigerated",
    "tanker",
    "curtainside",
    "crane-truck",
    "concrete-mixer",
    "low-loader",
    "custom-build"
  ], {
    required_error: "Please select a truck type",
  }),

  // Preferences
  preferredMake: z.string().min(1, "Please specify preferred make"),
  budgetRange: z.enum([
    "under-50k",
    "50k-100k",
    "100k-200k",
    "200k-300k",
    "over-300k",
    "flexible"
  ]),

  // Technical Requirements
  engineType: z.enum(["diesel", "electric", "hybrid", "gas"]).optional(),
  transmission: z.enum(["manual", "automatic", "automated-manual"]).optional(),
  axleConfiguration: z.string().optional(),
  horsepowerMin: z.number().int().min(0).optional(),

  // Specifications
  gvwMin: z.number().int().min(0).optional(),
  cabType: z.enum(["sleeper", "day-cab", "crew-cab", "extended"]).optional(),
  emissionStandard: z.string().optional(),

  // Special Features & Requirements
  specialFeatures: z.array(z.string()),
  customRequirements: z.string().min(20, "Please provide detailed requirements (minimum 20 characters)"),

  // Timeline & Usage
  desiredDelivery: z.enum([
    "immediate",
    "1-3-months",
    "3-6-months",
    "6-12-months",
    "flexible"
  ]),
  intendedUse: z.string().min(10, "Please describe intended use (minimum 10 characters)"),

  // Additional Information
  currentFleetSize: z.number().int().min(0).optional(),
  tradeInAvailable: z.boolean(),
  tradeInDetails: z.string().optional(),
  financingNeeded: z.boolean(),

  // Agreement
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
})

export type CustomOrderFormData = z.infer<typeof customOrderFormSchema>

// Truck type options with labels
export const truckTypeOptions = [
  { value: "tractor-unit", label: "Tractor Unit / Semi Truck" },
  { value: "tipper", label: "Tipper / Dump Truck" },
  { value: "box-truck", label: "Box Truck / Van Body" },
  { value: "flatbed", label: "Flatbed Truck" },
  { value: "refrigerated", label: "Refrigerated Truck" },
  { value: "tanker", label: "Tanker Truck" },
  { value: "curtainside", label: "Curtainside Truck" },
  { value: "crane-truck", label: "Crane Truck" },
  { value: "concrete-mixer", label: "Concrete Mixer" },
  { value: "low-loader", label: "Low Loader" },
  { value: "custom-build", label: "Custom Build / Special Requirements" },
] as const

// Budget range options
export const budgetRangeOptions = [
  { value: "under-50k", label: "Under €50,000" },
  { value: "50k-100k", label: "€50,000 - €100,000" },
  { value: "100k-200k", label: "€100,000 - €200,000" },
  { value: "200k-300k", label: "€200,000 - €300,000" },
  { value: "over-300k", label: "Over €300,000" },
  { value: "flexible", label: "Flexible / Depends on Specifications" },
] as const

// Cab type options
export const cabTypeOptions = [
  { value: "sleeper", label: "Sleeper Cab" },
  { value: "day-cab", label: "Day Cab" },
  { value: "crew-cab", label: "Crew Cab" },
  { value: "extended", label: "Extended Cab" },
] as const

// Delivery timeline options
export const deliveryTimelineOptions = [
  { value: "immediate", label: "Immediate (Ready Stock)" },
  { value: "1-3-months", label: "1-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "6-12-months", label: "6-12 Months" },
  { value: "flexible", label: "Flexible Timeline" },
] as const

// Common special features
export const commonFeatures = [
  "Air Conditioning",
  "GPS Navigation",
  "Parking Sensors",
  "Rear Camera",
  "Cruise Control",
  "ABS Brakes",
  "Air Suspension",
  "Power Steering",
  "Central Locking",
  "Alloy Wheels",
  "LED Lights",
  "Electric Windows",
  "Hydraulic Lift",
  "Tail Lift",
  "Refrigeration Unit",
  "Heated Seats",
  "Bluetooth Connectivity",
  "Lane Departure Warning",
  "Collision Avoidance System",
] as const
