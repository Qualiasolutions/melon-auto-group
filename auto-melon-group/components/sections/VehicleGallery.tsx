"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VehicleGalleryProps {
  images: string[]
  altText: string
}

export function VehicleGallery({ images, altText }: VehicleGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border-2 border-slate-200">
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <div className="text-center">
            <Truck className="h-16 w-16 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">No images available</p>
            <p className="text-sm">Contact us for more details</p>
          </div>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border-2 border-slate-200 shadow-lg group">
        <div className="relative w-full h-full bg-white">
          {imageErrors.has(currentImageIndex) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <Truck className="h-24 w-24 mb-4 text-slate-300" />
              <p className="text-lg font-medium">Image not available</p>
              <p className="text-sm">Contact us for more details</p>
            </div>
          ) : (
            <Image
              src={images[currentImageIndex]}
              alt={`${altText} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain p-4"
              priority={currentImageIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              unoptimized
              onError={() => handleImageError(currentImageIndex)}
            />
          )}
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 hover:scale-110 shadow-lg transition-all duration-200"
              onClick={previousImage}
            >
              <ChevronLeft className="h-6 w-6 text-brand-red" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 hover:scale-110 shadow-lg transition-all duration-200"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6 text-brand-red" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all hover:scale-105 bg-white border-2 shadow-sm ${
                index === currentImageIndex
                  ? 'ring-2 ring-brand-red ring-offset-2 scale-105 border-brand-red shadow-lg'
                  : 'border-slate-200 hover:border-brand-red/50 hover:shadow-md'
              }`}
            >
              {imageErrors.has(index) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                  <Truck className="h-6 w-6 text-slate-300" />
                </div>
              ) : (
                <Image
                  src={image}
                  alt={`${altText} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 20vw, (max-width: 1024px) 16vw, 12vw"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  unoptimized
                  onError={() => handleImageError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}