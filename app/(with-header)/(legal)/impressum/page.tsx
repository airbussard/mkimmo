import { Metadata } from 'next'
import { Building2, Mail, Phone, Users, Scale, FileText, Link2, Copyright, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COMPANY_INFO } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Angaben der Möller & Knabe GbR.',
}

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Impressum</h1>

        <div className="grid gap-6">
          {/* Anbieter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary-600" />
                Angaben gemäß § 5 TMG
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Anschrift</h3>
                <address className="not-italic text-secondary-600 leading-relaxed">
                  {COMPANY_INFO.name}<br />
                  {COMPANY_INFO.strasse}<br />
                  {COMPANY_INFO.plz} {COMPANY_INFO.ort}
                </address>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">Kontakt</h3>
                <div className="space-y-2 text-secondary-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary-600" />
                    <a href={`tel:${COMPANY_INFO.telefon.replace(/\s/g, '')}`} className="hover:text-primary-600">
                      {COMPANY_INFO.telefon}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary-600" />
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary-600">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gesellschafter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary-600" />
                Vertretungsberechtigte Gesellschafter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-2 text-secondary-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Aaron Möller
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Oscar Knabe
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Berufsrechtliche Regelungen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scale className="h-5 w-5 text-primary-600" />
                Berufsrechtliche Regelungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid md:grid-cols-2 gap-4 text-secondary-600">
                <div>
                  <dt className="font-semibold text-secondary-900">Berufsbezeichnung</dt>
                  <dd>Immobilienmakler</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary-900">Zuständige Aufsichtsbehörde</dt>
                  <dd>Industrie- und Handelskammer Aachen</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary-900">Verliehen in</dt>
                  <dd>Deutschland</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary-900">Berufsrechtliche Regelungen</dt>
                  <dd>§ 34c GewO (Gewerbeordnung)</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Umsatzsteuer */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary-600" />
                Umsatzsteuer-ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                <span className="text-secondary-400 italic">[Wird noch ergänzt]</span>
              </p>
            </CardContent>
          </Card>

          {/* Streitschlichtung */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-primary-600" />
                Streitschlichtung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-secondary-600">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">EU-Streitschlichtung</h3>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Verbraucherstreitbeilegung</h3>
                <p>
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Haftung */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-primary-600" />
                Haftungshinweise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-secondary-600">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Haftung für Inhalte</h3>
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach
                  den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
                  jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
                  oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p className="mt-2">
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                  allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
                  ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von
                  entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Haftung für Links</h3>
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
                  Seiten verantwortlich.
                </p>
                <p className="mt-2">
                  Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                  überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                  Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen
                  werden wir derartige Links umgehend entfernen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Urheberrecht */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Copyright className="h-5 w-5 text-primary-600" />
                Urheberrecht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-secondary-600">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
                jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
                gestattet.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
                Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
                Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
                entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte
                umgehend entfernen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
