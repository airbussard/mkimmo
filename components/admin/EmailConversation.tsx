'use client'

import { useState, useRef, useEffect } from 'react'
import { Mail, ArrowUpRight, ArrowDownLeft, Maximize2, Minimize2 } from 'lucide-react'
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

// Component to render HTML emails in an isolated iframe
function HtmlEmailContent({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(200)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const updateHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc?.body) {
          const newHeight = doc.body.scrollHeight + 20
          setHeight(Math.min(newHeight, isExpanded ? 2000 : 400))
        }
      } catch {
        // Cross-origin issues, use default height
      }
    }

    iframe.onload = updateHeight
    // Also try after a short delay for slower rendering
    const timer = setTimeout(updateHeight, 500)

    return () => clearTimeout(timer)
  }, [html, isExpanded])

  // Wrap HTML with basic styles for better rendering
  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #374151;
          word-wrap: break-word;
        }
        img { max-width: 100%; height: auto; }
        a { color: #1e3a5f; }
        table { max-width: 100%; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        srcDoc={wrappedHtml}
        className="w-full border-0 rounded bg-white"
        style={{ height: `${height}px`, minHeight: '100px' }}
        sandbox="allow-same-origin"
        title="E-Mail-Inhalt"
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 p-1 bg-white/80 rounded hover:bg-white shadow-sm"
        title={isExpanded ? 'Verkleinern' : 'Vergrößern'}
      >
        {isExpanded ? (
          <Minimize2 className="h-4 w-4 text-secondary-600" />
        ) : (
          <Maximize2 className="h-4 w-4 text-secondary-600" />
        )}
      </button>
    </div>
  )
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
            {message.contentHtml ? (
              <HtmlEmailContent html={message.contentHtml} />
            ) : message.contentText ? (
              <p className="whitespace-pre-wrap">{message.contentText}</p>
            ) : (
              <p className="italic text-secondary-400">Kein Inhalt</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
