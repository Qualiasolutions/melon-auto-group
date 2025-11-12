import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <footer className="mt-16 bg-[#0f1f2e] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo & Title */}
          <div className="space-y-4">
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
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.email}
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
