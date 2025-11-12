"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Icon } from "@/components/ui/icon"
import {
  vehicleCategories,
  vehicleMakes,
  conditionTypes,
  europeanCountries,
} from "@/types/vehicle"

const categoryBlocks = [
  {
    label: "Tractor Unit",
    query: "semi-truck",
    description: "Actros 5, Scania R, Volvo FH",
    icon: "local_shipping",
  },
  {
    label: "Tipper",
    query: "dump-truck",
    description: "6x4 · 8x4 chassis",
    icon: "construction",
  },
  {
    label: "Refrigerated",
    query: "refrigerated",
    description: "ATP/FRC certified",
    icon: "ac_unit",
  },
  {
    label: "Tanker",
    query: "tanker",
    description: "Baffles · full ADR pack",
    icon: "water_drop",
  },
] as const

const insightCards = [
  {
    title: "EU Certified",
    value: "150-point dossier",
    description: "VIN-verified inspections, oil analysis, and HD walk-arounds.",
    icon: "verified_user",
  },
  {
    title: "Global Shipping",
    value: "65+ corridors",
    description: "RORO, flat rack, and inland transport coordinated in-house.",
    icon: "directions_boat",
  },
  {
    title: "Live Tracking",
    value: "2h response SLA",
    description: "WhatsApp updates from offer to port departure.",
    icon: "language",
  },
]

const metrics = [
  { label: "Verified trucks online", value: "1,240+" },
  { label: "Fresh arrivals / week", value: "75" },
  { label: "Avg. port dispatch", value: "6 days" },
]

export function Hero() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("")
  const [make, setMake] = useState<string>("")
  const [condition, setCondition] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([30000, 120000])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (search.trim()) params.set("search", search.trim())
    if (category) params.set("category", category)
    if (make) params.set("make", make)
    if (condition) params.set("condition", condition)
    if (country) params.set("country", country)
    if (priceRange[0] > 0) params.set("priceMin", String(priceRange[0]))
    if (priceRange[1] < 180000) params.set("priceMax", String(priceRange[1]))

    router.push(`/inventory${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleQuickSegment = (segment: string) => {
    const params = new URLSearchParams()
    params.set("category", segment)
    router.push(`/inventory?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-brand-gradient text-white">
      <div className="absolute inset-0 bg-melon-grid opacity-20" />
      <div className="container relative z-10 grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.4em] backdrop-blur">
            <Image
              src="/melon-logo.png"
              alt="Auto Melon Group"
              width={32}
              height={32}
              className="h-6 w-6 object-contain"
              priority
            />
            Marketplace Live Feed
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              Source EU-spec trucks with{" "}
              <span className="text-brand-red-soft">instant filtering</span> and export-ready paperwork.
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Compare tractors, rigid bodies, construction units, and specialty fleet builds in one console. Every listing
              includes Euro compliance, maintenance history, and a shipping playbook down to the port cut-off date.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
              </div>
            ))}
          </div>

        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
          {categoryBlocks.map((block, index) => (
            <button
              key={block.query}
              type="button"
              onClick={() => handleQuickSegment(block.query)}
              className="group rounded-xl border border-white/15 bg-white/5 p-3 text-center text-white/90 transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              style={{ animation: `fadeUp 0.4s ease ${index * 0.05}s both` }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center text-brand-red-soft">
                  <Icon name={block.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">{block.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/95 p-6 text-base text-brand-ink shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-green">Advanced filtering</p>
              <h3 className="mt-1 text-xl font-semibold text-brand-ink">Pinpoint the right truck faster</h3>
            </div>
            <div className="rounded-full bg-brand-red-soft px-3 py-1 text-xs font-semibold text-brand-red">
              Live data
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by make, stock ID, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Truck type</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Preferred make</label>
                <Select value={make} onValueChange={setMake}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All manufacturers" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleMakes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Condition</label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionTypes.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Export from</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All hubs" />
                  </SelectTrigger>
                  <SelectContent>
                    {europeanCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                <span>Budget (EUR)</span>
                <span className="text-brand-ink font-semibold">
                  €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                value={priceRange}
                min={10000}
                max={180000}
                step={5000}
                onValueChange={(values) => setPriceRange([values[0], values[1]] as [number, number])}
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-brand-red hover:bg-brand-red-dark">
              Show matching trucks
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-brand-green text-brand-green hover:bg-brand-green/10"
              onClick={() => router.push("/inventory")}
            >
              Browse all {currentYear} listings
            </Button>
          </form>

          <div className="mt-6 grid gap-4 border-t pt-6 text-sm text-muted-foreground sm:grid-cols-2">
            {insightCards.map((card) => (
              <div key={card.title} className="flex gap-3">
                <div className="mt-0.5 h-10 w-10 flex items-center justify-center rounded-xl bg-brand-red-soft text-brand-red">
                  <Icon name={card.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/80">{card.title}</p>
                  <p className="text-base font-semibold text-brand-ink">{card.value}</p>
                  <p className="text-xs">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
