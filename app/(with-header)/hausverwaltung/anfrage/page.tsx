'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Building2, Send, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COMPANY_INFO } from '@/config/navigation'

export default function AnfragePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefon: '',
    objektart: '',
    einheiten: '',
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
          type: 'hv_anfrage',
          name: formData.name,
          email: formData.email,
          phone: formData.telefon || undefined,
          message: formData.nachricht || undefined,
          metadata: {
            objektart: formData.objektart || undefined,
            einheiten: formData.einheiten ? parseInt(formData.einheiten) : undefined,
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            Vielen Dank für Ihre Anfrage!
          </h1>
          <p className="text-secondary-600 mb-8">
            Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
            In der Regel antworten wir innerhalb von 24 Stunden.
          </p>
          <Button asChild>
            <Link href="/hausverwaltung">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Hausverwaltung
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
              Anfrage Hausverwaltung
            </h1>
            <p className="text-secondary-600">
              Sie möchten Ihre Immobilie professionell verwalten lassen? Füllen Sie das
              Formular aus und wir erstellen Ihnen ein unverbindliches Angebot.
            </p>
          </div>
        </div>
      </section>

      {/* Formular Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ihr vollständiger Name"
                />
              </div>

              {/* E-Mail */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  E-Mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ihre@email.de"
                />
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <Label htmlFor="telefon">Telefon (optional)</Label>
                <Input
                  id="telefon"
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  placeholder="+49 123 456789"
                />
              </div>

              {/* Objektart */}
              <div className="space-y-2">
                <Label htmlFor="objektart">Objektart</Label>
                <Select
                  value={formData.objektart}
                  onValueChange={(value) => setFormData({ ...formData, objektart: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mehrfamilienhaus">Mehrfamilienhaus</SelectItem>
                    <SelectItem value="wohnanlage">Wohnanlage</SelectItem>
                    <SelectItem value="gewerbe">Gewerbeimmobilie</SelectItem>
                    <SelectItem value="gemischt">Wohn- und Geschäftshaus</SelectItem>
                    <SelectItem value="sonstiges">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Anzahl Einheiten */}
              <div className="space-y-2">
                <Label htmlFor="einheiten">Anzahl Wohn-/Gewerbeeinheiten (optional)</Label>
                <Input
                  id="einheiten"
                  type="number"
                  min="1"
                  value={formData.einheiten}
                  onChange={(e) => setFormData({ ...formData, einheiten: e.target.value })}
                  placeholder="z.B. 12"
                />
              </div>

              {/* Nachricht */}
              <div className="space-y-2">
                <Label htmlFor="nachricht">Ihre Nachricht</Label>
                <textarea
                  id="nachricht"
                  rows={5}
                  value={formData.nachricht}
                  onChange={(e) => setFormData({ ...formData, nachricht: e.target.value })}
                  placeholder="Teilen Sie uns weitere Details zu Ihrem Objekt oder Ihre Fragen mit..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Datenschutz */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="datenschutz"
                  required
                  checked={formData.datenschutz}
                  onChange={(e) => setFormData({ ...formData, datenschutz: e.target.checked })}
                  className="mt-1"
                />
                <Label htmlFor="datenschutz" className="text-sm text-secondary-600 font-normal">
                  Ich habe die{' '}
                  <Link href="/datenschutz" className="text-primary-600 hover:underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage
                  zu. <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Fehlermeldung */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Wird gesendet...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Anfrage absenden
                  </>
                )}
              </Button>
            </form>

            {/* Kontakt-Alternative */}
            <div className="mt-12 p-6 bg-secondary-50 rounded-xl text-center">
              <p className="text-secondary-600 mb-2">Sie möchten uns lieber direkt kontaktieren?</p>
              <p className="font-medium text-secondary-900">
                Telefon:{' '}
                <a href={`tel:${COMPANY_INFO.telefon}`} className="text-primary-600 hover:underline">
                  {COMPANY_INFO.telefon}
                </a>
              </p>
              <p className="font-medium text-secondary-900">
                E-Mail:{' '}
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary-600 hover:underline">
                  {COMPANY_INFO.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
