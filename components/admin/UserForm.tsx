'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  UserRole,
  UserStatus,
  USER_ROLE_NAMEN,
  USER_STATUS_NAMEN,
  USER_ROLES,
  USER_STATUSES,
} from '@/types/user'

interface UserFormProps {
  user?: User
  isEditing?: boolean
}

export function UserForm({ user, isEditing = false }: UserFormProps) {
  const router = useRouter()
  const [loading, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    password: '',
    role: user?.role || ('mitarbeiter' as UserRole),
    status: user?.status || ('aktiv' as UserStatus),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (isEditing && user) {
        // Update existing user
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            role: formData.role,
            status: formData.status,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Fehler beim Speichern')
        }
      } else {
        // Create new user
        if (!formData.password || formData.password.length < 8) {
          throw new Error('Passwort muss mindestens 8 Zeichen lang sein')
        }

        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Fehler beim Erstellen')
        }
      }

      router.push('/admin/benutzer')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/benutzer"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEditing ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
          </h1>
          <p className="text-secondary-600">
            {isEditing
              ? 'Benutzerdaten aktualisieren'
              : 'Neuen Mitarbeiter anlegen'}
          </p>
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Speichern
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Benutzerdaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Vollständiger Name *
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Max Mustermann"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                E-Mail-Adresse *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="max@beispiel.de"
                required
                disabled={isEditing}
              />
              {isEditing && (
                <p className="text-xs text-secondary-500 mt-1">
                  E-Mail kann nicht geändert werden
                </p>
              )}
            </div>

            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Passwort *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Mindestens 8 Zeichen"
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Rolle *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {USER_ROLE_NAMEN[role]}
                  </option>
                ))}
              </select>
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as UserStatus,
                    })
                  }
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {USER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {USER_STATUS_NAMEN[status]}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Description */}
      <Card>
        <CardHeader>
          <CardTitle>Rollenbeschreibung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                Administrator
              </span>
              <span className="text-secondary-600">
                Vollzugriff auf alle Bereiche inkl. Benutzerverwaltung
              </span>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Manager
              </span>
              <span className="text-secondary-600">
                Zugriff auf alle Bereiche außer Benutzerverwaltung
              </span>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-700">
                Mitarbeiter
              </span>
              <span className="text-secondary-600">
                Eingeschränkter Zugriff (wird später konfiguriert)
              </span>
            </div>
            <p className="text-secondary-500 italic mt-4">
              Hinweis: Aktuell haben alle Rollen Vollzugriff. Die
              Berechtigungssteuerung wird in einer späteren Version
              implementiert.
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
