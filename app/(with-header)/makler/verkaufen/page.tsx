import { Metadata } from 'next'
import { TrendingUp, CheckCircle, Home, Users, Clock, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Immobilie verkaufen',
  description: 'Sie möchten Ihre Immobilie verkaufen? Wir unterstützen Sie professionell bei der Vermarktung und dem Verkauf.',
}

export default function VerkaufenPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
              Ihre Immobilie verkaufen
            </h1>
            <p className="text-lg md:text-xl text-secondary-600 mb-8">
              Profitieren Sie von unserer Erfahrung und Marktkenntnis. Wir verkaufen Ihre
              Immobilie zum bestmöglichen Preis – diskret, professionell und zuverlässig.
            </p>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            Warum mit uns verkaufen?
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Marktgerechte Bewertung</h3>
              <p className="text-sm text-secondary-600">
                Fundierte Wertermittlung basierend auf aktuellen Marktdaten
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Großes Netzwerk</h3>
              <p className="text-sm text-secondary-600">
                Zugang zu vorgemerkten Kaufinteressenten
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Schnelle Vermittlung</h3>
              <p className="text-sm text-secondary-600">
                Professionelle Vermarktung für zügigen Verkauf
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Volle Betreuung</h3>
              <p className="text-sm text-secondary-600">
                Von der Bewertung bis zum Notartermin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formular */}
      <section className="py-16 md:py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Verkaufsanfrage stellen</CardTitle>
                <p className="text-center text-secondary-600 mt-2">
                  Füllen Sie das Formular aus und wir melden uns zeitnah bei Ihnen für eine kostenlose Erstberatung.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-secondary-900 border-b pb-2">Ihre Kontaktdaten</h3>
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input id="email" type="email" placeholder="ihre@email.de" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefon">Telefon *</Label>
                        <Input id="telefon" type="tel" placeholder="+49 ..." required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-secondary-900 border-b pb-2">Angaben zur Immobilie</h3>
                    <div className="space-y-2">
                      <Label htmlFor="objektart">Art der Immobilie *</Label>
                      <select
                        id="objektart"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="einfamilienhaus">Einfamilienhaus</option>
                        <option value="doppelhaushaelfte">Doppelhaushälfte</option>
                        <option value="reihenhaus">Reihenhaus</option>
                        <option value="mehrfamilienhaus">Mehrfamilienhaus</option>
                        <option value="eigentumswohnung">Eigentumswohnung</option>
                        <option value="grundstueck">Grundstück</option>
                        <option value="gewerbe">Gewerbeimmobilie</option>
                        <option value="sonstiges">Sonstiges</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adresse">Adresse der Immobilie *</Label>
                      <Input id="adresse" placeholder="Straße, Hausnummer" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plz">PLZ *</Label>
                        <Input id="plz" placeholder="52249" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ort">Ort *</Label>
                        <Input id="ort" placeholder="Eschweiler" required />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wohnflaeche">Wohnfläche (ca. m²)</Label>
                        <Input id="wohnflaeche" type="number" placeholder="120" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grundstueck">Grundstücksfläche (ca. m²)</Label>
                        <Input id="grundstueck" type="number" placeholder="500" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="baujahr">Baujahr</Label>
                        <Input id="baujahr" type="number" placeholder="1990" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zimmer">Anzahl Zimmer</Label>
                        <Input id="zimmer" type="number" placeholder="5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preisvorstellung">Preisvorstellung (€)</Label>
                      <Input id="preisvorstellung" type="number" placeholder="350000" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-secondary-900 border-b pb-2">Weitere Informationen</h3>
                    <div className="space-y-2">
                      <Label htmlFor="zeitrahmen">Gewünschter Verkaufszeitraum</Label>
                      <select
                        id="zeitrahmen"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="sofort">So schnell wie möglich</option>
                        <option value="3monate">Innerhalb von 3 Monaten</option>
                        <option value="6monate">Innerhalb von 6 Monaten</option>
                        <option value="flexibel">Flexibel / Kein Zeitdruck</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nachricht">Weitere Informationen zur Immobilie</Label>
                      <textarea
                        id="nachricht"
                        rows={4}
                        placeholder="Besonderheiten, Ausstattung, Renovierungen, etc."
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
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

                  <Button type="submit" className="w-full" size="lg">
                    Kostenlose Bewertung anfordern
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Pflichtfelder. Ihre Daten werden vertraulich behandelt.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prozess */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            So läuft der Verkauf ab
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Erstgespräch</h3>
                <p className="text-sm text-secondary-600">
                  Kostenlose Beratung und Besichtigung Ihrer Immobilie
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Bewertung</h3>
                <p className="text-sm text-secondary-600">
                  Fundierte Marktwertermittlung und Preisempfehlung
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Vermarktung</h3>
                <p className="text-sm text-secondary-600">
                  Professionelles Exposé und zielgerichtete Vermarktung
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  4
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Verkauf</h3>
                <p className="text-sm text-secondary-600">
                  Besichtigungen, Verhandlung und Notartermin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
