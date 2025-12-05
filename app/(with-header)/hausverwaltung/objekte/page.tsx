import { Metadata } from 'next'
import { Building2, Users, Layers, MapPin } from 'lucide-react'
import { ManagedPropertyCard } from '@/components/hausverwaltung/ManagedPropertyCard'
import { serviceFactory } from '@/lib/services/ServiceFactory'

export const metadata: Metadata = {
  title: 'Verwaltete Objekte',
  description: 'Übersicht unserer verwalteten Immobilien. Wohngebäude, Gewerbeimmobilien und gemischt genutzte Objekte.',
}

export default async function ObjektePage() {
  const managedPropertyService = serviceFactory.getManagedPropertyService()
  const properties = await managedPropertyService.getAll()

  // Statistiken berechnen
  const totalUnits = properties.reduce((sum, p) => sum + p.gebaeude.anzahlEinheiten, 0)
  const totalArea = properties.reduce((sum, p) => sum + p.gebaeude.gesamtflaeche, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Verwaltete Objekte</h1>
        <p className="text-secondary-600">
          Übersicht über die von uns professionell verwalteten Immobilien in der Region.
        </p>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-center">
          <Building2 className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-600">{properties.length}</div>
          <div className="text-sm text-secondary-600">Objekte</div>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-600">{totalUnits}</div>
          <div className="text-sm text-secondary-600">Wohneinheiten</div>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-center">
          <Layers className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-600">{totalArea.toLocaleString('de-DE')}</div>
          <div className="text-sm text-secondary-600">m² Fläche</div>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-center">
          <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-600">3</div>
          <div className="text-sm text-secondary-600">Städte</div>
        </div>
      </div>

      {/* Objekt-Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <ManagedPropertyCard key={property.id} property={property} />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-500">
            Keine verwalteten Objekte gefunden.
          </p>
        </div>
      )}
    </div>
  )
}
