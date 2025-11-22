"use client"

import { useEffect, useRef, useState } from "react"
import { TruckIcon, Users, Globe, Award } from "lucide-react"

interface Stat {
  icon: React.ReactNode
  value: number
  suffix?: string
  label: string
  color: string
}

export function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const stats: Stat[] = [
    {
      icon: <TruckIcon className="h-8 w-8" />,
      value: 500,
      suffix: "+",
      label: "Quality Trucks Available",
      color: "from-brand-red to-red-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: 1200,
      suffix: "+",
      label: "Happy Customers",
      color: "from-brand-green to-emerald-600"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      value: 45,
      suffix: "+",
      label: "Countries Served",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: 15,
      suffix: "+",
      label: "Years Experience",
      color: "from-orange-600 to-amber-600"
    }
  ]

  return (
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-red rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-brand-green rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by <span className="gradient-text">Thousands</span> Worldwide
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Your premier destination for quality used trucks in Cyprus and beyond
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  stat: Stat
  isVisible: boolean
  delay: number
}

function StatCard({ stat, isVisible, delay }: StatCardProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepValue = stat.value / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setCount(stat.value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(stepValue * currentStep))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, stat.value])

  return (
    <div
      className="glass-dark p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
      style={{
        animation: isVisible ? `fadeUp 0.8s ease-out ${delay}ms both` : 'none'
      }}
    >
      {/* Icon */}
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {stat.icon}
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-5xl md:text-6xl font-bold text-white group-hover:scale-110 transition-transform duration-300 inline-block">
          {count.toLocaleString()}
        </span>
        {stat.suffix && (
          <span className="text-4xl md:text-5xl font-bold text-white/80">
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-lg text-slate-400 font-medium">
        {stat.label}
      </p>

      {/* Glow Effect on Hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
    </div>
  )
}
