import { baseTemplate } from './base'

interface ReplyTemplateOptions {
  recipientName: string
  message: string
  ticketNumber: number
  senderName?: string
}

export function replyTemplate(options: ReplyTemplateOptions): string {
  const { recipientName, message, ticketNumber, senderName } = options

  // Formatiere Nachricht mit Zeilenumbrüchen
  const formattedMessage = message
    .split('\n')
    .map((line) => `<p style="margin: 0 0 8px 0;">${line || '&nbsp;'}</p>`)
    .join('')

  const content = `
    ${formattedMessage}

    <div class="divider"></div>

    <p style="color: #6b7280; font-size: 14px;">
      Mit freundlichen Grüßen,<br>
      ${senderName || 'Ihr Team von MK Immobilien'}
    </p>

    <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
      Anfrage-Referenz: [ANFRAGE-${ticketNumber}]<br>
      Bitte beziehen Sie sich bei Rückfragen auf diese Referenz.
    </p>
  `

  return baseTemplate(content, {
    previewText: `Antwort auf Ihre Anfrage - ${message.substring(0, 100)}...`,
  })
}

interface ConfirmationTemplateOptions {
  name: string
  requestType: string
  ticketNumber: number
}

export function confirmationTemplate(options: ConfirmationTemplateOptions): string {
  const { name, requestType, ticketNumber } = options

  const content = `
    <p>
      Vielen Dank für Ihre ${requestType}. Wir haben Ihre Anfrage erhalten und werden uns
      schnellstmöglich bei Ihnen melden.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0; color: #166534;">
        <strong>Ihre Anfrage wurde erfolgreich übermittelt.</strong>
      </p>
    </div>

    <p>
      In der Regel antworten wir innerhalb von 24 Stunden (an Werktagen).
      Bei dringenden Anliegen erreichen Sie uns auch telefonisch.
    </p>

    <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
      Mit freundlichen Grüßen,<br>
      Ihr Team von MK Immobilien
    </p>

    <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
      Anfrage-Referenz: [ANFRAGE-${ticketNumber}]
    </p>
  `

  return baseTemplate(content, {
    previewText: `Vielen Dank für Ihre Anfrage - Wir melden uns bei Ihnen.`,
  })
}
