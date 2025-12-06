'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Home, TrendingUp, Send, CheckCircle, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PropertyMap } from '@/components/shared/PropertyMap'
import { COMPANY_INFO } from '@/config/navigation'

export default function MaklerKontaktPage() {
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    anliegen: '',
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
          type: 'makler_kontakt',
          name: `${formData.vorname} ${formData.nachname}`.trim(),
          email: formData.email,
          phone: formData.telefon || undefined,
          message: formData.nachricht,
          metadata: {
            anliegen: formData.anliegen,
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
            Unser Makler-Team wird sich schnellstmöglich bei Ihnen melden.
            In der Regel antworten wir innerhalb von 24 Stunden.
          </p>
          <Button asChild>
            <Link href="/makler">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu den Immobilien
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
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Kontakt - Immobilienmakler</h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Sie möchten eine Immobilie kaufen oder verkaufen? Wir beraten Sie gerne persönlich
            und unverbindlich zu Ihrem Vorhaben.
          </p>
        </div>

        {/* Schnellkontakt-Karten */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Sie suchen eine Immobilie?</h3>
              </div>
              <p className="text-sm text-secondary-600">
                Teilen Sie uns Ihre Wünsche mit und wir finden das passende Objekt für Sie.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Sie möchten verkaufen?</h3>
              </div>
              <p className="text-sm text-secondary-600">
                Wir ermitteln den Wert Ihrer Immobilie und begleiten Sie bis zum Verkauf.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Kontaktformular */}
          <Card>
            <CardHeader>
              <CardTitle>Nachricht an unser Makler-Team</CardTitle>
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
                  <Label htmlFor="anliegen">Ihr Anliegen *</Label>
                  <select
                    id="anliegen"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                    value={formData.anliegen}
                    onChange={(e) => setFormData({ ...formData, anliegen: e.target.value })}
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="kaufen">Ich möchte eine Immobilie kaufen</option>
                    <option value="mieten">Ich möchte eine Immobilie mieten</option>
                    <option value="verkaufen">Ich möchte meine Immobilie verkaufen</option>
                    <option value="bewertung">Ich möchte eine Immobilienbewertung</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nachricht">Nachricht *</Label>
                  <textarea
                    id="nachricht"
                    rows={5}
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                      Anfrage absenden
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
                <h2 className="text-xl font-semibold mb-6">Ihr Makler-Team</h2>

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
