import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container relative z-10">
          <Badge className="mb-4 bg-brand-red text-white">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
            UK Used Truck Imports
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            We specialize in importing quality used commercial vehicles from the UK.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                We import used trucks and commercial vehicles from the UK market, offering access to
                well-maintained European brands at competitive prices.
              </p>
              <p>
                Our inventory includes trucks from leading manufacturers such as Mercedes-Benz, Scania,
                Volvo, DAF, MAN, and Iveco. Browse our current selection to find vehicles suitable for
                your business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why UK Imports */}
      <section className="py-16 bg-muted/40">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why UK Imports</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-red flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Quality Standards</h3>
                  <p className="text-muted-foreground">
                    UK commercial vehicles are known for high maintenance standards and comprehensive service histories.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-red flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Right-Hand Drive Options</h3>
                  <p className="text-muted-foreground">
                    Access to right-hand drive vehicles for markets where this configuration is preferred.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brand-red flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Competitive Pricing</h3>
                  <p className="text-muted-foreground">
                    The UK market offers good value for quality used trucks suitable for various applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Truck?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Browse our inventory or get in touch with our team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-brand-red hover:bg-white/90">
              <Link href="/inventory">View Inventory</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-brand-ink">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
