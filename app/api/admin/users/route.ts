import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SupabaseUserService } from '@/lib/services/supabase/SupabaseUserService'

// Check if user is authenticated
async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const service = new SupabaseUserService()
    const users = await service.getAll()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Benutzer' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, password, fullName, role } = body

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    const service = new SupabaseUserService()
    const newUser = await service.create({ email, password, fullName, role })
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fehler beim Erstellen' },
      { status: 500 }
    )
  }
}
