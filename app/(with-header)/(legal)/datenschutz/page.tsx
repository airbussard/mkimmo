import { Metadata } from 'next'
import { COMPANY_INFO } from '@/config/navigation'
import { Shield, Server, FileText, Cookie, Users, Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der Möller & Knabe GbR gemäß DSGVO.',
}

function Section({
  icon: Icon,
  title,
  children
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary-100">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
      </div>
      <div className="pl-0 md:pl-12 space-y-4 text-secondary-700">
        {children}
      </div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-secondary-900 mb-2">{title}</h3>
      <div className="text-secondary-600 space-y-2">{children}</div>
    </div>
  )
}

export default function DatenschutzPage() {
  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Datenschutzerklärung
            </h1>
            <p className="text-secondary-600">
              Informationen zum Umgang mit Ihren personenbezogenen Daten gemäß DSGVO
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Quick Overview Card */}
          <Card className="mb-10 border-primary-200 bg-primary-50">
            <CardContent className="p-6">
              <h2 className="font-bold text-primary-900 mb-3">Datenschutz auf einen Blick</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-primary-800">Verantwortliche Stelle</p>
                  <p className="text-primary-700">{COMPANY_INFO.name}</p>
                </div>
                <div>
                  <p className="font-medium text-primary-800">Kontakt</p>
                  <p className="text-primary-700">{COMPANY_INFO.email}</p>
                </div>
                <div>
                  <p className="font-medium text-primary-800">Hosting</p>
                  <p className="text-primary-700">Server in Deutschland</p>
                </div>
                <div>
                  <p className="font-medium text-primary-800">Ihre Rechte</p>
                  <p className="text-primary-700">Auskunft, Löschung, Widerruf</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Datenerfassung */}
          <Section icon={FileText} title="1. Datenerfassung auf dieser Website">
            <SubSection title="Wer ist verantwortlich?">
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                Die Kontaktdaten finden Sie im Abschnitt &bdquo;Verantwortliche Stelle&ldquo;.
              </p>
            </SubSection>

            <SubSection title="Wie erfassen wir Ihre Daten?">
              <p>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen,
                z.B. über ein Kontaktformular.
              </p>
              <p>
                Andere Daten werden automatisch beim Besuch der Website durch unsere
                IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser,
                Betriebssystem oder Uhrzeit des Seitenaufrufs).
              </p>
            </SubSection>

            <SubSection title="Wofür nutzen wir Ihre Daten?">
              <p>
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website
                zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
            </SubSection>
          </Section>

          {/* Section 2: Hosting */}
          <Section icon={Server} title="2. Hosting">
            <p>
              Wir hosten die Inhalte unserer Website auf einem Server in Deutschland.
              Der Hosting-Anbieter erhebt in sog. Logfiles folgende Daten, die Ihr Browser übermittelt:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
              <li>Inhalt der Anforderung (konkrete Seite)</li>
              <li>Zugriffsstatus/HTTP-Statuscode</li>
              <li>Übertragene Datenmenge</li>
              <li>Browser und Betriebssystem</li>
            </ul>
          </Section>

          {/* Section 3: Verantwortliche Stelle */}
          <Section icon={Users} title="3. Verantwortliche Stelle">
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="font-semibold text-secondary-900 mb-4">{COMPANY_INFO.name}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary-600" />
                    <div>
                      <p>{COMPANY_INFO.strasse}</p>
                      <p>{COMPANY_INFO.plz} {COMPANY_INFO.ort}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary-600" />
                    <p>{COMPANY_INFO.telefon}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <p>{COMPANY_INFO.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Section 4: Cookies */}
          <Section icon={Cookie} title="4. Cookies & Google Consent Mode">
            <SubSection title="Was sind Cookies?">
              <p>
                Cookies sind kleine Datenpakete, die auf Ihrem Endgerät gespeichert werden.
                Sie richten keinen Schaden an und werden entweder vorübergehend (Session-Cookies)
                oder dauerhaft (permanente Cookies) gespeichert.
              </p>
            </SubSection>

            <SubSection title="Google Consent Mode v2">
              <p>
                Diese Website verwendet den Google Consent Mode v2. Dieser ermöglicht es uns,
                Ihre Einwilligung für verschiedene Kategorien von Cookies und Tracking-Technologien
                einzuholen und zu verwalten.
              </p>
              <p>
                Erst nach Ihrer ausdrücklichen Einwilligung werden entsprechende Cookies gesetzt
                oder Tracking-Technologien aktiviert. Sie können Ihre Einwilligung jederzeit über
                den Cookie-Banner widerrufen oder anpassen.
              </p>
            </SubSection>

            <SubSection title="Browser-Einstellungen">
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies
                informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies
                für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen
                der Cookies beim Schließen des Browsers aktivieren.
              </p>
            </SubSection>
          </Section>

          {/* Section 5: Kontaktformular */}
          <Section icon={Mail} title="5. Kontaktformular">
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
              aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
              zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <p>
              Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung erfolgt
              auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1
              lit. f DSGVO (berechtigtes Interesse an der Bearbeitung Ihrer Anfrage).
            </p>
          </Section>

          {/* Section 6: Ihre Rechte */}
          <Section icon={Shield} title="6. Ihre Betroffenenrechte">
            <p className="mb-4">
              Unter den angegebenen Kontaktdaten können Sie jederzeit folgende Rechte ausüben:
            </p>

            <div className="grid gap-3">
              {[
                { right: 'Auskunftsrecht', desc: 'Auskunft über Ihre gespeicherten Daten und deren Verarbeitung', article: 'Art. 15 DSGVO' },
                { right: 'Berichtigungsrecht', desc: 'Berichtigung unrichtiger personenbezogener Daten', article: 'Art. 16 DSGVO' },
                { right: 'Löschungsrecht', desc: 'Löschung Ihrer bei uns gespeicherten Daten', article: 'Art. 17 DSGVO' },
                { right: 'Einschränkungsrecht', desc: 'Einschränkung der Datenverarbeitung', article: 'Art. 18 DSGVO' },
                { right: 'Widerspruchsrecht', desc: 'Widerspruch gegen die Verarbeitung Ihrer Daten', article: 'Art. 21 DSGVO' },
                { right: 'Datenübertragbarkeit', desc: 'Übertragung Ihrer Daten in einem gängigen Format', article: 'Art. 20 DSGVO' },
              ].map((item) => (
                <div key={item.right} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-secondary-200">
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">{item.right}</p>
                    <p className="text-sm text-secondary-600">{item.desc}</p>
                  </div>
                  <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded">
                    {item.article}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-secondary-100 rounded-lg">
              <p className="text-sm text-secondary-700">
                <strong>Beschwerderecht:</strong> Im Falle von Verstößen gegen die DSGVO steht Ihnen
                ein Beschwerderecht bei einer Aufsichtsbehörde zu. Das Beschwerderecht besteht
                unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
              </p>
            </div>
          </Section>

          {/* Section 7: Speicherdauer & Widerruf */}
          <Section icon={FileText} title="7. Speicherdauer & Widerruf">
            <SubSection title="Speicherdauer">
              <p>
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde,
                verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
              </p>
              <p>
                Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur
                Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen
                rechtlich zulässigen Gründe für die Speicherung haben.
              </p>
            </SubSection>

            <SubSection title="Widerruf Ihrer Einwilligung">
              <p>
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
                Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit
                der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>
            </SubSection>
          </Section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-secondary-200">
            <p className="text-sm text-secondary-500">
              Stand: Dezember 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
