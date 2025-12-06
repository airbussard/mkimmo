import { NextRequest, NextResponse } from 'next/server'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import { fetchUnreadEmails, extractRequestIdFromSubject } from '@/lib/email/imap-client'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

export async function GET(request: NextRequest) {
  // Verify cron secret
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Email Fetch] Starting...')

  const emailService = new SupabaseEmailService()
  const contactService = new SupabaseContactService()

  // Get email settings
  const settings = await emailService.getSettings()
  if (!settings || !settings.isActive) {
    console.log('[Email Fetch] Email settings not configured or inactive')
    return NextResponse.json({
      success: false,
      message: 'Email settings not configured or inactive',
    })
  }

  try {
    // Fetch unread emails from IMAP
    const emails = await fetchUnreadEmails(settings)

    if (emails.length === 0) {
      console.log('[Email Fetch] No new emails')
      return NextResponse.json({
        success: true,
        fetched: 0,
        message: 'No new emails',
      })
    }

    console.log(`[Email Fetch] Found ${emails.length} new emails`)

    let processed = 0
    let newRequests = 0
    let replies = 0

    for (const email of emails) {
      try {
        // Try to extract request ID from subject
        const requestId = extractRequestIdFromSubject(email.subject)

        if (requestId) {
          // This is a reply to an existing request
          const existingRequest = await contactService.getById(requestId)

          if (existingRequest) {
            // Save as email message
            await emailService.createMessage({
              contactRequestId: requestId,
              direction: 'incoming',
              fromEmail: email.from.email,
              fromName: email.from.name,
              toEmail: email.to,
              subject: email.subject,
              contentHtml: email.contentHtml,
              contentText: email.contentText,
              messageId: email.messageId,
              inReplyTo: email.inReplyTo,
            })

            // Update request status to 'neu' (new message received)
            await contactService.updateStatus(requestId, 'neu')

            replies++
            console.log(`[Email Fetch] Reply to request ${requestId}`)
          }
        } else {
          // New email - create a new contact request
          const newRequest = await contactService.create({
            type: 'allgemein',
            name: email.from.name || email.from.email,
            email: email.from.email,
            message: email.contentText || email.subject,
            metadata: {
              source: 'email',
              originalSubject: email.subject,
            },
          })

          if (newRequest) {
            // Save as email message
            await emailService.createMessage({
              contactRequestId: newRequest.id,
              direction: 'incoming',
              fromEmail: email.from.email,
              fromName: email.from.name,
              toEmail: email.to,
              subject: email.subject,
              contentHtml: email.contentHtml,
              contentText: email.contentText,
              messageId: email.messageId,
            })

            newRequests++
            console.log(`[Email Fetch] New request from ${email.from.email}`)
          }
        }

        processed++
      } catch (emailError) {
        console.error('[Email Fetch] Error processing email:', emailError)
      }
    }

    console.log(
      `[Email Fetch] Completed. Processed: ${processed}, New: ${newRequests}, Replies: ${replies}`
    )

    return NextResponse.json({
      success: true,
      fetched: emails.length,
      processed,
      newRequests,
      replies,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Email Fetch] Error:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
