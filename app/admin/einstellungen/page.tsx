import Link from 'next/link'
import { Building2, Calculator, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EinstellungenPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Einstellungen</h1>
        <p className="text-secondary-600">
          Verwalten Sie Firmendaten und Systemkonfiguration
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/einstellungen/firma">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary-600" />
                Firmendaten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 text-sm mb-4">
                Bearbeiten Sie den Firmennamen, die Adresse, Kontaktdaten und
                Öffnungszeiten, die auf der Website angezeigt werden.
              </p>
              <div className="flex items-center text-primary-600 text-sm font-medium">
                Bearbeiten
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/einstellungen/steuern">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary-600" />
                Grunderwerbsteuer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 text-sm mb-4">
                Verwalten Sie die Grunderwerbsteuersätze pro Bundesland für den
                Kaufnebenkosten-Rechner.
              </p>
              <div className="flex items-center text-primary-600 text-sm font-medium">
                Bearbeiten
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
