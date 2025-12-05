import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SITE_PASSWORD = 'mkimmo'
const COOKIE_NAME = 'mkimmo_auth'
const COOKIE_VALUE = 'authenticated'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  if (password === SITE_PASSWORD) {
    const response = NextResponse.json({ success: true })

    // Cookie für 30 Tage setzen
    response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
      path: '/',
    })

    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
