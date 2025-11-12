import { Vehicle } from './vehicle'

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: Vehicle
        Insert: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>
      }
      inquiries: {
        Row: {
          id: string
          vehicle_id: string | null
          name: string
          email: string
          phone: string
          message: string
          status: 'new' | 'contacted' | 'qualified' | 'closed' | 'spam'
          created_at: string
          updated_at: string
        }
        Insert: {
          vehicle_id?: string | null
          name: string
          email: string
          phone: string
          message: string
          status?: 'new' | 'contacted' | 'qualified' | 'closed' | 'spam'
          created_at?: string
        }
        Update: Partial<{
          vehicle_id: string | null
          name: string
          email: string
          phone: string
          message: string
          status: 'new' | 'contacted' | 'qualified' | 'closed' | 'spam'
        }>
      }
    }
  }
}
