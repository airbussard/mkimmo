'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Users, Pencil, Trash2, Key, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  User,
  USER_ROLE_NAMEN,
  USER_STATUS_NAMEN,
} from '@/types/user'

export default function BenutzerPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Fehler beim Laden')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Benutzer wirklich löschen?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      setUsers(users.filter((u) => u.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler beim Löschen')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Benutzer</h1>
          <p className="text-secondary-600">
            Mitarbeiter und Zugriffsrechte verwalten
          </p>
        </div>
        <Link href="/admin/benutzer/neu">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neuer Benutzer
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {/* User List */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-secondary-300 mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Keine Benutzer vorhanden
            </h3>
            <p className="text-secondary-600 mb-4">
              Erstellen Sie Ihren ersten Benutzer.
            </p>
            <Link href="/admin/benutzer/neu">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Benutzer erstellen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-secondary-600">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-secondary-600">
                      E-Mail
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-secondary-600">
                      Rolle
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-secondary-600">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-secondary-600">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-secondary-900">
                          {user.fullName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : user.role === 'manager'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-secondary-100 text-secondary-700'
                          }`}
                        >
                          {USER_ROLE_NAMEN[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'aktiv'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {USER_STATUS_NAMEN[user.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/benutzer/${user.id}`}>
                            <Button variant="ghost" size="sm" title="Bearbeiten">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/benutzer/${user.id}/passwort`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Passwort ändern"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Löschen"
                          >
                            {deletingId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
