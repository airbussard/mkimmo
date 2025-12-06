'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, CheckCircle, XCircle, TestTube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EmailSettingsData {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  imapHost: string
  imapPort: number
  imapUser: string
  imapPassword: string
  fromEmail: string
  fromName: string
  isActive: boolean
}

export function EmailSettingsForm() {
  const [settings, setSettings] = useState<EmailSettingsData>({
    smtpHost: 'smtp.strato.de',
    smtpPort: 465,
    smtpUser: '',
    smtpPassword: '',
    imapHost: 'imap.strato.de',
    imapPort: 993,
    imapUser: '',
    imapPassword: '',
    fromEmail: '',
    fromName: 'MK Immobilien',
    isActive: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<'smtp' | 'imap' | null>(null)
  const [testResult, setTestResult] = useState<{
    type: 'smtp' | 'imap'
    success: boolean
    message: string
  } | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings')
      const data = await response.json()

      if (data.settings) {
        setSettings({
          smtpHost: data.settings.smtpHost || 'smtp.strato.de',
          smtpPort: data.settings.smtpPort || 465,
          smtpUser: data.settings.smtpUser || '',
          smtpPassword: data.settings.smtpPassword || '',
          imapHost: data.settings.imapHost || 'imap.strato.de',
          imapPort: data.settings.imapPort || 993,
          imapUser: data.settings.imapUser || '',
          imapPassword: data.settings.imapPassword || '',
          fromEmail: data.settings.fromEmail || '',
          fromName: data.settings.fromName || 'MK Immobilien',
          isActive: data.settings.isActive ?? true,
        })
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Speichern')
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async (type: 'smtp' | 'imap') => {
    setTesting(type)
    setTestResult(null)

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testType: type }),
      })

      const data = await response.json()

      setTestResult({
        type,
        success: data.success,
        message: data.message || (data.success ? 'Verbindung erfolgreich' : 'Verbindung fehlgeschlagen'),
      })
    } catch (err) {
      setTestResult({
        type,
        success: false,
        message: err instanceof Error ? err.message : 'Unbekannter Fehler',
      })
    } finally {
      setTesting(null)
    }
  }

  const updateField = (field: keyof EmailSettingsData, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* SMTP Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SMTP (Ausgehende E-Mails)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                SMTP-Server
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => updateField('smtpHost', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Port
              </label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => updateField('smtpPort', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Benutzername
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => updateField('smtpUser', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Passwort
              </label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => updateField('smtpPassword', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleTest('smtp')}
              disabled={testing !== null}
            >
              {testing === 'smtp' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Verbindung testen
            </Button>
          </div>
          {testResult?.type === 'smtp' && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                testResult.success
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {testResult.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* IMAP Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">IMAP (Eingehende E-Mails)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                IMAP-Server
              </label>
              <input
                type="text"
                value={settings.imapHost}
                onChange={(e) => updateField('imapHost', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Port
              </label>
              <input
                type="number"
                value={settings.imapPort}
                onChange={(e) => updateField('imapPort', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Benutzername
              </label>
              <input
                type="text"
                value={settings.imapUser}
                onChange={(e) => updateField('imapUser', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Passwort
              </label>
              <input
                type="password"
                value={settings.imapPassword}
                onChange={(e) => updateField('imapPassword', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleTest('imap')}
              disabled={testing !== null}
            >
              {testing === 'imap' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Verbindung testen
            </Button>
          </div>
          {testResult?.type === 'imap' && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                testResult.success
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {testResult.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sender Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Absender-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Absender-E-Mail
              </label>
              <input
                type="email"
                value={settings.fromEmail}
                onChange={(e) => updateField('fromEmail', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Absender-Name
              </label>
              <input
                type="text"
                value={settings.fromName}
                onChange={(e) => updateField('fromName', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={settings.isActive}
              onChange={(e) => updateField('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm text-secondary-700">
              E-Mail-System aktiviert
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Einstellungen wurden gespeichert
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Speichern...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Einstellungen speichern
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
