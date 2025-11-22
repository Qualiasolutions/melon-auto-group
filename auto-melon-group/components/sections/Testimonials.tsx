"use client"

import { Star, Quote } from "lucide-react"
import { useState, useEffect } from "react"

interface Testimonial {
  name: string
  company: string
  location: string
  rating: number
  text: string
  vehicleType: string
}

const testimonials: Testimonial[] = [
  {
    name: "Andreas Georgiou",
    company: "Georgiou Transport Ltd",
    location: "Nicosia, Cyprus",
    rating: 5,
    text: "Excellent service from start to finish. Found the perfect Mercedes Actros for our fleet. The team was professional, transparent, and helped arrange everything including shipping documentation.",
    vehicleType: "Mercedes-Benz Actros"
  },
  {
    name: "Maria Christodoulou",
    company: "MC Logistics",
    location: "Limassol, Cyprus",
    rating: 5,
    text: "Best truck dealer in Cyprus! Purchased 3 Scania trucks for our company. All vehicles were exactly as described, and the after-sales support has been outstanding.",
    vehicleType: "Scania R-Series"
  },
  {
    name: "Petros Nikolaou",
    company: "Nikolaou Construction",
    location: "Larnaca, Cyprus",
    rating: 5,
    text: "Highly recommend Auto Melon Group. They helped us find a DAF tipper truck at an excellent price. Professional team with great knowledge of UK import regulations.",
    vehicleType: "DAF CF Tipper"
  },
  {
    name: "Yiannis Pavlou",
    company: "Pavlou Refrigerated Transport",
    location: "Paphos, Cyprus",
    rating: 5,
    text: "Outstanding experience! Purchased a Volvo refrigerated truck. The inspection reports were detailed, and the truck arrived in perfect condition. Will definitely buy again.",
    vehicleType: "Volvo FH Refrigerated"
  },
  {
    name: "Christos Demetriou",
    company: "Demetriou Fleet Services",
    location: "Nicosia, Cyprus",
    rating: 5,
    text: "We've been buying from Auto Melon for 2 years now. Always quality trucks, competitive prices, and honest service. They truly understand the Cyprus market needs.",
    vehicleType: "Multiple Vehicles"
  },
  {
    name: "Elena Constantinou",
    company: "Constantinou Distribution",
    location: "Limassol, Cyprus",
    rating: 5,
    text: "Fantastic service! Helped us expand our fleet with 2 MAN trucks. The financing options and quick delivery made everything smooth. Trustworthy team!",
    vehicleType: "MAN TGX"
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:32px_32px] opacity-30" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 text-brand-red font-semibold text-sm mb-4">
            <Star className="h-4 w-4 fill-current" />
            Trusted by Businesses Across Cyprus
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-ink mb-4">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real feedback from satisfied customers across Nicosia, Limassol, Larnaca & beyond
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 hover-lift relative overflow-hidden">
                  {/* Quote Icon */}
                  <div className="absolute top-8 right-8 opacity-10">
                    <Quote className="h-24 w-24 text-brand-red" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 relative z-10">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Vehicle Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-red/10 text-brand-red text-sm font-semibold mb-6">
                    <TruckIcon className="h-4 w-4" />
                    {testimonial.vehicleType}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-brand-ink">{testimonial.name}</div>
                      <div className="text-slate-600">{testimonial.company}</div>
                      <div className="text-sm text-slate-500">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-brand-red'
                    : 'w-3 h-3 bg-slate-300 hover:bg-brand-red/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover-lift">
            <div className="text-3xl font-bold text-brand-red mb-2">4.9/5</div>
            <div className="text-sm text-slate-600 font-medium">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover-lift">
            <div className="text-3xl font-bold text-brand-green mb-2">1,200+</div>
            <div className="text-sm text-slate-600 font-medium">Happy Customers</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover-lift">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-sm text-slate-600 font-medium">Satisfaction Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover-lift">
            <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
            <div className="text-sm text-slate-600 font-medium">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
