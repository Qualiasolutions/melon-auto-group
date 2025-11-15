"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, Loader2, Facebook, CheckCircle2, XCircle, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface ScrapedVehicle {
  title: string
  price: number
  currency: string
  make: string
  model: string
  year: number
  mileage: number
  location: string
  description: string
  images: string[]
  url: string
  source: string
  scrapedAt: string
  rawData: any
}

export default function FacebookMarketplaceScraper() {
  const router = useRouter()
  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState("truck")
  const [location, setLocation] = useState("Cyprus")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [maxResults, setMaxResults] = useState("20")

  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [vehicles, setVehicles] = useState<ScrapedVehicle[]>([])
  const [runId, setRunId] = useState("")

  const handleScrape = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")
    setVehicles([])

    try {
      const response = await fetch('/api/scrape-facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery,
          location: location || undefined,
          minPrice: minPrice ? parseInt(minPrice) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
          maxResults: parseInt(maxResults) || 20,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to scrape Facebook Marketplace')
      }

      setVehicles(data.vehicles || [])
      setRunId(data.runId || '')
      setSuccess(`Successfully scraped ${data.count} vehicles from Facebook Marketplace!`)

    } catch (err: any) {
      console.error('Error scraping:', err)
      setError(err.message || 'Failed to scrape Facebook Marketplace. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImportToDatabase = async () => {
    if (vehicles.length === 0) {
      setError("No vehicles to import")
      return
    }

    setImporting(true)
    setError("")
    setSuccess("")

    try {
      let imported = 0
      let skipped = 0

      for (const vehicle of vehicles) {
        // Transform to database format
        const dbVehicle = {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          price: vehicle.price,
          currency: vehicle.currency || 'EUR',
          condition: 'used' as const,
          category: 'truck' as const, // Could be improved with better categorization
          engine_type: 'diesel' as const,
          transmission: 'manual' as const,
          location: vehicle.location,
          country: 'Cyprus',
          vin: `FB-${Date.now()}-${imported}`,
          images: vehicle.images,
          specifications: {
            source: vehicle.source,
            scrapedAt: vehicle.scrapedAt,
            originalUrl: vehicle.url,
            apifyRunId: runId,
            rawData: vehicle.rawData,
          },
          features: [],
          description: vehicle.description || `${vehicle.title} - Imported from Facebook Marketplace`,
          available: true,
          featured: false,
        }

        // Check for duplicates based on title and price
        const { data: existing } = await supabase
          .from('vehicles')
          .select('id')
          .eq('make', dbVehicle.make)
          .eq('model', dbVehicle.model)
          .eq('price', dbVehicle.price)
          .single()

        if (existing) {
          console.log(`Skipping duplicate: ${vehicle.title}`)
          skipped++
          continue
        }

        // Insert vehicle
        const { error: insertError } = await supabase
          .from('vehicles')
          .insert(dbVehicle)

        if (insertError) {
          console.error(`Error importing ${vehicle.title}:`, insertError)
        } else {
          imported++
        }
      }

      setSuccess(`Successfully imported ${imported} vehicles! (${skipped} skipped as duplicates)`)

      // Clear the scraped results
      setTimeout(() => {
        setVehicles([])
        router.push('/admin/vehicles')
      }, 3000)

    } catch (err: any) {
      console.error('Error importing vehicles:', err)
      setError(err.message || 'Failed to import vehicles to database')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl" />
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Facebook className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Facebook Marketplace Scraper</h1>
                  <p className="text-slate-300 text-sm">Powered by Apify</p>
                </div>
              </div>
              <p className="text-slate-400 mt-4 max-w-2xl">
                Search and import vehicle listings directly from Facebook Marketplace using advanced web scraping technology.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400">
              <Link href="/admin/vehicles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Configuration */}
      <Card className="border-2 border-slate-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            Search Configuration
          </CardTitle>
          <CardDescription className="text-base">
            Configure your Facebook Marketplace search parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Query */}
            <div className="space-y-2">
              <Label htmlFor="query" className="text-base font-semibold text-slate-700">
                Search Query *
              </Label>
              <Input
                id="query"
                type="text"
                placeholder="e.g., truck, commercial vehicle, lorry"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-base border-2"
                disabled={loading}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold text-slate-700">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Cyprus, Nicosia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 text-base border-2"
                disabled={loading}
              />
            </div>

            {/* Min Price */}
            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-base font-semibold text-slate-700">
                Minimum Price (€)
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="e.g., 5000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-12 text-base border-2"
                disabled={loading}
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-base font-semibold text-slate-700">
                Maximum Price (€)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="e.g., 50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-12 text-base border-2"
                disabled={loading}
              />
            </div>

            {/* Max Results */}
            <div className="space-y-2">
              <Label htmlFor="maxResults" className="text-base font-semibold text-slate-700">
                Maximum Results
              </Label>
              <Input
                id="maxResults"
                type="number"
                placeholder="20"
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
                className="h-12 text-base border-2"
                disabled={loading}
                min="1"
                max="100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleScrape}
              disabled={loading || !searchQuery.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl flex-1 h-14 text-base font-semibold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Scraping Facebook Marketplace...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>

            {vehicles.length > 0 && (
              <Button
                onClick={handleImportToDatabase}
                disabled={importing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl min-w-[200px] h-14 text-base font-semibold rounded-xl"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Import to Database
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {vehicles.length > 0 && (
        <Card className="border-2 border-blue-200 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-2xl">
              Scraped Vehicles ({vehicles.length})
            </CardTitle>
            <CardDescription className="text-base">
              Review the vehicles before importing to your database
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <div className="w-32 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={vehicle.images[0]}
                          alt={vehicle.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Facebook className="h-8 w-8 text-slate-400" />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-900 truncate">
                        {vehicle.title}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Make:</span> {vehicle.make}
                        </div>
                        <div>
                          <span className="font-medium">Model:</span> {vehicle.model}
                        </div>
                        <div>
                          <span className="font-medium">Year:</span> {vehicle.year}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> {vehicle.currency} {vehicle.price.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} km
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Location:</span> {vehicle.location}
                        </div>
                      </div>
                      {vehicle.url && (
                        <a
                          href={vehicle.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                          View on Facebook →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></span>
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-purple-800">
          <p>
            <strong>1. Configure Search:</strong> Enter your search criteria including keywords, location, and price range.
          </p>
          <p>
            <strong>2. Start Scraping:</strong> Our Apify-powered scraper will search Facebook Marketplace and extract vehicle listings.
          </p>
          <p>
            <strong>3. Review Results:</strong> Check the scraped vehicles and their details before importing.
          </p>
          <p>
            <strong>4. Import to Database:</strong> Click "Import to Database" to add the vehicles to your inventory.
          </p>
          <p className="text-xs text-purple-600 mt-4">
            <strong>Note:</strong> Scraping may take 30-60 seconds depending on the number of results. The scraper will automatically filter duplicates during import.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
