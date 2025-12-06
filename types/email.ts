// E-Mail-Einstellungen (aus Datenbank)
export interface EmailSettings {
  id: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  imapHost: string
  imapPort: number
  imapUser: string
  imapPassword: string
  fromEmail: string
  fromName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// E-Mail-Queue Status
export type EmailQueueStatus = 'pending' | 'processing' | 'sent' | 'failed'

// E-Mail-Queue Typ
export type EmailQueueType = 'reply' | 'confirmation' | 'notification'

// E-Mail in der Queue
export interface EmailQueueItem {
  id: string
  contactRequestId?: string
  recipientEmail: string
  recipientName?: string
  subject: string
  contentHtml: string
  contentText?: string
  status: EmailQueueStatus
  type: EmailQueueType
  attempts: number
  maxAttempts: number
  lastAttemptAt?: string
  errorMessage?: string
  sentAt?: string
  createdAt: string
}

// Nachrichtenrichtung
export type EmailDirection = 'incoming' | 'outgoing'

// E-Mail-Nachricht (Konversation)
export interface EmailMessage {
  id: string
  contactRequestId: string
  direction: EmailDirection
  fromEmail: string
  fromName?: string
  toEmail: string
  subject?: string
  contentHtml?: string
  contentText?: string
  messageId?: string
  inReplyTo?: string
  readAt?: string
  createdAt: string
}

// Für das Erstellen neuer Queue-Einträge
export interface CreateEmailQueueItem {
  contactRequestId?: string
  recipientEmail: string
  recipientName?: string
  subject: string
  contentHtml: string
  contentText?: string
  type: EmailQueueType
}

// Für das Erstellen neuer Nachrichten
export interface CreateEmailMessage {
  contactRequestId: string
  direction: EmailDirection
  fromEmail: string
  fromName?: string
  toEmail: string
  subject?: string
  contentHtml?: string
  contentText?: string
  messageId?: string
  inReplyTo?: string
}

// Für das Aktualisieren der Einstellungen
export interface UpdateEmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  imapHost: string
  imapPort: number
  imapUser: string
  imapPassword: string
  fromEmail: string
  fromName: string
  isActive: boolean
}
