import { NextRequest, NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body

    const emailService = new SupabaseEmailService()

    if (action === 'retry') {
      const success = await emailService.retryQueueItem(id)
      if (!success) {
        return NextResponse.json(
          { error: 'Konnte E-Mail nicht zurücksetzen' },
          { status: 500 }
        )
      }
      return NextResponse.json({ success: true, message: 'E-Mail wird erneut versendet' })
    }

    return NextResponse.json({ error: 'Ungültige Aktion' }, { status: 400 })
  } catch (error) {
    console.error('[Email Queue API] PATCH error:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const emailService = new SupabaseEmailService()

    const success = await emailService.deleteQueueItem(id)
    if (!success) {
      return NextResponse.json(
        { error: 'Konnte E-Mail nicht löschen' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'E-Mail gelöscht' })
  } catch (error) {
    console.error('[Email Queue API] DELETE error:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
