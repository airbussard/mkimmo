import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'
import { EmailQueueTable } from '@/components/admin/EmailQueueTable'

export default function EmailQueuePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/einstellungen/email"
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">E-Mail-Warteschlange</h1>
            <p className="text-secondary-600">
              Überwachen und verwalten Sie ausgehende E-Mails
            </p>
          </div>
        </div>
        <Link
          href="/admin/einstellungen/email"
          className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4" />
          E-Mail-Einstellungen
        </Link>
      </div>

      {/* Queue Table */}
      <EmailQueueTable />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Hinweise</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • E-Mails werden automatisch alle 5 Minuten durch einen Cron-Job verarbeitet
          </li>
          <li>
            • Fehlgeschlagene E-Mails werden bis zu 3x automatisch wiederholt
          </li>
          <li>
            • Mit &quot;Erneut versuchen&quot; können Sie eine E-Mail manuell zurücksetzen
          </li>
        </ul>
      </div>
    </div>
  )
}
