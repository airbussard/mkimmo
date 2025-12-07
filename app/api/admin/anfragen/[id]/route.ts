import { NextRequest, NextResponse } from 'next/server'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactService = new SupabaseContactService()
    const success = await contactService.delete(params.id)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Fehler beim Löschen' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Delete contact request error:', error)
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
