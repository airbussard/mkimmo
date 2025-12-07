import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, generateMessageId } from '@/lib/email/mailer'
import type { EmailSettings } from '@/types/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

interface EmailSettingsRow {
  id: string
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_password: string
  imap_host: string
  imap_port: number
  imap_user: string
  imap_password: string
  from_email: string
  from_name: string
  is_active: boolean
}

interface EmailQueueRow {
  id: string
  recipient_email: string
  recipient_name: string | null
  subject: string
  content_html: string
  content_text: string | null
  status: string
  attempts: number
  max_attempts: number
}

function mapSettingsRow(row: EmailSettingsRow): EmailSettings {
  return {
    id: row.id,
    smtpHost: row.smtp_host,
    smtpPort: row.smtp_port,
    smtpUser: row.smtp_user,
    smtpPassword: row.smtp_password,
    imapHost: row.imap_host,
    imapPort: row.imap_port,
    imapUser: row.imap_user,
    imapPassword: row.imap_password,
    fromEmail: row.from_email,
    fromName: row.from_name,
    isActive: row.is_active,
    createdAt: '',
    updatedAt: '',
  }
}

export async function GET() {
  console.log('[Email Queue] Starting processing...')

  const supabase = createAdminClient()

  // Get email settings
  const { data: settingsData, error: settingsError } = await supabase
    .from('email_settings')
    .select('*')
    .eq('is_active', true)
    .single()

  if (settingsError || !settingsData) {
    console.log('[Email Queue] Email settings not configured or inactive')
    return NextResponse.json({
      success: false,
      message: 'Email settings not configured or inactive',
    })
  }

  const settings = mapSettingsRow(settingsData)

  // Get pending emails (FlightHourWeb pattern: simple select with attempts filter)
  const { data: pendingEmails, error: fetchError } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .lt('attempts', 3)
    .order('created_at', { ascending: true })
    .limit(10)

  if (fetchError) {
    console.error('[Email Queue] Error fetching emails:', fetchError)
    return NextResponse.json({
      success: false,
      error: fetchError.message,
    })
  }

  if (!pendingEmails || pendingEmails.length === 0) {
    console.log('[Email Queue] No pending emails')
    return NextResponse.json({
      success: true,
      processed: 0,
      message: 'No pending emails',
    })
  }

  console.log(`[Email Queue] Processing ${pendingEmails.length} emails`)

  let sent = 0
  let failed = 0

  for (const email of pendingEmails as EmailQueueRow[]) {
    console.log(`[Email Queue] Processing ${email.id} (attempt ${email.attempts + 1}/3)`)

    try {
      // Mark as processing
      await supabase
        .from('email_queue')
        .update({
          status: 'processing',
          last_attempt_at: new Date().toISOString(),
          attempts: email.attempts + 1,
        })
        .eq('id', email.id)

      const messageId = generateMessageId()

      const result = await sendEmail(settings, {
        to: email.recipient_email,
        toName: email.recipient_name || undefined,
        subject: email.subject,
        html: email.content_html,
        text: email.content_text || undefined,
        messageId,
      })

      console.log(`[Email Queue] sendEmail result:`, JSON.stringify(result))

      if (result.success) {
        // Mark as sent (FlightHourWeb pattern)
        const { error: updateError } = await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            error_message: null,
          })
          .eq('id', email.id)

        if (updateError) {
          console.error('[Email Queue] Error updating to sent:', updateError)
        } else {
          sent++
          console.log(`[Email Queue] ✓ Sent: ${email.subject} to ${email.recipient_email}`)
        }
      } else {
        // Check if max attempts reached
        const newAttempts = email.attempts + 1
        if (newAttempts >= email.max_attempts) {
          await supabase
            .from('email_queue')
            .update({
              status: 'failed',
              error_message: result.error,
            })
            .eq('id', email.id)
          failed++
          console.error(`[Email Queue] Failed (max attempts): ${email.subject}`)
        } else {
          // Reset to pending for retry
          await supabase
            .from('email_queue')
            .update({
              status: 'pending',
              error_message: result.error,
            })
            .eq('id', email.id)
          console.warn(`[Email Queue] Will retry: ${email.subject}`)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[Email Queue] Exception for ${email.id}:`, errorMessage)

      const newAttempts = email.attempts + 1
      if (newAttempts >= email.max_attempts) {
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error_message: errorMessage,
          })
          .eq('id', email.id)
        failed++
      } else {
        await supabase
          .from('email_queue')
          .update({
            status: 'pending',
            error_message: errorMessage,
          })
          .eq('id', email.id)
      }
    }
  }

  console.log(`[Email Queue] Completed. Sent: ${sent}, Failed: ${failed}`)

  return NextResponse.json({
    success: true,
    processed: pendingEmails.length,
    sent,
    failed,
  })
}
