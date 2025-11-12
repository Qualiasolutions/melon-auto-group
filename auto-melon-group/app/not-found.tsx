import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TruckIcon, Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* 404 Visual */}
          <div className="relative">
            <div className="text-[200px] md:text-[300px] font-black leading-none text-white/5 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <TruckIcon className="h-32 w-32 md:h-40 md:w-40 text-brand-red animate-bounce" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Lost Your Way?
            </h1>
            <p className="text-xl text-slate-300 max-w-md mx-auto">
              This page seems to have taken a different route.
              Let&apos;s get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red-dark">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/inventory">
                <Search className="mr-2 h-5 w-5" />
                Browse Inventory
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-12 border-t border-white/10">
            <p className="text-sm text-slate-400 mb-4">Or try these popular pages:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/about"
                className="text-sm text-slate-300 hover:text-white transition-colors underline underline-offset-4"
              >
                About Us
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/contact"
                className="text-sm text-slate-300 hover:text-white transition-colors underline underline-offset-4"
              >
                Contact
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/faq"
                className="text-sm text-slate-300 hover:text-white transition-colors underline underline-offset-4"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
