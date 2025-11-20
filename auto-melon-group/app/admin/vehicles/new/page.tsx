"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vehicleFormSchema, type VehicleFormData, imageUrlSchema } from "@/lib/validations/vehicle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { vehicleMakes, vehicleCategories, engineTypes, transmissionTypes, conditionTypes, cabinTypes, tonsTypes } from "@/types/vehicle"
import { X, Save, ArrowLeft, Plus, Loader2, ImageIcon, AlertCircle, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getAllVehicleMakes, addCustomMake } from "@/lib/custom-makes"

export default function NewVehiclePage() {
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageInput, setImageInput] = useState("")
  const [imageError, setImageError] = useState("")
  const [specifications, setSpecifications] = useState<Record<string, string | number>>({})
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState("")
  const [customMake, setCustomMake] = useState("")
  const [vehicleMakesList, setVehicleMakesList] = useState<string[]>(vehicleMakes as string[])
  const [isLoadingMakes, setIsLoadingMakes] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      currency: 'EUR',
      condition: 'used',
      category: 'tractor-unit',
      engineType: undefined,
      transmission: 'manual',
      enginePower: undefined,
      engineSize: undefined,
      cabin: undefined,
      tons: undefined,
      location: '',
      country: 'Cyprus',
      vin: '',
      sourceUrl: '',
      description: '',
      available: true,
      featured: false,
      images: [],
      specifications: {},
      features: [],
    },
  })

  // Load custom makes from Supabase and imported data from sessionStorage
  React.useEffect(() => {
    const loadData = async () => {
      // Load custom makes from Supabase
      setIsLoadingMakes(true)
      try {
        const allMakes = await getAllVehicleMakes()
        setVehicleMakesList(allMakes)
      } catch (error) {
        console.error('Error loading custom makes:', error)
      } finally {
        setIsLoadingMakes(false)
      }

      // Load imported data from sessionStorage
      const importedData = sessionStorage.getItem('importedVehicleData')
      if (importedData) {
        try {
          const data = JSON.parse(importedData)

          // Check if this is fallback/mock data and skip loading if so
          if (data.isFallbackData ||
              (data.features && data.features.includes('Sample Data - AutoTrader temporarily unavailable')) ||
              (data.description && data.description.includes('AutoTrader scraping is currently unavailable'))) {
            console.log('🚫 Skipping fallback/mock data loading')
            sessionStorage.removeItem('importedVehicleData')
            return
          }

          // Set form values
          if (data.make) setValue('make', data.make)
          if (data.model) setValue('model', data.model)
          if (data.year) setValue('year', data.year)
          if (data.mileage) setValue('mileage', data.mileage)
          if (data.price) setValue('price', data.price)
          if (data.currency) setValue('currency', data.currency)
          if (data.condition) setValue('condition', data.condition)
          if (data.category) setValue('category', data.category)
          if (data.engineType) setValue('engineType', data.engineType)
          if (data.transmission) setValue('transmission', data.transmission)
          if (data.enginePower) setValue('enginePower', data.enginePower)
          if (data.engineSize) setValue('engineSize', data.engineSize)
          if (data.location) setValue('location', data.location)
          if (data.country) setValue('country', data.country)
          if (data.description) setValue('description', data.description)
          if (data.vin) setValue('vin', data.vin)

          // Set arrays and objects
          if (data.images && Array.isArray(data.images)) {
            setImageUrls(data.images)
          }
          if (data.features && Array.isArray(data.features)) {
            setFeatures(data.features)
          }
          if (data.specifications && typeof data.specifications === 'object') {
            setSpecifications(data.specifications)
          }

          // Clear sessionStorage after loading
          sessionStorage.removeItem('importedVehicleData')

          toast.success("Imported data loaded!", {
            description: "Review and adjust the vehicle information before saving",
          })
        } catch (error) {
          console.error('Error loading imported data:', error)
        }
      }
    }

    loadData()
  }, [])

  const make = watch('make')
  const category = watch('category')
  const condition = watch('condition')
  const engineType = watch('engineType')
  const transmission = watch('transmission')
  const cabin = watch('cabin')
  const tons = watch('tons')

  const handleImageUrlAdd = () => {
    try {
      setImageError("")
      const trimmedUrl = imageInput.trim()

      if (!trimmedUrl) {
        setImageError("Please enter an image URL")
        return
      }

      // Validate URL
      imageUrlSchema.parse(trimmedUrl)

      if (imageUrls.includes(trimmedUrl)) {
        setImageError("This image URL is already added")
        return
      }

      setImageUrls(prev => [...prev, trimmedUrl])
      setImageInput("")
      toast.success("Image added successfully")
    } catch (error) {
      setImageError("Please enter a valid image URL")
    }
  }

  const handleImageUrlRemove = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
    toast.info("Image removed")
  }

  const handleFeatureAdd = () => {
    const trimmedFeature = featureInput.trim()
    if (trimmedFeature && !features.includes(trimmedFeature)) {
      setFeatures(prev => [...prev, trimmedFeature])
      setFeatureInput("")
      toast.success("Feature added")
    }
  }

  const handleFeatureRemove = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
    toast.info("Feature removed")
  }

  const handleAddSpecification = (key: string, value: string) => {
    if (key && value) {
      setSpecifications(prev => ({
        ...prev,
        [key]: isNaN(Number(value)) ? value : Number(value)
      }))
    }
  }

  const handleRemoveSpecification = (key: string) => {
    setSpecifications(prev => {
      const newSpecs = { ...prev }
      delete newSpecs[key]
      return newSpecs
    })
  }

  const handleAddCustomMakeToList = async () => {
    if (!customMake.trim()) {
      toast.error("Please enter a custom make name")
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
        setValue('make', customMake.trim())
        setCustomMake("")

        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error adding custom make:', error)
      toast.error("Failed to add custom make", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoadingMakes(false)
    }
  }

  const onSubmit = async (data: VehicleFormData) => {
    try {
      // Use custom make if "Other" is selected and custom make is provided
      const finalMake = data.make === 'Other' && customMake ? customMake : data.make

      const vehicleData = {
        make: finalMake,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        price: data.price,
        currency: data.currency,
        condition: data.condition,
        category: data.category,
        engine_type: data.engineType || null,
        transmission: data.transmission,
        engine_power: data.enginePower && !isNaN(data.enginePower) ? data.enginePower : null,
        engine_size: data.engineSize && !isNaN(data.engineSize) ? data.engineSize : null,
        cabin: data.cabin || null,
        tons: data.tons || null,
        location: data.location,
        country: data.country,
        vin: data.vin || null,
        source_url: data.sourceUrl,
        images: imageUrls,
        specifications: specifications,
        features: features,
        description: data.description || '',
        available: data.available,
        featured: data.featured,
      }

      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add vehicle')
      }

      toast.success("Vehicle added successfully!", {
        description: `${finalMake} ${data.model} has been added to inventory`,
      })

      // Redirect after short delay to show toast
      setTimeout(() => {
        router.push('/admin/vehicles')
      }, 1500)
    } catch (error) {
      console.error('Error adding vehicle:', error)
      toast.error("Failed to add vehicle", {
        description: error instanceof Error ? error.message : "Please check all fields and try again",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild className="h-9">
                <Link href="/admin/vehicles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Add New Vehicle</h1>
                <p className="text-sm text-slate-600 mt-0.5">Complete the form below to add a vehicle to your inventory</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg font-semibold text-slate-900">Basic Information</CardTitle>
              <CardDescription className="text-sm">Vehicle identification and classification</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Make */}
                <div className="space-y-2">
                  <Label htmlFor="make" className="text-sm font-medium">
                    Make <span className="text-red-500">*</span>
                  </Label>
                  <Select value={make} onValueChange={(value) => {
                    setValue('make', value)
                    if (value !== 'Other') {
                      setCustomMake("")
                    }
                  }}>
                    <SelectTrigger className={errors.make ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleMakesList.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  {make === 'Other' && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter custom make..."
                        value={customMake}
                        onChange={(e) => setCustomMake(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddCustomMakeToList}
                        size="sm"
                        variant="outline"
                        disabled={!customMake.trim() || isLoadingMakes}
                      >
                        {isLoadingMakes ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <PlusCircle className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  {errors.make && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.make.message}
                    </p>
                  )}
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-sm font-medium">
                    Model <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="model"
                    {...register('model')}
                    placeholder="e.g., Actros"
                    className={errors.model ? "border-red-500" : ""}
                  />
                  {errors.model && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.model.message}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    className={errors.year ? "border-red-500" : ""}
                  />
                  {errors.year && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-medium">
                    Condition <span className="text-red-500">*</span>
                  </Label>
                  <Select value={condition} onValueChange={(value) => setValue('condition', value as "new" | "used" | "certified")}>
                    <SelectTrigger className={errors.condition ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionTypes.map(cond => (
                        <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.condition.message}
                    </p>
                  )}
                </div>

                {/* VIN */}
                <div className="space-y-2">
                  <Label htmlFor="vin" className="text-sm font-medium">VIN (Optional)</Label>
                  <Input
                    id="vin"
                    {...register('vin')}
                    placeholder="Vehicle Identification Number"
                    className={errors.vin ? "border-red-500" : ""}
                  />
                  {errors.vin && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.vin.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Specifications */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg font-semibold text-slate-900">Pricing & Specifications</CardTitle>
              <CardDescription className="text-sm">Vehicle pricing and technical details</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price (EUR) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Mileage */}
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-sm font-medium">
                    Mileage (km) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mileage"
                    type="number"
                    {...register('mileage', { valueAsNumber: true })}
                    placeholder="0"
                    className={errors.mileage ? "border-red-500" : ""}
                  />
                  {errors.mileage && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.mileage.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="e.g., Nicosia"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Engine Type */}
                <div className="space-y-2">
                  <Label htmlFor="engineType" className="text-sm font-medium">Engine Type</Label>
                  <Select value={engineType || ""} onValueChange={(value) => setValue('engineType', value as "diesel" | "electric" | "hybrid" | "gas" | undefined)}>
                    <SelectTrigger className={errors.engineType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select engine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineTypes.map(engine => (
                        <SelectItem key={engine.value} value={engine.value}>{engine.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.engineType && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.engineType.message}
                    </p>
                  )}
                </div>

                {/* Engine Power */}
                <div className="space-y-2">
                  <Label htmlFor="enginePower" className="text-sm font-medium">Engine Power (HP)</Label>
                  <Input
                    id="enginePower"
                    type="number"
                    {...register('enginePower', { valueAsNumber: true })}
                    placeholder="e.g., 450"
                    className={errors.enginePower ? "border-red-500" : ""}
                  />
                  {errors.enginePower && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.enginePower.message}
                    </p>
                  )}
                </div>

                {/* Engine Size */}
                <div className="space-y-2">
                  <Label htmlFor="engineSize" className="text-sm font-medium">Engine Size (L)</Label>
                  <Input
                    id="engineSize"
                    type="number"
                    step="0.1"
                    {...register('engineSize', { valueAsNumber: true })}
                    placeholder="e.g., 2.0"
                    className={errors.engineSize ? "border-red-500" : ""}
                  />
                  {errors.engineSize && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.engineSize.message}
                    </p>
                  )}
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <Label htmlFor="transmission" className="text-sm font-medium">
                    Transmission <span className="text-red-500">*</span>
                  </Label>
                  <Select value={transmission} onValueChange={(value) => setValue('transmission', value as "manual" | "automatic" | "automated-manual")}>
                    <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map(trans => (
                        <SelectItem key={trans.value} value={trans.value}>{trans.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transmission && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.transmission.message}
                    </p>
                  )}
                </div>

                {/* Cabin */}
                <div className="space-y-2">
                  <Label htmlFor="cabin" className="text-sm font-medium">Cabin Type</Label>
                  <Select value={cabin || ""} onValueChange={(value) => setValue('cabin', value as "1" | "1.5" | "2" | undefined)}>
                    <SelectTrigger className={errors.cabin ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select cabin type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cabinTypes.map(cab => (
                        <SelectItem key={cab.value} value={cab.value}>{cab.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cabin && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cabin.message}
                    </p>
                  )}
                </div>

                {/* Tons */}
                <div className="space-y-2">
                  <Label htmlFor="tons" className="text-sm font-medium">Weight Capacity</Label>
                  <Select value={tons || ""} onValueChange={(value) => setValue('tons', value as "3.5" | "7.5" | "12" | "18" | undefined)}>
                    <SelectTrigger className={errors.tons ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      {tonsTypes.map(ton => (
                        <SelectItem key={ton.value} value={ton.value}>{ton.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tons && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.tons.message}
                    </p>
                  )}
                </div>

                {/* Source URL */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="sourceUrl" className="text-sm font-medium">
                    Source URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="sourceUrl"
                    {...register('sourceUrl')}
                    placeholder="https://example.com/vehicle-listing"
                    className={errors.sourceUrl ? "border-red-500" : ""}
                  />
                  {errors.sourceUrl && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.sourceUrl.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">Original listing URL for reference</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Vehicle Images</CardTitle>
                  <CardDescription className="text-sm">Add images via URL</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleImageUrlAdd())}
                  placeholder="https://example.com/image.jpg"
                  className={imageError ? "border-red-500" : ""}
                />
                <Button type="button" onClick={handleImageUrlAdd} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {imageError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {imageError}
                </p>
              )}
              {imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageUrlRemove(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-500">No images added</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Features */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-lg font-semibold text-slate-900">Features</CardTitle>
                <CardDescription className="text-sm">Special features and equipment</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFeatureAdd())}
                    placeholder="e.g., Air conditioning"
                  />
                  <Button type="button" onClick={handleFeatureAdd} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm flex items-center gap-2 border border-blue-200"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleFeatureRemove(index)}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-lg font-semibold text-slate-900">Description</CardTitle>
                <CardDescription className="text-sm">Detailed vehicle information</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Enter detailed vehicle description..."
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Availability & Display */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-lg font-semibold text-slate-900">Display Settings</CardTitle>
              <CardDescription className="text-sm">Control visibility and highlighting</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex-1">
                  <input
                    type="checkbox"
                    {...register('available')}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-sm text-slate-900">Available for Sale</span>
                    <p className="text-xs text-slate-500">Show in public inventory</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex-1">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-sm text-slate-900">Featured Vehicle</span>
                    <p className="text-xs text-slate-500">Highlight on homepage</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center gap-3 sticky bottom-0 bg-white border-t border-slate-200 p-4 rounded-lg shadow-lg">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 h-11 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Vehicle
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              asChild
              disabled={isSubmitting}
            >
              <Link href="/admin/vehicles">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
