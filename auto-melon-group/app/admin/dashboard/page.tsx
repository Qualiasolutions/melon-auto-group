import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, DollarSign, CheckCircle, TrendingUp, Package, AlertCircle, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Vehicle } from "@/types/vehicle"

async function getStats() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')

  const typedVehicles = (vehicles as Vehicle[]) || []
  const available = typedVehicles.filter(v => v.available)
  const featured = typedVehicles.filter(v => v.featured)
  const totalValue = available.reduce((sum, v) => sum + (v.price || 0), 0)
  const avgPrice = available.length > 0 ? totalValue / available.length : 0

  return {
    total: typedVehicles.length,
    available: available.length,
    featured: featured.length,
    totalValue,
    avgPrice,
    recentVehicles: typedVehicles.slice(0, 5)
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.total,
      icon: Truck,
    },
    {
      title: "Available",
      value: stats.available,
      icon: CheckCircle,
    },
    {
      title: "Featured",
      value: stats.featured,
      icon: TrendingUp,
    },
    {
      title: "Avg Price",
      value: `€${Math.round(stats.avgPrice).toLocaleString()}`,
      icon: DollarSign,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-gray-600">Manage your vehicle inventory and operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button asChild className="h-20 bg-red-600 hover:bg-red-700 text-white flex-col">
              <Link href="/admin/vehicles/import">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-sm">Import</span>
              </Link>
            </Button>

            <Button asChild className="h-20 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-col">
              <Link href="/admin/vehicles/new">
                <Package className="h-5 w-5 mb-1" />
                <span className="text-sm">Add Vehicle</span>
              </Link>
            </Button>

            <Button asChild className="h-20 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-col">
              <Link href="/admin/vehicles">
                <Truck className="h-5 w-5 mb-1" />
                <span className="text-sm">All Vehicles</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 border border-gray-200 text-gray-700 hover:bg-gray-50 flex-col">
              <Link href="/">
                <AlertCircle className="h-5 w-5 mb-1" />
                <span className="text-sm">View Website</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Vehicles */}
      <Card className="border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Vehicles</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/vehicles">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentVehicles.length > 0 ? (
              stats.recentVehicles.map((vehicle: any) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center">
                      <Truck className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">€{vehicle.price?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{vehicle.available ? 'Available' : 'Sold'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No vehicles available. Add your first vehicle to get started.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
