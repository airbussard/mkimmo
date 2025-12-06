import { NextRequest, NextResponse } from 'next/server'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import { ContactRequestStatus } from '@/types/contact'

const VALID_STATUSES: ContactRequestStatus[] = ['neu', 'in_bearbeitung', 'erledigt']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: 'Ungültiger Status' },
        { status: 400 }
      )
    }

    const contactService = new SupabaseContactService()
    const success = await contactService.updateStatus(id, body.status)

    if (!success) {
      return NextResponse.json(
        { error: 'Status konnte nicht aktualisiert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
