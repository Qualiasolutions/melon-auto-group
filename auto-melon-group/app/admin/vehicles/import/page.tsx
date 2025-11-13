"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, Link as LinkIcon, Loader2, Plus } from "lucide-react"
import Link from "next/link"

export default function ImportVehiclePage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [scrapedData, setScrapedData] = useState<any>(null)

  const handleScrape = async () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError("")
    setScrapedData(null)

    try {
      // Note: In a production environment, this would call a Next.js API route
      // that uses Firecrawl server-side to avoid exposing API keys
      const response = await fetch('/api/scrape-vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape URL')
      }

      const data = await response.json()
      setScrapedData(data)

      // Check if this is fallback/mock data - don't save it to sessionStorage
      if (data.isFallbackData ||
          (data.features && data.features.includes('Sample Data - AutoTrader temporarily unavailable')) ||
          (data.description && data.description.includes('AutoTrader scraping is currently unavailable'))) {
        console.log('🚫 Not saving fallback data to sessionStorage')
        setError('AutoTrader scraping temporarily unavailable. Please try again later or use Bazaraki/Facebook Marketplace URLs.')
        return
      }

      // Store real scraped data in sessionStorage for the form to retrieve
      sessionStorage.setItem('importedVehicleData', JSON.stringify(data))

      // Redirect to new vehicle form
      setTimeout(() => {
        router.push(`/admin/vehicles/new?imported=true`)
      }, 1000)
    } catch (err) {
      console.error('Error scraping URL:', err)
      setError('Failed to import vehicle data. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 via-orange-500/10 to-brand-red/10 rounded-3xl blur-3xl" />
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red to-orange-600 flex items-center justify-center shadow-lg">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Smart Import</h1>
                  <p className="text-slate-300 text-sm">AI-powered vehicle data extraction</p>
                </div>
              </div>
              <p className="text-slate-400 mt-4 max-w-2xl">
                Simply paste a link from Bazaraki or Facebook Marketplace, and our intelligent system will automatically extract all vehicle details for you.
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

      {/* Premium Import Instructions */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Download className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
            <p>Copy the vehicle listing URL from <strong>Bazaraki.com</strong>, <strong>Facebook Marketplace</strong>, or <strong>AutoTrader UK</strong> <span className="text-green-600">(All platforms now supported!)</span></p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
            <p>Paste the URL in the field below and click <strong>"Import Vehicle Data"</strong></p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</div>
            <p>Review the automatically extracted information and make any necessary adjustments</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</div>
            <p>Save the vehicle to your inventory</p>
          </div>
        </CardContent>
      </Card>

      {/* Premium URL Input */}
      <Card className="border-2 border-slate-200 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-2xl">Import from URL</CardTitle>
          <CardDescription className="text-base">
            Paste the vehicle listing URL below to begin automatic data extraction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label htmlFor="url" className="text-base font-semibold text-slate-700">
              Listing URL
            </Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://www.bazaraki.com/... or https://www.facebook.com/marketplace/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && url.trim() && handleScrape()}
                  className="pl-12 h-14 text-base border-2 border-slate-200 focus:border-brand-red focus:ring-brand-red rounded-xl"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleScrape}
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg hover:shadow-xl min-w-[160px] h-14 text-base font-semibold rounded-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Import Vehicle
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 px-2">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Bazaraki.com
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Facebook Marketplace
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  AutoTrader UK (New!)
                </span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scrapedData && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Data imported successfully! Redirecting to form...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Premium Manual Entry Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-red" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Prefer to enter vehicle details manually?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full h-12 border-2 hover:border-brand-red hover:text-brand-red font-semibold">
              <Link href="/admin/vehicles/new">
                Go to Manual Entry Form
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* API Status Card */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></span>
              System Status
            </CardTitle>
            <CardDescription className="text-purple-700">
              Playwright + Firecrawl Integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-800">
              <strong>Ready:</strong> AutoTrader UK now uses Playwright for direct scraping, while Bazaraki and Facebook use Firecrawl. All platforms are supported!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
