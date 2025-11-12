import { z } from "zod"

// Vehicle form validation schema
export const vehicleFormSchema = z.object({
  // Basic Information
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .int("Year must be a whole number")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 2, "Year cannot be more than 2 years in the future"),
  vin: z.string()
    .min(1, "VIN is required")
    .max(100, "VIN must be less than 100 characters"),
  reference_url: z.string(),
  category: z.string().min(1, "Category is required"),
  condition: z.enum(["new", "used", "certified"]),

  // Pricing & Specifications
  price: z.number()
    .positive("Price must be greater than 0")
    .min(1, "Price is required"),
  currency: z.string(),
  mileage: z.number()
    .int("Mileage must be a whole number")
    .min(0, "Mileage cannot be negative"),
  horsepower: z.number()
    .int("Horsepower must be a whole number")
    .positive("Horsepower must be greater than 0"),
  engineType: z.enum(["diesel", "electric", "hybrid", "gas"]),
  transmission: z.enum(["manual", "automatic", "automated-manual"]),

  // Location
  location: z.string().min(1, "Location is required"),
  country: z.string(),

  // Media
  images: z.array(z.string().url("Image must be a valid URL")),

  // Description
  description: z.string(),

  // Specifications (JSONB)
  specifications: z.record(z.string(), z.union([z.string(), z.number()])),

  // Features
  features: z.array(z.string()),

  // Flags
  available: z.boolean(),
  featured: z.boolean(),
})

export type VehicleFormData = z.infer<typeof vehicleFormSchema>

// Individual field schemas for partial validation
export const priceSchema = z.number().positive().min(1)
export const yearSchema = z.number().int().min(1900).max(new Date().getFullYear() + 2)
export const mileageSchema = z.number().int().min(0)
export const vinSchema = z.string().min(1).max(100)
export const imageUrlSchema = z.string().url()
