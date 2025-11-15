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
import { supabase } from "@/lib/supabase/client"

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

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [vehicle, setVehicle] = useState<ScrapedVehicle | null>(null)
  const [runId, setRunId] = useState("")

  const handleScrape = async () => {
    if (!url.trim()) {
      setError("Please enter a Facebook Marketplace URL")
      return
    }

    if (!url.includes('facebook.com/marketplace')) {
      setError("Please enter a valid Facebook Marketplace URL")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")
    setVehicle(null)

    try {
      const response = await fetch('/api/scrape-facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to scrape Facebook Marketplace')
      }

      setVehicle(data.vehicle || null)
      setRunId(data.runId || '')
      setSuccess(`Successfully scraped vehicle from Facebook Marketplace!`)

    } catch (err: any) {
      console.error('Error scraping:', err)
      setError(err.message || 'Failed to scrape Facebook Marketplace. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImportToDatabase = async () => {
    if (!vehicle) {
      setError("No vehicle data to import")
      return
    }

    // Store in sessionStorage and redirect to new vehicle form
    sessionStorage.setItem('importedVehicleData', JSON.stringify({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      price: vehicle.price,
      currency: vehicle.currency,
      location: vehicle.location,
      description: vehicle.description,
      images: vehicle.images,
      specifications: {
        source: vehicle.source,
        scrapedAt: vehicle.scrapedAt,
        originalUrl: vehicle.url,
        apifyRunId: runId,
      }
    }))

    // Redirect to new vehicle form
    router.push(`/admin/vehicles/new?imported=true`)
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

      {/* URL Input */}
      <Card className="border-2 border-slate-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Facebook className="h-6 w-6 text-blue-600" />
            Import from Facebook Marketplace
          </CardTitle>
          <CardDescription className="text-base">
            Paste a Facebook Marketplace item URL to extract vehicle details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label htmlFor="url" className="text-base font-semibold text-slate-700">
              Facebook Marketplace URL *
            </Label>
            <div className="flex gap-3">
              <Input
                id="url"
                type="url"
                placeholder="https://www.facebook.com/marketplace/item/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && url.trim() && handleScrape()}
                className="flex-1 h-14 text-base border-2 border-slate-200 focus:border-blue-600 focus:ring-blue-600 rounded-xl"
                disabled={loading}
              />
              <Button
                onClick={handleScrape}
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl min-w-[160px] h-14 text-base font-semibold rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Scrape Data
                  </>
                )}
              </Button>
            </div>
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
      {vehicle && (
        <Card className="border-2 border-green-200 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Vehicle Data Extracted
                </CardTitle>
                <CardDescription className="text-base">
                  Review the details before importing
                </CardDescription>
              </div>
              <Button
                onClick={handleImportToDatabase}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Import to Form
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border-2 border-slate-200 rounded-xl p-6 space-y-6">
              {/* Images */}
              {vehicle.images && vehicle.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicle.images.map((img, idx) => (
                    <div key={idx} className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`${vehicle.title} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900">
                  {vehicle.title}
                </h3>
              </div>

              {/* Price */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">Price</p>
                <p className="text-3xl font-bold text-blue-900">
                  {vehicle.currency} {vehicle.price.toLocaleString()}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 font-medium">Make</p>
                  <p className="text-lg font-semibold text-slate-900">{vehicle.make}</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 font-medium">Model</p>
                  <p className="text-lg font-semibold text-slate-900">{vehicle.model}</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 font-medium">Year</p>
                  <p className="text-lg font-semibold text-slate-900">{vehicle.year}</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 font-medium">Mileage</p>
                  <p className="text-lg font-semibold text-slate-900">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 col-span-2">
                  <p className="text-sm text-slate-600 font-medium">Location</p>
                  <p className="text-lg font-semibold text-slate-900">{vehicle.location}</p>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-2">Description</p>
                  <p className="text-slate-700 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Original URL */}
              {vehicle.url && (
                <div>
                  <a
                    href={vehicle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Original Listing on Facebook →
                  </a>
                </div>
              )}
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
            <strong>1. Find a Listing:</strong> Browse Facebook Marketplace and find a vehicle you want to import.
          </p>
          <p>
            <strong>2. Copy URL:</strong> Copy the item's URL from your browser (e.g., https://www.facebook.com/marketplace/item/123...).
          </p>
          <p>
            <strong>3. Paste & Scrape:</strong> Paste the URL above and click "Scrape Data" - our Apify-powered scraper will extract all vehicle details.
          </p>
          <p>
            <strong>4. Review & Import:</strong> Check the extracted information and click "Import to Form" to add it to your inventory.
          </p>
          <p className="text-xs text-purple-600 mt-4">
            <strong>Note:</strong> Scraping takes 20-40 seconds per listing. The data will be pre-filled in the vehicle form where you can review and adjust before saving.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
