import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { i18n } from './config/i18n'
import { detectLocale } from './lib/i18n/locale-detector'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files, API routes, and admin routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') // files with extensions
  ) {
    // For API and admin routes, still update Supabase session
    if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
      return await updateSession(request)
    }
    return NextResponse.next()
  }

  // Check if pathname already has locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Update Supabase session and continue
    return await updateSession(request)
  }

  // Redirect to locale-prefixed URL
  const locale = detectLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  // Preserve search params
  newUrl.search = request.nextUrl.search

  const response = NextResponse.redirect(newUrl)

  // Set locale cookie
  response.cookies.set(i18n.localeCookie, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
