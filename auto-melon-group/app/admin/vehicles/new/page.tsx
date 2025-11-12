"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/lib/supabase/client"
import { vehicleFormSchema, type VehicleFormData, imageUrlSchema } from "@/lib/validations/vehicle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { vehicleMakes, vehicleCategories, engineTypes, transmissionTypes, conditionTypes } from "@/types/vehicle"
import { Upload, X, Save, ArrowLeft, Plus, Loader2, ImageIcon, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewVehiclePage() {
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageInput, setImageInput] = useState("")
  const [imageError, setImageError] = useState("")
  const [specifications, setSpecifications] = useState<Record<string, string | number>>({})
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState("")

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
      horsepower: 0,
      location: '',
      country: 'Cyprus',
      vin: '',
      description: '',
      reference_url: '',
      available: true,
      featured: false,
      images: [],
      specifications: {},
      features: [],
    },
  })

  const make = watch('make')
  const category = watch('category')
  const condition = watch('condition')
  const engineType = watch('engineType')
  const transmission = watch('transmission')

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

  const onSubmit = async (data: VehicleFormData) => {
    try {
      const vehicleData = {
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        price: data.price,
        currency: data.currency,
        condition: data.condition,
        category: data.category,
        engine_type: data.engineType,
        transmission: data.transmission,
        horsepower: data.horsepower,
        location: data.location,
        country: data.country,
        vin: data.vin,
        reference_url: data.reference_url || null,
        images: imageUrls,
        specifications: specifications,
        features: features,
        description: data.description || '',
        available: data.available,
        featured: data.featured,
      }

      // @ts-expect-error - Supabase types don't perfectly match our form data
      const { data: insertedData, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to add vehicle')
      }

      toast.success("Vehicle added successfully!", {
        description: `${data.make} ${data.model} has been added to inventory`,
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
    <div className="max-w-6xl mx-auto space-y-6">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core vehicle identification details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Make */}
              <div className="space-y-2">
                <Label htmlFor="make">
                  Make <span className="text-red-500">*</span>
                </Label>
                <Select value={make} onValueChange={(value) => setValue('make', value)}>
                  <SelectTrigger className={errors.make ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleMakes.map(make => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* VIN */}
              <div className="space-y-2">
                <Label htmlFor="vin">
                  VIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vin"
                  {...register('vin')}
                  placeholder="Vehicle Identification Number"
                  className={errors.vin ? "border-red-500" : ""}
                />
                {errors.vin && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vin.message}
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
                <Select value={condition} onValueChange={(value: any) => setValue('condition', value)}>
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

              {/* Reference URL */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="reference_url">Reference URL (Optional)</Label>
                <Input
                  id="reference_url"
                  type="url"
                  {...register('reference_url')}
                  placeholder="https://example.com/listing"
                  className={errors.reference_url ? "border-red-500" : ""}
                />
                <p className="text-xs text-slate-500">Original listing URL for reference</p>
                {errors.reference_url && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.reference_url.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Technical Specifications */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Pricing & Technical Specifications</CardTitle>
            <CardDescription>Performance and pricing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* Horsepower */}
              <div className="space-y-2">
                <Label htmlFor="horsepower">
                  Horsepower <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="horsepower"
                  type="number"
                  {...register('horsepower', { valueAsNumber: true })}
                  placeholder="0"
                  className={errors.horsepower ? "border-red-500" : ""}
                />
                {errors.horsepower && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.horsepower.message}
                  </p>
                )}
              </div>

              {/* Engine Type */}
              <div className="space-y-2">
                <Label htmlFor="engineType">
                  Engine Type <span className="text-red-500">*</span>
                </Label>
                <Select value={engineType} onValueChange={(value: any) => setValue('engineType', value)}>
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
                <Select value={transmission} onValueChange={(value: any) => setValue('transmission', value)}>
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
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Images
            </CardTitle>
            <CardDescription>Add vehicle images via URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Special features and equipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Detailed vehicle description</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register('description')}
              rows={6}
              placeholder="Enter detailed vehicle description..."
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Availability & Features */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Availability & Display Options</CardTitle>
            <CardDescription>Control how this vehicle appears on the site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
