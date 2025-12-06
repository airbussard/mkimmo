import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Calendar, Tag, MessageSquare, Building2, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import { SupabaseEmailService } from '@/lib/services/supabase/SupabaseEmailService'
import { CONTACT_REQUEST_TYPE_NAMEN } from '@/types/contact'
import { ContactStatusSelect } from '@/components/admin/ContactStatusSelect'
import { ContactNotesEditor } from '@/components/admin/ContactNotesEditor'
import { EmailReplyForm } from '@/components/admin/EmailReplyForm'
import { EmailConversation } from '@/components/admin/EmailConversation'

interface PageProps {
  params: Promise<{ id: string }>
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

export default async function AnfrageDetailPage({ params }: PageProps) {
  const { id } = await params
  const contactService = new SupabaseContactService()
  const emailService = new SupabaseEmailService()

  const [request, emailMessages] = await Promise.all([
    contactService.getById(id),
    emailService.getMessagesByContactRequest(id),
  ])

  if (!request) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/anfragen"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">
            Anfrage von {request.name}
          </h1>
          <p className="text-secondary-600">
            {CONTACT_REQUEST_TYPE_NAMEN[request.type]}
          </p>
        </div>
        <ContactStatusSelect
          requestId={request.id}
          currentStatus={request.status}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nachricht */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                Nachricht
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.message ? (
                <p className="text-secondary-700 whitespace-pre-wrap">
                  {request.message}
                </p>
              ) : (
                <p className="text-secondary-400 italic">Keine Nachricht</p>
              )}
            </CardContent>
          </Card>

          {/* Zusätzliche Daten */}
          {request.metadata && Object.keys(request.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary-600" />
                  Zusätzliche Informationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(request.metadata).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-secondary-500 capitalize">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-secondary-900">
                        {typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Link zur angefragten Immobilie */}
                {request.type === 'makler_anfrage' && request.metadata?.propertyId ? (
                  <div className="pt-4 border-t">
                    <Link
                      href={`/makler/${String(request.metadata.propertyId)}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Building2 className="h-4 w-4" />
                      Zur Immobilie: {String(request.metadata.propertyTitle || 'Ansehen')}
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* E-Mail-Kommunikation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary-600" />
                E-Mail-Kommunikation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bisherige Nachrichten */}
              {emailMessages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-3">
                    Nachrichtenverlauf
                  </h4>
                  <EmailConversation messages={emailMessages} />
                </div>
              )}

              {/* Antwort-Formular */}
              <div className={emailMessages.length > 0 ? 'pt-4 border-t' : ''}>
                <h4 className="text-sm font-medium text-secondary-700 mb-3">
                  Antwort senden
                </h4>
                <EmailReplyForm
                  requestId={request.id}
                  ticketNumber={request.ticketNumber}
                  recipientName={request.name}
                  recipientEmail={request.email}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interne Notizen */}
          <Card>
            <CardHeader>
              <CardTitle>Interne Notizen</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactNotesEditor
                requestId={request.id}
                currentNotes={request.notes || ''}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Kontaktdaten */}
          <Card>
            <CardHeader>
              <CardTitle>Kontaktdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-secondary-500">Name</p>
                <p className="font-medium text-secondary-900">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">E-Mail</p>
                <a
                  href={`mailto:${request.email}`}
                  className="flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700"
                >
                  <Mail className="h-4 w-4" />
                  {request.email}
                </a>
              </div>
              {request.phone && (
                <div>
                  <p className="text-sm text-secondary-500">Telefon</p>
                  <a
                    href={`tel:${request.phone}`}
                    className="flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Phone className="h-4 w-4" />
                    {request.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meta-Informationen */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-secondary-500">Typ</p>
                <p className="font-medium text-secondary-900">
                  {CONTACT_REQUEST_TYPE_NAMEN[request.type]}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Eingegangen am</p>
                <p className="flex items-center gap-2 text-secondary-900">
                  <Calendar className="h-4 w-4 text-secondary-400" />
                  {formatDate(request.createdAt)}
                </p>
              </div>
              {request.updatedAt !== request.createdAt && (
                <div>
                  <p className="text-sm text-secondary-500">Zuletzt geändert</p>
                  <p className="text-secondary-900">
                    {formatDate(request.updatedAt)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={`mailto:${request.email}?subject=Re: Ihre Anfrage bei MK Immobilien`}
                className="block w-full px-4 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                E-Mail senden
              </a>
              {request.phone && (
                <a
                  href={`tel:${request.phone}`}
                  className="block w-full px-4 py-2 text-center bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                >
                  Anrufen
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
