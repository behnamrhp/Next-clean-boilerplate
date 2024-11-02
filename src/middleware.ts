import { fallbackLng, languages } from "@/bootstrap/i18n/settings";
import { NextRequest, NextResponse } from "next/server";
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = languages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )
 
  if (pathnameHasLocale) return
 
  request.nextUrl.pathname = `/${fallbackLng}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}