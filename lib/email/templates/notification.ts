import { baseTemplate } from './base'
import { CONTACT_REQUEST_TYPE_NAMEN, type ContactRequestType } from '@/types/contact'

interface NotificationTemplateOptions {
  requestId: string
  requestType: ContactRequestType
  senderName: string
  senderEmail: string
  senderPhone?: string
  messagePreview?: string
  adminUrl: string
}

export function notificationTemplate(options: NotificationTemplateOptions): string {
  const {
    requestId,
    requestType,
    senderName,
    senderEmail,
    senderPhone,
    messagePreview,
    adminUrl,
  } = options

  const typeName = CONTACT_REQUEST_TYPE_NAMEN[requestType] || 'Anfrage'
  const truncatedMessage = messagePreview
    ? messagePreview.length > 200
      ? messagePreview.substring(0, 200) + '...'
      : messagePreview
    : null

  const content = `
    <p><strong>Neue Anfrage eingegangen!</strong></p>

    <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; color: #92400e; font-weight: 500;">
        ${typeName}
      </p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name:</td>
        <td style="padding: 8px 0; font-weight: 500;">${senderName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">E-Mail:</td>
        <td style="padding: 8px 0;">
          <a href="mailto:${senderEmail}" style="color: #1e3a5f;">${senderEmail}</a>
        </td>
      </tr>
      ${senderPhone ? `
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Telefon:</td>
        <td style="padding: 8px 0;">
          <a href="tel:${senderPhone}" style="color: #1e3a5f;">${senderPhone}</a>
        </td>
      </tr>
      ` : ''}
    </table>

    ${truncatedMessage ? `
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Nachricht:</p>
      <p style="margin: 0; color: #374151;">${truncatedMessage}</p>
    </div>
    ` : ''}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${adminUrl}" class="button" style="display: inline-block; padding: 14px 28px; background-color: #1e3a5f; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500;">
        Anfrage bearbeiten
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Anfrage-ID: ${requestId}
    </p>
  `

  return baseTemplate(content, {
    previewText: `Neue ${typeName} von ${senderName}`,
  })
}
