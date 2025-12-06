'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Building2, MapPin, Users, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { ManagedProperty } from '@/types/managed-property'
import { DeleteManagedPropertyButton } from '@/components/admin/DeleteManagedPropertyButton'

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  wohngebaeude: 'Wohngebäude',
  gewerbe: 'Gewerbe',
  gemischt: 'Gemischt',
}

export default function ObjektePage() {
  const [properties, setProperties] = useState<ManagedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const service = new SupabaseManagedPropertyService()
      const data = await service.getAll()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.adresse.ort.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.adresse.strasse.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-secondary-900">
            Verwaltungsobjekte
          </h1>
          <p className="text-secondary-600">
            {properties.length} Objekte in der Verwaltung
          </p>
        </div>
        <Link href="/admin/hausverwaltung/objekte/neu">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neues Objekt
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
        <input
          type="text"
          placeholder="Objekte suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchQuery
                ? 'Keine Objekte gefunden'
                : 'Noch keine Objekte vorhanden'}
            </p>
            {!searchQuery && (
              <Link href="/admin/hausverwaltung/objekte/neu">
                <Button className="mt-4">Erstes Objekt anlegen</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="aspect-video bg-secondary-100 relative">
                {property.bilder?.[0]?.url ? (
                  <img
                    src={property.bilder[0].url}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-secondary-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-medium bg-white/90 rounded">
                    {PROPERTY_TYPE_LABELS[property.typ] || property.typ}
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                  {property.name}
                </h3>

                <div className="space-y-2 text-sm text-secondary-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.adresse.strasse} {property.adresse.hausnummer},{' '}
                      {property.adresse.plz} {property.adresse.ort}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{property.gebaeude.anzahlEinheiten} Einheiten</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/hausverwaltung/objekte/${property.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Bearbeiten
                    </Button>
                  </Link>
                  <DeleteManagedPropertyButton
                    propertyId={property.id}
                    propertyName={property.name}
                    onDeleted={loadProperties}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
