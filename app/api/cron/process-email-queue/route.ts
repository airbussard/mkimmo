import { NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { sendEmail, generateMessageId } from '@/lib/email/mailer'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

export async function GET() {
  console.log('[Email Queue] Starting processing...')
  console.log('[Email Queue] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('[Email Queue] SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('[Email Queue] SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)

  const emailService = new SupabaseEmailService()

  // Cleanup: Stuck "processing" E-Mails zurücksetzen (älter als 5 Minuten)
  const resetCount = await emailService.resetStuckProcessingEmails(5)
  if (resetCount > 0) {
    console.log(`[Email Queue] Reset ${resetCount} stuck processing emails`)
  }

  // Get email settings
  const settings = await emailService.getSettings()
  if (!settings || !settings.isActive) {
    console.log('[Email Queue] Email settings not configured or inactive')
    return NextResponse.json({
      success: false,
      message: 'Email settings not configured or inactive',
    })
  }

  // Atomisch pending E-Mails holen und als "processing" markieren
  // Das verhindert Race Conditions bei parallelen Cron-Job-Aufrufen
  const pendingEmails = await emailService.claimPendingEmails(10)

  if (pendingEmails.length === 0) {
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

  for (const email of pendingEmails) {
    console.log(`[Email Queue] Processing email ${email.id} to ${email.recipientEmail}...`)

    try {
      console.log(`[Email Queue] Generating messageId...`)
      const messageId = generateMessageId()

      console.log(`[Email Queue] Calling sendEmail...`)
      const result = await sendEmail(settings, {
        to: email.recipientEmail,
        toName: email.recipientName,
        subject: email.subject,
        html: email.contentHtml,
        text: email.contentText,
        messageId,
      })

      console.log(`[Email Queue] sendEmail result:`, JSON.stringify(result))

      if (result.success) {
        console.log(`[Email Queue] Updating status to sent...`)
        await emailService.updateQueueStatus(email.id, 'sent', {
          sentAt: new Date().toISOString(),
        })
        sent++
        console.log(`[Email Queue] ✓ Sent: ${email.subject} to ${email.recipientEmail}`)
      } else {
        console.log(`[Email Queue] Send failed: ${result.error}`)
        // Check if max attempts reached
        if (email.attempts + 1 >= email.maxAttempts) {
          console.log(`[Email Queue] Max attempts reached, marking as failed`)
          await emailService.updateQueueStatus(email.id, 'failed', {
            errorMessage: result.error,
          })
          failed++
        } else {
          console.log(`[Email Queue] Resetting to pending for retry`)
          await emailService.updateQueueStatus(email.id, 'pending', {
            errorMessage: result.error,
          })
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[Email Queue] Exception for ${email.id}:`, errorMessage)

      // Bei Exception: IMMER auf pending zurücksetzen für Retry (außer max attempts erreicht)
      if (email.attempts + 1 >= email.maxAttempts) {
        console.log(`[Email Queue] Max attempts reached, marking as failed`)
        await emailService.updateQueueStatus(email.id, 'failed', {
          errorMessage,
        })
        failed++
      } else {
        console.log(`[Email Queue] Resetting to pending for retry`)
        await emailService.updateQueueStatus(email.id, 'pending', {
          errorMessage,
        })
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
