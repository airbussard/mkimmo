'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Home, Building2, MapPin, Loader2, Search, Euro } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SupabaseUnitService } from '@/lib/services/supabase/SupabaseUnitService'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { Unit, UnitStatus } from '@/types/unit'
import { ManagedProperty } from '@/types/managed-property'
import { DeleteUnitButton } from '@/components/admin/DeleteUnitButton'

const STATUS_LABELS: Record<UnitStatus, string> = {
  vermietet: 'Vermietet',
  leer: 'Leer',
  renovierung: 'In Renovierung',
}

const STATUS_COLORS: Record<UnitStatus, string> = {
  vermietet: 'bg-green-100 text-green-700',
  leer: 'bg-yellow-100 text-yellow-700',
  renovierung: 'bg-blue-100 text-blue-700',
}

const TYPE_LABELS: Record<string, string> = {
  wohnung: 'Wohnung',
  gewerbe: 'Gewerbe',
  stellplatz: 'Stellplatz',
  lager: 'Lager',
}

export default function EinheitenPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [properties, setProperties] = useState<Record<string, ManagedProperty>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterProperty, setFilterProperty] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const unitService = new SupabaseUnitService()
      const propertyService = new SupabaseManagedPropertyService()

      const [unitsData, propertiesData] = await Promise.all([
        unitService.getAll(),
        propertyService.getAll(),
      ])

      setUnits(unitsData)

      // Create property lookup
      const propertyMap: Record<string, ManagedProperty> = {}
      propertiesData.forEach((p) => {
        propertyMap[p.id] = p
      })
      setProperties(propertyMap)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.einheitNummer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      properties[unit.objektId]?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProperty = !filterProperty || unit.objektId === filterProperty
    const matchesStatus = !filterStatus || unit.status === filterStatus

    return matchesSearch && matchesProperty && matchesStatus
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const propertyList = Object.values(properties)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Einheiten</h1>
          <p className="text-secondary-600">
            {units.length} Einheiten insgesamt
          </p>
        </div>
        <Link href="/admin/hausverwaltung/einheiten/neu">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neue Einheit
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Einheiten suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <select
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
          className="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle Objekte</option>
          {propertyList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Alle Status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Units List */}
      {filteredUnits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Home className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchQuery || filterProperty || filterStatus
                ? 'Keine Einheiten gefunden'
                : 'Noch keine Einheiten vorhanden'}
            </p>
            {!searchQuery && !filterProperty && !filterStatus && (
              <Link href="/admin/hausverwaltung/einheiten/neu">
                <Button className="mt-4">Erste Einheit anlegen</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Einheit
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Objekt
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Typ
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Fläche
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Miete
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-secondary-700">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-secondary-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-secondary-900">
                      {unit.einheitNummer}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {unit.etage}. Etage, {unit.lage}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-secondary-700">
                      <Building2 className="h-4 w-4 text-secondary-400" />
                      {properties[unit.objektId]?.name || 'Unbekannt'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary-700">
                    {TYPE_LABELS[unit.typ] || unit.typ}
                  </td>
                  <td className="px-4 py-3 text-secondary-700">
                    {unit.details.flaeche} m²
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-secondary-900">
                      {formatCurrency(unit.miete.warmmiete)}
                    </div>
                    <div className="text-xs text-secondary-500">
                      ({formatCurrency(unit.miete.kaltmiete)} kalt)
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        STATUS_COLORS[unit.status]
                      }`}
                    >
                      {STATUS_LABELS[unit.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/hausverwaltung/einheiten/${unit.id}`}>
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                      </Link>
                      <DeleteUnitButton
                        unitId={unit.id}
                        unitNumber={unit.einheitNummer}
                        onDeleted={loadData}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
