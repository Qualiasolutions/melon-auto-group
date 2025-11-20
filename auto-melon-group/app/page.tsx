import { VehicleCard } from "@/components/sections/VehicleCard"
import { SearchHeader } from "@/components/sections/SearchHeader"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { Vehicle } from "@/types/vehicle"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Truck,
  TruckIcon,
} from "lucide-react"

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(18)

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching vehicles:', error)
    }
    return []
  }

  return vehicles as Vehicle[]
}

interface TruckCategory {
  title: string
  imagePath: string
  category: string
  color: string
}

const truckCategories: TruckCategory[] = [
  {
    title: "4x4",
    imagePath: "/icons/4x4.png",
    category: "4x4",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Tractor Unit",
    imagePath: "/icons/tractor-unit.png",
    category: "tractor-unit",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Tipper",
    imagePath: "/icons/tipper.png",
    category: "tipper",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Box Truck",
    imagePath: "/icons/box-truck.png",
    category: "box-truck",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Flatbed",
    imagePath: "/icons/flatbed.png",
    category: "flatbed",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Refrigerated",
    imagePath: "/icons/refrigerated.png",
    category: "refrigerated",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Tanker",
    imagePath: "/icons/tanker.png",
    category: "tanker",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Trailer",
    imagePath: "/icons/trailer.png",
    category: "trailer",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Curtainside",
    imagePath: "/icons/curtainside.png",
    category: "curtainside",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Crane Truck",
    imagePath: "/icons/crane-truck.png",
    category: "crane-truck",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Van",
    imagePath: "/icons/van.png",
    category: "van",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Dropside",
    imagePath: "/icons/dropside.png",
    category: "dropside",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Recovery",
    imagePath: "/icons/recovery.png",
    category: "recovery",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Concrete Mixer",
    imagePath: "/icons/concrete-mixer.png",
    category: "concrete-mixer",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Low Loader",
    imagePath: "/icons/low-loader.png",
    category: "low-loader",
    color: "bg-white hover:bg-slate-50",
  },
  {
    title: "Logging",
    imagePath: "/icons/logging.png",
    category: "logging",
    color: "bg-white hover:bg-slate-50",
  },
]

export default async function Home() {
  const featuredVehicles = await getFeaturedVehicles()

  return (
    <div className="flex flex-col">
      {/* Simple Search Header */}
      <SearchHeader />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Main Category Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-b-4 border-slate-100">
        <div className="container max-w-7xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-wider text-brand-red font-semibold mb-2">
              Browse by Category
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-2">
              Find Your Perfect Truck
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based in Cyprus, serving local businesses with quality UK-imported commercial vehicles
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-5">
            {truckCategories.map((category) => (
              <Link
                key={category.category}
                href={`/inventory?category=${category.category}`}
                className={`group relative rounded-lg border border-slate-200 bg-white p-4 text-center transition-all hover:shadow-lg hover:border-brand-red hover:-translate-y-1 ${category.color}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-24 w-24 rounded-lg bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Image
                      src={category.imagePath}
                      alt={category.title}
                      width={84}
                      height={84}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-slate-700 group-hover:text-brand-red transition-colors">{category.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand-red/20 to-transparent"></div>

      {/* Featured Vehicles Section */}
      <section className="py-24 bg-white border-b-4 border-slate-100">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
            <div>
              <p className="text-sm uppercase tracking-widest text-brand-red font-bold mb-3 flex items-center gap-2">
                <span className="h-0.5 w-8 bg-brand-red"></span>
                Featured Selection
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-ink mb-3 tracking-tight">
                Quality Used Trucks in Cyprus
              </h2>
              <p className="text-lg text-slate-600 font-medium">UK imported trucks - Mercedes, Scania, Volvo, DAF</p>
            </div>
            <Button asChild size="lg" className="mt-8 md:mt-0 bg-brand-red hover:bg-brand-red-dark text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8 py-6 text-base font-semibold">
              <Link href="/inventory">
                View All Inventory
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-slate-200">
              <TruckIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-brand-ink">Loading Inventory</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our latest commercial vehicles are being updated
              </p>
              <Button asChild variant="outline">
                <Link href="/inventory">Browse Available Trucks</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand-green/20 to-transparent"></div>

      {/* Trust Signals */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b-4 border-slate-100">
        <div className="container max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-10 bg-white rounded-2xl border-2 border-slate-100 hover:shadow-2xl hover:border-brand-red/20 transition-all duration-300 group">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 text-brand-red mb-6 shadow-lg ring-4 ring-red-50 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-brand-ink group-hover:text-brand-red transition-colors">Quality Assured</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Every vehicle thoroughly inspected and certified
              </p>
            </div>
            <div className="text-center p-10 bg-white rounded-2xl border-2 border-slate-100 hover:shadow-2xl hover:border-brand-green/20 transition-all duration-300 group">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 text-brand-green mb-6 shadow-lg ring-4 ring-green-50 group-hover:scale-110 transition-transform">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-brand-ink group-hover:text-brand-green transition-colors">UK Imported Quality</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                EURO 6 certified trucks from the UK market
              </p>
            </div>
            <div className="text-center p-10 bg-white rounded-2xl border-2 border-slate-100 hover:shadow-2xl hover:border-blue-600/20 transition-all duration-300 group">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 text-blue-600 mb-6 shadow-lg ring-4 ring-blue-50 group-hover:scale-110 transition-transform">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-brand-ink group-hover:text-blue-600 transition-colors">Easy Search</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Advanced filtering to find your perfect match
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent"></div>

      {/* Popular Brands */}
      <section className="py-20 bg-white border-b-4 border-slate-100">
        <div className="container max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-brand-red font-semibold mb-2">
              Trusted Manufacturers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-2">
              Top Brands
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We feature the world's leading commercial vehicle manufacturers
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {["Mercedes-Benz", "Scania", "Volvo", "DAF", "MAN", "Iveco", "Renault", "Freightliner", "Peterbilt", "Kenworth", "Mack", "Isuzu"].map((brand) => (
              <Link
                key={brand}
                href={`/inventory?make=${brand}`}
                className="flex items-center justify-center h-24 border border-slate-200 rounded-lg bg-white hover:border-brand-red hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <span className="font-bold text-sm text-center px-3 text-slate-700 group-hover:text-brand-red transition-colors">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red via-red-600 to-orange-600" />
        <div className="absolute inset-0 bg-melon-grid opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-400/20 via-transparent to-transparent"></div>
        <div className="container max-w-7xl relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to Find Your Perfect Truck?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto font-medium leading-relaxed">
            Browse our extensive inventory of quality used trucks in Cyprus or contact our expert team for personalized assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-brand-red hover:bg-slate-50 hover:text-brand-red-dark shadow-2xl hover:shadow-3xl transition-all text-lg px-10 py-7 font-bold hover:scale-105">
              <Link href="/inventory">
                Browse Inventory
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-3 border-white bg-white text-brand-red hover:bg-slate-100 hover:text-brand-red-dark shadow-2xl hover:shadow-3xl transition-all text-lg px-10 py-7 font-bold hover:scale-105">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
