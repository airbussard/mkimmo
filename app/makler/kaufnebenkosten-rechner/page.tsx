import { Metadata } from 'next'
import { Suspense } from 'react'
import { KaufnebenkostenRechner } from '@/components/makler/KaufnebenkostenRechner'

export const metadata: Metadata = {
  title: 'Kaufnebenkosten-Rechner',
  description:
    'Berechnen Sie die Kaufnebenkosten für Ihre Immobilie. Grunderwerbsteuer, Notarkosten, Grundbuchkosten und Maklerprovision auf einen Blick.',
}

export default function KaufnebenkostenRechnerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Kaufnebenkosten-Rechner</h1>
          <p className="text-secondary-600">
            Berechnen Sie schnell und einfach die anfallenden Nebenkosten beim Immobilienkauf. Die
            Grunderwerbsteuer variiert je nach Bundesland.
          </p>
        </div>

        <Suspense fallback={<div>Laden...</div>}>
          <KaufnebenkostenRechner />
        </Suspense>
      </div>
    </div>
  )
}
