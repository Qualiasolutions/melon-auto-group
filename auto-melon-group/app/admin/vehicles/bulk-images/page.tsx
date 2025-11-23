"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Link as LinkIcon, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
}

interface UploadResult {
  vehicle: string
  success: boolean
  message: string
  imageCount?: number
}

export default function BulkImagesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState("")
  const [imageUrls, setImageUrls] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  // Fetch vehicles on mount
  useEffect(() => {
    fetch("/api/admin/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles) {
          setVehicles(data.vehicles)
        }
      })
      .catch(console.error)
  }, [])

  const handleBulkUrlUpload = async () => {
    if (!selectedVehicleId || !imageUrls.trim()) {
      alert("Please select a vehicle and enter image URLs")
      return
    }

    setLoading(true)
    setUploadResults([])

    try {
      const urls = imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)

      const response = await fetch("/api/admin/vehicles/bulk-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicleId,
          urls,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResults([
          {
            vehicle: `${result.vehicle.make} ${result.vehicle.model} (${result.vehicle.year})`,
            success: true,
            message: `Successfully added ${result.addedCount} images`,
            imageCount: result.addedCount,
          },
        ])
        setImageUrls("")
        setSelectedVehicleId("")
      } else {
        setUploadResults([
          {
            vehicle: "Error",
            success: false,
            message: result.error || "Failed to upload images",
          },
        ])
      }
    } catch (error) {
      setUploadResults([
        {
          vehicle: "Error",
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleBulkFileUpload = async () => {
    if (!selectedVehicleId || !selectedFiles || selectedFiles.length === 0) {
      alert("Please select a vehicle and choose files")
      return
    }

    setLoading(true)
    setUploadResults([])

    try {
      const formData = new FormData()
      formData.append("vehicleId", selectedVehicleId)

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("images", selectedFiles[i])
      }

      const response = await fetch("/api/admin/vehicles/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResults([
          {
            vehicle: `${result.vehicle.make} ${result.vehicle.model} (${result.vehicle.year})`,
            success: true,
            message: `Successfully uploaded ${result.uploadedCount} images`,
            imageCount: result.uploadedCount,
          },
        ])
        setSelectedFiles(null)
        setSelectedVehicleId("")
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setUploadResults([
          {
            vehicle: "Error",
            success: false,
            message: result.error || "Failed to upload files",
          },
        ])
      }
    } catch (error) {
      setUploadResults([
        {
          vehicle: "Error",
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Image Management</h1>
        <p className="text-muted-foreground">
          Upload images to vehicles using URLs or file uploads
        </p>
      </div>

      <Tabs defaultValue="urls" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="urls">
            <LinkIcon className="mr-2 h-4 w-4" />
            Bulk URLs
          </TabsTrigger>
          <TabsTrigger value="files">
            <Upload className="mr-2 h-4 w-4" />
            File Upload
          </TabsTrigger>
        </TabsList>

        {/* Bulk URLs Tab */}
        <TabsContent value="urls">
          <Card>
            <CardHeader>
              <CardTitle>Add Images via URLs</CardTitle>
              <CardDescription>
                Paste multiple image URLs (one per line) to add to a vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-select-urls">Select Vehicle</Label>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger id="vehicle-select-urls">
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-urls">Image URLs (one per line)</Label>
                <Textarea
                  id="image-urls"
                  placeholder={`https://example.com/image1.jpg\nhttps://example.com/image2.jpg\nhttps://example.com/image3.jpg`}
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  {imageUrls.split("\n").filter((url) => url.trim()).length} URLs entered
                </p>
              </div>

              <Button
                onClick={handleBulkUrlUpload}
                disabled={loading || !selectedVehicleId || !imageUrls.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Add Images from URLs
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Upload Tab */}
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image Files</CardTitle>
              <CardDescription>
                Select multiple image files to upload for a vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-select-files">Select Vehicle</Label>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger id="vehicle-select-files">
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Select Images</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  {selectedFiles ? `${selectedFiles.length} file(s) selected` : "No files selected"}
                </p>
              </div>

              <Button
                onClick={handleBulkFileUpload}
                disabled={loading || !selectedVehicleId || !selectedFiles}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {uploadResults.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{result.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
