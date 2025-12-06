'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PropertyMap } from '@/components/shared/PropertyMap'
import { COMPANY_INFO } from '@/config/navigation'

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    betreff: '',
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
          type: 'allgemein',
          name: `${formData.vorname} ${formData.nachname}`.trim(),
          email: formData.email,
          phone: formData.telefon || undefined,
          message: formData.nachricht,
          metadata: {
            betreff: formData.betreff,
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
            Vielen Dank für Ihre Nachricht!
          </h1>
          <p className="text-secondary-600 mb-8">
            Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
            In der Regel antworten wir innerhalb von 24 Stunden.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Kontakt</h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Haben Sie Fragen zu unseren Leistungen oder möchten Sie ein unverbindliches Beratungsgespräch
            vereinbaren? Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Kontaktformular */}
          <Card>
            <CardHeader>
              <CardTitle>Nachricht senden</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vorname">Vorname *</Label>
                    <Input
                      id="vorname"
                      placeholder="Ihr Vorname"
                      required
                      value={formData.vorname}
                      onChange={(e) => setFormData({ ...formData, vorname: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nachname">Nachname *</Label>
                    <Input
                      id="nachname"
                      placeholder="Ihr Nachname"
                      required
                      value={formData.nachname}
                      onChange={(e) => setFormData({ ...formData, nachname: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input
                    id="telefon"
                    type="tel"
                    placeholder="+49 ..."
                    value={formData.telefon}
                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="betreff">Betreff *</Label>
                  <Input
                    id="betreff"
                    placeholder="Worum geht es?"
                    required
                    value={formData.betreff}
                    onChange={(e) => setFormData({ ...formData, betreff: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nachricht">Nachricht *</Label>
                  <textarea
                    id="nachricht"
                    rows={5}
                    placeholder="Ihre Nachricht an uns..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    value={formData.nachricht}
                    onChange={(e) => setFormData({ ...formData, nachricht: e.target.value })}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="datenschutz"
                    className="mt-1"
                    required
                    checked={formData.datenschutz}
                    onChange={(e) => setFormData({ ...formData, datenschutz: e.target.checked })}
                  />
                  <Label htmlFor="datenschutz" className="text-sm text-muted-foreground">
                    Ich habe die{' '}
                    <Link href="/datenschutz" className="text-primary-600 hover:underline">
                      Datenschutzerklärung
                    </Link>{' '}
                    gelesen und akzeptiere diese. *
                  </Label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Wird gesendet...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Nachricht absenden
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">* Pflichtfelder</p>
              </form>
            </CardContent>
          </Card>

          {/* Kontaktinformationen */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Kontaktdaten</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 mt-1 text-primary-600" />
                    <div>
                      <p className="font-medium">{COMPANY_INFO.name}</p>
                      <p className="text-muted-foreground">
                        {COMPANY_INFO.strasse}
                        <br />
                        {COMPANY_INFO.plz} {COMPANY_INFO.ort}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-muted-foreground text-sm">Telefon</p>
                      <a href={`tel:${COMPANY_INFO.telefon}`} className="font-medium hover:text-primary-600">
                        {COMPANY_INFO.telefon}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-muted-foreground text-sm">E-Mail</p>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="font-medium hover:text-primary-600">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 mt-1 text-primary-600" />
                    <div>
                      <p className="text-muted-foreground text-sm">Öffnungszeiten</p>
                      <p className="font-medium">
                        Mo - Fr: 9:00 - 18:00 Uhr
                        <br />
                        Sa: nach Vereinbarung
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Karte */}
            <Card>
              <CardHeader>
                <CardTitle>Standort</CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyMap
                  lat={COMPANY_INFO.koordinaten.lat}
                  lng={COMPANY_INFO.koordinaten.lng}
                  titel={COMPANY_INFO.name}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
