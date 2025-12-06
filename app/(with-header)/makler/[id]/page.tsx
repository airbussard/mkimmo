import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Home,
  BedDouble,
  Bath,
  Maximize,
  Calendar,
  Thermometer,
  Car,
  Trees,
  Building2,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PropertyGallery } from '@/components/makler/PropertyGallery'
import { PropertyInquiryForm } from '@/components/makler/PropertyInquiryForm'
import { PropertyMap } from '@/components/shared/PropertyMap'
import { serviceFactory } from '@/lib/services/ServiceFactory'
import {
  PROPERTY_STATUS_NAMEN,
  PROPERTY_TYPE_NAMEN,
  HEATING_TYPE_NAMEN,
  BUNDESLAND_NAMEN,
} from '@/types/property'
import { formatCurrency, formatArea, formatDate } from '@/lib/utils'
import { COMPANY_INFO } from '@/config/navigation'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const propertyService = serviceFactory.getPropertyService()
  const property = await propertyService.getById(params.id)

  if (!property) {
    return { title: 'Immobilie nicht gefunden' }
  }

  return {
    title: property.titel,
    description: property.kurzBeschreibung,
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const propertyService = serviceFactory.getPropertyService()
  const property = await propertyService.getById(params.id)

  if (!property) {
    notFound()
  }

  const statusVariant =
    property.status === 'verfuegbar'
      ? 'success'
      : property.status === 'reserviert'
        ? 'warning'
        : 'secondary'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Zurück-Link */}
      <Link
        href="/makler"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Zurück zur Übersicht
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hauptbereich */}
        <div className="lg:col-span-2 space-y-8">
          {/* Galerie */}
          <PropertyGallery bilder={property.bilder} titel={property.titel} />

          {/* Titel und Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={statusVariant}>{PROPERTY_STATUS_NAMEN[property.status]}</Badge>
              <Badge variant="outline">{PROPERTY_TYPE_NAMEN[property.typ]}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
              {property.titel}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {property.adresse.strasse} {property.adresse.hausnummer}, {property.adresse.plz}{' '}
              {property.adresse.ort}
            </div>
          </div>

          {/* Kurzinfos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.details.wohnflaeche > 0 && (
              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <Maximize className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm text-muted-foreground">Wohnfläche</p>
                <p className="font-semibold">{formatArea(property.details.wohnflaeche)}</p>
              </div>
            )}
            {property.details.zimmer > 0 && (
              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <Home className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm text-muted-foreground">Zimmer</p>
                <p className="font-semibold">{property.details.zimmer}</p>
              </div>
            )}
            {property.details.schlafzimmer > 0 && (
              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <BedDouble className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm text-muted-foreground">Schlafzimmer</p>
                <p className="font-semibold">{property.details.schlafzimmer}</p>
              </div>
            )}
            {property.details.badezimmer > 0 && (
              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <Bath className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <p className="text-sm text-muted-foreground">Badezimmer</p>
                <p className="font-semibold">{property.details.badezimmer}</p>
              </div>
            )}
          </div>

          {/* Beschreibung */}
          <Card>
            <CardHeader>
              <CardTitle>Beschreibung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 whitespace-pre-line">{property.beschreibung}</p>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Objektdetails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Objektart</span>
                    <span className="font-medium">{PROPERTY_TYPE_NAMEN[property.typ]}</span>
                  </div>
                  {property.details.wohnflaeche > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Wohnfläche</span>
                      <span className="font-medium">{formatArea(property.details.wohnflaeche)}</span>
                    </div>
                  )}
                  {property.details.grundstuecksflaeche && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Grundstücksfläche</span>
                      <span className="font-medium">
                        {formatArea(property.details.grundstuecksflaeche)}
                      </span>
                    </div>
                  )}
                  {property.details.baujahr && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Baujahr</span>
                      <span className="font-medium">{property.details.baujahr}</span>
                    </div>
                  )}
                  {property.details.etage !== undefined && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Etage</span>
                      <span className="font-medium">
                        {property.details.etage}
                        {property.details.etagen && ` von ${property.details.etagen}`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Heizung</span>
                    <span className="font-medium">{HEATING_TYPE_NAMEN[property.details.heizung]}</span>
                  </div>
                  {property.details.energieausweis && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Energieausweis</span>
                      <span className="font-medium">{property.details.energieausweis}</span>
                    </div>
                  )}
                  {property.details.stellplaetze !== undefined && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Stellplätze</span>
                      <span className="font-medium">{property.details.stellplaetze}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Bundesland</span>
                    <span className="font-medium">{BUNDESLAND_NAMEN[property.adresse.bundesland]}</span>
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
                {property.details.balkon && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Balkon
                  </div>
                )}
                {property.details.terrasse && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Terrasse
                  </div>
                )}
                {property.details.garten && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Garten
                  </div>
                )}
                {property.details.aufzug && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Aufzug
                  </div>
                )}
                {property.details.keller && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Keller
                  </div>
                )}
                {property.details.moebliert && (
                  <div className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Möbliert
                  </div>
                )}
                {property.merkmale.map((merkmal) => (
                  <div key={merkmal} className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {merkmal}
                  </div>
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
                  titel={property.titel}
                  className="h-[400px]"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preis-Card */}
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(property.preis)}
                </p>
                {property.preistyp === 'miete' && (
                  <p className="text-muted-foreground">pro Monat</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full" asChild>
                  <a href={`tel:${COMPANY_INFO.telefon}`}>Anrufen</a>
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">{COMPANY_INFO.name}</p>
                <p>{COMPANY_INFO.telefon}</p>
                <p>{COMPANY_INFO.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Anfrage-Formular */}
          <PropertyInquiryForm propertyId={property.id} propertyTitle={property.titel} />

          {/* Kaufnebenkosten-Rechner Link */}
          {property.preistyp === 'kauf' && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Kaufnebenkosten berechnen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Berechnen Sie die Nebenkosten für diese Immobilie.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/makler/kaufnebenkosten-rechner?preis=${property.preis}&bundesland=${property.adresse.bundesland}`}>
                    Zum Rechner
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
