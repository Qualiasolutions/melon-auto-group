"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, MessageCircle, Mail } from "lucide-react"
import { siteConfig } from "@/config/site"
import type { Locale } from "@/types/i18n"
import type { Dictionary } from "@/types/i18n"
import { useState } from "react"

interface LocalizedHeaderProps {
  locale: Locale
  dict: Dictionary
}

export function LocalizedHeader({ locale, dict }: LocalizedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar - Contact Info */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-6">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-red transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="text-xs">{siteConfig.contact.email}</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-red transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="text-xs">{siteConfig.contact.phone}</span>
              </a>
            </div>
            <div className="ml-auto">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative h-14 w-14">
              <Image
                src="/melon-logo.png"
                alt="Auto Melon Group"
                width={56}
                height={56}
                className="h-14 w-14 object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-lg text-brand-ink group-hover:text-brand-red transition-colors">
                Auto Melon Group
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                {locale === 'el' ? 'Εμπορικά Οχήματα' : 'Commercial Vehicles'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link
              href={`/${locale}`}
              className="px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 hover:text-brand-red transition-colors"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${locale}/inventory`}
              className="px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 hover:text-brand-red transition-colors"
            >
              {dict.nav.inventory}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 hover:text-brand-red transition-colors"
            >
              {dict.nav.about}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 hover:text-brand-red transition-colors"
            >
              {dict.nav.contact}
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden md:flex bg-green-600 hover:bg-green-700 text-white"
              asChild
            >
              <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>{locale === 'el' ? 'Μενού' : 'Menu'}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-3 mt-6">
                  <Link
                    href={`/${locale}`}
                    className="px-4 py-3 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dict.nav.home}
                  </Link>
                  <Link
                    href={`/${locale}/inventory`}
                    className="px-4 py-3 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dict.nav.inventory}
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="px-4 py-3 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dict.nav.about}
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="px-4 py-3 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dict.nav.contact}
                  </Link>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="px-4 pb-2">
                      <p className="text-xs text-muted-foreground mb-3">
                        {locale === 'el' ? 'Αλλαγή Γλώσσας' : 'Change Language'}
                      </p>
                      <LanguageSwitcher currentLocale={locale} />
                    </div>

                    <Button
                      className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                      asChild
                    >
                      <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      asChild
                    >
                      <a href={`tel:${siteConfig.contact.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {dict.contact.phone}
                      </a>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
