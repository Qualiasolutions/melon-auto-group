import { Metadata } from "next"
import { BookOpen, TrendingUp, Truck } from "lucide-react"
import { getAllBlogPosts } from "@/lib/blog/posts"
import { BlogList } from "@/components/blog/BlogList"
import { siteConfig } from "@/config/site"
import type { Locale } from "@/config/i18n"

interface BlogPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params

  const title =
    locale === "el"
      ? "Blog | Οδηγοί & Συμβουλές για Φορτηγά και 4x4 στην Κύπρο"
      : "Blog | Truck & 4x4 Guides, Tips & News for Cyprus"

  const description =
    locale === "el"
      ? "Διαβάστε τους οδηγούς μας για αγορά μεταχειρισμένων φορτηγών, 4x4 pickup, εισαγωγές από UK και χρηματοδότηση εμπορικών οχημάτων στην Κύπρο."
      : "Read our guides on buying used trucks, 4x4 pickups, UK imports, and commercial vehicle financing in Cyprus. Expert advice for truck buyers."

  return {
    title,
    description,
    keywords: [
      "truck buying guide cyprus",
      "4x4 pickup guide",
      "used trucks cyprus blog",
      "commercial vehicle advice",
      "UK truck import guide",
      "truck financing cyprus",
      "οδηγός αγοράς φορτηγών κύπρος",
      "συμβουλές 4x4 pickup",
    ],
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        en: `${siteConfig.url}/en/blog`,
        el: `${siteConfig.url}/el/blog`,
        "x-default": `${siteConfig.url}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/blog`,
      type: "website",
      locale: locale === "el" ? "el_GR" : "en_US",
      siteName: siteConfig.name,
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const posts = getAllBlogPosts()

  const heroTitle =
    locale === "el"
      ? "Blog & Οδηγοί"
      : "Blog & Guides"

  const heroSubtitle =
    locale === "el"
      ? "Συμβουλές ειδικών, οδηγοί αγοράς και τα τελευταία νέα για φορτηγά και 4x4 στην Κύπρο"
      : "Expert tips, buying guides, and the latest news about trucks and 4x4 vehicles in Cyprus"

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-brand-red" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{heroTitle}</h1>
            <p className="text-xl text-slate-300">{heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-8 bg-muted/40 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Truck className="h-5 w-5 text-brand-red" />
              <span className="text-sm font-medium">
                {locale === "el" ? "Οδηγοί Αγοράς" : "Buying Guides"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <TrendingUp className="h-5 w-5 text-brand-red" />
              <span className="text-sm font-medium">
                {locale === "el" ? "Συγκρίσεις Οχημάτων" : "Vehicle Comparisons"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <BlogList posts={posts} locale={locale} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            {locale === "el"
              ? "Έτοιμοι να Βρείτε το Επόμενο Φορτηγό σας;"
              : "Ready to Find Your Next Truck?"}
          </h2>
          <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
            {locale === "el"
              ? "Περιηγηθείτε στο απόθεμά μας με ποιοτικά μεταχειρισμένα φορτηγά και 4x4 pickup."
              : "Browse our inventory of quality used trucks and 4x4 pickups."}
          </p>
          <a
            href={`/${locale}/inventory`}
            className="inline-flex items-center gap-2 bg-white text-brand-red px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            {locale === "el" ? "Δείτε το Απόθεμα" : "View Inventory"}
          </a>
        </div>
      </section>
    </div>
  )
}
