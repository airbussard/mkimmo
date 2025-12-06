import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const COOKIE_NAME = 'mkimmo_auth'
const COOKIE_VALUE = 'authenticated'

// Pfade, die ohne Authentifizierung zugänglich sein sollen (Site-Auth)
const PUBLIC_PATHS = ['/login', '/api/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Statische Dateien durchlassen
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Admin-Bereich: Supabase Auth verwenden
  if (pathname.startsWith('/admin')) {
    return updateSession(request)
  }

  // Öffentliche Pfade durchlassen (für Site-Auth)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Site-Auth: Cookie prüfen
  const authCookie = request.cookies.get(COOKIE_NAME)

  if (authCookie?.value === COOKIE_VALUE) {
    return NextResponse.next()
  }

  // Nicht authentifiziert -> zur Login-Seite
  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
