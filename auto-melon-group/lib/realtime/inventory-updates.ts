import { createClient } from '@supabase/supabase-js'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Vehicle } from '@/types/vehicle'

export type InventoryUpdateEvent = {
  type: 'vehicle_added' | 'vehicle_updated' | 'vehicle_deleted' | 'vehicle_sold'
  vehicle: Vehicle | null
  vehicleId?: string
  timestamp: string
  userId?: string
  metadata?: any
}

export type InventoryUpdateListener = (event: InventoryUpdateEvent) => void

class InventoryUpdateService {
  private supabase: any
  private channel: RealtimeChannel | null = null
  private listeners: Map<string, InventoryUpdateListener> = new Map()
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  /**
   * Connect to real-time updates
   */
  async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        return
      }

      this.channel = this.supabase
        .channel('inventory-updates')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'vehicles'
          },
          (payload: any) => {
            this.handleDatabaseChange(payload)
          }
        )
        .on('broadcast',
          { event: 'inventory_update' },
          (payload: any) => {
            this.handleBroadcastUpdate(payload)
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true
            this.reconnectAttempts = 0
            console.log('✅ Connected to inventory updates')
            this.notifyListeners({
              type: 'vehicle_updated',
              vehicle: null,
              timestamp: new Date().toISOString(),
              metadata: { status: 'connected' }
            })
          } else if (status === 'CHANNEL_ERROR') {
            this.isConnected = false
            console.error('❌ Failed to connect to inventory updates')
            this.handleReconnect()
          }
        })
    } catch (error) {
      console.error('Error connecting to inventory updates:', error)
      this.handleReconnect()
    }
  }

  /**
   * Disconnect from real-time updates
   */
  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.supabase.removeChannel(this.channel)
      this.channel = null
      this.isConnected = false
      console.log('🔌 Disconnected from inventory updates')
    }
  }

  /**
   * Add a listener for inventory updates
   */
  addListener(id: string, listener: InventoryUpdateListener): void {
    this.listeners.set(id, listener)
  }

  /**
   * Remove a listener
   */
  removeListener(id: string): void {
    this.listeners.delete(id)
  }

  /**
   * Broadcast an inventory update event
   */
  async broadcastUpdate(event: Omit<InventoryUpdateEvent, 'timestamp'>): Promise<void> {
    try {
      if (!this.channel || !this.isConnected) {
        console.warn('Not connected to broadcast updates')
        return
      }

      await this.channel.send({
        type: 'broadcast',
        event: 'inventory_update',
        payload: {
          ...event,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Error broadcasting inventory update:', error)
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: InventoryUpdateEvent): void {
    this.listeners.forEach((listener, id) => {
      try {
        listener(event)
      } catch (error) {
        console.error(`Error in listener ${id}:`, error)
      }
    })
  }

  /**
   * Handle database change events
   */
  private handleDatabaseChange(payload: any): void {
    console.log('📡 Database change:', payload)

    let event: InventoryUpdateEvent

    switch (payload.eventType) {
      case 'INSERT':
        event = {
          type: 'vehicle_added',
          vehicle: payload.new as Vehicle,
          timestamp: new Date().toISOString()
        }
        break

      case 'UPDATE':
        event = {
          type: payload.new.available === false ? 'vehicle_sold' : 'vehicle_updated',
          vehicle: payload.new as Vehicle,
          timestamp: new Date().toISOString()
        }
        break

      case 'DELETE':
        event = {
          type: 'vehicle_deleted',
          vehicle: null,
          vehicleId: payload.old.id,
          timestamp: new Date().toISOString()
        }
        break

      default:
        return
    }

    this.notifyListeners(event)
  }

  /**
   * Handle broadcast update events
   */
  private handleBroadcastUpdate(payload: any): void {
    const event: InventoryUpdateEvent = payload.payload
    this.notifyListeners(event)
  }

  /**
   * Handle reconnection logic
   */
  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      this.connect()
    }, delay)
  }

  /**
   * Get connection status
   */
  isRealtimeConnected(): boolean {
    return this.isConnected
  }

  /**
   * Get current listener count
   */
  getListenerCount(): number {
    return this.listeners.size
  }
}

// Singleton instance
export const inventoryUpdates = new InventoryUpdateService()

// React hook for real-time inventory updates
export function useInventoryUpdates(listener: InventoryUpdateListener, deps: any[] = []) {
  const listenerId = React.useId?.() || Math.random().toString(36)

  React.useEffect(() => {
    // Add listener
    inventoryUpdates.addListener(listenerId, listener)

    // Connect if not already connected
    inventoryUpdates.connect()

    // Cleanup
    return () => {
      inventoryUpdates.removeListener(listenerId)
    }
  }, deps)

  return {
    isConnected: inventoryUpdates.isRealtimeConnected(),
    broadcastUpdate: inventoryUpdates.broadcastUpdate.bind(inventoryUpdates),
    disconnect: inventoryUpdates.disconnect.bind(inventoryUpdates)
  }
}

// Server-side utility for broadcasting updates
export async function broadcastInventoryUpdate(event: Omit<InventoryUpdateEvent, 'timestamp'>): Promise<void> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    await supabase
      .channel('admin-updates')
      .send({
        type: 'broadcast',
        event: 'inventory_update',
        payload: {
          ...event,
          timestamp: new Date().toISOString()
        }
      })
  } catch (error) {
    console.error('Error broadcasting server-side update:', error)
  }
}

// Vehicle CRUD operations with real-time updates
export class VehicleCRUDService {
  private supabase: any

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    this.supabase = createClient(supabaseUrl, supabaseServiceKey)
  }

  async createVehicle(vehicleData: Partial<Vehicle>, userId?: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await this.supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating vehicle:', error)
        return null
      }

      // Broadcast update
      await inventoryUpdates.broadcastUpdate({
        type: 'vehicle_added',
        vehicle: data,
        userId
      })

      return data
    } catch (error) {
      console.error('Error in createVehicle:', error)
      return null
    }
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>, userId?: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await this.supabase
        .from('vehicles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating vehicle:', error)
        return null
      }

      // Broadcast update
      await inventoryUpdates.broadcastUpdate({
        type: 'vehicle_updated',
        vehicle: data,
        userId
      })

      return data
    } catch (error) {
      console.error('Error in updateVehicle:', error)
      return null
    }
  }

  async deleteVehicle(id: string, userId?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting vehicle:', error)
        return false
      }

      // Broadcast update
      await inventoryUpdates.broadcastUpdate({
        type: 'vehicle_deleted',
        vehicle: null,
        vehicleId: id,
        userId
      })

      return true
    } catch (error) {
      console.error('Error in deleteVehicle:', error)
      return false
    }
  }

  async markAsSold(id: string, userId?: string): Promise<Vehicle | null> {
    return this.updateVehicle(id, { available: false }, userId)
  }
}

export const vehicleCRUD = new VehicleCRUDService()