import { Metadata } from 'next'
import { MietrenditeRechner } from '@/components/makler/MietrenditeRechner'

export const metadata: Metadata = {
  title: 'Mietrendite-Rechner',
  description:
    'Berechnen Sie Brutto- und Nettomietrendite, Cashflow, Eigenkapitalrendite und Profitabilität Ihrer Immobilieninvestition.',
}

export default function MietrenditeRechnerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Mietrendite- & Profitabilitätsrechner
        </h1>
        <p className="text-secondary-600 max-w-3xl">
          Analysieren Sie die Rentabilität Ihrer Immobilieninvestition. Berechnen Sie
          Brutto- und Nettomietrendite, Cashflow, Eigenkapitalrendite (ROE) und
          erstellen Sie detaillierte Tilgungs- und Cashflow-Pläne.
        </p>
      </div>

      <MietrenditeRechner />
    </div>
  )
}
