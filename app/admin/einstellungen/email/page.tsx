import Link from 'next/link'
import { ArrowLeft, Mail, Inbox } from 'lucide-react'
import { EmailSettingsForm } from '@/components/admin/EmailSettingsForm'

export default function EmailSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/einstellungen"
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary-600" />
              E-Mail-Einstellungen
            </h1>
            <p className="text-secondary-600 mt-1">
              Konfigurieren Sie SMTP und IMAP für den E-Mail-Versand und -Empfang
            </p>
          </div>
        </div>
        <Link
          href="/admin/einstellungen/email-queue"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Inbox className="h-4 w-4" />
          Warteschlange
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Hinweis zur Einrichtung</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>SMTP</strong>: Wird für das Senden von E-Mails verwendet (Antworten auf Anfragen)
          </li>
          <li>
            • <strong>IMAP</strong>: Wird für das Empfangen von E-Mails verwendet (neue Nachrichten zu Anfragen)
          </li>
          <li>
            • Für Strato: SMTP-Port 465 (SSL), IMAP-Port 993 (SSL)
          </li>
          <li>
            • Die Cron-Jobs für E-Mail-Verarbeitung müssen separat bei cron-job.org eingerichtet werden
          </li>
        </ul>
      </div>

      {/* Settings Form */}
      <EmailSettingsForm />

      {/* Cron Info */}
      <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
        <h3 className="font-medium text-secondary-800 mb-2">Cron-Job URLs</h3>
        <p className="text-sm text-secondary-600 mb-3">
          Richten Sie diese URLs bei cron-job.org ein (alle 5 Minuten):
        </p>
        <div className="space-y-2 font-mono text-xs bg-white p-3 rounded border">
          <p className="break-all">
            <span className="text-secondary-500">Queue:</span>{' '}
            https://moellerknabe.de/api/cron/process-email-queue
          </p>
          <p className="break-all">
            <span className="text-secondary-500">Fetch:</span>{' '}
            https://moellerknabe.de/api/cron/fetch-emails
          </p>
        </div>
      </div>
    </div>
  )
}
