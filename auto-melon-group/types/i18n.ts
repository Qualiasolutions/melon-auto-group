export type Locale = 'en' | 'el'

export const locales: Locale[] = ['en', 'el']
export const defaultLocale: Locale = 'en'

export interface Dictionary {
  nav: {
    home: string
    inventory: string
    about: string
    contact: string
    customOrder: string
    faq: string
  }
  home: {
    hero: {
      title: string
      subtitle: string
      searchPlaceholder: string
    }
    categories: {
      heading: string
      subheading: string
    }
    featured: {
      heading: string
      subheading: string
      viewAll: string
    }
    trust: {
      quality: {
        title: string
        description: string
      }
      ukImported: {
        title: string
        description: string
      }
      easySearch: {
        title: string
        description: string
      }
    }
    brands: {
      heading: string
      subheading: string
    }
    cta: {
      title: string
      subtitle: string
      browseInventory: string
      contactTeam: string
    }
  }
  inventory: {
    title: string
    subtitle: string
    searchPlaceholder: string
    vehiclesFound: string
    noResults: string
    sortBy: string
    filters: string
    clearAll: string
    viewGrid: string
    viewList: string
  }
  search: {
    placeholder: string
    advancedFilters: string
    clearFilters: string
    searchInventory: string
    viewAll: string
    vehicleType: string
    make: string
    priceRange: string
    year: string
    condition: string
    allTypes: string
    allMakes: string
    allPrices: string
    allYears: string
    allConditions: string
  }
  vehicle: {
    viewDetails: string
    enquire: string
    noImage: string
    featured: string
    new: string
    certified: string
    used: string
    price: string
    year: string
    mileage: string
    location: string
    specifications: string
    description: string
    similarTrucks: string
    whatsappInquiry: string
    callUs: string
    emailInquiry: string
  }
  categories: {
    '4x4': string
    'tractor-unit': string
    'tipper': string
    'box-truck': string
    'flatbed': string
    'refrigerated': string
    'tanker': string
    'trailer': string
    'curtainside': string
    'crane-truck': string
    'van': string
    'dropside': string
    'recovery': string
    'concrete-mixer': string
    'low-loader': string
    'logging': string
  }
  about: {
    badge: string
    hero: {
      title: string
      subtitle: string
    }
    whatWeDo: {
      title: string
      description1: string
      description2: string
    }
    whyUKImports: {
      title: string
      quality: {
        title: string
        description: string
      }
      rightHand: {
        title: string
        description: string
      }
      pricing: {
        title: string
        description: string
      }
    }
    cta: {
      title: string
      subtitle: string
      viewInventory: string
      contactUs: string
    }
  }
  contact: {
    title: string
    subtitle: string
    phone: string
    email: string
    whatsapp: string
    chatWithUs: string
    sendMessage: {
      title: string
      description: string
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      phone: string
      phonePlaceholder: string
      message: string
      messagePlaceholder: string
      submit: string
      sending: string
      successTitle: string
      successMessage: string
      sendAnother: string
      interestedInVehicle: string
    }
  }
  common: {
    loading: string
    error: string
    submit: string
    cancel: string
    save: string
    delete: string
    edit: string
    back: string
    next: string
    previous: string
    close: string
  }
}
