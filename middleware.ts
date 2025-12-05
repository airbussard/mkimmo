import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'mkimmo_auth'
const COOKIE_VALUE = 'authenticated'

// Pfade, die ohne Authentifizierung zugänglich sein sollen
const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Statische Dateien und API-Routen (außer /api/auth) durchlassen
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Öffentliche Pfade durchlassen
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Auth-Cookie prüfen
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
