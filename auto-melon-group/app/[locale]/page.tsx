import { getDictionary } from '@/lib/i18n/get-dictionary'
import type { Locale } from '@/types/i18n'
import { supabase } from '@/lib/supabase/client'
import type { Vehicle } from '@/types/vehicle'
import Link from 'next/link'
import { ArrowRight, Search, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocalizedHeader } from '@/components/layout/LocalizedHeader'
import { LocalizedFooter } from '@/components/layout/LocalizedFooter'

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching vehicles:', error)
    }
    return []
  }

  return vehicles as Vehicle[]
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const featuredVehicles = await getFeaturedVehicles()

  return (
    <div className="min-h-screen flex flex-col">
      <LocalizedHeader locale={locale} dict={dict} />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-ink mb-6">
              {dict.home.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {dict.home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red-dark">
                <Link href={`/${locale}/inventory`}>
                  {dict.home.cta.browseInventory}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${locale}/contact`}>{dict.home.cta.contactTeam}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-xl border hover:shadow-lg transition-shadow">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-brand-red mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">{dict.home.trust.quality.title}</h3>
              <p className="text-muted-foreground">{dict.home.trust.quality.description}</p>
            </div>
            <div className="text-center p-8 rounded-xl border hover:shadow-lg transition-shadow">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-brand-green mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">{dict.home.trust.ukImported.title}</h3>
              <p className="text-muted-foreground">{dict.home.trust.ukImported.description}</p>
            </div>
            <div className="text-center p-8 rounded-xl border hover:shadow-lg transition-shadow">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">{dict.home.trust.easySearch.title}</h3>
              <p className="text-muted-foreground">{dict.home.trust.easySearch.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-4">
                {dict.home.featured.heading}
              </h2>
              <p className="text-lg text-muted-foreground">{dict.home.featured.subheading}</p>
            </div>

            {featuredVehicles.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {featuredVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-white rounded-lg overflow-hidden border hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-video bg-slate-200 relative">
                        {vehicle.images && vehicle.images[0] && (
                          <img
                            src={vehicle.images[0]}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-brand-red">
                            €{vehicle.price.toLocaleString()}
                          </span>
                          <Button asChild size="sm">
                            <Link href={`/${locale}/inventory/${vehicle.id}`}>
                              {dict.vehicle.viewDetails}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Button asChild size="lg" variant="outline">
                    <Link href={`/${locale}/inventory`}>{dict.home.featured.viewAll}</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{dict.common.loading}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-red via-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{dict.home.cta.title}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">{dict.home.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-brand-red hover:bg-slate-50">
              <Link href={`/${locale}/inventory`}>
                {dict.home.cta.browseInventory}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-red">
              <Link href={`/${locale}/contact`}>{dict.home.cta.contactTeam}</Link>
            </Button>
          </div>
        </div>
      </section>

      <LocalizedFooter locale={locale} dict={dict} />
    </div>
  )
}
