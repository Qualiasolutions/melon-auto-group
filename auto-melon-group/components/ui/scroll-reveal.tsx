"use client"

import { useEffect, useRef, useState, ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade-in" | "scale-up"
  duration?: number
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
  duration = 700,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [delay])

  const getAnimationClass = () => {
    const baseClasses = "transition-all"
    const durationClass = `duration-${duration}`

    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return `${baseClasses} ${durationClass} opacity-0 translate-y-12`
        case "fade-down":
          return `${baseClasses} ${durationClass} opacity-0 -translate-y-12`
        case "fade-left":
          return `${baseClasses} ${durationClass} opacity-0 translate-x-12`
        case "fade-right":
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-12`
        case "fade-in":
          return `${baseClasses} ${durationClass} opacity-0`
        case "scale-up":
          return `${baseClasses} ${durationClass} opacity-0 scale-95`
        default:
          return `${baseClasses} ${durationClass} opacity-0 translate-y-12`
      }
    }

    return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`
  }

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
}
