"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Vehicle, vehicleMakes, vehicleCategories, engineTypes, transmissionTypes, conditionTypes, cabinTypes, tonsTypes } from "@/types/vehicle"
import { Upload, X, Save, ArrowLeft, ExternalLink, Loader2, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllVehicleMakes, addCustomMake } from "@/lib/custom-makes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [bazarakiUrl, setBazarakiUrl] = useState<string | null>(null)
  const [customMake, setCustomMake] = useState<string>("")
  const [vehicleMakesList, setVehicleMakesList] = useState<string[]>(vehicleMakes as string[])
  const [isLoadingMakes, setIsLoadingMakes] = useState(false)
  const [bulkUrlInput, setBulkUrlInput] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    currency: 'EUR',
    condition: 'used',
    category: 'tractor-unit',
    engineType: 'diesel',
    transmission: 'manual',
    enginePower: '',
    engineSize: '',
    cabin: '',
    tons: '',
    location: '',
    country: 'Cyprus',
    vin: '',
    sourceUrl: '',
    description: '',
    available: true,
    featured: false,
  })

  // Add to Supabase function
  const handleAddCustomMakeToList = async () => {
    if (!customMake.trim()) {
      alert('Please enter a custom make name')
      return
    }

    try {
      setIsLoadingMakes(true)
      const result = await addCustomMake(customMake.trim())

      if (result.success) {
        // Refresh the makes list
        const allMakes = await getAllVehicleMakes()
        setVehicleMakesList(allMakes)

        // Set the form value to the new make
        setFormData(prev => ({ ...prev, make: customMake.trim() }))
        setCustomMake("")

        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error adding custom make:', error)
      alert('Failed to add custom make. Please try again.')
    } finally {
      setIsLoadingMakes(false)
    }
  }

  useEffect(() => {
    async function loadData() {
      // Load custom makes from Supabase
      try {
        const allMakes = await getAllVehicleMakes()
        setVehicleMakesList(allMakes)
      } catch (error) {
        console.error('Error loading custom makes:', error)
      }

      // Load vehicle data
      await fetchVehicle()
    }

    loadData()
  }, [id, router])

  async function fetchVehicle() {
    setFetching(true)
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch vehicle')
      }

      const typedData = result.data as Vehicle
      if (typedData) {
        setFormData({
          make: typedData.make || '',
          model: typedData.model || '',
          year: typedData.year || new Date().getFullYear(),
          mileage: typedData.mileage || 0,
          price: typedData.price || 0,
          currency: typedData.currency || 'EUR',
          condition: typedData.condition || 'used',
          category: typedData.category || 'tractor-unit',
          engineType: typedData.engineType || 'diesel',
          transmission: typedData.transmission || 'manual',
          enginePower: typedData.enginePower || '',
          engineSize: typedData.engineSize || '',
          cabin: typedData.cabin || '',
          tons: typedData.tons || '',
          location: typedData.location || '',
          country: typedData.country || 'Cyprus',
          vin: typedData.vin || '',
          sourceUrl: typedData.sourceUrl || '',
          description: typedData.description || '',
          available: typedData.available ?? true,
          featured: typedData.featured ?? false,
        })
        setImageUrls(typedData.images || [])
        setBazarakiUrl(typedData.bazarakiUrl || null)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      alert('Error loading vehicle data')
      router.push('/admin/vehicles')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      setImageUrls(prev => [...prev, url.trim()])
    }
  }

  const handleImageUrlRemove = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Drag and drop handlers for image reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImageUrls = [...imageUrls]
    const draggedImage = newImageUrls[draggedIndex]
    newImageUrls.splice(draggedIndex, 1)
    newImageUrls.splice(index, 0, draggedImage)
    setImageUrls(newImageUrls)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleBulkUrlAdd = () => {
    const urls = bulkUrlInput
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0)

    const validUrls: string[] = []
    const invalidUrls: string[] = []

    urls.forEach(url => {
      try {
        new URL(url)
        if (!imageUrls.includes(url)) {
          validUrls.push(url)
        }
      } catch {
        invalidUrls.push(url)
      }
    })

    if (validUrls.length > 0) {
      setImageUrls(prev => [...prev, ...validUrls])
      toast.success(`Added ${validUrls.length} image(s)`)
      setBulkUrlInput("")
    }

    if (invalidUrls.length > 0) {
      toast.error(`Skipped ${invalidUrls.length} invalid URL(s)`)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newImageUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith("image/")) {
        toast.error(`Skipped non-image file: ${file.name}`)
        continue
      }

      try {
        const reader = new FileReader()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        newImageUrls.push(dataUrl)
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error)
        toast.error(`Failed to read ${file.name}`)
      }
    }

    if (newImageUrls.length > 0) {
      setImageUrls(prev => [...prev, ...newImageUrls])
      toast.success(`Added ${newImageUrls.length} image(s)`)
      setSelectedFiles(null)

      // Reset file input
      const fileInput = document.getElementById("file-upload-edit") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Use custom make if "Other" is selected and custom make is provided
      const finalMake = formData.make === 'Other' && customMake ? customMake : formData.make

      const vehicleData = {
        make: finalMake,
        model: formData.model,
        year: parseInt(formData.year.toString()),
        mileage: parseInt(formData.mileage.toString()),
        price: parseFloat(formData.price.toString()),
        currency: formData.currency,
        condition: formData.condition,
        category: formData.category,
        engine_type: formData.engineType,
        transmission: formData.transmission,
        engine_power: formData.enginePower && !isNaN(parseInt(formData.enginePower.toString())) ? parseInt(formData.enginePower.toString()) : null,
        engine_size: formData.engineSize && !isNaN(parseFloat(formData.engineSize.toString())) ? parseFloat(formData.engineSize.toString()) : null,
        cabin: formData.cabin || null,
        tons: formData.tons || null,
        location: formData.location,
        country: formData.country,
        vin: formData.vin || null,
        source_url: formData.sourceUrl || '',
        images: imageUrls,
        specifications: {},
        features: [],
        description: formData.description || '',
        available: formData.available,
        featured: formData.featured,
      }

      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update vehicle')
      }

      alert('Vehicle updated successfully!')
      router.push('/admin/vehicles')
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Error updating vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
            <p className="text-slate-600">Loading vehicle data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/vehicles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Vehicle</h1>
            <p className="text-slate-600 mt-1">Update vehicle details</p>
          </div>
        </div>
        {bazarakiUrl && (
          <Button variant="outline" asChild className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Link href={bazarakiUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original Listing
            </Link>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Select value={formData.make} onValueChange={(value) => {
                  handleChange('make', value)
                  if (value !== 'Other') {
                    setCustomMake("")
                  }
                }} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleMakesList.map(make => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                    <SelectItem value="Other">Other (Add new make)</SelectItem>
                  </SelectContent>
                </Select>
                {formData.make === 'Other' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter custom make..."
                        value={customMake}
                        onChange={(e) => setCustomMake(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAddCustomMakeToList()
                        }}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        disabled={!customMake.trim() || isLoadingMakes}
                      >
                        {isLoadingMakes ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Add to List
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">Add your custom make to the dropdown list permanently</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleChange('vin', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sourceUrl">Source URL *</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => handleChange('sourceUrl', e.target.value)}
                  placeholder="https://example.com/vehicle-listing"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionTypes.map(cond => (
                      <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Specs */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Pricing & Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (EUR) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km) *</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleChange('mileage', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enginePower">Engine Power (HP)</Label>
                <Input
                  id="enginePower"
                  type="number"
                  min="0"
                  value={formData.enginePower}
                  onChange={(e) => handleChange('enginePower', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineSize">Engine Size (L)</Label>
                <Input
                  id="engineSize"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.engineSize}
                  onChange={(e) => handleChange('engineSize', e.target.value)}
                  placeholder="e.g., 2.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineType">Engine Type *</Label>
                <Select value={formData.engineType} onValueChange={(value) => handleChange('engineType', value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {engineTypes.map(engine => (
                      <SelectItem key={engine.value} value={engine.value}>{engine.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission *</Label>
                <Select value={formData.transmission} onValueChange={(value) => handleChange('transmission', value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionTypes.map(trans => (
                      <SelectItem key={trans.value} value={trans.value}>{trans.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cabin">Cabin Type</Label>
                <Select value={formData.cabin || ""} onValueChange={(value) => handleChange('cabin', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cabin type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cabinTypes.map(cab => (
                      <SelectItem key={cab.value} value={cab.value}>{cab.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tons">Weight Capacity (Tonnes)</Label>
                <Select value={formData.tons || ""} onValueChange={(value) => handleChange('tons', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {tonsTypes.map(ton => (
                      <SelectItem key={ton.value} value={ton.value}>{ton.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Nicosia"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single">Single URL</TabsTrigger>
                <TabsTrigger value="bulk">Bulk URLs</TabsTrigger>
                <TabsTrigger value="files">File Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <Button type="button" onClick={handleImageUrlAdd} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image URL
                </Button>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
                <div className="space-y-2">
                  <Label>Paste multiple image URLs (one per line)</Label>
                  <Textarea
                    value={bulkUrlInput}
                    onChange={(e) => setBulkUrlInput(e.target.value)}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-slate-500">
                    {bulkUrlInput.split("\n").filter(url => url.trim()).length} URLs entered
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleBulkUrlAdd}
                  disabled={!bulkUrlInput.trim()}
                  className="w-full"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Add All URLs
                </Button>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload-edit">Select multiple images</Label>
                  <Input
                    id="file-upload-edit"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      setSelectedFiles(e.target.files)
                      handleFileUpload(e.target.files)
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-slate-500">
                    {selectedFiles ? `${selectedFiles.length} file(s) selected` : "No files selected"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {imageUrls.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-700">
                    {imageUrls.length} image(s) added
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    💡 Drag images to reorder • First image is primary
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group cursor-move transition-all ${
                        draggedIndex === index ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {index + 1}
                      </div>
                      <Image
                        src={url}
                        alt={`Vehicle ${index + 1}`}
                        width={300}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg border-2 border-slate-200 pointer-events-none"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={() => handleImageUrlRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              placeholder="Enter vehicle description..."
            />
          </CardContent>
        </Card>

        {/* Flags */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Availability & Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => handleChange('available', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Available for Sale</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Featured Vehicle</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg flex-1">
            {loading ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/vehicles">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}