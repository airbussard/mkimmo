import { NextRequest, NextResponse } from 'next/server'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (typeof body.notes !== 'string') {
      return NextResponse.json(
        { error: 'Notizen müssen ein Text sein' },
        { status: 400 }
      )
    }

    const contactService = new SupabaseContactService()
    const success = await contactService.updateNotes(id, body.notes)

    if (!success) {
      return NextResponse.json(
        { error: 'Notizen konnten nicht gespeichert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notes update error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
