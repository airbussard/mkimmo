import Link from 'next/link'
import { Plus, Building2, Pencil, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabasePropertyService } from '@/lib/services/supabase/SupabasePropertyService'
import { PROPERTY_TYPE_NAMEN, PROPERTY_STATUS_NAMEN } from '@/types/property'
import { DeletePropertyButton } from '@/components/admin/DeletePropertyButton'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'verfuegbar':
      return 'bg-green-100 text-green-800'
    case 'reserviert':
      return 'bg-yellow-100 text-yellow-800'
    case 'verkauft':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default async function AdminImmobilienPage() {
  const propertyService = new SupabasePropertyService()
  const properties = await propertyService.getAll()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Immobilien</h1>
          <p className="text-secondary-600 mt-1">
            {properties.length} Immobilie{properties.length !== 1 ? 'n' : ''} verwalten
          </p>
        </div>
        <Link href="/admin/immobilien/neu">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neue Immobilie
          </Button>
        </Link>
      </div>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-600" />
            Alle Immobilien
          </CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Keine Immobilien vorhanden
              </h3>
              <p className="text-secondary-600 mb-4">
                Erstellen Sie Ihre erste Immobilie, um loszulegen.
              </p>
              <Link href="/admin/immobilien/neu">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Erste Immobilie anlegen
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Titel
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Typ
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Ort
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Preis
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-secondary-600">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-secondary-100 hover:bg-secondary-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {property.titel}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {property.slug}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-700">
                        {PROPERTY_TYPE_NAMEN[property.typ]}
                      </td>
                      <td className="py-3 px-4 text-secondary-700">
                        {property.adresse.ort}
                      </td>
                      <td className="py-3 px-4 font-medium text-secondary-900">
                        {formatPrice(property.preis)}
                        {property.preistyp === 'miete' && (
                          <span className="text-sm text-secondary-500">/Monat</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {PROPERTY_STATUS_NAMEN[property.status]}
                        </span>
                        {property.hervorgehoben && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/makler/${property.id}`}
                            target="_blank"
                            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                            title="Ansehen"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/immobilien/${property.id}`}
                            className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Bearbeiten"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeletePropertyButton
                            propertyId={property.id}
                            propertyTitle={property.titel}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
