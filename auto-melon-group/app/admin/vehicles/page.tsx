"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVehicles(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (!error) {
      setVehicles(vehicles.filter(v => v.id !== id))
    }
  }

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    // @ts-ignore - Supabase type inference issue
    const { error } = await supabase.from('vehicles').update({ available: !currentStatus }).eq('id', id)

    if (!error) {
      setVehicles(vehicles.map(v =>
        v.id === id ? { ...v, available: !currentStatus } : v
      ))
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
          <h1 className="text-3xl font-bold text-slate-900">Vehicle Management</h1>
          <p className="text-slate-600 mt-1">{vehicles.length} total vehicles</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg">
          <Link href="/admin/vehicles/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Vehicle
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="border-2 border-slate-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by make, model, or category..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle>All Vehicles ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
              <p className="mt-2 text-slate-600">Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-slate-600">{vehicle.vin?.substring(0, 10)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{vehicle.year}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-brand-red">€{vehicle.price?.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {vehicle.category?.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={`cursor-pointer ${vehicle.available ? 'bg-slate-700 hover:bg-slate-800 text-white' : 'bg-slate-400 hover:bg-slate-500 text-white'}`}
                            onClick={() => toggleAvailability(vehicle.id, vehicle.available)}
                          >
                            {vehicle.available ? 'Available' : 'Sold'}
                          </Badge>
                          {vehicle.featured && (
                            <Badge className="bg-brand-red hover:bg-red-700 text-white">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle.reference_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={vehicle.reference_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/inventory/${vehicle.id}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
              <p className="text-slate-600">No vehicles found</p>
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
