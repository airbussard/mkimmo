import Link from 'next/link'
import { MessageSquare, Eye, Mail, Phone, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import {
  CONTACT_REQUEST_TYPE_NAMEN,
} from '@/types/contact'
import { DeleteContactRequestButton } from '@/components/admin/DeleteContactRequestButton'
import { ContactStatusSelect } from '@/components/admin/ContactStatusSelect'
import { ClickableTableRow } from '@/components/admin/ClickableTableRow'

function getStatusColor(status: string): string {
  switch (status) {
    case 'neu':
      return 'bg-blue-100 text-blue-800'
    case 'in_bearbeitung':
      return 'bg-yellow-100 text-yellow-800'
    case 'erledigt':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AdminAnfragenPage() {
  const contactService = new SupabaseContactService()
  const requests = await contactService.getAll()

  const newCount = requests.filter((r) => r.status === 'neu').length
  const inProgressCount = requests.filter((r) => r.status === 'in_bearbeitung').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Anfragen</h1>
        <p className="text-secondary-600 mt-1">
          {requests.length} Anfrage{requests.length !== 1 ? 'n' : ''} gesamt
          {newCount > 0 && (
            <span className="ml-2 text-blue-600">({newCount} neu)</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Neue Anfragen</p>
                <p className="text-2xl font-bold text-blue-600">{newCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">In Bearbeitung</p>
                <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Gesamt</p>
                <p className="text-2xl font-bold text-secondary-900">{requests.length}</p>
              </div>
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Mail className="h-5 w-5 text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            Alle Anfragen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Keine Anfragen vorhanden
              </h3>
              <p className="text-secondary-600">
                Neue Anfragen erscheinen hier, sobald jemand ein Kontaktformular ausfüllt.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Kontakt
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Typ
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Nachricht
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      Datum
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
                  {requests.map((request) => (
                    <ClickableTableRow
                      key={request.id}
                      href={`/admin/anfragen/${request.id}`}
                      className={`border-b border-secondary-100 hover:bg-secondary-50 ${
                        request.status === 'neu' ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {request.name}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-secondary-500">
                            <a
                              href={`mailto:${request.email}`}
                              className="flex items-center gap-1 hover:text-primary-600"
                            >
                              <Mail className="h-3 w-3" />
                              {request.email}
                            </a>
                            {request.phone && (
                              <a
                                href={`tel:${request.phone}`}
                                className="flex items-center gap-1 hover:text-primary-600"
                              >
                                <Phone className="h-3 w-3" />
                                {request.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-secondary-700">
                          {CONTACT_REQUEST_TYPE_NAMEN[request.type]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-secondary-600 truncate max-w-xs">
                          {request.message || '-'}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-secondary-700">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <ContactStatusSelect
                          requestId={request.id}
                          currentStatus={request.status}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/anfragen/${request.id}`}
                            className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <DeleteContactRequestButton
                            requestId={request.id}
                            requestName={request.name}
                          />
                        </div>
                      </td>
                    </ClickableTableRow>
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
