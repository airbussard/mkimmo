import { NextResponse } from 'next/server'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { SupabaseUserService } from '@/lib/services/supabase/SupabaseUserService'
import { ContactRequestType } from '@/types/contact'

const contactService = new SupabaseContactService()
const emailService = new SupabaseEmailService()
const userService = new SupabaseUserService()

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
      'makler_ersteinschaetzung',
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

    if (!result) {
      return NextResponse.json(
        { error: 'Fehler beim Erstellen der Anfrage' },
        { status: 500 }
      )
    }

    // Benachrichtigungs-E-Mails an alle aktiven Mitarbeiter senden
    try {
      console.log('[Contact API] Fetching active users for notifications...')
      const activeUsers = await userService.getActiveUsers()
      console.log(`[Contact API] Found ${activeUsers.length} active users:`, activeUsers.map(u => u.email))

      if (activeUsers.length > 0) {
        console.log('[Contact API] Queuing notification emails...')
        console.log('[Contact API] Contact request:', { id: result.id, ticketNumber: result.ticketNumber, name: result.name })
        const queued = await emailService.queueNotificationEmails(result, activeUsers)
        console.log(`[Contact API] Successfully queued ${queued} notification emails`)
      } else {
        console.log('[Contact API] No active users found, skipping notifications')
      }
    } catch (notifyError) {
      // Benachrichtigungsfehler sollen die Anfrage nicht fehlschlagen lassen
      console.error('[Contact API] Error sending notifications:', notifyError)
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating contact request:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der Anfrage' },
      { status: 500 }
    )
  }
}
