import type { Locale } from '@/types/i18n'

export const i18n = {
  defaultLocale: 'en' as Locale,
  locales: ['en', 'el'] as Locale[],
  localeDetection: true,
  localeCookie: 'NEXT_LOCALE',
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  el: 'Ελληνικά',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  el: '🇬🇷',
}
