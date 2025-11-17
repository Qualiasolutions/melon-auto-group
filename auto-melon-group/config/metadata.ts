import { Metadata } from "next"
import { siteConfig } from "./site"

// Comprehensive English SEO Keywords
export const englishKeywords = [
  // General Commercial Vehicles
  "used trucks",
  "commercial vehicles",
  "heavy trucks",
  "commercial trucks for sale",
  "used commercial vehicles",
  "truck dealer",
  "truck dealership",

  // Truck Brands
  "Mercedes-Benz trucks",
  "Scania trucks",
  "Volvo trucks",
  "DAF trucks",
  "MAN trucks",
  "Iveco trucks",
  "Renault trucks",
  "Mercedes Actros",
  "Scania R series",
  "Scania S series",
  "Volvo FH",
  "DAF XF",

  // Truck Types
  "semi-trucks",
  "tractor units",
  "tipper trucks",
  "dump trucks",
  "box trucks",
  "refrigerated trucks",
  "tanker trucks",
  "flatbed trucks",
  "curtainside trucks",
  "crane trucks",
  "concrete mixer trucks",
  "recovery trucks",
  "4x4 trucks",

  // Technical Specifications
  "EURO 6 trucks",
  "EURO 5 trucks",
  "diesel trucks",
  "automatic transmission trucks",
  "manual transmission trucks",
  "low mileage trucks",

  // Geographic & Business
  "Cyprus truck dealer",
  "European trucks",
  "Middle East truck export",
  "worldwide truck shipping",
  "international truck sales",
  "fleet sales",
  "bulk truck purchase",

  // Business Type
  "certified pre-owned trucks",
  "quality used trucks",
  "inspected commercial vehicles",
  "reliable truck dealer",
]

// Comprehensive Greek SEO Keywords (Ελληνικά)
export const greekKeywords = [
  // Γενικά Εμπορικά Οχήματα
  "μεταχειρισμένα φορτηγά",
  "εμπορικά οχήματα",
  "βαριά φορτηγά",
  "φορτηγά προς πώληση",
  "μεταχειρισμένα εμπορικά οχήματα",
  "έμπορος φορτηγών",
  "πωλητής φορτηγών",

  // Μάρκες Φορτηγών
  "Mercedes-Benz φορτηγά",
  "Scania φορτηγά",
  "Volvo φορτηγά",
  "DAF φορτηγά",
  "MAN φορτηγά",
  "Iveco φορτηγά",
  "Renault φορτηγά",
  "Mercedes Actros",
  "Scania R σειρά",
  "Scania S σειρά",
  "Volvo FH",
  "DAF XF",

  // Τύποι Φορτηγών
  "ημιφορτηγά",
  "ελκυστήρες",
  "ανατρεπόμενα φορτηγά",
  "φορτηγά κλειστά",
  "ψυγεία φορτηγά",
  "βυτιοφόρα",
  "φορτηγά επίπεδης πλατφόρμας",
  "γερανοφόρα",
  "μπετονιέρες",
  "οδική βοήθεια",
  "4x4 φορτηγά",

  // Τεχνικές Προδιαγραφές
  "EURO 6 φορτηγά",
  "EURO 5 φορτηγά",
  "ντίζελ φορτηγά",
  "αυτόματο κιβώτιο",
  "χειροκίνητο κιβώτιο",
  "χαμηλά χιλιόμετρα",

  // Γεωγραφικά & Επιχειρηματικά
  "έμπορος φορτηγών Κύπρος",
  "ευρωπαϊκά φορτηγά",
  "εξαγωγή φορτηγών Μέση Ανατολή",
  "παγκόσμια αποστολή φορτηγών",
  "διεθνείς πωλήσεις φορτηγών",
  "πωλήσεις στόλου",

  // Τύπος Επιχείρησης
  "πιστοποιημένα μεταχειρισμένα φορτηγά",
  "ποιοτικά φορτηγά",
  "ελεγμένα εμπορικά οχήματα",
  "αξιόπιστος έμπορος φορτηγών",
]

// English Metadata
export const englishMetadata = {
  title: "Auto Melon Group - Premium Used Trucks & Commercial Vehicles Worldwide",
  description: "Leading dealer of quality used trucks and commercial vehicles. Specializing in Mercedes-Benz, Scania, Volvo, DAF. EURO 6 certified trucks. Worldwide shipping from Cyprus. Fleet sales available.",
  keywords: englishKeywords,
}

// Greek Metadata (Ελληνικά)
export const greekMetadata = {
  title: "Auto Melon Group - Μεταχειρισμένα Φορτηγά & Εμπορικά Οχήματα Παγκοσμίως",
  description: "Κορυφαίος έμπορος ποιοτικών μεταχειρισμένων φορτηγών και εμπορικών οχημάτων. Ειδικευόμαστε σε Mercedes-Benz, Scania, Volvo, DAF. EURO 6 πιστοποιημένα φορτηγά. Παγκόσμια αποστολή από Κύπρο. Διαθέσιμες πωλήσεις στόλου.",
  keywords: greekKeywords,
}

// Base metadata configuration
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: englishMetadata.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: englishMetadata.description,
  keywords: englishMetadata.keywords,
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en': siteConfig.url,
      'el': `${siteConfig.url}/el`,
      'el-CY': `${siteConfig.url}/el`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["el_GR", "el_CY"],
    url: siteConfig.url,
    title: englishMetadata.title,
    description: englishMetadata.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: englishMetadata.title,
    description: englishMetadata.description,
    images: ["/og-image.jpg"],
    creator: "@automelongroup",
    site: "@automelongroup",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code", // Add your actual verification code
    // yandex: "yandex-verification-code",
    // bing: "bing-verification-code",
  },
  category: "automotive",
}

// Page-specific metadata generators
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = "",
  greekTitle?: string,
  greekDescription?: string
): Metadata {
  const url = `${siteConfig.url}${path}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': url,
        'el': `${url}/el`,
        'el-CY': `${url}/el`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      images: ["/og-image.jpg"],
      type: "website",
      locale: "en_US",
      alternateLocale: ["el_GR", "el_CY"],
    },
    twitter: {
      title,
      description,
      images: ["/og-image.jpg"],
    },
  }
}

// Structured Data helpers
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/melon-logo.png`,
      width: 1024,
      height: 1024,
    },
    image: `${siteConfig.url}/og-image.jpg`,
    description: englishMetadata.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: "Limassol",
      addressRegion: "Limassol",
      postalCode: "3036",
      addressCountry: "CY",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "sales",
        areaServed: ["CY", "EU", "AE", "SA"],
        availableLanguage: ["en", "el", "ar"],
      },
      {
        "@type": "ContactPoint",
        email: siteConfig.contact.email,
        contactType: "customer service",
      },
    ],
    sameAs: [
      siteConfig.links.facebook,
      siteConfig.links.instagram,
      siteConfig.links.whatsapp,
    ],
    priceRange: "$$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
  }
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    description: englishMetadata.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: "Limassol",
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "34.6857",
      longitude: "33.0438",
    },
    image: `${siteConfig.url}/og-image.jpg`,
    priceRange: "$$$",
  }
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: englishMetadata.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/inventory?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en", "el"],
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

export function getVehicleSchema(vehicle: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "@id": `${siteConfig.url}/inventory/${vehicle.id}`,
    name: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
    description: vehicle.description,
    manufacturer: vehicle.make,
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    vehicleEngine: {
      "@type": "EngineSpecification",
      fuelType: vehicle.engineType,
      enginePower: {
        "@type": "QuantitativeValue",
        value: vehicle.horsepower,
        unitCode: "BHP",
      },
    },
    vehicleTransmission: vehicle.transmission,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: vehicle.currency,
      availability: vehicle.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
    image: vehicle.images || [],
    vehicleIdentificationNumber: vehicle.vin,
    itemCondition: vehicle.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
  }
}
