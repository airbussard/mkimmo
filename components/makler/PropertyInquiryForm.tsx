'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PropertyInquiryFormProps {
  propertyId: string
  propertyTitle: string
}

export function PropertyInquiryForm({ propertyId, propertyTitle }: PropertyInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefon: '',
    nachricht: '',
    datenschutz: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'makler_anfrage',
          name: formData.name,
          email: formData.email,
          phone: formData.telefon || undefined,
          message: formData.nachricht || undefined,
          metadata: {
            propertyId,
            propertyTitle,
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Fehler beim Senden')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Anfrage gesendet!
            </h3>
            <p className="text-sm text-secondary-600">
              Wir melden uns schnellstmöglich bei Ihnen.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Anfrage senden</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inquiry-name">Name *</Label>
            <Input
              id="inquiry-name"
              placeholder="Ihr Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-email">E-Mail *</Label>
            <Input
              id="inquiry-email"
              type="email"
              placeholder="ihre@email.de"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-telefon">Telefon</Label>
            <Input
              id="inquiry-telefon"
              type="tel"
              placeholder="+49 ..."
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-nachricht">Nachricht</Label>
            <textarea
              id="inquiry-nachricht"
              rows={3}
              placeholder="Ihre Fragen zu dieser Immobilie..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.nachricht}
              onChange={(e) => setFormData({ ...formData, nachricht: e.target.value })}
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="inquiry-datenschutz"
              className="mt-1"
              required
              checked={formData.datenschutz}
              onChange={(e) => setFormData({ ...formData, datenschutz: e.target.checked })}
            />
            <Label htmlFor="inquiry-datenschutz" className="text-xs text-muted-foreground">
              Ich habe die{' '}
              <Link href="/datenschutz" className="text-primary-600 hover:underline">
                Datenschutzerklärung
              </Link>{' '}
              gelesen und akzeptiere diese. *
            </Label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Wird gesendet...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Anfrage senden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
