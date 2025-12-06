import { NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { sendEmail, generateMessageId } from '@/lib/email/mailer'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

export async function GET() {
  console.log('[Email Queue] Starting processing...')

  const emailService = new SupabaseEmailService()

  // Get email settings
  const settings = await emailService.getSettings()
  if (!settings || !settings.isActive) {
    console.log('[Email Queue] Email settings not configured or inactive')
    return NextResponse.json({
      success: false,
      message: 'Email settings not configured or inactive',
    })
  }

  // Get pending emails (max 10 per run)
  const pendingEmails = await emailService.getPendingEmails(10)

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
    // Mark as processing
    await emailService.updateQueueStatus(email.id, 'processing')

    try {
      const messageId = generateMessageId()

      const result = await sendEmail(settings, {
        to: email.recipientEmail,
        toName: email.recipientName,
        subject: email.subject,
        html: email.contentHtml,
        text: email.contentText,
        messageId,
      })

      if (result.success) {
        await emailService.updateQueueStatus(email.id, 'sent', {
          sentAt: new Date().toISOString(),
        })
        sent++
        console.log(`[Email Queue] Sent: ${email.subject} to ${email.recipientEmail}`)
      } else {
        // Check if max attempts reached
        if (email.attempts + 1 >= email.maxAttempts) {
          await emailService.updateQueueStatus(email.id, 'failed', {
            errorMessage: result.error,
          })
          failed++
          console.error(`[Email Queue] Failed (max attempts): ${email.subject}`)
        } else {
          // Reset to pending for retry
          await emailService.updateQueueStatus(email.id, 'pending', {
            errorMessage: result.error,
          })
          console.warn(`[Email Queue] Will retry: ${email.subject}`)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (email.attempts + 1 >= email.maxAttempts) {
        await emailService.updateQueueStatus(email.id, 'failed', {
          errorMessage,
        })
        failed++
      } else {
        await emailService.updateQueueStatus(email.id, 'pending', {
          errorMessage,
        })
      }

      console.error(`[Email Queue] Error processing ${email.id}:`, errorMessage)
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
