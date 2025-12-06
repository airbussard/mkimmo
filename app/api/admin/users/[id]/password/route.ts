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
    const { password } = body

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      )
    }

    const service = new SupabaseUserService()
    await service.updatePassword(id, password)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fehler beim Ändern des Passworts' },
      { status: 500 }
    )
  }
}
