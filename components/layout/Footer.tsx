import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AM</span>
              </div>
              <span className="font-bold text-lg">Auto Melon Group</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium used trucks and commercial vehicles worldwide. Quality assured, competitively priced.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/inventory" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Inventory
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Truck Brands */}
          <div>
            <h3 className="font-semibold mb-4">Popular Brands</h3>
            <ul className="space-y-2 text-sm">
              {["Mercedes-Benz", "Scania", "Volvo", "DAF"].map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/inventory?make=${brand}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${siteConfig.contact.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${siteConfig.contact.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Auto Melon Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
