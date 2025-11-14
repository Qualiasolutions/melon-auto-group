import { supabase } from '@/lib/supabase/client'
import { vehicleMakes } from '@/types/vehicle'

export interface CustomMake {
  id: string
  make_name: string
  created_at: string
  updated_at: string
}

// Fetch all custom makes from Supabase
export async function getCustomMakes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('custom_makes')
      .select('make_name')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching custom makes:', error)
      return []
    }

    return data?.map(item => item.make_name) || []
  } catch (error) {
    console.error('Error fetching custom makes:', error)
    return []
  }
}

// Add a new custom make to Supabase
export async function addCustomMake(makeName: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate input
    if (!makeName || !makeName.trim()) {
      return { success: false, message: 'Please enter a custom make name' }
    }

    const trimmedMake = makeName.trim()

    // Check if it already exists in the original vehicle makes
    if ((vehicleMakes as string[]).includes(trimmedMake)) {
      return { success: false, message: 'This make already exists in the standard list' }
    }

    // Check if it already exists in custom makes
    const existingMakes = await getCustomMakes()
    if (existingMakes.includes(trimmedMake)) {
      return { success: false, message: 'This custom make already exists in the list' }
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('custom_makes')
      .insert({ make_name: trimmedMake })

    if (error) {
      console.error('Error adding custom make:', error)
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'This make already exists in the list' }
      }
      return { success: false, message: 'Failed to add custom make to database' }
    }

    return { success: true, message: `"${trimmedMake}" has been added permanently!` }
  } catch (error) {
    console.error('Error adding custom make:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

// Get all vehicle makes (standard + custom)
export async function getAllVehicleMakes(): Promise<string[]> {
  try {
    const customMakes = await getCustomMakes()
    return [...vehicleMakes, ...customMakes]
  } catch (error) {
    console.error('Error getting all vehicle makes:', error)
    return vehicleMakes as string[]
  }
}