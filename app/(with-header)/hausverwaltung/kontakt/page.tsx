import { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, Building2, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PropertyMap } from '@/components/shared/PropertyMap'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Kontakt - Hausverwaltung',
  description: 'Kontaktieren Sie uns für alle Fragen rund um Hausverwaltung und Immobilienverwaltung.',
}

export default function HausverwaltungKontaktPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Kontakt - Hausverwaltung</h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Sie haben Fragen zu unserer Hausverwaltung oder möchten Ihr Objekt von uns verwalten lassen?
            Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>

        {/* Schnellkontakt-Karten */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Neues Objekt anmelden</h3>
              </div>
              <p className="text-sm text-secondary-600">
                Sie möchten Ihre Immobilie professionell verwalten lassen? Fordern Sie ein unverbindliches Angebot an.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold">Bestandskunden</h3>
              </div>
              <p className="text-sm text-secondary-600">
                Sie sind bereits Kunde? Wir helfen Ihnen bei allen Anliegen rund um Ihr verwaltetes Objekt.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Kontaktformular */}
          <Card>
            <CardHeader>
              <CardTitle>Nachricht an die Hausverwaltung</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vorname">Vorname *</Label>
                    <Input id="vorname" placeholder="Ihr Vorname" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nachname">Nachname *</Label>
                    <Input id="nachname" placeholder="Ihr Nachname" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input id="email" type="email" placeholder="ihre@email.de" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input id="telefon" type="tel" placeholder="+49 ..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kundenart">Kundenart *</Label>
                  <select
                    id="kundenart"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="neukunde">Neukunde - Objekt anmelden</option>
                    <option value="eigentuemer">Bestandskunde - Eigentümer</option>
                    <option value="mieter">Bestandskunde - Mieter</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objektadresse">Objektadresse (falls bekannt)</Label>
                  <Input id="objektadresse" placeholder="Straße, PLZ Ort" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nachricht">Nachricht *</Label>
                  <textarea
                    id="nachricht"
                    rows={5}
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="datenschutz" className="mt-1" required />
                  <Label htmlFor="datenschutz" className="text-sm text-muted-foreground">
                    Ich habe die{' '}
                    <a href="/datenschutz" className="text-primary-600 hover:underline">
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und akzeptiere diese. *
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Anfrage absenden
                </Button>

                <p className="text-xs text-muted-foreground">* Pflichtfelder</p>
              </form>
            </CardContent>
          </Card>

          {/* Kontaktinformationen */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Hausverwaltung</h2>

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

                <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                  <p className="text-sm text-secondary-600">
                    <strong>Hinweis für Mieter:</strong> Bei dringenden technischen Notfällen außerhalb
                    der Geschäftszeiten (Wasserrohrbruch, Heizungsausfall etc.) erreichen Sie unseren
                    24h-Notdienst unter der Telefonnummer.
                  </p>
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
