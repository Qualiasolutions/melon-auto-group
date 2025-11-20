import { NextRequest } from 'next/server'
import { i18n } from '@/config/i18n'
import type { Locale } from '@/types/i18n'

export function detectLocale(request: NextRequest): Locale {
  // 1. Check cookie preference
  const cookieLocale = request.cookies.get(i18n.localeCookie)?.value as Locale
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 2. Check Accept-Language header (Cyprus = el-CY, Greece = el-GR)
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Prioritize Greek for Cyprus and Greece
    if (
      acceptLanguage.includes('el-CY') ||
      acceptLanguage.includes('el-GR') ||
      acceptLanguage.includes('el')
    ) {
      return 'el'
    }
  }

  // 3. Default to English
  return i18n.defaultLocale
}
