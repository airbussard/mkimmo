import { Metadata } from 'next'
import Link from 'next/link'
import { Home, TrendingUp, Users, Award, Clock, CheckCircle, ArrowRight, Calculator, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Makler',
  description:
    'Ihr Immobilienmakler in Eschweiler und Umgebung. Professionelle Vermittlung von Häusern, Wohnungen und Grundstücken.',
}

export default function MaklerLandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
              Ihr Immobilienmakler in Eschweiler
            </h1>
            <p className="text-lg md:text-xl text-secondary-600 mb-8">
              Wir begleiten Sie professionell beim Kauf oder Verkauf Ihrer Immobilie.
              Mit lokaler Expertise und persönlicher Beratung finden wir gemeinsam
              die perfekte Lösung für Sie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/makler/immobilien">
                  <Home className="w-5 h-5 mr-2" />
                  Immobilien entdecken
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/makler/kaufnebenkosten-rechner">
                  <Calculator className="w-5 h-5 mr-2" />
                  Kaufnebenkosten berechnen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Leistungen Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            Unsere Leistungen
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Immobilienvermittlung</h3>
              <p className="text-secondary-600">
                Ob Kauf oder Verkauf – wir finden den passenden Käufer oder die
                Traumimmobilie für Sie. Diskret und professionell.
              </p>
            </div>
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Marktanalyse & Bewertung</h3>
              <p className="text-secondary-600">
                Fundierte Wertermittlung Ihrer Immobilie basierend auf aktuellen
                Marktdaten und lokaler Expertise.
              </p>
            </div>
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Persönliche Beratung</h3>
              <p className="text-secondary-600">
                Individuelle Betreuung von der ersten Besichtigung bis zum
                Notartermin. Wir sind für Sie da.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiken Section */}
      <section className="bg-secondary-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">150+</div>
              <p className="text-secondary-600">Vermittelte Objekte</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">15+</div>
              <p className="text-secondary-600">Jahre Erfahrung</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">98%</div>
              <p className="text-secondary-600">Zufriedene Kunden</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">100%</div>
              <p className="text-secondary-600">Engagement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            Warum {COMPANY_INFO.name}?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Lokale Marktkenntnis</h3>
                <p className="text-secondary-600">
                  Wir kennen den Immobilienmarkt in Eschweiler und der Städteregion Aachen wie unsere Westentasche.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Faire Konditionen</h3>
                <p className="text-secondary-600">
                  Transparente Preisgestaltung ohne versteckte Kosten. Sie wissen immer, woran Sie sind.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Schnelle Vermittlung</h3>
                <p className="text-secondary-600">
                  Dank unseres Netzwerks und unserer Erfahrung vermitteln wir Ihre Immobilie zeitnah.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Persönlicher Ansprechpartner</h3>
                <p className="text-secondary-600">
                  Ein fester Ansprechpartner begleitet Sie durch den gesamten Prozess.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verkäufer CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Sie möchten verkaufen?
                </h2>
                <p className="text-primary-100 mb-6">
                  Profitieren Sie von unserer Erfahrung und Marktkenntnis. Wir verkaufen
                  Ihre Immobilie zum bestmöglichen Preis – diskret und professionell.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-primary-100">
                    <CheckCircle className="w-5 h-5 text-white" />
                    Kostenlose Immobilienbewertung
                  </li>
                  <li className="flex items-center gap-2 text-primary-100">
                    <CheckCircle className="w-5 h-5 text-white" />
                    Professionelle Vermarktung
                  </li>
                  <li className="flex items-center gap-2 text-primary-100">
                    <CheckCircle className="w-5 h-5 text-white" />
                    Betreuung bis zum Notartermin
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link href="/makler/verkaufen">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Jetzt verkaufen
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Bereit für Ihre Traumimmobilie?
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Entdecken Sie unser aktuelles Angebot oder kontaktieren Sie uns für eine persönliche Beratung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/makler/kaufen">
                Immobilien zum Kauf
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/makler/kontakt">Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
