import { NextRequest, NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import { replyTemplate } from '@/lib/email/templates/reply'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { message, subject } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nachricht ist erforderlich' },
        { status: 400 }
      )
    }

    // Get contact request
    const contactService = new SupabaseContactService()
    const contactRequest = await contactService.getById(id)

    if (!contactRequest) {
      return NextResponse.json(
        { error: 'Anfrage nicht gefunden' },
        { status: 404 }
      )
    }

    // Get email settings
    const emailService = new SupabaseEmailService()
    const settings = await emailService.getSettings()

    if (!settings || !settings.isActive) {
      return NextResponse.json(
        { error: 'E-Mail-Einstellungen nicht konfiguriert' },
        { status: 500 }
      )
    }

    // Generate email content
    const emailSubject = subject || `Re: Ihre Anfrage [ANFRAGE-${id}]`
    const emailHtml = replyTemplate({
      recipientName: contactRequest.name,
      message: message.trim(),
      requestId: id,
      senderName: settings.fromName,
    })

    // Queue the email
    const queuedEmail = await emailService.queueEmail({
      contactRequestId: id,
      recipientEmail: contactRequest.email,
      recipientName: contactRequest.name,
      subject: emailSubject,
      contentHtml: emailHtml,
      contentText: message.trim(),
      type: 'reply',
    })

    if (!queuedEmail) {
      return NextResponse.json(
        { error: 'E-Mail konnte nicht in die Warteschlange aufgenommen werden' },
        { status: 500 }
      )
    }

    // Save as outgoing message
    await emailService.createMessage({
      contactRequestId: id,
      direction: 'outgoing',
      fromEmail: settings.fromEmail,
      fromName: settings.fromName,
      toEmail: contactRequest.email,
      subject: emailSubject,
      contentHtml: emailHtml,
      contentText: message.trim(),
    })

    // Update status to 'in_bearbeitung'
    await contactService.updateStatus(id, 'in_bearbeitung')

    return NextResponse.json({
      success: true,
      message: 'E-Mail wurde in die Warteschlange aufgenommen',
      queueId: queuedEmail.id,
    })
  } catch (error) {
    console.error('[Reply API] Error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
