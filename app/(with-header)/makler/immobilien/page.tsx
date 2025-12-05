import { Metadata } from 'next'
import { PropertyFilters } from '@/components/makler/PropertyFilters'
import { PropertyGrid } from '@/components/makler/PropertyGrid'
import { serviceFactory } from '@/lib/services/ServiceFactory'

export const metadata: Metadata = {
  title: 'Immobilien',
  description:
    'Entdecken Sie unser aktuelles Angebot an Immobilien in Eschweiler und der Städteregion Aachen. Häuser, Wohnungen, Grundstücke und Gewerbeimmobilien.',
}

export default async function ImmobilienPage() {
  const propertyService = serviceFactory.getPropertyService()
  const properties = await propertyService.getAll()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Immobilien</h1>
        <p className="text-secondary-600">
          Entdecken Sie unser aktuelles Angebot an Immobilien in Eschweiler und Umgebung.
        </p>
      </div>

      <PropertyFilters />
      <PropertyGrid properties={properties} />
    </div>
  )
}
