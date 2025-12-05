import { Metadata } from 'next'
import { ManagedPropertyCard } from '@/components/hausverwaltung/ManagedPropertyCard'
import { serviceFactory } from '@/lib/services/ServiceFactory'

export const metadata: Metadata = {
  title: 'Hausverwaltung',
  description:
    'Professionelle Hausverwaltung in Eschweiler und Umgebung. Wir kümmern uns um Ihre Immobilie – von der Mieterbetreuung bis zur Instandhaltung.',
}

export default async function HausverwaltungPage() {
  const managedPropertyService = serviceFactory.getManagedPropertyService()
  const properties = await managedPropertyService.getAll()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Hausverwaltung</h1>
        <p className="text-secondary-600 max-w-2xl">
          Wir verwalten Ihre Immobilie professionell und zuverlässig. Von der Mieterbetreuung über
          die Nebenkostenabrechnung bis zur Instandhaltung – wir kümmern uns um alles.
        </p>
      </div>

      {/* Verwaltete Objekte */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Unsere verwalteten Objekte</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {properties.length} Objekt{properties.length !== 1 ? 'e' : ''} in der Verwaltung
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <ManagedPropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Leistungen */}
      <div className="bg-secondary-50 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Unsere Leistungen</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-2">Kaufmännische Verwaltung</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Mietbuchhaltung</li>
              <li>• Nebenkostenabrechnung</li>
              <li>• Mahnwesen</li>
              <li>• Wirtschaftsplanung</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-2">Technische Verwaltung</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Instandhaltung</li>
              <li>• Reparaturmanagement</li>
              <li>• Wartungsverträge</li>
              <li>• Modernisierungen</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-2">Mieterbetreuung</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ansprechpartner für Mieter</li>
              <li>• Wohnungsübergaben</li>
              <li>• Mietersuche</li>
              <li>• Konfliktmanagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
