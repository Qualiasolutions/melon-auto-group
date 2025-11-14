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
      engineType: 'diesel',
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
        engine_type: data.engineType,
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
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/vehicles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New Vehicle</h1>
          <p className="text-slate-600 mt-1">Fill in the details to add a new vehicle to inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="border-2 border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6 border-b border-slate-200/60">
            <CardHeader className="px-0 py-0">
              <CardTitle className="text-2xl font-bold text-slate-900">Basic Information</CardTitle>
              <CardDescription className="text-slate-600 mt-1">Core vehicle identification details</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Make */}
              <div className="space-y-2">
                <Label htmlFor="make">
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
                    <SelectItem value="Other">Other (Add new make)</SelectItem>
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
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddCustomMakeToList()
                      }}
                      variant="outline"
                      className="whitespace-nowrap"
                      disabled={!customMake.trim() || isLoadingMakes}
                    >
                      {isLoadingMakes ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <PlusCircle className="h-4 w-4 mr-2" />
                      )}
                      Add to List
                    </Button>
                  </div>
                )}
                {errors.make && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.make.message}
                  </p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  {...register('model')}
                  placeholder="e.g., Actros"
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.model.message}
                  </p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  className={errors.year ? "border-red-500" : ""}
                />
                {errors.year && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.year.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label htmlFor="condition">
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.condition.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Technical Specifications */}
        <Card className="border-2 border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-slate-200/60">
            <CardHeader className="px-0 py-0">
              <CardTitle className="text-2xl font-bold text-slate-900">Pricing & Technical Specifications</CardTitle>
              <CardDescription className="text-slate-600 mt-1">Performance and pricing information</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <Label htmlFor="mileage">
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.mileage.message}
                  </p>
                )}
              </div>

              {/* Engine Power */}
              <div className="space-y-2">
                <Label htmlFor="enginePower">
                  Engine Power (HP)
                </Label>
                <Input
                  id="enginePower"
                  type="number"
                  {...register('enginePower', { valueAsNumber: true })}
                  placeholder="e.g., 450"
                  className={errors.enginePower ? "border-red-500" : ""}
                />
                {errors.enginePower && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.enginePower.message}
                  </p>
                )}
              </div>

              {/* Engine Size */}
              <div className="space-y-2">
                <Label htmlFor="engineSize">
                  Engine Size (L)
                </Label>
                <Input
                  id="engineSize"
                  type="number"
                  step="0.1"
                  {...register('engineSize', { valueAsNumber: true })}
                  placeholder="e.g., 2.0"
                  className={errors.engineSize ? "border-red-500" : ""}
                />
                {errors.engineSize && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.engineSize.message}
                  </p>
                )}
                <p className="text-xs text-slate-500">Engine displacement in liters</p>
              </div>

              {/* Engine Type */}
              <div className="space-y-2">
                <Label htmlFor="engineType">
                  Engine Type <span className="text-red-500">*</span>
                </Label>
                <Select value={engineType} onValueChange={(value) => setValue('engineType', value as "diesel" | "electric" | "hybrid" | "gas")}>
                  <SelectTrigger className={errors.engineType ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {engineTypes.map(engine => (
                      <SelectItem key={engine.value} value={engine.value}>{engine.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.engineType && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.engineType.message}
                  </p>
                )}
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label htmlFor="transmission">
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.transmission.message}
                  </p>
                )}
              </div>

              {/* Cabin */}
              <div className="space-y-2">
                <Label htmlFor="cabin">
                  Cabin Type
                </Label>
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.cabin.message}
                  </p>
                )}
              </div>

              {/* Tons */}
              <div className="space-y-2">
                <Label htmlFor="tons">
                  Weight Capacity (Tonnes)
                </Label>
                <Select value={tons || ""} onValueChange={(value) => setValue('tons', value as "3.5" | "7.5" | "12" | "18" | undefined)}>
                  <SelectTrigger className={errors.tons ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select weight capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {tonsTypes.map(ton => (
                      <SelectItem key={ton.value} value={ton.value}>{ton.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tons && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.tons.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g., Nicosia"
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Source URL */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="sourceUrl">
                  Source URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sourceUrl"
                  {...register('sourceUrl')}
                  placeholder="https://example.com/vehicle-listing"
                  className={errors.sourceUrl ? "border-red-500" : ""}
                />
                {errors.sourceUrl && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.sourceUrl.message}
                  </p>
                )}
                <p className="text-xs text-slate-500">Main source link where this vehicle was found (for internal reference)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-2 border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-slate-200/60">
            <CardHeader className="px-0 py-0">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                Images
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1">Add vehicle images via URLs</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleImageUrlAdd())}
                placeholder="https://example.com/image.jpg"
                className={imageError ? "border-red-500" : ""}
              />
              <Button type="button" onClick={handleImageUrlAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {imageError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {imageError}
              </p>
            )}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageUrlRemove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {imageUrls.length === 0 && (
              <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-300 rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No images added yet</p>
                <p className="text-xs">Add image URLs to showcase this vehicle</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-2 border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-slate-200/60">
            <CardHeader className="px-0 py-0">
              <CardTitle className="text-2xl font-bold text-slate-900">Features</CardTitle>
              <CardDescription className="text-slate-600 mt-1">Special features and equipment</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFeatureAdd())}
                placeholder="e.g., Air conditioning, GPS navigation"
              />
              <Button type="button" onClick={handleFeatureAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm flex items-center gap-2"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleFeatureRemove(index)}
                      className="hover:text-blue-700"
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
        <Card className="border-2 border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-slate-200/60">
            <CardHeader className="px-0 py-0">
              <CardTitle className="text-2xl font-bold text-slate-900">Description</CardTitle>
              <CardDescription className="text-slate-600 mt-1">Detailed vehicle description</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8">
            <Textarea
              {...register('description')}
              rows={6}
              placeholder="Enter detailed vehicle description..."
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Availability & Display Options */}
        <Card className="border-2 border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-8 py-6 border-b border-slate-200/60">
            <CardHeader className="px-0 py-0">
              <CardTitle className="text-2xl font-bold text-slate-900">Availability & Display Options</CardTitle>
              <CardDescription className="text-slate-600 mt-1">Control how this vehicle appears on the site</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  {...register('available')}
                  className="w-5 h-5 text-brand-red focus:ring-brand-red"
                />
                <div>
                  <span className="font-medium text-slate-900">Available for Sale</span>
                  <p className="text-xs text-slate-500">Show this vehicle in inventory</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-5 h-5 text-brand-red focus:ring-brand-red"
                />
                <div>
                  <span className="font-medium text-slate-900">Featured Vehicle</span>
                  <p className="text-xs text-slate-500">Highlight on homepage</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pb-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg flex-1 h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving Vehicle...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Vehicle
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12"
            asChild
            disabled={isSubmitting}
          >
            <Link href="/admin/vehicles">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
