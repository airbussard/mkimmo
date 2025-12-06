import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SupabaseUserService } from '@/lib/services/supabase/SupabaseUserService'

async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await params

  try {
    const service = new SupabaseUserService()
    const userData = await service.getById(id)

    if (!userData) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden des Benutzers' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const service = new SupabaseUserService()
    const updatedUser = await service.update(id, body)
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fehler beim Aktualisieren' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { id } = await params

  // Prevent self-deletion
  if (user.id === id) {
    return NextResponse.json(
      { error: 'Sie können sich nicht selbst löschen' },
      { status: 400 }
    )
  }

  try {
    const service = new SupabaseUserService()
    await service.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fehler beim Löschen' },
      { status: 500 }
    )
  }
}
