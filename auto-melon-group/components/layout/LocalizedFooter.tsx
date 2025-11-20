"use client"

import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Locale } from "@/types/i18n"
import type { Dictionary } from "@/types/i18n"

interface LocalizedFooterProps {
  locale: Locale
  dict: Dictionary
}

export function LocalizedFooter({ locale, dict }: LocalizedFooterProps) {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Auto Melon Group</h3>
            <p className="text-slate-400 text-sm">
              {locale === 'el'
                ? 'Ποιοτικά μεταχειρισμένα φορτηγά στην Κύπρο'
                : 'Quality used trucks in Cyprus'}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold mb-4">
              {locale === 'el' ? 'Σύνδεσμοι' : 'Links'}
            </h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/inventory`} className="hover:text-white transition-colors">
                  {dict.nav.inventory}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{dict.contact.title}</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>+357 99107227</li>
              <li>info@automelongroup.com</li>
              <li>{locale === 'el' ? 'Λεμεσός, Κύπρος' : 'Limassol, Cyprus'}</li>
            </ul>
          </div>

          {/* Language Switcher */}
          <div>
            <h4 className="font-semibold mb-4">
              {locale === 'el' ? 'Γλώσσα' : 'Language'}
            </h4>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>
            © 2024 Auto Melon Group.{' '}
            {locale === 'el' ? 'Όλα τα δικαιώματα διατηρούνται.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
