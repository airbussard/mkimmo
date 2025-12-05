import { Metadata } from 'next'
import { Building2, Users, Shield, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Erfahren Sie mehr über Möller & Knabe GbR - Ihr Partner für Immobilien und Hausverwaltung in Eschweiler.',
}

export default function UeberUnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Über {COMPANY_INFO.name}
        </h1>
        <p className="text-lg text-secondary-600">
          Ihr vertrauensvoller Partner für Immobilien und Hausverwaltung in Eschweiler
          und der Städteregion Aachen seit vielen Jahren.
        </p>
      </div>

      {/* Unternehmensbild */}
      <div className="max-w-4xl mx-auto mb-16">
        <ImagePlaceholder aspectRatio="wide" className="rounded-xl" />
      </div>

      {/* Unsere Geschichte */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Unsere Geschichte</h2>
        <div className="prose prose-slate max-w-none">
          <p>
            {COMPANY_INFO.name} wurde mit dem Ziel gegründet, Immobiliendienstleistungen auf einem
            neuen Niveau anzubieten. Als inhabergeführtes Unternehmen legen wir besonderen Wert auf
            persönliche Betreuung und individuelle Lösungen für unsere Kunden.
          </p>
          <p>
            Mit unserer Doppelkompetenz in Immobilienvermittlung und Hausverwaltung bieten wir unseren
            Kunden einen umfassenden Service aus einer Hand. Von der ersten Beratung bis zur
            langfristigen Betreuung Ihrer Immobilie sind wir Ihr verlässlicher Partner.
          </p>
          <p>
            Unser Sitz in Eschweiler ermöglicht uns eine optimale Betreuung von Kunden in der
            gesamten Städteregion Aachen und darüber hinaus. Die genaue Kenntnis des lokalen
            Immobilienmarktes ist dabei ein entscheidender Vorteil für unsere Kunden.
          </p>
        </div>
      </div>

      {/* Unsere Werte */}
      <div className="bg-secondary-50 py-16 -mx-4 px-4 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Unsere Werte</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Vertrauen</h3>
              <p className="text-sm text-muted-foreground">
                Ehrliche und transparente Kommunikation bildet die Basis unserer Arbeit.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Persönlichkeit</h3>
              <p className="text-sm text-muted-foreground">
                Bei uns sind Sie keine Nummer. Wir nehmen uns Zeit für Ihre Anliegen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Kompetenz</h3>
              <p className="text-sm text-muted-foreground">
                Fundiertes Fachwissen und langjährige Erfahrung für Ihren Erfolg.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Mit Leidenschaft und vollem Einsatz für Ihre Immobilie.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leistungsbereiche */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">Unsere Leistungsbereiche</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Building2 className="w-6 h-6 mr-2 text-primary-600" />
                Makler
              </h3>
              <p className="text-muted-foreground mb-4">
                Als erfahrene Immobilienmakler begleiten wir Sie professionell beim Kauf oder Verkauf
                Ihrer Immobilie. Von der Wertermittlung über die Vermarktung bis zum erfolgreichen
                Abschluss beim Notar.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Professionelle Immobilienbewertung</li>
                <li>• Hochwertige Exposés und Vermarktung</li>
                <li>• Besichtigungen und Verhandlungen</li>
                <li>• Begleitung bis zum Notartermin</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary-600" />
                Hausverwaltung
              </h3>
              <p className="text-muted-foreground mb-4">
                Als zuverlässiger Hausverwalter kümmern wir uns um alle Belange Ihrer Immobilie.
                Von der kaufmännischen Verwaltung über die technische Betreuung bis zur Mieterbetreuung.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Kaufmännische Verwaltung</li>
                <li>• Technische Objektbetreuung</li>
                <li>• Mieterbetreuung und -kommunikation</li>
                <li>• Nebenkostenabrechnung</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Lernen Sie uns kennen</h2>
        <p className="text-muted-foreground mb-6">
          Vereinbaren Sie ein unverbindliches Beratungsgespräch. Wir freuen uns auf Sie!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${COMPANY_INFO.telefon}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            {COMPANY_INFO.telefon}
          </a>
          <a
            href="/kontakt"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Kontaktformular
          </a>
        </div>
      </div>
    </div>
  )
}
