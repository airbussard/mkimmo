'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmailReplyFormProps {
  requestId: string
  ticketNumber: number
  recipientName: string
  recipientEmail: string
}

export function EmailReplyForm({
  requestId,
  ticketNumber,
  recipientName,
  recipientEmail,
}: EmailReplyFormProps) {
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState(`Re: Ihre Anfrage [ANFRAGE-${ticketNumber}]`)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/anfragen/${requestId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, subject }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Senden')
      }

      setSuccess(true)
      setMessage('')
      router.refresh()

      // Reset success after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          An
        </label>
        <p className="text-secondary-900">
          {recipientName} &lt;{recipientEmail}&gt;
        </p>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-secondary-700 mb-1"
        >
          Betreff
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-secondary-700 mb-1"
        >
          Nachricht
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
          placeholder="Ihre Antwort..."
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          E-Mail wurde in die Warteschlange aufgenommen und wird in Kürze gesendet.
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !message.trim()}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Antwort senden
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
