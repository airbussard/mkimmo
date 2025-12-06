import { Mail, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { EmailMessage } from '@/types/email'

interface EmailConversationProps {
  messages: EmailMessage[]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EmailConversation({ messages }: EmailConversationProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Noch keine E-Mail-Kommunikation</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg border ${
            message.direction === 'outgoing'
              ? 'bg-primary-50 border-primary-200 ml-4'
              : 'bg-secondary-50 border-secondary-200 mr-4'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {message.direction === 'outgoing' ? (
                <ArrowUpRight className="h-4 w-4 text-primary-600" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-secondary-600" />
              )}
              <span className="text-sm font-medium">
                {message.direction === 'outgoing' ? 'Gesendet an' : 'Empfangen von'}:{' '}
                {message.direction === 'outgoing' ? message.toEmail : message.fromEmail}
              </span>
            </div>
            <span className="text-xs text-secondary-500">
              {formatDate(message.createdAt)}
            </span>
          </div>

          {/* Subject */}
          {message.subject && (
            <p className="text-sm font-medium text-secondary-700 mb-2">
              {message.subject}
            </p>
          )}

          {/* Content */}
          <div className="text-sm text-secondary-600">
            {message.contentText ? (
              <p className="whitespace-pre-wrap">{message.contentText}</p>
            ) : message.contentHtml ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: message.contentHtml }}
              />
            ) : (
              <p className="italic text-secondary-400">Kein Inhalt</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
