import { createAdminClient } from '@/lib/supabase/admin'
import type {
  EmailSettings,
  EmailQueueItem,
  EmailMessage,
  CreateEmailQueueItem,
  CreateEmailMessage,
  EmailQueueStatus,
  UpdateEmailSettings,
} from '@/types/email'
import type { ContactRequest } from '@/types/contact'
import type { User } from '@/types/user'
import { notificationTemplate } from '@/lib/email/templates/notification'
import { CONTACT_REQUEST_TYPE_NAMEN } from '@/types/contact'

// ============================================
// Database Row Types
// ============================================

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
  created_at: string
  updated_at: string
}

interface EmailQueueRow {
  id: string
  contact_request_id: string | null
  recipient_email: string
  recipient_name: string | null
  subject: string
  content_html: string
  content_text: string | null
  status: string
  type: string
  attempts: number
  max_attempts: number
  last_attempt_at: string | null
  error_message: string | null
  sent_at: string | null
  created_at: string
}

interface EmailMessageRow {
  id: string
  contact_request_id: string
  direction: string
  from_email: string
  from_name: string | null
  to_email: string
  subject: string | null
  content_html: string | null
  content_text: string | null
  message_id: string | null
  in_reply_to: string | null
  read_at: string | null
  created_at: string
}

// ============================================
// Mappers
// ============================================

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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapQueueRow(row: EmailQueueRow): EmailQueueItem {
  return {
    id: row.id,
    contactRequestId: row.contact_request_id || undefined,
    recipientEmail: row.recipient_email,
    recipientName: row.recipient_name || undefined,
    subject: row.subject,
    contentHtml: row.content_html,
    contentText: row.content_text || undefined,
    status: row.status as EmailQueueStatus,
    type: row.type as 'reply' | 'confirmation' | 'notification',
    attempts: row.attempts,
    maxAttempts: row.max_attempts,
    lastAttemptAt: row.last_attempt_at || undefined,
    errorMessage: row.error_message || undefined,
    sentAt: row.sent_at || undefined,
    createdAt: row.created_at,
  }
}

function mapMessageRow(row: EmailMessageRow): EmailMessage {
  return {
    id: row.id,
    contactRequestId: row.contact_request_id,
    direction: row.direction as 'incoming' | 'outgoing',
    fromEmail: row.from_email,
    fromName: row.from_name || undefined,
    toEmail: row.to_email,
    subject: row.subject || undefined,
    contentHtml: row.content_html || undefined,
    contentText: row.content_text || undefined,
    messageId: row.message_id || undefined,
    inReplyTo: row.in_reply_to || undefined,
    readAt: row.read_at || undefined,
    createdAt: row.created_at,
  }
}

// ============================================
// Service Class
// ============================================

export class SupabaseEmailService {
  private getSupabase() {
    return createAdminClient()
  }

  // ============================================
  // Settings
  // ============================================

  async getSettings(): Promise<EmailSettings | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.error('[EmailService] Error fetching settings:', error)
      return null
    }

    return mapSettingsRow(data)
  }

  async updateSettings(settings: UpdateEmailSettings): Promise<boolean> {
    const supabase = this.getSupabase()

    // Erst existierenden aktiven Eintrag finden
    const { data: existing } = await supabase
      .from('email_settings')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('email_settings')
        .update({
          smtp_host: settings.smtpHost,
          smtp_port: settings.smtpPort,
          smtp_user: settings.smtpUser,
          smtp_password: settings.smtpPassword,
          imap_host: settings.imapHost,
          imap_port: settings.imapPort,
          imap_user: settings.imapUser,
          imap_password: settings.imapPassword,
          from_email: settings.fromEmail,
          from_name: settings.fromName,
          is_active: settings.isActive,
        })
        .eq('id', existing.id)

      if (error) {
        console.error('[EmailService] Error updating settings:', error)
        return false
      }
    } else {
      // Insert new
      const { error } = await supabase.from('email_settings').insert({
        smtp_host: settings.smtpHost,
        smtp_port: settings.smtpPort,
        smtp_user: settings.smtpUser,
        smtp_password: settings.smtpPassword,
        imap_host: settings.imapHost,
        imap_port: settings.imapPort,
        imap_user: settings.imapUser,
        imap_password: settings.imapPassword,
        from_email: settings.fromEmail,
        from_name: settings.fromName,
        is_active: settings.isActive,
      })

      if (error) {
        console.error('[EmailService] Error inserting settings:', error)
        return false
      }
    }

    return true
  }

  // ============================================
  // Queue
  // ============================================

  async queueEmail(item: CreateEmailQueueItem): Promise<EmailQueueItem | null> {
    const supabase = this.getSupabase()

    const { data, error } = await supabase
      .from('email_queue')
      .insert({
        contact_request_id: item.contactRequestId || null,
        recipient_email: item.recipientEmail,
        recipient_name: item.recipientName || null,
        subject: item.subject,
        content_html: item.contentHtml,
        content_text: item.contentText || null,
        type: item.type,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('[EmailService] Error queuing email:', error)
      return null
    }

    return data ? mapQueueRow(data) : null
  }

  async getPendingEmails(limit: number = 10): Promise<EmailQueueItem[]> {
    const supabase = this.getSupabase()

    console.log('[EmailService] Fetching pending emails...')

    const { data, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('[EmailService] Error fetching pending emails:', error)
      console.error('[EmailService] Error details:', JSON.stringify(error, null, 2))
      return []
    }

    console.log(`[EmailService] Found ${data?.length || 0} pending emails`)
    if (data && data.length > 0) {
      console.log('[EmailService] First pending email:', JSON.stringify(data[0], null, 2))
    }

    return (data || []).map(mapQueueRow)
  }

  /**
   * Atomisch pending E-Mails abrufen und als "processing" markieren.
   * Verhindert Race Conditions bei parallelen Cron-Job-Aufrufen.
   */
  async claimPendingEmails(limit: number = 10): Promise<EmailQueueItem[]> {
    const supabase = this.getSupabase()

    console.log('[EmailService] Claiming pending emails...')

    // Erst IDs der pending E-Mails holen
    const { data: pendingIds, error: selectError } = await supabase
      .from('email_queue')
      .select('id')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit)

    if (selectError || !pendingIds || pendingIds.length === 0) {
      if (selectError) {
        console.error('[EmailService] Error selecting pending emails:', selectError)
      }
      return []
    }

    const ids = pendingIds.map((row) => row.id)

    // Atomisch auf "processing" setzen und zurückgeben
    const { data, error } = await supabase
      .from('email_queue')
      .update({
        status: 'processing',
        last_attempt_at: new Date().toISOString(),
      })
      .in('id', ids)
      .eq('status', 'pending') // Nur wenn noch pending (Race Condition Schutz)
      .select()

    if (error) {
      console.error('[EmailService] Error claiming emails:', error)
      return []
    }

    console.log(`[EmailService] Claimed ${data?.length || 0} emails for processing`)

    return (data || []).map(mapQueueRow)
  }

  async updateQueueStatus(
    id: string,
    status: EmailQueueStatus,
    options?: {
      errorMessage?: string
      sentAt?: string
    }
  ): Promise<boolean> {
    const supabase = this.getSupabase()

    const updateData: Record<string, unknown> = {
      status,
      last_attempt_at: new Date().toISOString(),
    }

    if (status === 'failed' && options?.errorMessage) {
      updateData.error_message = options.errorMessage
    }

    if (status === 'sent' && options?.sentAt) {
      updateData.sent_at = options.sentAt
    }

    // Increment attempts
    const { data: current } = await supabase
      .from('email_queue')
      .select('attempts')
      .eq('id', id)
      .single()

    if (current) {
      updateData.attempts = current.attempts + 1
    }

    const { error } = await supabase
      .from('email_queue')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('[EmailService] Error updating queue status:', error)
      return false
    }

    return true
  }

  // ============================================
  // Messages
  // ============================================

  async createMessage(message: CreateEmailMessage): Promise<EmailMessage | null> {
    const supabase = this.getSupabase()

    const { data, error } = await supabase
      .from('email_messages')
      .insert({
        contact_request_id: message.contactRequestId,
        direction: message.direction,
        from_email: message.fromEmail,
        from_name: message.fromName || null,
        to_email: message.toEmail,
        subject: message.subject || null,
        content_html: message.contentHtml || null,
        content_text: message.contentText || null,
        message_id: message.messageId || null,
        in_reply_to: message.inReplyTo || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[EmailService] Error creating message:', error)
      return null
    }

    return data ? mapMessageRow(data) : null
  }

  async getMessagesByContactRequest(contactRequestId: string): Promise<EmailMessage[]> {
    const supabase = this.getSupabase()

    const { data, error } = await supabase
      .from('email_messages')
      .select('*')
      .eq('contact_request_id', contactRequestId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[EmailService] Error fetching messages:', error)
      return []
    }

    return (data || []).map(mapMessageRow)
  }

  async getLastMessageByContactRequest(contactRequestId: string): Promise<EmailMessage | null> {
    const supabase = this.getSupabase()

    const { data, error } = await supabase
      .from('email_messages')
      .select('*')
      .eq('contact_request_id', contactRequestId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return null
    }

    return mapMessageRow(data)
  }

  // ============================================
  // Notifications
  // ============================================

  async queueNotificationEmails(
    contactRequest: ContactRequest,
    recipients: User[],
    baseUrl: string = 'https://moellerknabe.de'
  ): Promise<number> {
    const supabase = this.getSupabase()
    const typeName = CONTACT_REQUEST_TYPE_NAMEN[contactRequest.type] || 'Anfrage'
    let queued = 0

    for (const recipient of recipients) {
      // Duplikat-Prüfung: Bereits eine pending/processing Notification für diese Anfrage + Empfänger?
      const { data: existing } = await supabase
        .from('email_queue')
        .select('id')
        .eq('contact_request_id', contactRequest.id)
        .eq('recipient_email', recipient.email)
        .eq('type', 'notification')
        .in('status', ['pending', 'processing'])
        .limit(1)

      if (existing && existing.length > 0) {
        console.log(
          `[EmailService] Notification already queued for ${recipient.email}, skipping`
        )
        continue
      }

      const adminUrl = `${baseUrl}/admin/anfragen/${contactRequest.id}`

      const html = notificationTemplate({
        ticketNumber: contactRequest.ticketNumber,
        requestType: contactRequest.type,
        senderName: contactRequest.name,
        senderEmail: contactRequest.email,
        senderPhone: contactRequest.phone,
        messagePreview: contactRequest.message,
        adminUrl,
      })

      const { error } = await supabase
        .from('email_queue')
        .insert({
          contact_request_id: contactRequest.id,
          recipient_email: recipient.email,
          recipient_name: recipient.fullName,
          subject: `Neue ${typeName} von ${contactRequest.name}`,
          content_html: html,
          content_text: `Neue ${typeName} von ${contactRequest.name} (${contactRequest.email}). Zur Anfrage: ${adminUrl}`,
          type: 'notification',
          status: 'pending',
        })

      if (error) {
        console.error(`[EmailService] Error queuing notification for ${recipient.email}:`, error)
      } else {
        queued++
      }
    }

    console.log(`[EmailService] Queued ${queued} notification emails for request ${contactRequest.id}`)
    return queued
  }

  // ============================================
  // Queue Management (Admin)
  // ============================================

  async getQueueStats(): Promise<{
    total: number
    pending: number
    processing: number
    sent: number
    failed: number
  }> {
    const supabase = this.getSupabase()

    const { data, error } = await supabase
      .from('email_queue')
      .select('status')

    if (error || !data) {
      console.error('[EmailService] Error fetching queue stats:', error)
      return { total: 0, pending: 0, processing: 0, sent: 0, failed: 0 }
    }

    return {
      total: data.length,
      pending: data.filter((d) => d.status === 'pending').length,
      processing: data.filter((d) => d.status === 'processing').length,
      sent: data.filter((d) => d.status === 'sent').length,
      failed: data.filter((d) => d.status === 'failed').length,
    }
  }

  async getQueueItems(filter?: {
    status?: EmailQueueStatus
    limit?: number
  }): Promise<EmailQueueItem[]> {
    const supabase = this.getSupabase()

    let query = supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter?.status) {
      query = query.eq('status', filter.status)
    }

    if (filter?.limit) {
      query = query.limit(filter.limit)
    } else {
      query = query.limit(100)
    }

    const { data, error } = await query

    if (error) {
      console.error('[EmailService] Error fetching queue items:', error)
      return []
    }

    return (data || []).map(mapQueueRow)
  }

  async retryQueueItem(id: string): Promise<boolean> {
    const supabase = this.getSupabase()

    const { error } = await supabase
      .from('email_queue')
      .update({
        status: 'pending',
        attempts: 0,
        error_message: null,
        last_attempt_at: null,
      })
      .eq('id', id)

    if (error) {
      console.error('[EmailService] Error retrying queue item:', error)
      return false
    }

    return true
  }

  async deleteQueueItem(id: string): Promise<boolean> {
    const supabase = this.getSupabase()

    const { error } = await supabase.from('email_queue').delete().eq('id', id)

    if (error) {
      console.error('[EmailService] Error deleting queue item:', error)
      return false
    }

    return true
  }
}
