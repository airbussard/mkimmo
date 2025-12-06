import { NextRequest, NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { testConnection } from '@/lib/email/mailer'
import { testImapConnection } from '@/lib/email/imap-client'

export async function GET() {
  try {
    const emailService = new SupabaseEmailService()
    const settings = await emailService.getSettings()

    if (!settings) {
      return NextResponse.json({
        settings: null,
        message: 'Keine E-Mail-Einstellungen gefunden',
      })
    }

    // Don't send password in response (mask it)
    return NextResponse.json({
      settings: {
        ...settings,
        smtpPassword: settings.smtpPassword ? '********' : '',
        imapPassword: settings.imapPassword ? '********' : '',
      },
    })
  } catch (error) {
    console.error('[Email Settings] GET error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      imapHost,
      imapPort,
      imapUser,
      imapPassword,
      fromEmail,
      fromName,
      isActive,
    } = body

    // Validate required fields
    if (!smtpHost || !smtpUser || !imapHost || !imapUser || !fromEmail) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen' },
        { status: 400 }
      )
    }

    const emailService = new SupabaseEmailService()

    // Get current settings to check if password changed
    const currentSettings = await emailService.getSettings()

    // Use existing password if not provided or masked
    const finalSmtpPassword =
      (!smtpPassword || smtpPassword === '********') && currentSettings
        ? currentSettings.smtpPassword
        : smtpPassword

    const finalImapPassword =
      (!imapPassword || imapPassword === '********') && currentSettings
        ? currentSettings.imapPassword
        : imapPassword

    const success = await emailService.updateSettings({
      smtpHost,
      smtpPort: smtpPort || 465,
      smtpUser,
      smtpPassword: finalSmtpPassword,
      imapHost,
      imapPort: imapPort || 993,
      imapUser,
      imapPassword: finalImapPassword,
      fromEmail,
      fromName: fromName || 'MK Immobilien',
      isActive: isActive ?? true,
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Einstellungen konnten nicht gespeichert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Einstellungen gespeichert',
    })
  } catch (error) {
    console.error('[Email Settings] PUT error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Test connection endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType } = body

    const emailService = new SupabaseEmailService()
    const settings = await emailService.getSettings()

    if (!settings) {
      return NextResponse.json(
        { error: 'Keine E-Mail-Einstellungen gefunden' },
        { status: 400 }
      )
    }

    if (testType === 'smtp') {
      const result = await testConnection(settings)
      return NextResponse.json({
        success: result.success,
        message: result.success ? 'SMTP-Verbindung erfolgreich' : result.error,
      })
    }

    if (testType === 'imap') {
      const result = await testImapConnection(settings)
      return NextResponse.json({
        success: result.success,
        message: result.success ? 'IMAP-Verbindung erfolgreich' : result.error,
      })
    }

    return NextResponse.json(
      { error: 'Ungültiger Testtyp' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Email Settings] POST error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
