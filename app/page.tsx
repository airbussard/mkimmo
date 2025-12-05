import Image from 'next/image'
import { LandingTile } from '@/components/landing/LandingTile'
import { COMPANY_INFO } from '@/config/navigation'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/images/Logo MK Immobilien.png"
            alt={COMPANY_INFO.name}
            width={800}
            height={200}
            className="h-48 md:h-64 w-auto mx-auto mb-6"
            priority
          />
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
            Ihr kompetenter Partner für Immobilien und Hausverwaltung in Eschweiler und Umgebung.
            Wir unterstützen Sie professionell bei allen Fragen rund um Ihre Immobilie.
          </p>
        </div>
      </section>

      {/* Kacheln Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <LandingTile
              titel="Makler"
              beschreibung="Professionelle Vermittlung von Immobilien. Wir begleiten Sie beim Kauf oder Verkauf Ihrer Immobilie."
              href="/makler"
              icon="makler"
            />
            <LandingTile
              titel="Hausverwaltung"
              beschreibung="Zuverlässige Verwaltung Ihrer Immobilie. Wir kümmern uns um alles – von der Mieterbetreuung bis zur Instandhaltung."
              href="/hausverwaltung"
              icon="hausverwaltung"
            />
          </div>
        </div>
      </section>

      {/* Vorteile Section */}
      <section className="bg-secondary-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            Warum {COMPANY_INFO.name}?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Regionale Expertise</h3>
              <p className="text-secondary-600">
                Wir kennen den lokalen Immobilienmarkt in Eschweiler und der Städteregion Aachen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Persönliche Betreuung</h3>
              <p className="text-secondary-600">
                Bei uns sind Sie keine Nummer. Wir nehmen uns Zeit für Ihre individuellen Anliegen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Transparente Kommunikation</h3>
              <p className="text-secondary-600">
                Offene und ehrliche Beratung – wir halten Sie stets auf dem Laufenden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
            Haben Sie Fragen?
          </h2>
          <p className="text-secondary-600 mb-8 max-w-xl mx-auto">
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
            Wir freuen uns auf Sie!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${COMPANY_INFO.telefon}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {COMPANY_INFO.telefon}
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
