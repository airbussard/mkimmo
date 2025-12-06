'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { ManagedProperty } from '@/types/managed-property'
import { Bundesland, HeatingType } from '@/types/property'

interface ManagedPropertyFormProps {
  property?: ManagedProperty
  isEdit?: boolean
}

const BUNDESLAENDER: { value: Bundesland; label: string }[] = [
  { value: 'baden-wuerttemberg', label: 'Baden-Württemberg' },
  { value: 'bayern', label: 'Bayern' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'brandenburg', label: 'Brandenburg' },
  { value: 'bremen', label: 'Bremen' },
  { value: 'hamburg', label: 'Hamburg' },
  { value: 'hessen', label: 'Hessen' },
  { value: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern' },
  { value: 'niedersachsen', label: 'Niedersachsen' },
  { value: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen' },
  { value: 'rheinland-pfalz', label: 'Rheinland-Pfalz' },
  { value: 'saarland', label: 'Saarland' },
  { value: 'sachsen', label: 'Sachsen' },
  { value: 'sachsen-anhalt', label: 'Sachsen-Anhalt' },
  { value: 'schleswig-holstein', label: 'Schleswig-Holstein' },
  { value: 'thueringen', label: 'Thüringen' },
]

const PROPERTY_TYPES = [
  { value: 'wohngebaeude', label: 'Wohngebäude' },
  { value: 'gewerbe', label: 'Gewerbe' },
  { value: 'gemischt', label: 'Gemischt' },
]

const HEATING_TYPES: { value: HeatingType; label: string }[] = [
  { value: 'gas', label: 'Gas' },
  { value: 'oel', label: 'Öl' },
  { value: 'fernwaerme', label: 'Fernwärme' },
  { value: 'waermepumpe', label: 'Wärmepumpe' },
  { value: 'pellet', label: 'Pellets' },
  { value: 'elektro', label: 'Elektro' },
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ManagedPropertyForm({ property, isEdit }: ManagedPropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState(property?.name || '')
  const [slug, setSlug] = useState(property?.slug || '')
  const [typ, setTyp] = useState(property?.typ || 'wohngebaeude')
  const [beschreibung, setBeschreibung] = useState(property?.beschreibung || '')

  // Address
  const [strasse, setStrasse] = useState(property?.adresse.strasse || '')
  const [hausnummer, setHausnummer] = useState(property?.adresse.hausnummer || '')
  const [plz, setPlz] = useState(property?.adresse.plz || '')
  const [ort, setOrt] = useState(property?.adresse.ort || '')
  const [bundesland, setBundesland] = useState<Bundesland>(
    property?.adresse.bundesland || 'nordrhein-westfalen'
  )

  // Building
  const [baujahr, setBaujahr] = useState(property?.gebaeude.baujahr || 0)
  const [anzahlEinheiten, setAnzahlEinheiten] = useState(property?.gebaeude.anzahlEinheiten || 0)
  const [etagen, setEtagen] = useState(property?.gebaeude.etagen || 0)
  const [gesamtflaeche, setGesamtflaeche] = useState(property?.gebaeude.gesamtflaeche || 0)
  const [stellplaetze, setStellplaetze] = useState(property?.gebaeude.stellplaetze || 0)
  const [aufzug, setAufzug] = useState(property?.gebaeude.aufzug || false)
  const [heizung, setHeizung] = useState<HeatingType>(property?.gebaeude.heizung || 'gas')

  // Management
  const [verwaltetSeit, setVerwaltetSeit] = useState(property?.verwaltung.verwaltetSeit || '')
  const [verwalter, setVerwalter] = useState(property?.verwaltung.verwalter || '')
  const [kontaktEmail, setKontaktEmail] = useState(property?.verwaltung.kontaktEmail || '')
  const [kontaktTelefon, setKontaktTelefon] = useState(property?.verwaltung.kontaktTelefon || '')

  // Images
  const [bilder, setBilder] = useState(property?.bilder || [])

  const handleNameChange = (value: string) => {
    setName(value)
    if (!isEdit) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const service = new SupabaseManagedPropertyService()

      const propertyData = {
        name,
        slug,
        typ: typ as ManagedProperty['typ'],
        beschreibung,
        adresse: {
          strasse,
          hausnummer,
          plz,
          ort,
          bundesland,
        },
        gebaeude: {
          baujahr,
          anzahlEinheiten,
          etagen,
          gesamtflaeche,
          stellplaetze,
          aufzug,
          heizung,
        },
        verwaltung: {
          verwaltetSeit,
          verwalter,
          kontaktEmail,
          kontaktTelefon,
        },
        bilder,
        ausstattung: property?.ausstattung || [],
      }

      if (isEdit && property) {
        await service.update(property.id, propertyData)
      } else {
        await service.create(propertyData)
      }

      router.push('/admin/hausverwaltung/objekte')
      router.refresh()
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/hausverwaltung/objekte"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Objekt bearbeiten' : 'Neues Objekt'}
          </h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grunddaten */}
          <Card>
            <CardHeader>
              <CardTitle>Grunddaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="z.B. Wohnanlage Musterstraße"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="wohnanlage-musterstrasse"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Typ *
                </label>
                <select
                  value={typ}
                  onChange={(e) => setTyp(e.target.value as ManagedProperty['typ'])}
                  required
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={beschreibung}
                  onChange={(e) => setBeschreibung(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Beschreibung des Objekts..."
                />
              </div>
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
                    Straße *
                  </label>
                  <input
                    type="text"
                    value={strasse}
                    onChange={(e) => setStrasse(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Hausnummer *
                  </label>
                  <input
                    type="text"
                    value={hausnummer}
                    onChange={(e) => setHausnummer(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    value={plz}
                    onChange={(e) => setPlz(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Ort *
                  </label>
                  <input
                    type="text"
                    value={ort}
                    onChange={(e) => setOrt(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Bundesland *
                </label>
                <select
                  value={bundesland}
                  onChange={(e) => setBundesland(e.target.value as Bundesland)}
                  required
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {BUNDESLAENDER.map((bl) => (
                    <option key={bl.value} value={bl.value}>
                      {bl.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Gebäudedaten */}
          <Card>
            <CardHeader>
              <CardTitle>Gebäudedaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Baujahr
                  </label>
                  <input
                    type="number"
                    value={baujahr || ''}
                    onChange={(e) => setBaujahr(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Einheiten
                  </label>
                  <input
                    type="number"
                    value={anzahlEinheiten || ''}
                    onChange={(e) => setAnzahlEinheiten(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Etagen
                  </label>
                  <input
                    type="number"
                    value={etagen || ''}
                    onChange={(e) => setEtagen(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Gesamtfläche (m²)
                  </label>
                  <input
                    type="number"
                    value={gesamtflaeche || ''}
                    onChange={(e) => setGesamtflaeche(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Stellplätze
                  </label>
                  <input
                    type="number"
                    value={stellplaetze || ''}
                    onChange={(e) => setStellplaetze(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Heizung
                  </label>
                  <select
                    value={heizung}
                    onChange={(e) => setHeizung(e.target.value as HeatingType)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {HEATING_TYPES.map((ht) => (
                      <option key={ht.value} value={ht.value}>
                        {ht.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aufzug}
                      onChange={(e) => setAufzug(e.target.checked)}
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      Aufzug vorhanden
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bilder */}
          <Card>
            <CardHeader>
              <CardTitle>Bilder</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={bilder}
                onImagesChange={setBilder}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verwaltung */}
          <Card>
            <CardHeader>
              <CardTitle>Verwaltung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Verwaltet seit
                </label>
                <input
                  type="date"
                  value={verwaltetSeit}
                  onChange={(e) => setVerwaltetSeit(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Zuständiger Verwalter
                </label>
                <input
                  type="text"
                  value={verwalter}
                  onChange={(e) => setVerwalter(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Name des Verwalters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Kontakt E-Mail
                </label>
                <input
                  type="email"
                  value={kontaktEmail}
                  onChange={(e) => setKontaktEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Kontakt Telefon
                </label>
                <input
                  type="tel"
                  value={kontaktTelefon}
                  onChange={(e) => setKontaktTelefon(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
