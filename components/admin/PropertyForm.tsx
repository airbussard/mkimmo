'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { SupabasePropertyService } from '@/lib/services/supabase/SupabasePropertyService'
import {
  Property,
  PropertyType,
  PropertyStatus,
  HeatingType,
  Bundesland,
  PROPERTY_TYPE_NAMEN,
  PROPERTY_STATUS_NAMEN,
  HEATING_TYPE_NAMEN,
  BUNDESLAND_NAMEN,
  PropertyImage,
} from '@/types/property'

interface PropertyFormProps {
  property?: Property
  isEditing?: boolean
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const defaultProperty: Omit<Property, 'id' | 'erstelltAm' | 'aktualisiertAm'> = {
  titel: '',
  slug: '',
  typ: 'wohnung',
  status: 'verfuegbar',
  preis: 0,
  preistyp: 'kauf',
  adresse: {
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
    bundesland: 'nordrhein-westfalen',
  },
  details: {
    wohnflaeche: 0,
    zimmer: 0,
    schlafzimmer: 0,
    badezimmer: 0,
    heizung: 'gas',
    balkon: false,
    terrasse: false,
    garten: false,
    aufzug: false,
    keller: false,
    moebliert: false,
  },
  bilder: [],
  beschreibung: '',
  kurzBeschreibung: '',
  merkmale: [],
  hervorgehoben: false,
}

export function PropertyForm({ property, isEditing = false }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState<Omit<Property, 'id' | 'erstelltAm' | 'aktualisiertAm'>>(
    property
      ? {
          titel: property.titel,
          slug: property.slug,
          typ: property.typ,
          status: property.status,
          preis: property.preis,
          preistyp: property.preistyp,
          adresse: { ...property.adresse },
          details: { ...property.details },
          bilder: [...property.bilder],
          beschreibung: property.beschreibung,
          kurzBeschreibung: property.kurzBeschreibung,
          merkmale: [...property.merkmale],
          hervorgehoben: property.hervorgehoben,
        }
      : defaultProperty
  )

  const [merkmalInput, setMerkmalInput] = useState('')

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateAddress = <K extends keyof typeof formData.adresse>(
    field: K,
    value: typeof formData.adresse[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      adresse: { ...prev.adresse, [field]: value },
    }))
  }

  const updateDetails = <K extends keyof typeof formData.details>(
    field: K,
    value: typeof formData.details[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }))
  }

  const addMerkmal = () => {
    if (merkmalInput.trim() && !formData.merkmale.includes(merkmalInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        merkmale: [...prev.merkmale, merkmalInput.trim()],
      }))
      setMerkmalInput('')
    }
  }

  const removeMerkmal = (merkmal: string) => {
    setFormData((prev) => ({
      ...prev,
      merkmale: prev.merkmale.filter((m) => m !== merkmal),
    }))
  }

  const handleTitleChange = (title: string) => {
    updateField('titel', title)
    if (!isEditing) {
      updateField('slug', generateSlug(title))
    }
  }

  const handleImagesChange = (images: PropertyImage[]) => {
    updateField('bilder', images)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const propertyService = new SupabasePropertyService()

      if (isEditing && property) {
        await propertyService.update(property.id, formData)
      } else {
        await propertyService.create(formData)
      }

      router.push('/admin/immobilien')
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/immobilien"
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {isEditing ? 'Immobilie bearbeiten' : 'Neue Immobilie'}
            </h1>
            {isEditing && property && (
              <p className="text-secondary-600">{property.titel}</p>
            )}
          </div>
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basis-Informationen */}
          <Card>
            <CardHeader>
              <CardTitle>Basis-Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="titel">Titel *</Label>
                  <Input
                    id="titel"
                    value={formData.titel}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="z.B. Moderne 3-Zimmer-Wohnung in Eschweiler"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="moderne-3-zimmer-wohnung-eschweiler"
                  />
                </div>
                <div>
                  <Label htmlFor="typ">Typ *</Label>
                  <Select
                    value={formData.typ}
                    onValueChange={(v) => updateField('typ', v as PropertyType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_TYPE_NAMEN).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preis">Preis (EUR) *</Label>
                  <Input
                    id="preis"
                    type="number"
                    value={formData.preis}
                    onChange={(e) => updateField('preis', Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preistyp">Preistyp</Label>
                  <Select
                    value={formData.preistyp}
                    onValueChange={(v) => updateField('preistyp', v as 'kauf' | 'miete')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kauf">Kauf</SelectItem>
                      <SelectItem value="miete">Miete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card>
            <CardHeader>
              <CardTitle>Adresse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="strasse">Straße</Label>
                  <Input
                    id="strasse"
                    value={formData.adresse.strasse}
                    onChange={(e) => updateAddress('strasse', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hausnummer">Nr.</Label>
                  <Input
                    id="hausnummer"
                    value={formData.adresse.hausnummer}
                    onChange={(e) => updateAddress('hausnummer', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="plz">PLZ</Label>
                  <Input
                    id="plz"
                    value={formData.adresse.plz}
                    onChange={(e) => updateAddress('plz', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ort">Ort</Label>
                  <Input
                    id="ort"
                    value={formData.adresse.ort}
                    onChange={(e) => updateAddress('ort', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bundesland">Bundesland</Label>
                  <Select
                    value={formData.adresse.bundesland}
                    onValueChange={(v) => updateAddress('bundesland', v as Bundesland)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BUNDESLAND_NAMEN).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="wohnflaeche">Wohnfläche (m²)</Label>
                  <Input
                    id="wohnflaeche"
                    type="number"
                    value={formData.details.wohnflaeche}
                    onChange={(e) => updateDetails('wohnflaeche', Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="grundstuecksflaeche">Grundstück (m²)</Label>
                  <Input
                    id="grundstuecksflaeche"
                    type="number"
                    value={formData.details.grundstuecksflaeche || ''}
                    onChange={(e) =>
                      updateDetails('grundstuecksflaeche', e.target.value ? Number(e.target.value) : undefined)
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="zimmer">Zimmer</Label>
                  <Input
                    id="zimmer"
                    type="number"
                    value={formData.details.zimmer}
                    onChange={(e) => updateDetails('zimmer', Number(e.target.value))}
                    min={0}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label htmlFor="schlafzimmer">Schlafzimmer</Label>
                  <Input
                    id="schlafzimmer"
                    type="number"
                    value={formData.details.schlafzimmer}
                    onChange={(e) => updateDetails('schlafzimmer', Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="badezimmer">Badezimmer</Label>
                  <Input
                    id="badezimmer"
                    type="number"
                    value={formData.details.badezimmer}
                    onChange={(e) => updateDetails('badezimmer', Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="baujahr">Baujahr</Label>
                  <Input
                    id="baujahr"
                    type="number"
                    value={formData.details.baujahr || ''}
                    onChange={(e) =>
                      updateDetails('baujahr', e.target.value ? Number(e.target.value) : undefined)
                    }
                    min={1800}
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label htmlFor="etage">Etage</Label>
                  <Input
                    id="etage"
                    type="number"
                    value={formData.details.etage ?? ''}
                    onChange={(e) =>
                      updateDetails('etage', e.target.value ? Number(e.target.value) : undefined)
                    }
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="heizung">Heizung</Label>
                  <Select
                    value={formData.details.heizung}
                    onValueChange={(v) => updateDetails('heizung', v as HeatingType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(HEATING_TYPE_NAMEN).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ausstattung Toggles */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                {[
                  { key: 'balkon', label: 'Balkon' },
                  { key: 'terrasse', label: 'Terrasse' },
                  { key: 'garten', label: 'Garten' },
                  { key: 'aufzug', label: 'Aufzug' },
                  { key: 'keller', label: 'Keller' },
                  { key: 'moebliert', label: 'Möbliert' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <Switch
                      id={key}
                      checked={formData.details[key as keyof typeof formData.details] as boolean}
                      onCheckedChange={(checked) =>
                        updateDetails(key as keyof typeof formData.details, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Beschreibung */}
          <Card>
            <CardHeader>
              <CardTitle>Beschreibung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kurzBeschreibung">Kurzbeschreibung</Label>
                <textarea
                  id="kurzBeschreibung"
                  value={formData.kurzBeschreibung}
                  onChange={(e) => updateField('kurzBeschreibung', e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Kurze Beschreibung für die Listenansicht..."
                />
              </div>
              <div>
                <Label htmlFor="beschreibung">Ausführliche Beschreibung</Label>
                <textarea
                  id="beschreibung"
                  value={formData.beschreibung}
                  onChange={(e) => updateField('beschreibung', e.target.value)}
                  className="w-full min-h-[200px] px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Detaillierte Beschreibung der Immobilie..."
                />
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
                images={formData.bilder}
                onImagesChange={handleImagesChange}
                propertyId={property?.id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Verfügbarkeit</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => updateField('status', v as PropertyStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROPERTY_STATUS_NAMEN).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="hervorgehoben">Hervorgehoben</Label>
                <Switch
                  id="hervorgehoben"
                  checked={formData.hervorgehoben}
                  onCheckedChange={(checked) => updateField('hervorgehoben', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Merkmale */}
          <Card>
            <CardHeader>
              <CardTitle>Merkmale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={merkmalInput}
                  onChange={(e) => setMerkmalInput(e.target.value)}
                  placeholder="z.B. Fußbodenheizung"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMerkmal())}
                />
                <Button type="button" variant="outline" onClick={addMerkmal}>
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.merkmale.map((merkmal) => (
                  <span
                    key={merkmal}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {merkmal}
                    <button
                      type="button"
                      onClick={() => removeMerkmal(merkmal)}
                      className="hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
