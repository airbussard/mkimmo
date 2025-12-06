'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Home,
  Users,
  ArrowRight,
  Loader2,
  Euro,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { SupabaseUnitService, SupabaseTenantService } from '@/lib/services/supabase/SupabaseUnitService'
import { ManagedProperty } from '@/types/managed-property'
import { Unit } from '@/types/unit'
import { Tenant } from '@/types/tenant'

export default function HausverwaltungDashboard() {
  const [properties, setProperties] = useState<ManagedProperty[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const propertyService = new SupabaseManagedPropertyService()
        const unitService = new SupabaseUnitService()
        const tenantService = new SupabaseTenantService()

        const [propertiesData, unitsData, tenantsData] = await Promise.all([
          propertyService.getAll(),
          unitService.getAll(),
          tenantService.getAll(),
        ])

        setProperties(propertiesData)
        setUnits(unitsData)
        setTenants(tenantsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Calculate stats
  const vermieteteEinheiten = units.filter((u) => u.status === 'vermietet').length
  const leereEinheiten = units.filter((u) => u.status === 'leer').length
  const aktiveMieter = tenants.filter((t) => t.status === 'aktiv').length
  const gekuendigteMieter = tenants.filter((t) => t.status === 'gekuendigt').length

  const gesamtMiete = units
    .filter((u) => u.status === 'vermietet')
    .reduce((sum, u) => sum + u.miete.warmmiete, 0)

  const vermietungsquote = units.length > 0
    ? Math.round((vermieteteEinheiten / units.length) * 100)
    : 0

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Hausverwaltung
        </h1>
        <p className="text-secondary-600">
          Übersicht über alle verwalteten Objekte
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Objekte</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {properties.length}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Einheiten</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {units.length}
                </p>
                <p className="text-xs text-secondary-500 mt-1">
                  {vermieteteEinheiten} vermietet, {leereEinheiten} leer
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Mieter</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {aktiveMieter}
                </p>
                {gekuendigteMieter > 0 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    {gekuendigteMieter} gekündigt
                  </p>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Vermietungsquote</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {vermietungsquote}%
                </p>
                <p className="text-xs text-secondary-500 mt-1">
                  {formatCurrency(gesamtMiete)}/Monat
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              Objekte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-600 text-sm mb-4">
              Verwalten Sie Ihre Wohn- und Gewerbeobjekte
            </p>
            <Link href="/admin/hausverwaltung/objekte">
              <Button variant="outline" className="w-full gap-2">
                Zu den Objekten
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Einheiten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-600 text-sm mb-4">
              Wohnungen, Gewerbeeinheiten und Stellplätze
            </p>
            <Link href="/admin/hausverwaltung/einheiten">
              <Button variant="outline" className="w-full gap-2">
                Zu den Einheiten
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Mieter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-600 text-sm mb-4">
              Mieterdaten und Mietverträge verwalten
            </p>
            <Link href="/admin/hausverwaltung/mieter">
              <Button variant="outline" className="w-full gap-2">
                Zu den Mietern
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(leereEinheiten > 0 || gekuendigteMieter > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Hinweise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leereEinheiten > 0 && (
              <p className="text-sm text-yellow-700">
                • {leereEinheiten} {leereEinheiten === 1 ? 'Einheit ist' : 'Einheiten sind'} derzeit nicht vermietet
              </p>
            )}
            {gekuendigteMieter > 0 && (
              <p className="text-sm text-yellow-700">
                • {gekuendigteMieter} {gekuendigteMieter === 1 ? 'Mieter hat' : 'Mieter haben'} gekündigt
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Properties */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verwaltete Objekte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {properties.slice(0, 5).map((property) => {
                const propertyUnits = units.filter((u) => u.objektId === property.id)
                const vermietete = propertyUnits.filter((u) => u.status === 'vermietet').length

                return (
                  <Link
                    key={property.id}
                    href={`/admin/hausverwaltung/objekte/${property.id}`}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-secondary-900">
                        {property.name}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {property.adresse.strasse} {property.adresse.hausnummer},{' '}
                        {property.adresse.plz} {property.adresse.ort}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary-900">
                        {vermietete}/{propertyUnits.length} vermietet
                      </p>
                      <p className="text-xs text-secondary-500">
                        {propertyUnits.length > 0
                          ? `${Math.round((vermietete / propertyUnits.length) * 100)}%`
                          : '0%'}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
