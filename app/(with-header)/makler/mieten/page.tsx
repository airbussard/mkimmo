import { Metadata } from 'next'
import { PropertyFilters } from '@/components/makler/PropertyFilters'
import { PropertyGrid } from '@/components/makler/PropertyGrid'
import { serviceFactory } from '@/lib/services/ServiceFactory'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Immobilien mieten',
  description:
    'Mietwohnungen und Häuser zur Miete in Eschweiler und der Städteregion Aachen.',
}

export default async function MietenPage() {
  const propertyService = serviceFactory.getPropertyService()
  const allProperties = await propertyService.getAll()
  const properties = allProperties.filter((p) => p.preistyp === 'miete')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Immobilien mieten</h1>
        <p className="text-secondary-600">
          Finden Sie Ihre neue Mietwohnung oder Ihr Miethaus in Eschweiler und Umgebung.
        </p>
      </div>

      <PropertyFilters />
      <PropertyGrid properties={properties} />

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-500">
            Aktuell sind keine Mietobjekte verfügbar. Bitte schauen Sie später wieder vorbei
            oder kontaktieren Sie uns für eine Vormerkung.
          </p>
        </div>
      )}
    </div>
  )
}
