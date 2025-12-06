'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  SupabaseTaxRateService,
  TaxRate,
} from '@/lib/services/supabase/SupabaseSettingsService'

const BUNDESLAENDER = [
  { key: 'baden-wuerttemberg', label: 'Baden-Württemberg', defaultRate: 5.0 },
  { key: 'bayern', label: 'Bayern', defaultRate: 3.5 },
  { key: 'berlin', label: 'Berlin', defaultRate: 6.0 },
  { key: 'brandenburg', label: 'Brandenburg', defaultRate: 6.5 },
  { key: 'bremen', label: 'Bremen', defaultRate: 5.0 },
  { key: 'hamburg', label: 'Hamburg', defaultRate: 5.5 },
  { key: 'hessen', label: 'Hessen', defaultRate: 6.0 },
  { key: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern', defaultRate: 6.0 },
  { key: 'niedersachsen', label: 'Niedersachsen', defaultRate: 5.0 },
  { key: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen', defaultRate: 6.5 },
  { key: 'rheinland-pfalz', label: 'Rheinland-Pfalz', defaultRate: 5.0 },
  { key: 'saarland', label: 'Saarland', defaultRate: 6.5 },
  { key: 'sachsen', label: 'Sachsen', defaultRate: 5.5 },
  { key: 'sachsen-anhalt', label: 'Sachsen-Anhalt', defaultRate: 5.0 },
  { key: 'schleswig-holstein', label: 'Schleswig-Holstein', defaultRate: 6.5 },
  { key: 'thueringen', label: 'Thüringen', defaultRate: 5.0 },
]

export default function SteuernPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [dbRates, setDbRates] = useState<TaxRate[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const service = new SupabaseTaxRateService()
      const data = await service.getAll()
      setDbRates(data)

      // Initialize rates with DB values or defaults
      const rateMap: Record<string, number> = {}
      BUNDESLAENDER.forEach((bl) => {
        const dbRate = data.find((r) => r.bundesland === bl.key)
        rateMap[bl.key] = dbRate ? dbRate.rate : bl.defaultRate
      })
      setRates(rateMap)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRateChange = (bundesland: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setRates((prev) => ({ ...prev, [bundesland]: numValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const service = new SupabaseTaxRateService()

      // Update all rates
      for (const bl of BUNDESLAENDER) {
        await service.upsert(bl.key, rates[bl.key])
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/einstellungen"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">
            Grunderwerbsteuer
          </h1>
          <p className="text-secondary-600">
            Steuersätze für den Kaufnebenkosten-Rechner
          </p>
        </div>
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : saved ? (
            'Gespeichert!'
          ) : (
            <>
              <Save className="h-4 w-4" />
              Speichern
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg">
        <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Hinweis</p>
          <p>
            Diese Steuersätze werden im Kaufnebenkosten-Rechner verwendet. Die
            angegebenen Werte sind die aktuellen gesetzlichen Sätze (Stand 2024).
            Ändern Sie diese nur bei gesetzlichen Anpassungen.
          </p>
        </div>
      </div>

      {/* Tax Rates Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Steuersätze nach Bundesland</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BUNDESLAENDER.map((bl) => (
              <div key={bl.key} className="flex items-center gap-3">
                <label className="flex-1 text-sm text-secondary-700">
                  {bl.label}
                </label>
                <div className="relative w-24">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rates[bl.key] || ''}
                    onChange={(e) => handleRateChange(bl.key, e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {Math.min(...Object.values(rates)).toFixed(1)}%
              </p>
              <p className="text-sm text-secondary-600">Niedrigster Satz</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {Math.max(...Object.values(rates)).toFixed(1)}%
              </p>
              <p className="text-sm text-secondary-600">Höchster Satz</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {(
                  Object.values(rates).reduce((a, b) => a + b, 0) /
                  Object.values(rates).length
                ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-secondary-600">Durchschnitt</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">
                {rates['nordrhein-westfalen']?.toFixed(1)}%
              </p>
              <p className="text-sm text-secondary-600">NRW (unsere Region)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
