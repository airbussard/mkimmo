import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Maximum allowed cookie header size (nginx default is ~4KB, we use 3KB to be safe)
const MAX_COOKIE_SIZE = 3000

export async function updateSession(request: NextRequest) {
  // Protect admin routes - check path first before Supabase call
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if cookies are too large and clear them if necessary
  const cookieHeader = request.headers.get('cookie') || ''
  if (cookieHeader.length > MAX_COOKIE_SIZE) {
    console.log('[Admin Middleware] Cookie header too large, clearing Supabase cookies')

    // Clear all Supabase auth cookies
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    const supabaseCookies = request.cookies.getAll().filter(c =>
      c.name.startsWith('sb-') || c.name.includes('supabase')
    )
    supabaseCookies.forEach(cookie => {
      response.cookies.delete(cookie.name)
    })
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Debug logging
  console.log('[Admin Middleware]', {
    pathname,
    isLoginPage,
    hasUser: !!user,
  })

  // Login page: allow access if not logged in, redirect to admin if logged in
  if (isLoginPage) {
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // Not logged in - show login page (no redirect!)
    return supabaseResponse
  }

  // All other admin pages: require authentication
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return supabaseResponse
}
