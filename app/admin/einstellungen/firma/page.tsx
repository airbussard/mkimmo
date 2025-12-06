'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  SupabaseCompanyService,
  CompanyInfo,
} from '@/lib/services/supabase/SupabaseSettingsService'

export default function FirmendatenPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [fax, setFax] = useState('')
  const [weekdays, setWeekdays] = useState('')
  const [saturday, setSaturday] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const service = new SupabaseCompanyService()
      const data = await service.get()

      if (data) {
        setName(data.name)
        setStreet(data.address.street)
        setHouseNumber(data.address.houseNumber)
        setZip(data.address.zip)
        setCity(data.address.city)
        setPhone(data.contact.phone)
        setEmail(data.contact.email)
        setFax(data.contact.fax || '')
        setWeekdays(data.openingHours.weekdays)
        setSaturday(data.openingHours.saturday || '')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const service = new SupabaseCompanyService()
      await service.update({
        name,
        address: { street, houseNumber, zip, city },
        contact: { phone, email, fax: fax || undefined },
        openingHours: { weekdays, saturday: saturday || undefined },
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/einstellungen"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">Firmendaten</h1>
          <p className="text-secondary-600">
            Diese Daten werden auf der Website angezeigt
          </p>
        </div>
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : saved ? (
            'Gespeichert!'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Firma */}
        <Card>
          <CardHeader>
            <CardTitle>Firmenname</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Möller & Knabe GbR"
            />
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Straße
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Hausnummer
                </label>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  PLZ
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Stadt
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontakt */}
        <Card>
          <CardHeader>
            <CardTitle>Kontaktdaten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+49 2302 123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="info@mk-immo.de"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Fax (optional)
              </label>
              <input
                type="tel"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Öffnungszeiten */}
        <Card>
          <CardHeader>
            <CardTitle>Öffnungszeiten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Mo-Fr
              </label>
              <input
                type="text"
                value={weekdays}
                onChange={(e) => setWeekdays(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="09:00 - 18:00 Uhr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Samstag (optional)
              </label>
              <input
                type="text"
                value={saturday}
                onChange={(e) => setSaturday(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="10:00 - 14:00 Uhr oder 'nach Vereinbarung'"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
