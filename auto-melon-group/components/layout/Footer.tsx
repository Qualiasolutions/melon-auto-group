import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Custom Order", href: "/custom-order" },
  ]

  const truckCategories = [
    { label: "Tractor Units", href: "/inventory?category=tractor-unit" },
    { label: "Tippers", href: "/inventory?category=tipper" },
    { label: "Box Trucks", href: "/inventory?category=box-truck" },
    { label: "Refrigerated", href: "/inventory?category=refrigerated" },
    { label: "Tankers", href: "/inventory?category=tanker" },
    { label: "Trailers", href: "/inventory?category=trailer" },
    { label: "Flatbeds", href: "/inventory?category=flatbed" },
    { label: "Pickups", href: "/inventory?category=pickup" },
    { label: "4x4 Vehicles", href: "/inventory?category=4x4" },
  ]

  const popularBrands = [
    { label: "Mercedes-Benz", href: "/inventory?make=Mercedes-Benz" },
    { label: "Scania", href: "/inventory?make=Scania" },
    { label: "Volvo", href: "/inventory?make=Volvo" },
    { label: "DAF", href: "/inventory?make=DAF" },
    { label: "MAN", href: "/inventory?make=MAN" },
    { label: "Iveco", href: "/inventory?make=Iveco" },
  ]

  return (
    <footer className="mt-16 bg-[#0f1f2e] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Logo & About */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center">
                <Image
                  src="/melon-logo.png"
                  alt="Auto Melon Group logo"
                  width={48}
                  height={48}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-lg">Auto Melon Group</p>
                <p className="text-xs text-white/60">Commercial Vehicles</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Premium commercial vehicle dealership specializing in quality trucks and professional service.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Truck Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Truck Types</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {truckCategories.map((category) => (
                <li key={category.href}>
                  <Link href={category.href} className="hover:text-brand-red transition-colors">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Popular Brands</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {popularBrands.map((brand) => (
                <li key={brand.href}>
                  <Link href={brand.href} className="hover:text-brand-red transition-colors">
                    {brand.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <p className="text-white/50 text-xs mb-1">Phone</p>
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-brand-red transition-colors block">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <p className="text-white/50 text-xs mb-1">Email</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-red transition-colors block">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <p className="text-white/50 text-xs mb-1">WhatsApp</p>
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors block">
                  Message Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Powered By */}
        <div className="border-t border-white/10 mt-8 pt-6 text-sm text-white/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} Auto Melon Group. All rights reserved.</p>
            <p>
              Powered by{" "}
              <a
                href="https://www.qualiasolutions.cy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:text-orange-500 font-semibold transition-colors"
              >
                Qualia Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
