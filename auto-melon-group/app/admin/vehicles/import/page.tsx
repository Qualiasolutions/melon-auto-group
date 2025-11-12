"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, Link as LinkIcon, Loader2 } from "lucide-react"
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

      // Redirect to new vehicle form with pre-filled data
      const queryParams = new URLSearchParams({
        reference_url: url,
        ...data,
      }).toString()

      router.push(`/admin/vehicles/new?${queryParams}`)
    } catch (err) {
      console.error('Error scraping URL:', err)
      setError('Failed to import vehicle data. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/vehicles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Import Vehicle</h1>
          <p className="text-slate-600 mt-1">Import vehicle data from external listings</p>
        </div>
      </div>

      {/* Import Instructions */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Download className="h-5 w-5" />
            How to Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>1. Copy the URL of a vehicle listing from another website</p>
          <p>2. Paste the URL in the field below</p>
          <p>3. Click "Import Vehicle Data" to automatically extract information</p>
          <p>4. Review and edit the imported data before saving</p>
        </CardContent>
      </Card>

      {/* URL Input */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle>Vehicle Listing URL</CardTitle>
          <CardDescription>
            Enter the URL of the vehicle listing you want to import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Listing URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/vehicle-listing"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleScrape}
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Supported sites: Bazaraki, AutoTrader, and other truck listing platforms
            </p>
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

      {/* Manual Entry Option */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle>Or Add Manually</CardTitle>
          <CardDescription>
            Prefer to enter vehicle details manually?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full">
            <Link href="/admin/vehicles/new">
              Go to Manual Entry Form
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* API Note */}
      <Card className="border-2 border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This feature requires Firecrawl API configuration.
            Make sure your API key is set in the environment variables for production use.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
