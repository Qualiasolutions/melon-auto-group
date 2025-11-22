"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/lib/supabase/client"
import {
  customOrderFormSchema,
  type CustomOrderFormData,
  truckTypeOptions,
  budgetRangeOptions,
  cabTypeOptions,
  deliveryTimelineOptions,
  commonFeatures,
} from "@/lib/validations/custom-order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { vehicleMakes, engineTypes, transmissionTypes } from "@/types/vehicle"
import {
  Truck,
  Send,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Loader2,
  Package,
  Settings,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

export default function CustomOrderPage() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [customFeature, setCustomFeature] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomOrderFormData>({
    resolver: zodResolver(customOrderFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      truckType: "tractor-unit",
      preferredMake: "",
      budgetRange: "flexible",
      engineType: "diesel",
      transmission: "manual",
      specialFeatures: [],
      customRequirements: "",
      desiredDelivery: "flexible",
      intendedUse: "",
      currentFleetSize: 0,
      tradeInAvailable: false,
      tradeInDetails: "",
      financingNeeded: false,
      acceptTerms: false,
    },
  })

  const truckType = watch("truckType")
  const budgetRange = watch("budgetRange")
  const desiredDelivery = watch("desiredDelivery")
  const tradeInAvailable = watch("tradeInAvailable")
  const financingNeeded = watch("financingNeeded")
  const acceptTerms = watch("acceptTerms")

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      setValue("specialFeatures", updated)
      return updated
    })
  }

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      const updated = [...selectedFeatures, customFeature.trim()]
      setSelectedFeatures(updated)
      setValue("specialFeatures", updated)
      setCustomFeature("")
      toast.success("Feature added")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    const updated = selectedFeatures.filter(f => f !== feature)
    setSelectedFeatures(updated)
    setValue("specialFeatures", updated)
    toast.info("Feature removed")
  }

  const onSubmit = async (data: CustomOrderFormData) => {
    try {
      const orderData = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        truck_type: data.truckType,
        preferred_make: data.preferredMake,
        budget_range: data.budgetRange,
        engine_type: data.engineType || null,
        transmission: data.transmission || null,
        axle_configuration: data.axleConfiguration || null,
        horsepower_min: data.horsepowerMin || null,
        gvw_min: data.gvwMin || null,
        cab_type: data.cabType || null,
        emission_standard: data.emissionStandard || null,
        special_features: selectedFeatures,
        custom_requirements: data.customRequirements,
        desired_delivery: data.desiredDelivery,
        intended_use: data.intendedUse,
        current_fleet_size: data.currentFleetSize || null,
        trade_in_available: data.tradeInAvailable,
        trade_in_details: data.tradeInDetails || null,
        financing_needed: data.financingNeeded,
        status: 'pending',
      }

      // Save to Supabase database
      // @ts-expect-error - Supabase types don't perfectly match our form data
      const { error: dbError } = await supabase
        .from('custom_orders')
        .insert([orderData])

      if (dbError) {
        console.error('Supabase error:', dbError)
        // Continue even if database save fails - we still want to send the email
      }

      // Send email notification
      const emailResponse = await fetch('/api/custom-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          truckType: data.truckType,
          preferredMake: data.preferredMake,
          budgetRange: data.budgetRange,
          engineType: data.engineType,
          transmission: data.transmission,
          axleConfiguration: data.axleConfiguration,
          horsepowerMin: data.horsepowerMin,
          gvwMin: data.gvwMin,
          cabType: data.cabType,
          emissionStandard: data.emissionStandard,
          specialFeatures: selectedFeatures,
          customRequirements: data.customRequirements,
          desiredDelivery: data.desiredDelivery,
          intendedUse: data.intendedUse,
          currentFleetSize: data.currentFleetSize,
          tradeInAvailable: data.tradeInAvailable,
          tradeInDetails: data.tradeInDetails,
          financingNeeded: data.financingNeeded,
        }),
      })

      if (!emailResponse.ok) {
        const emailError = await emailResponse.json()
        console.error('Email error:', emailError)
        throw new Error('Failed to send notification email')
      }

      toast.success("Order submitted successfully!", {
        description: "We'll contact you within 24 hours to discuss your requirements",
      })

      setIsSubmitted(true)
      reset()
      setSelectedFeatures([])
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error("Failed to submit order", {
        description: error instanceof Error ? error.message : "Please try again or contact us directly",
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200 shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Order Submitted Successfully!
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Thank you for your custom truck order. Our team will review your requirements and contact you within 24 hours.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700"
                >
                  Submit Another Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="ml-4"
                >
                  Return to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-red to-orange-600 rounded-2xl mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Custom Truck Order
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Looking for a specific truck or custom configuration? Fill out this form and our team will source the perfect vehicle for your needs.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Customer Information */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <CardDescription>Your contact details for order follow-up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="John Doe"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+357 99 123456"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Your Company Ltd"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Truck Specifications */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Truck Specifications
              </CardTitle>
              <CardDescription>Tell us what type of truck you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truckType">
                    Truck Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={truckType}
                    onValueChange={(value: any) => setValue("truckType", value)}
                  >
                    <SelectTrigger className={errors.truckType ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {truckTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.truckType && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.truckType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredMake">
                    Preferred Make <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("preferredMake")}
                    onValueChange={(value) => setValue("preferredMake", value)}
                  >
                    <SelectTrigger className={errors.preferredMake ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Make</SelectItem>
                      {vehicleMakes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferredMake && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.preferredMake.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engineType">Engine Type</Label>
                  <Select
                    value={watch("engineType")}
                    onValueChange={(value: any) => setValue("engineType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {engineTypes.map(engine => (
                        <SelectItem key={engine.value} value={engine.value}>
                          {engine.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={watch("transmission")}
                    onValueChange={(value: any) => setValue("transmission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map(trans => (
                        <SelectItem key={trans.value} value={trans.value}>
                          {trans.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horsepowerMin">Minimum Horsepower</Label>
                  <Input
                    id="horsepowerMin"
                    type="number"
                    {...register("horsepowerMin", { valueAsNumber: true })}
                    placeholder="e.g., 400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="axleConfiguration">Axle Configuration</Label>
                  <Input
                    id="axleConfiguration"
                    {...register("axleConfiguration")}
                    placeholder="e.g., 6x4, 4x2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gvwMin">Minimum GVW (kg)</Label>
                  <Input
                    id="gvwMin"
                    type="number"
                    {...register("gvwMin", { valueAsNumber: true })}
                    placeholder="e.g., 26000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cabType">Cab Type</Label>
                  <Select
                    value={watch("cabType")}
                    onValueChange={(value: any) => setValue("cabType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cab type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cabTypeOptions.map(cab => (
                        <SelectItem key={cab.value} value={cab.value}>
                          {cab.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emissionStandard">Emission Standard</Label>
                  <Input
                    id="emissionStandard"
                    {...register("emissionStandard")}
                    placeholder="e.g., Euro 6, Euro 5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Features */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle>Special Features</CardTitle>
              <CardDescription>Select desired features for your truck</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {commonFeatures.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedFeatures.includes(feature)
                        ? "border-brand-red bg-red-50 text-brand-red"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomFeature())}
                  placeholder="Add custom feature..."
                />
                <Button type="button" onClick={handleAddCustomFeature} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {selectedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
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

          {/* Budget & Timeline */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget & Timeline
              </CardTitle>
              <CardDescription>Your budget and delivery preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">
                    Budget Range <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={budgetRange}
                    onValueChange={(value: any) => setValue("budgetRange", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRangeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredDelivery">
                    Desired Delivery <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={desiredDelivery}
                    onValueChange={(value: any) => setValue("desiredDelivery", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTimelineOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentFleetSize">Current Fleet Size</Label>
                  <Input
                    id="currentFleetSize"
                    type="number"
                    {...register("currentFleetSize", { valueAsNumber: true })}
                    placeholder="Number of trucks you currently own"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements & Usage */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Requirements & Intended Use
              </CardTitle>
              <CardDescription>Detailed requirements for your custom order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customRequirements">
                  Custom Requirements <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="customRequirements"
                  {...register("customRequirements")}
                  rows={6}
                  placeholder="Please provide detailed specifications, special requirements, or any specific features you need for your truck..."
                  className={errors.customRequirements ? "border-red-500" : ""}
                />
                {errors.customRequirements && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.customRequirements.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="intendedUse">
                  Intended Use <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="intendedUse"
                  {...register("intendedUse")}
                  rows={4}
                  placeholder="Describe how you plan to use this truck (e.g., long-haul transport, construction, delivery, etc.)"
                  className={errors.intendedUse ? "border-red-500" : ""}
                />
                {errors.intendedUse && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.intendedUse.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trade-in & Financing */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle>Trade-in & Financing</CardTitle>
              <CardDescription>Additional services and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Checkbox
                    checked={tradeInAvailable}
                    onCheckedChange={(checked) => setValue("tradeInAvailable", checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-slate-900">I have a vehicle for trade-in</span>
                    <p className="text-sm text-slate-500">We accept trade-ins on your existing vehicles</p>
                  </div>
                </label>

                {tradeInAvailable && (
                  <div className="ml-8 space-y-2">
                    <Label htmlFor="tradeInDetails">Trade-in Details</Label>
                    <Textarea
                      id="tradeInDetails"
                      {...register("tradeInDetails")}
                      rows={3}
                      placeholder="Provide details about your trade-in vehicle (make, model, year, condition, etc.)"
                    />
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Checkbox
                    checked={financingNeeded}
                    onCheckedChange={(checked) => setValue("financingNeeded", checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-slate-900">I'm interested in financing options</span>
                    <p className="text-sm text-slate-500">We offer competitive financing solutions</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Submit */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardContent className="pt-6 space-y-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
                  className={`mt-1 ${errors.acceptTerms ? "border-red-500" : ""}`}
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-900">
                    I accept the terms and conditions <span className="text-red-500">*</span>
                  </span>
                  <p className="text-sm text-slate-500">
                    By submitting this form, you agree to our privacy policy and terms of service. We will contact you regarding your custom order.
                  </p>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>
              </label>

              <Button
                type="submit"
                disabled={isSubmitting || !acceptTerms}
                className="w-full bg-gradient-to-r from-brand-red to-orange-600 hover:from-brand-red-dark hover:to-orange-700 shadow-lg h-14 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Order...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Custom Order
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
