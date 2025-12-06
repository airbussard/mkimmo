'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RotateCcw,
  Trash2,
  Mail,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EmailQueueItem, EmailQueueStatus } from '@/types/email'

interface QueueStats {
  total: number
  pending: number
  processing: number
  sent: number
  failed: number
}

const TYPE_LABELS: Record<string, string> = {
  reply: 'Antwort',
  confirmation: 'Bestätigung',
  notification: 'Benachrichtigung',
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Gerade eben'
  if (diffMins < 60) return `vor ${diffMins} Min.`
  if (diffHours < 24) return `vor ${diffHours} Std.`
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: EmailQueueStatus }) {
  const config: Record<
    string,
    { bg: string; text: string; icon: typeof Clock; label: string; spin?: boolean }
  > = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: Clock,
      label: 'Wartend',
    },
    processing: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: RefreshCw,
      label: 'Wird gesendet',
      spin: true,
    },
    sent: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: CheckCircle,
      label: 'Gesendet',
    },
    failed: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: AlertCircle,
      label: 'Fehlgeschlagen',
    },
  }

  const cfg = config[status] || config.pending
  const Icon = cfg.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <Icon className={`h-3.5 w-3.5 ${cfg.spin ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  icon: React.ElementType
  color: 'gray' | 'yellow' | 'green' | 'red' | 'blue'
}) {
  const colors = {
    gray: 'bg-secondary-100 text-secondary-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-900">{value}</p>
            <p className="text-sm text-secondary-500">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EmailQueueTable() {
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [items, setItems] = useState<EmailQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<EmailQueueStatus | 'all'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const statusParam = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/email-queue${statusParam}`)
      const data = await response.json()
      setStats(data.stats)
      setItems(data.items)
    } catch (error) {
      console.error('Error fetching queue data:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRetry = async (id: string) => {
    setActionLoading(id)
    try {
      await fetch(`/api/admin/email-queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry' }),
      })
      await fetchData()
    } catch (error) {
      console.error('Error retrying email:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Soll diese E-Mail wirklich gelöscht werden?')) return

    setActionLoading(id)
    try {
      await fetch(`/api/admin/email-queue/${id}`, { method: 'DELETE' })
      await fetchData()
    } catch (error) {
      console.error('Error deleting email:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filterButtons: { label: string; value: EmailQueueStatus | 'all' }[] = [
    { label: 'Alle', value: 'all' },
    { label: 'Wartend', value: 'pending' },
    { label: 'Gesendet', value: 'sent' },
    { label: 'Fehlgeschlagen', value: 'failed' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Gesamt" value={stats.total} icon={Mail} color="gray" />
          <StatCard title="Wartend" value={stats.pending} icon={Clock} color="yellow" />
          <StatCard
            title="Wird gesendet"
            value={stats.processing}
            icon={RefreshCw}
            color="blue"
          />
          <StatCard title="Gesendet" value={stats.sent} icon={CheckCircle} color="green" />
          <StatCard
            title="Fehlgeschlagen"
            value={stats.failed}
            icon={AlertCircle}
            color="red"
          />
        </div>
      )}

      {/* Filters & Refresh */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              E-Mail-Warteschlange
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex bg-secondary-100 rounded-lg p-1">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      filter === btn.value
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Aktualisieren
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-secondary-500">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Keine E-Mails in der Warteschlange</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-secondary-600">Empfänger</th>
                    <th className="pb-3 font-medium text-secondary-600">Betreff</th>
                    <th className="pb-3 font-medium text-secondary-600">Typ</th>
                    <th className="pb-3 font-medium text-secondary-600">Status</th>
                    <th className="pb-3 font-medium text-secondary-600">Versuche</th>
                    <th className="pb-3 font-medium text-secondary-600">Erstellt</th>
                    <th className="pb-3 font-medium text-secondary-600">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary-50">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-secondary-900">
                            {item.recipientName || '-'}
                          </p>
                          <p className="text-sm text-secondary-500">{item.recipientEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <p
                          className="text-secondary-900 truncate max-w-xs"
                          title={item.subject}
                        >
                          {item.subject}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-secondary-600">
                          {TYPE_LABELS[item.type] || item.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={item.status} />
                        {item.status === 'failed' && item.errorMessage && (
                          <p
                            className="text-xs text-red-600 mt-1 truncate max-w-xs"
                            title={item.errorMessage}
                          >
                            {item.errorMessage}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-secondary-600">
                          {item.attempts}/{item.maxAttempts}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-secondary-500">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {(item.status === 'failed' || item.status === 'pending') && (
                            <button
                              onClick={() => handleRetry(item.id)}
                              disabled={actionLoading === item.id}
                              className="p-1.5 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                              title="Erneut versuchen"
                            >
                              {actionLoading === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RotateCcw className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={actionLoading === item.id}
                            className="p-1.5 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
