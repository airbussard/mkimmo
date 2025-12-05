import { Metadata } from 'next'
import { Suspense } from 'react'
import { AnnuitaetenRechner } from '@/components/makler/AnnuitaetenRechner'

export const metadata: Metadata = {
  title: 'Annuitätendarlehen-Rechner',
  description:
    'Berechnen Sie Ihre monatliche Rate, Gesamtkosten und Tilgungsplan für Ihr Immobiliendarlehen. Kostenloser Darlehensrechner für Ihre Immobilienfinanzierung.',
  keywords: [
    'Annuitätendarlehen',
    'Darlehensrechner',
    'Immobilienfinanzierung',
    'Tilgungsplan',
    'Baufinanzierung',
    'Kredit berechnen',
    'Monatliche Rate',
  ],
}

export default function DarlehensrechnerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Annuitätendarlehen-Rechner
        </h1>
        <p className="text-secondary-600 max-w-2xl">
          Berechnen Sie Ihre monatliche Rate, die Gesamtkosten und erstellen Sie einen
          detaillierten Tilgungsplan für Ihre Immobilienfinanzierung.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-secondary-500">Rechner wird geladen...</div>
          </div>
        }
      >
        <AnnuitaetenRechner />
      </Suspense>
    </div>
  )
}
