export const siteConfig = {
  name: "Auto Melon Group",
  description: "UK Used Trucks & Commercial Vehicles | Cyprus Dealer | Mercedes, Scania, Volvo, DAF & More",
  url: "https://automelongroup.com",
  ogImage: "https://automelongroup.com/og-image.jpg",
  links: {
    facebook: "https://facebook.com/automelongroup",
    instagram: "https://instagram.com/automelongroup",
    whatsapp: "https://wa.me/35799107227",
  },
  contact: {
    email: "info@automelongroup.com",
    phone: "+357 99107227",
    whatsapp: "+35799107227",
    address: "Limassol, Cyprus", // Generic location - update with specific address when available
  },
  languages: {
    en: "English",
    ar: "العربية",
    fr: "Français",
  },
  currencies: ["USD", "EUR"],
}

export type SiteConfig = typeof siteConfig
