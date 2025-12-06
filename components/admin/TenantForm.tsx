'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabaseTenantService, SupabaseUnitService } from '@/lib/services/supabase/SupabaseUnitService'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { Tenant, TenantStatus, LeaseInfo } from '@/types/tenant'
import { Unit } from '@/types/unit'
import { ManagedProperty } from '@/types/managed-property'

interface TenantFormProps {
  tenant?: Tenant
  isEdit?: boolean
  preselectedUnitId?: string
}

const TENANT_STATUSES: { value: TenantStatus; label: string }[] = [
  { value: 'aktiv', label: 'Aktiv' },
  { value: 'gekuendigt', label: 'Gekündigt' },
  { value: 'ausstehend', label: 'Ausstehend' },
]

const LEASE_TYPES: { value: LeaseInfo['typ']; label: string }[] = [
  { value: 'unbefristet', label: 'Unbefristet' },
  { value: 'befristet', label: 'Befristet' },
]

export function TenantForm({ tenant, isEdit, preselectedUnitId }: TenantFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [properties, setProperties] = useState<Record<string, ManagedProperty>>({})
  const [loadingUnits, setLoadingUnits] = useState(true)

  // Form state
  const [einheitId, setEinheitId] = useState(tenant?.einheitId || preselectedUnitId || '')
  const [name, setName] = useState(tenant?.name || '')
  const [email, setEmail] = useState(tenant?.email || '')
  const [telefon, setTelefon] = useState(tenant?.telefon || '')
  const [bewohner, setBewohner] = useState(tenant?.bewohner || 1)
  const [status, setStatus] = useState<TenantStatus>(tenant?.status || 'aktiv')

  // Lease
  const [beginn, setBeginn] = useState(tenant?.mietvertrag.beginn || '')
  const [ende, setEnde] = useState(tenant?.mietvertrag.ende || '')
  const [typ, setTyp] = useState<LeaseInfo['typ']>(tenant?.mietvertrag.typ || 'unbefristet')
  const [kuendigungsfrist, setKuendigungsfrist] = useState(tenant?.mietvertrag.kuendigungsfrist || 3)

  useEffect(() => {
    const loadData = async () => {
      try {
        const unitService = new SupabaseUnitService()
        const propertyService = new SupabaseManagedPropertyService()

        const [unitsData, propertiesData] = await Promise.all([
          unitService.getAll(),
          propertyService.getAll(),
        ])

        setUnits(unitsData)

        const propertyMap: Record<string, ManagedProperty> = {}
        propertiesData.forEach((p) => {
          propertyMap[p.id] = p
        })
        setProperties(propertyMap)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoadingUnits(false)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!einheitId) {
      setError('Bitte wählen Sie eine Einheit aus')
      setLoading(false)
      return
    }

    try {
      const service = new SupabaseTenantService()

      const tenantData = {
        einheitId,
        name,
        email,
        telefon,
        bewohner,
        status,
        mietvertrag: {
          beginn,
          ende: typ === 'befristet' ? ende : undefined,
          typ,
          kuendigungsfrist,
        },
      }

      if (isEdit && tenant) {
        await service.update(tenant.id, tenantData)
      } else {
        await service.create(tenantData)
      }

      router.push('/admin/hausverwaltung/mieter')
      router.refresh()
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  // Group units by property
  const unitsByProperty: Record<string, { property: ManagedProperty; units: Unit[] }> = {}
  units.forEach((unit) => {
    const property = properties[unit.objektId]
    if (property) {
      if (!unitsByProperty[unit.objektId]) {
        unitsByProperty[unit.objektId] = { property, units: [] }
      }
      unitsByProperty[unit.objektId].units.push(unit)
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/hausverwaltung/mieter"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Mieter bearbeiten' : 'Neuer Mieter'}
          </h1>
        </div>
        <Button type="submit" disabled={loading || loadingUnits} className="gap-2">
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
              <CardTitle>Mieterdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Einheit *
                </label>
                <select
                  value={einheitId}
                  onChange={(e) => setEinheitId(e.target.value)}
                  required
                  disabled={loadingUnits}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                >
                  <option value="">Einheit auswählen...</option>
                  {Object.entries(unitsByProperty).map(([propertyId, { property, units: propertyUnits }]) => (
                    <optgroup key={propertyId} label={property.name}>
                      {propertyUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.einheitNummer} - {unit.details.flaeche} m², {unit.details.zimmer} Zimmer
                          {unit.status === 'vermietet' && ' (bereits vermietet)'}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Vor- und Nachname"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="email@beispiel.de"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Anzahl Bewohner
                </label>
                <input
                  type="number"
                  min="1"
                  value={bewohner}
                  onChange={(e) => setBewohner(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mietvertrag */}
          <Card>
            <CardHeader>
              <CardTitle>Mietvertrag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Mietbeginn *
                  </label>
                  <input
                    type="date"
                    value={beginn}
                    onChange={(e) => setBeginn(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Vertragsart
                  </label>
                  <select
                    value={typ}
                    onChange={(e) => setTyp(e.target.value as LeaseInfo['typ'])}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {LEASE_TYPES.map((lt) => (
                      <option key={lt.value} value={lt.value}>
                        {lt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {typ === 'befristet' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Mietende
                  </label>
                  <input
                    type="date"
                    value={ende}
                    onChange={(e) => setEnde(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Kündigungsfrist (Monate)
                </label>
                <input
                  type="number"
                  min="0"
                  value={kuendigungsfrist}
                  onChange={(e) => setKuendigungsfrist(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
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
                onChange={(e) => setStatus(e.target.value as TenantStatus)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {TENANT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hinweis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-600">
                Bei Anlage eines neuen Mieters wird der Status der zugehörigen
                Einheit automatisch auf &quot;vermietet&quot; gesetzt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
