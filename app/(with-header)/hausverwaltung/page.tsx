import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, FileText, Wrench, Users, Shield, Phone, Clock, CheckCircle, ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/config/navigation'
import { HeroSlider, Slide } from '@/components/HeroSlider'

export const metadata: Metadata = {
  title: 'Hausverwaltung',
  description:
    'Professionelle Hausverwaltung in Eschweiler und Umgebung. Wir kümmern uns um Ihre Immobilie – von der Mieterbetreuung bis zur Instandhaltung.',
}

const hausverwaltungSlides: Slide[] = [
  {
    image: '/slider/IMG_5050.jpeg',
    title: 'Professionelle Hausverwaltung',
    subtitle: 'Wir verwalten Ihre Immobilie zuverlässig und kompetent',
    cta: {
      text: 'Anfrage stellen',
      href: '/hausverwaltung/anfrage',
      icon: <FileText className="w-5 h-5 mr-2" />,
    },
    ctaSecondary: {
      text: 'Unsere Objekte',
      href: '/hausverwaltung/objekte',
    },
  },
  {
    image: '/slider/IMG_3439.jpeg',
    title: 'Zuverlässige Betreuung',
    subtitle: 'Von der Nebenkostenabrechnung bis zur Instandhaltung – wir kümmern uns',
    cta: {
      text: 'Leistungen ansehen',
      href: '#leistungen',
    },
    ctaSecondary: {
      text: 'Kontakt aufnehmen',
      href: '/hausverwaltung/kontakt',
    },
  },
  {
    image: '/slider/DSC_0065.JPG',
    title: 'Erfahrung die zählt',
    subtitle: 'Über 15 Jahre Erfahrung in der Immobilienverwaltung',
    cta: {
      text: 'Jetzt anfragen',
      href: '/hausverwaltung/anfrage',
    },
    ctaSecondary: {
      text: 'Anrufen',
      href: `tel:${COMPANY_INFO.telefon}`,
    },
  },
]

export default function HausverwaltungLandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Slider */}
      <HeroSlider slides={hausverwaltungSlides} autoPlayInterval={6000} />

      {/* Leistungen Section */}
      <section id="leistungen" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            Unsere Leistungen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Kaufmännische Verwaltung</h3>
              <ul className="text-secondary-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Mietbuchhaltung</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Nebenkostenabrechnung</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Mahnwesen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Wirtschaftsplanung</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Technische Verwaltung</h3>
              <ul className="text-secondary-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Instandhaltung</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Reparaturmanagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Wartungsverträge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Modernisierungen</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Mieterbetreuung</h3>
              <ul className="text-secondary-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Ansprechpartner für Mieter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Wohnungsübergaben</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Mietersuche</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Konfliktmanagement</span>
                </li>
              </ul>
            </div>
            <div className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Verlässlichkeit</h3>
              <ul className="text-secondary-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Antwort innerhalb 48h garantiert</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Zügige Problemlösungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Abrechnung bis Sept. des Folgejahres</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                  <span>Freundlich & kompetent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile Section */}
      <section className="bg-secondary-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary-900 mb-12">
            Ihre Vorteile mit {COMPANY_INFO.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Transparenz</h3>
              <p className="text-secondary-600">
                Übersichtliche Abrechnungen und regelmäßige Berichte. Sie behalten
                stets den Überblick über Ihre Immobilie.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Erreichbarkeit</h3>
              <p className="text-secondary-600">
                Wir sind für Sie und Ihre Mieter da – auch bei dringenden Anliegen
                schnell erreichbar.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Erfahrung</h3>
              <p className="text-secondary-600">
                Profitieren Sie von unserer langjährigen Erfahrung in der
                Immobilienverwaltung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiken Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">50+</div>
              <p className="text-secondary-600">Verwaltete Objekte</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">500+</div>
              <p className="text-secondary-600">Wohneinheiten</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">15+</div>
              <p className="text-secondary-600">Jahre Erfahrung</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24h</div>
              <p className="text-secondary-600">Notfall-Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Interesse an unserer Hausverwaltung?
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie
            gerne zu unseren Leistungen und Konditionen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/hausverwaltung/anfrage">
                Anfrage stellen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
            >
              <Link href={`tel:${COMPANY_INFO.telefon}`}>
                <Phone className="w-4 h-4 mr-2" />
                {COMPANY_INFO.telefon}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
