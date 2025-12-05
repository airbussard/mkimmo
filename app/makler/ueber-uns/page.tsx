import { Metadata } from 'next'
import { Users, Award, Clock, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Über uns - Makler',
  description:
    'Lernen Sie unser Makler-Team kennen. Professionelle Immobilienvermittlung mit persönlicher Beratung in Eschweiler und der Städteregion Aachen.',
}

const teamMembers = [
  {
    name: 'Thomas Möller',
    position: 'Geschäftsführer & Immobilienmakler',
    beschreibung:
      'Mit über 15 Jahren Erfahrung in der Immobilienbranche unterstützt Thomas Möller Sie kompetent bei allen Fragen rund um Kauf und Verkauf.',
  },
  {
    name: 'Sandra Knabe',
    position: 'Immobilienmaklerin',
    beschreibung:
      'Sandra Knabe ist spezialisiert auf Wohnimmobilien und begleitet Sie mit viel Engagement von der ersten Besichtigung bis zur Schlüsselübergabe.',
  },
]

export default function UeberUnsMaklerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Unser Makler-Team</h1>
        <p className="text-lg text-secondary-600">
          Wir sind Ihr kompetenter Partner für Immobilien in Eschweiler und der Städteregion Aachen.
          Persönliche Beratung und professionelle Vermittlung sind unser Anspruch.
        </p>
      </div>

      {/* Werte */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <div className="text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-semibold mb-2">Persönlich</h3>
          <p className="text-sm text-muted-foreground">
            Individuelle Betreuung für jeden Kunden
          </p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-semibold mb-2">Kompetent</h3>
          <p className="text-sm text-muted-foreground">
            Langjährige Erfahrung und Marktkenntnis
          </p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-semibold mb-2">Zuverlässig</h3>
          <p className="text-sm text-muted-foreground">
            Termingerechte und transparente Abwicklung
          </p>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-semibold mb-2">Engagiert</h3>
          <p className="text-sm text-muted-foreground">
            Mit Leidenschaft für Ihre Immobilie
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Das Team</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <ImagePlaceholder aspectRatio="square" className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary-600 mb-3">{member.position}</p>
                  <p className="text-muted-foreground">{member.beschreibung}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Über uns Text */}
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Über {COMPANY_INFO.name}</h2>
            <div className="space-y-4 text-secondary-600">
              <p>
                Seit vielen Jahren sind wir als Immobilienmakler in Eschweiler und der Städteregion
                Aachen tätig. Unser Fokus liegt auf der persönlichen Betreuung unserer Kunden – vom
                ersten Gespräch bis zur erfolgreichen Vermittlung.
              </p>
              <p>
                Als inhabergeführtes Unternehmen kennen wir den lokalen Immobilienmarkt genau und
                können Sie kompetent bei der Preisfindung, Vermarktung und Verhandlung unterstützen.
                Ob Sie verkaufen oder kaufen möchten – wir stehen Ihnen mit Rat und Tat zur Seite.
              </p>
              <p>
                Unsere Dienstleistungen umfassen die professionelle Bewertung Ihrer Immobilie,
                hochwertige Exposés, Besichtigungen, Vertragsverhandlungen und die Begleitung bis zum
                Notartermin. Transparente Kommunikation und faire Konditionen sind dabei
                selbstverständlich.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
