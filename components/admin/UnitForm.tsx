'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabaseUnitService } from '@/lib/services/supabase/SupabaseUnitService'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { Unit, UnitType, UnitStatus } from '@/types/unit'
import { ManagedProperty } from '@/types/managed-property'

interface UnitFormProps {
  unit?: Unit
  isEdit?: boolean
  preselectedPropertyId?: string
}

const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: 'wohnung', label: 'Wohnung' },
  { value: 'gewerbe', label: 'Gewerbe' },
  { value: 'stellplatz', label: 'Stellplatz' },
  { value: 'lager', label: 'Lager' },
]

const UNIT_STATUSES: { value: UnitStatus; label: string }[] = [
  { value: 'vermietet', label: 'Vermietet' },
  { value: 'leer', label: 'Leer' },
  { value: 'renovierung', label: 'In Renovierung' },
]

const LOCATIONS = [
  { value: 'links', label: 'Links' },
  { value: 'mitte', label: 'Mitte' },
  { value: 'rechts', label: 'Rechts' },
  { value: 'hinten', label: 'Hinten' },
]

export function UnitForm({ unit, isEdit, preselectedPropertyId }: UnitFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<ManagedProperty[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)

  // Form state
  const [objektId, setObjektId] = useState(unit?.objektId || preselectedPropertyId || '')
  const [einheitNummer, setEinheitNummer] = useState(unit?.einheitNummer || '')
  const [etage, setEtage] = useState(unit?.etage || 0)
  const [lage, setLage] = useState<Unit['lage']>(unit?.lage || 'mitte')
  const [typ, setTyp] = useState<UnitType>(unit?.typ || 'wohnung')
  const [status, setStatus] = useState<UnitStatus>(unit?.status || 'leer')

  // Details
  const [flaeche, setFlaeche] = useState(unit?.details.flaeche || 0)
  const [zimmer, setZimmer] = useState(unit?.details.zimmer || 0)
  const [schlafzimmer, setSchlafzimmer] = useState(unit?.details.schlafzimmer || 0)
  const [badezimmer, setBadezimmer] = useState(unit?.details.badezimmer || 0)
  const [balkon, setBalkon] = useState(unit?.details.balkon || false)
  const [balkonFlaeche, setBalkonFlaeche] = useState(unit?.details.balkonFlaeche || 0)
  const [keller, setKeller] = useState(unit?.details.keller || false)
  const [kellerFlaeche, setKellerFlaeche] = useState(unit?.details.kellerFlaeche || 0)

  // Rent
  const [kaltmiete, setKaltmiete] = useState(unit?.miete.kaltmiete || 0)
  const [nebenkosten, setNebenkosten] = useState(unit?.miete.nebenkosten || 0)
  const [kaution, setKaution] = useState(unit?.miete.kaution || 0)

  const warmmiete = kaltmiete + nebenkosten

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const service = new SupabaseManagedPropertyService()
        const data = await service.getAll()
        setProperties(data)
      } catch (error) {
        console.error('Error loading properties:', error)
      } finally {
        setLoadingProperties(false)
      }
    }

    loadProperties()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!objektId) {
      setError('Bitte wählen Sie ein Objekt aus')
      setLoading(false)
      return
    }

    try {
      const service = new SupabaseUnitService()

      const unitData = {
        objektId,
        einheitNummer,
        etage,
        lage,
        typ,
        status,
        details: {
          flaeche,
          zimmer,
          schlafzimmer,
          badezimmer,
          balkon,
          balkonFlaeche: balkon ? balkonFlaeche : undefined,
          keller,
          kellerFlaeche: keller ? kellerFlaeche : undefined,
        },
        miete: {
          kaltmiete,
          nebenkosten,
          warmmiete,
          kaution,
        },
        dokumente: unit?.dokumente || [],
      }

      if (isEdit && unit) {
        await service.update(unit.id, unitData)
      } else {
        await service.create(unitData)
      }

      router.push('/admin/hausverwaltung/einheiten')
      router.refresh()
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/hausverwaltung/einheiten"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Einheit bearbeiten' : 'Neue Einheit'}
          </h1>
        </div>
        <Button type="submit" disabled={loading || loadingProperties} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Speichern...
            </>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grunddaten */}
          <Card>
            <CardHeader>
              <CardTitle>Grunddaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Objekt *
                </label>
                <select
                  value={objektId}
                  onChange={(e) => setObjektId(e.target.value)}
                  required
                  disabled={loadingProperties}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                >
                  <option value="">Objekt auswählen...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.adresse.strasse} {p.adresse.hausnummer}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Einheit Nr. *
                  </label>
                  <input
                    type="text"
                    value={einheitNummer}
                    onChange={(e) => setEinheitNummer(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="z.B. WE01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Etage
                  </label>
                  <input
                    type="number"
                    value={etage}
                    onChange={(e) => setEtage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Lage
                  </label>
                  <select
                    value={lage}
                    onChange={(e) => setLage(e.target.value as Unit['lage'])}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Typ *
                  </label>
                  <select
                    value={typ}
                    onChange={(e) => setTyp(e.target.value as UnitType)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {UNIT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Fläche (m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={flaeche || ''}
                    onChange={(e) => setFlaeche(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Zimmer
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={zimmer || ''}
                    onChange={(e) => setZimmer(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Schlafzimmer
                  </label>
                  <input
                    type="number"
                    value={schlafzimmer || ''}
                    onChange={(e) => setSchlafzimmer(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Badezimmer
                  </label>
                  <input
                    type="number"
                    value={badezimmer || ''}
                    onChange={(e) => setBadezimmer(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={balkon}
                      onChange={(e) => setBalkon(e.target.checked)}
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      Balkon vorhanden
                    </span>
                  </label>
                  {balkon && (
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">
                        Balkonfläche (m²)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={balkonFlaeche || ''}
                        onChange={(e) => setBalkonFlaeche(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keller}
                      onChange={(e) => setKeller(e.target.checked)}
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      Keller vorhanden
                    </span>
                  </label>
                  {keller && (
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">
                        Kellerfläche (m²)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={kellerFlaeche || ''}
                        onChange={(e) => setKellerFlaeche(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Miete */}
          <Card>
            <CardHeader>
              <CardTitle>Mietkonditionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Kaltmiete (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={kaltmiete || ''}
                    onChange={(e) => setKaltmiete(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Nebenkosten (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nebenkosten || ''}
                    onChange={(e) => setNebenkosten(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Warmmiete (€)
                  </label>
                  <input
                    type="number"
                    value={warmmiete}
                    disabled
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Kaution (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={kaution || ''}
                    onChange={(e) => setKaution(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UnitStatus)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {UNIT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Übersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Kaltmiete</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(kaltmiete)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Nebenkosten</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(nebenkosten)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm">
                <span className="text-secondary-900 font-medium">Warmmiete</span>
                <span className="font-bold text-primary-600">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(warmmiete)}
                </span>
              </div>
              {flaeche > 0 && (
                <div className="border-t pt-2 flex justify-between text-sm">
                  <span className="text-secondary-600">€/m² (kalt)</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(kaltmiete / flaeche)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
