import nodemailer from 'nodemailer'
import type { EmailSettings } from '@/types/email'

interface SendEmailOptions {
  to: string
  toName?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  messageId?: string
  inReplyTo?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export function createTransporter(settings: EmailSettings) {
  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpPort === 465,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPassword,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  })
}

export async function sendEmail(
  settings: EmailSettings,
  options: SendEmailOptions
): Promise<SendEmailResult> {
  try {
    const transporter = createTransporter(settings)

    const mailOptions: nodemailer.SendMailOptions = {
      from: {
        name: settings.fromName,
        address: settings.fromEmail,
      },
      to: options.toName
        ? { name: options.toName, address: options.to }
        : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
      replyTo: options.replyTo || settings.fromEmail,
    }

    // Message-ID für Threading
    if (options.messageId) {
      mailOptions.messageId = options.messageId
    }

    // In-Reply-To für Threading
    if (options.inReplyTo) {
      mailOptions.inReplyTo = options.inReplyTo
      mailOptions.references = options.inReplyTo
    }

    const result = await transporter.sendMail(mailOptions)

    console.log('[Email] Sent successfully:', {
      to: options.to,
      subject: options.subject,
      messageId: result.messageId,
    })

    return {
      success: true,
      messageId: result.messageId,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Email] Send failed:', errorMessage)

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function testConnection(settings: EmailSettings): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const transporter = createTransporter(settings)
    await transporter.verify()

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function generateMessageId(domain: string = 'moellerknabe.de'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `<${timestamp}.${random}@${domain}>`
}
