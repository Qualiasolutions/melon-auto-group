"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Auto Melon Group',
    siteEmail: 'info@automelon.com',
    sitePhone: '+357 99 123 456',
    siteAddress: 'Nicosia, Cyprus',
    currency: 'EUR',
    defaultLocation: 'Cyprus',
  })

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('Settings saved successfully!')
    setLoading(false)
  }

  const handleReset = () => {
    setSettings({
      siteName: 'Auto Melon Group',
      siteEmail: 'info@automelon.com',
      sitePhone: '+357 99 123 456',
      siteAddress: 'Nicosia, Cyprus',
      currency: 'EUR',
      defaultLocation: 'Cyprus',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your site configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic site information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="Your site name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteEmail">Contact Email</Label>
              <Input
                id="siteEmail"
                type="email"
                value={settings.siteEmail}
                onChange={(e) => handleChange('siteEmail', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sitePhone">Phone Number</Label>
              <Input
                id="sitePhone"
                type="tel"
                value={settings.sitePhone}
                onChange={(e) => handleChange('sitePhone', e.target.value)}
                placeholder="+357 99 123 456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteAddress">Business Address</Label>
              <Input
                id="siteAddress"
                value={settings.siteAddress}
                onChange={(e) => handleChange('siteAddress', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
            <CardDescription>Currency and location preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                placeholder="EUR"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultLocation">Default Location</Label>
              <Input
                id="defaultLocation"
                value={settings.defaultLocation}
                onChange={(e) => handleChange('defaultLocation', e.target.value)}
                placeholder="Cyprus"
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status and database connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Database Status</span>
              <span className="font-semibold text-green-600">✓ Connected</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Environment</span>
              <span className="font-semibold">{process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Version</span>
              <span className="font-semibold">1.0.0</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg flex-1"
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </form>
    </div>
  )
}
