"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/inventory')
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />

      <div className="container relative z-10 flex flex-col items-center gap-8 py-24 sm:py-32 lg:py-40">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
          <span className="text-orange-400 font-semibold mr-2">★</span>
          Trusted by 1000+ buyers worldwide
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl">
          Premium Used Trucks &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Commercial Vehicles
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl text-center text-lg text-slate-300 sm:text-xl">
          Mercedes, Scania, Volvo, DAF & more. Quality assured trucks with transparent pricing and worldwide shipping.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-2 rounded-lg bg-white p-2 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by make, model, or keyword..."
                className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 h-12 px-8"
            >
              Search Trucks
            </Button>
          </div>
        </form>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur"
            onClick={() => router.push('/inventory?make=Mercedes-Benz')}
          >
            Mercedes-Benz
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur"
            onClick={() => router.push('/inventory?make=Scania')}
          >
            Scania
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur"
            onClick={() => router.push('/inventory?make=Volvo')}
          >
            Volvo
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur"
            onClick={() => router.push('/inventory?make=DAF')}
          >
            DAF
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mt-8">
          {[
            { value: "500+", label: "Trucks Available" },
            { value: "65+", label: "Countries Served" },
            { value: "30+", label: "Years Experience" },
            { value: "98%", label: "Customer Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
