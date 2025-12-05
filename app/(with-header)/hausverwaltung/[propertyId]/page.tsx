import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Thermometer,
  Car,
  Users,
  Mail,
  Phone,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { PropertyMap } from '@/components/shared/PropertyMap'
import { UnitCard } from '@/components/hausverwaltung/UnitCard'
import { serviceFactory } from '@/lib/services/ServiceFactory'
import { MANAGED_PROPERTY_TYPE_NAMEN } from '@/types/managed-property'
import { HEATING_TYPE_NAMEN, BUNDESLAND_NAMEN } from '@/types/property'
import { formatArea, formatDate } from '@/lib/utils'

interface PageProps {
  params: { propertyId: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const managedPropertyService = serviceFactory.getManagedPropertyService()
  const property = await managedPropertyService.getById(params.propertyId)

  if (!property) {
    return { title: 'Objekt nicht gefunden' }
  }

  return {
    title: property.name,
    description: property.beschreibung,
  }
}

export default async function ManagedPropertyDetailPage({ params }: PageProps) {
  const managedPropertyService = serviceFactory.getManagedPropertyService()
  const unitService = serviceFactory.getUnitService()

  const property = await managedPropertyService.getById(params.propertyId)

  if (!property) {
    notFound()
  }

  const units = await unitService.getByPropertyId(property.id)

  const vermieteteEinheiten = units.filter((u) => u.status === 'vermietet').length
  const leereEinheiten = units.filter((u) => u.status === 'leer').length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Zurück-Link */}
      <Link
        href="/hausverwaltung"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Zurück zur Übersicht
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hauptbereich */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bild */}
          <ImagePlaceholder aspectRatio="video" className="w-full" />

          {/* Titel */}
          <div>
            <Badge variant="secondary" className="mb-2">
              {MANAGED_PROPERTY_TYPE_NAMEN[property.typ]}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
              {property.name}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {property.adresse.strasse} {property.adresse.hausnummer}, {property.adresse.plz}{' '}
              {property.adresse.ort}
            </div>
          </div>

          {/* Kurzinfos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Etagen</p>
              <p className="font-semibold">{property.gebaeude.etagen}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Einheiten</p>
              <p className="font-semibold">{property.gebaeude.anzahlEinheiten}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Baujahr</p>
              <p className="font-semibold">{property.gebaeude.baujahr}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Car className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Stellplätze</p>
              <p className="font-semibold">{property.gebaeude.stellplaetze}</p>
            </div>
          </div>

          {/* Beschreibung */}
          <Card>
            <CardHeader>
              <CardTitle>Beschreibung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600">{property.beschreibung}</p>
            </CardContent>
          </Card>

          {/* Gebäudedetails */}
          <Card>
            <CardHeader>
              <CardTitle>Gebäudedetails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Gesamtfläche</span>
                    <span className="font-medium">{formatArea(property.gebaeude.gesamtflaeche)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Heizung</span>
                    <span className="font-medium">{HEATING_TYPE_NAMEN[property.gebaeude.heizung]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Aufzug</span>
                    <span className="font-medium">{property.gebaeude.aufzug ? 'Ja' : 'Nein'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Bundesland</span>
                    <span className="font-medium">{BUNDESLAND_NAMEN[property.adresse.bundesland]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Verwaltet seit</span>
                    <span className="font-medium">{formatDate(property.verwaltung.verwaltetSeit)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Verwalter</span>
                    <span className="font-medium">{property.verwaltung.verwalter}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ausstattung */}
          <Card>
            <CardHeader>
              <CardTitle>Ausstattung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.ausstattung.map((item) => (
                  <div key={item} className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Einheiten */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Wohneinheiten</span>
                <div className="flex gap-2 text-sm font-normal">
                  <Badge variant="success">{vermieteteEinheiten} vermietet</Badge>
                  {leereEinheiten > 0 && <Badge variant="outline">{leereEinheiten} frei</Badge>}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {units.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} propertyId={property.id} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Karte */}
          {property.adresse.koordinaten && (
            <Card>
              <CardHeader>
                <CardTitle>Lage</CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyMap
                  lat={property.adresse.koordinaten.lat}
                  lng={property.adresse.koordinaten.lng}
                  titel={property.name}
                  className="h-[400px]"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Kontakt-Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ansprechpartner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{property.verwaltung.verwalter}</p>
                <p className="text-sm text-muted-foreground">Objektverwalter</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-primary-600" />
                  <a
                    href={`mailto:${property.verwaltung.kontaktEmail}`}
                    className="hover:text-primary-600"
                  >
                    {property.verwaltung.kontaktEmail}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-primary-600" />
                  <a
                    href={`tel:${property.verwaltung.kontaktTelefon}`}
                    className="hover:text-primary-600"
                  >
                    {property.verwaltung.kontaktTelefon}
                  </a>
                </div>
              </div>

              <Button className="w-full" asChild>
                <a href={`mailto:${property.verwaltung.kontaktEmail}`}>Kontakt aufnehmen</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
