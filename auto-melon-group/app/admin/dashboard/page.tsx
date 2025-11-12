import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, DollarSign, CheckCircle, TrendingUp, Package, AlertCircle } from "lucide-react"
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
      gradient: "from-brand-red to-red-700",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      title: "Available",
      value: stats.available,
      icon: CheckCircle,
      gradient: "from-brand-red to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      title: "Featured",
      value: stats.featured,
      icon: TrendingUp,
      gradient: "from-brand-red to-orange-600",
      bgGradient: "from-red-50 to-orange-100",
    },
    {
      title: "Avg Price",
      value: `€${Math.round(stats.avgPrice).toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-red-600 to-brand-red",
      bgGradient: "from-red-50 to-red-100",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-red to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-bold mb-2">Welcome to Admin Panel</h1>
        <p className="text-white/90 text-lg">Manage your truck inventory efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
            <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center`}>
                  <stat.icon className={`h-8 w-8 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-24 bg-gradient-to-r from-brand-red to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg">
              <Link href="/admin/vehicles/new">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8" />
                  <span className="text-base font-semibold">Add New Vehicle</span>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-24 bg-gradient-to-r from-red-600 to-brand-red hover:from-red-700 hover:to-red-800 shadow-lg">
              <Link href="/admin/vehicles">
                <div className="flex flex-col items-center gap-2">
                  <Truck className="h-8 w-8" />
                  <span className="text-base font-semibold">View All Vehicles</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 border-2 border-brand-red text-brand-red hover:bg-red-50 hover:border-red-700">
              <Link href="/">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="h-8 w-8" />
                  <span className="text-base font-semibold">View Website</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Vehicles */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Recent Vehicles</CardTitle>
          <Button asChild variant="outline">
            <Link href="/admin/vehicles">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentVehicles.length > 0 ? (
              stats.recentVehicles.map((vehicle: any) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <Truck className="h-8 w-8 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-sm text-slate-600">{vehicle.year} • {vehicle.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-red text-lg">€{vehicle.price?.toLocaleString()}</p>
                    <p className="text-xs text-slate-600">{vehicle.available ? 'Available' : 'Sold'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-600 py-8">No vehicles yet. Add your first vehicle!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
