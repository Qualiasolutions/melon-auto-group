"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, Trash2, Search, Plus, Eye, ExternalLink } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VehicleData {
  id: string
  make: string
  model: string
  year: number
  price: number
  category: string
  available: boolean
  featured: boolean
  vin?: string
  source_url?: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/vehicles')
      const result = await response.json()

      if (response.ok && result.data) {
        setVehicles(result.data)
      } else {
        console.error('Error fetching vehicles:', result.error)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setVehicles(vehicles.filter(v => v.id !== id))
      } else {
        const result = await response.json()
        console.error('Error deleting vehicle:', result.error)
        alert('Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Failed to delete vehicle')
    }
  }

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus }),
      })

      if (response.ok) {
        setVehicles(vehicles.map(v =>
          v.id === id ? { ...v, available: !currentStatus } : v
        ))
      } else {
        const result = await response.json()
        console.error('Error updating vehicle:', result.error)
        alert('Failed to update vehicle status')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Failed to update vehicle status')
    }
  }

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600 mt-1">{vehicles.length} total vehicles</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
          <Link href="/admin/vehicles/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by make, model, or category..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">All Vehicles ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Vehicle</TableHead>
                    <TableHead className="text-gray-700">Year</TableHead>
                    <TableHead className="text-gray-700">Price</TableHead>
                    <TableHead className="text-gray-700">Category</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-gray-500">{vehicle.vin?.substring(0, 10)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900">{vehicle.year}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-red-600">€{vehicle.price?.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-gray-600 border-gray-300">
                          {vehicle.category?.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={`cursor-pointer ${vehicle.available ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => toggleAvailability(vehicle.id, vehicle.available)}
                          >
                            {vehicle.available ? 'Available' : 'Sold'}
                          </Badge>
                          {vehicle.featured && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {vehicle.source_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-green-200 text-green-600 hover:bg-green-50"
                              title="View source listing"
                            >
                              <Link href={vehicle.source_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-gray-200"
                          >
                            <Link href={`/inventory/${vehicle.id}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-gray-200"
                          >
                            <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No vehicles found</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/admin/vehicles/new">Add your first vehicle</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
