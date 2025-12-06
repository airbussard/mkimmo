import { NextResponse } from 'next/server'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import { ContactRequestType } from '@/types/contact'

const contactService = new SupabaseContactService()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validierung
    if (!body.type || !body.name || !body.email) {
      return NextResponse.json(
        { error: 'Typ, Name und E-Mail sind erforderlich' },
        { status: 400 }
      )
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Ungültiges E-Mail-Format' },
        { status: 400 }
      )
    }

    // Typ validieren
    const validTypes: ContactRequestType[] = [
      'allgemein',
      'makler_kontakt',
      'makler_anfrage',
      'makler_verkauf',
      'hv_kontakt',
      'hv_anfrage',
    ]

    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: 'Ungültiger Anfrage-Typ' },
        { status: 400 }
      )
    }

    // Anfrage erstellen
    const result = await contactService.create({
      type: body.type,
      name: body.name,
      email: body.email,
      phone: body.phone || undefined,
      message: body.message || undefined,
      metadata: body.metadata || undefined,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating contact request:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der Anfrage' },
      { status: 500 }
    )
  }
}
