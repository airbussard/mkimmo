'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Users, Home, Mail, Phone, Loader2, Search, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SupabaseTenantService, SupabaseUnitService } from '@/lib/services/supabase/SupabaseUnitService'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { Tenant, TenantStatus } from '@/types/tenant'
import { Unit } from '@/types/unit'
import { ManagedProperty } from '@/types/managed-property'
import { DeleteTenantButton } from '@/components/admin/DeleteTenantButton'

const STATUS_LABELS: Record<TenantStatus, string> = {
  aktiv: 'Aktiv',
  gekuendigt: 'Gekündigt',
  ausstehend: 'Ausstehend',
}

const STATUS_COLORS: Record<TenantStatus, string> = {
  aktiv: 'bg-green-100 text-green-700',
  gekuendigt: 'bg-yellow-100 text-yellow-700',
  ausstehend: 'bg-secondary-100 text-secondary-700',
}

export default function MieterPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [units, setUnits] = useState<Record<string, Unit>>({})
  const [properties, setProperties] = useState<Record<string, ManagedProperty>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const tenantService = new SupabaseTenantService()
      const unitService = new SupabaseUnitService()
      const propertyService = new SupabaseManagedPropertyService()

      const [tenantsData, unitsData, propertiesData] = await Promise.all([
        tenantService.getAll(),
        unitService.getAll(),
        propertyService.getAll(),
      ])

      setTenants(tenantsData)

      // Create lookups
      const unitMap: Record<string, Unit> = {}
      unitsData.forEach((u) => {
        unitMap[u.id] = u
      })
      setUnits(unitMap)

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

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !filterStatus || tenant.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('de-DE')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Mieter</h1>
          <p className="text-secondary-600">
            {tenants.filter((t) => t.status === 'aktiv').length} aktive Mietverhältnisse
          </p>
        </div>
        <Link href="/admin/hausverwaltung/mieter/neu">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neuer Mieter
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Mieter suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

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

      {/* Tenants List */}
      {filteredTenants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchQuery || filterStatus
                ? 'Keine Mieter gefunden'
                : 'Noch keine Mieter vorhanden'}
            </p>
            {!searchQuery && !filterStatus && (
              <Link href="/admin/hausverwaltung/mieter/neu">
                <Button className="mt-4">Ersten Mieter anlegen</Button>
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
                  Mieter
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Einheit
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Kontakt
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-secondary-700">
                  Mietbeginn
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
              {filteredTenants.map((tenant) => {
                const unit = units[tenant.einheitId]
                const property = unit ? properties[unit.objektId] : null

                return (
                  <tr key={tenant.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-secondary-900">
                        {tenant.name}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {tenant.bewohner} {tenant.bewohner === 1 ? 'Bewohner' : 'Bewohner'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {unit ? (
                        <div>
                          <div className="flex items-center gap-2 text-secondary-700">
                            <Home className="h-4 w-4 text-secondary-400" />
                            {unit.einheitNummer}
                          </div>
                          {property && (
                            <div className="text-sm text-secondary-500">
                              {property.name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-secondary-400">Keine Einheit</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {tenant.email && (
                          <a
                            href={`mailto:${tenant.email}`}
                            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                          >
                            <Mail className="h-3 w-3" />
                            {tenant.email}
                          </a>
                        )}
                        {tenant.telefon && (
                          <a
                            href={`tel:${tenant.telefon}`}
                            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                          >
                            <Phone className="h-3 w-3" />
                            {tenant.telefon}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-secondary-700">
                        <Calendar className="h-4 w-4 text-secondary-400" />
                        {formatDate(tenant.mietvertrag.beginn)}
                      </div>
                      {tenant.mietvertrag.ende && (
                        <div className="text-sm text-secondary-500">
                          bis {formatDate(tenant.mietvertrag.ende)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          STATUS_COLORS[tenant.status]
                        }`}
                      >
                        {STATUS_LABELS[tenant.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/hausverwaltung/mieter/${tenant.id}`}>
                          <Button variant="outline" size="sm">
                            Bearbeiten
                          </Button>
                        </Link>
                        <DeleteTenantButton
                          tenantId={tenant.id}
                          tenantName={tenant.name}
                          onDeleted={loadData}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
