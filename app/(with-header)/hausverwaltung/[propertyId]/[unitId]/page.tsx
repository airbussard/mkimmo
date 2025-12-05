import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Home,
  Maximize,
  Users,
  FileText,
  Calendar,
  Euro,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceFactory } from '@/lib/services/ServiceFactory'
import {
  UNIT_TYPE_NAMEN,
  UNIT_STATUS_NAMEN,
  UNIT_LAGE_NAMEN,
  DOCUMENT_TYPE_NAMEN,
} from '@/types/unit'
import { TENANT_STATUS_NAMEN } from '@/types/tenant'
import { formatCurrency, formatArea, formatDate } from '@/lib/utils'

interface PageProps {
  params: { propertyId: string; unitId: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const unitService = serviceFactory.getUnitService()
  const managedPropertyService = serviceFactory.getManagedPropertyService()

  const unit = await unitService.getById(params.unitId)
  const property = await managedPropertyService.getById(params.propertyId)

  if (!unit || !property) {
    return { title: 'Einheit nicht gefunden' }
  }

  return {
    title: `${unit.einheitNummer} - ${property.name}`,
    description: `${UNIT_TYPE_NAMEN[unit.typ]} mit ${unit.details.zimmer} Zimmern und ${formatArea(unit.details.flaeche)}`,
  }
}

export default async function UnitDetailPage({ params }: PageProps) {
  const unitService = serviceFactory.getUnitService()
  const tenantService = serviceFactory.getTenantService()
  const managedPropertyService = serviceFactory.getManagedPropertyService()

  const unit = await unitService.getById(params.unitId)
  const property = await managedPropertyService.getById(params.propertyId)

  if (!unit || !property) {
    notFound()
  }

  const tenant = unit.mieterId ? await tenantService.getById(unit.mieterId) : null

  const statusVariant =
    unit.status === 'vermietet'
      ? 'success'
      : unit.status === 'leer'
        ? 'outline'
        : 'warning'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Zurück-Link */}
      <Link
        href={`/hausverwaltung/${params.propertyId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Zurück zu {property.name}
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hauptbereich */}
        <div className="lg:col-span-2 space-y-8">
          {/* Titel */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={statusVariant}>{UNIT_STATUS_NAMEN[unit.status]}</Badge>
              <Badge variant="outline">{UNIT_TYPE_NAMEN[unit.typ]}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
              Einheit {unit.einheitNummer}
            </h1>
            <p className="text-muted-foreground">
              {property.name} • {unit.etage}. OG {UNIT_LAGE_NAMEN[unit.lage]}
            </p>
          </div>

          {/* Kurzinfos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Maximize className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Fläche</p>
              <p className="font-semibold">{formatArea(unit.details.flaeche)}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Home className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Zimmer</p>
              <p className="font-semibold">{unit.details.zimmer}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Euro className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Warmmiete</p>
              <p className="font-semibold">{formatCurrency(unit.miete.warmmiete)}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-muted-foreground">Etage</p>
              <p className="font-semibold">{unit.etage}. OG</p>
            </div>
          </div>

          {/* Einheit-Details */}
          <Card>
            <CardHeader>
              <CardTitle>Einheit-Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Typ</span>
                    <span className="font-medium">{UNIT_TYPE_NAMEN[unit.typ]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Fläche</span>
                    <span className="font-medium">{formatArea(unit.details.flaeche)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Zimmer</span>
                    <span className="font-medium">{unit.details.zimmer}</span>
                  </div>
                  {unit.details.schlafzimmer !== undefined && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Schlafzimmer</span>
                      <span className="font-medium">{unit.details.schlafzimmer}</span>
                    </div>
                  )}
                  {unit.details.badezimmer !== undefined && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Badezimmer</span>
                      <span className="font-medium">{unit.details.badezimmer}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Balkon</span>
                    <span className="font-medium">
                      {unit.details.balkon ? (
                        <>
                          <Check className="w-4 h-4 inline text-green-500 mr-1" />
                          {unit.details.balkonFlaeche && `${unit.details.balkonFlaeche} m²`}
                        </>
                      ) : (
                        <X className="w-4 h-4 inline text-red-500" />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Keller</span>
                    <span className="font-medium">
                      {unit.details.keller ? (
                        <>
                          <Check className="w-4 h-4 inline text-green-500 mr-1" />
                          {unit.details.kellerFlaeche && `${unit.details.kellerFlaeche} m²`}
                        </>
                      ) : (
                        <X className="w-4 h-4 inline text-red-500" />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Lage</span>
                    <span className="font-medium">
                      {unit.etage}. OG {UNIT_LAGE_NAMEN[unit.lage]}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mieter-Informationen */}
          {tenant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mieterinformationen</span>
                  <Badge
                    variant={
                      tenant.status === 'aktiv'
                        ? 'success'
                        : tenant.status === 'gekuendigt'
                          ? 'destructive'
                          : 'warning'
                    }
                  >
                    {TENANT_STATUS_NAMEN[tenant.status]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{tenant.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Bewohner</span>
                      <span className="font-medium">{tenant.bewohner} Person(en)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Mietbeginn</span>
                      <span className="font-medium">{formatDate(tenant.mietvertrag.beginn)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Vertragsart</span>
                      <span className="font-medium">
                        {tenant.mietvertrag.typ === 'unbefristet' ? 'Unbefristet' : 'Befristet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Kündigungsfrist</span>
                      <span className="font-medium">{tenant.mietvertrag.kuendigungsfrist} Monate</span>
                    </div>
                    {tenant.mietvertrag.ende && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Mietende</span>
                        <span className="font-medium">{formatDate(tenant.mietvertrag.ende)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dokumente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Dokumente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unit.dokumente.length > 0 ? (
                <div className="space-y-2">
                  {unit.dokumente.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-3 text-primary-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {DOCUMENT_TYPE_NAMEN[doc.typ]} • {formatDate(doc.hochgeladenAm)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>
                        Ansehen
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Dokumente vorhanden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mietkosten-Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Mietkosten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Kaltmiete</span>
                  <span className="font-semibold">{formatCurrency(unit.miete.kaltmiete)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Nebenkosten</span>
                  <span className="font-semibold">{formatCurrency(unit.miete.nebenkosten)}</span>
                </div>
                <div className="flex justify-between py-2 bg-primary-50 p-3 rounded-lg">
                  <span className="font-semibold">Warmmiete</span>
                  <span className="font-bold text-primary-600">
                    {formatCurrency(unit.miete.warmmiete)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Kaution</span>
                  <span className="font-semibold">{formatCurrency(unit.miete.kaution)}</span>
                </div>
              </div>

              {unit.status === 'leer' && (
                <Button className="w-full" asChild>
                  <a href={`mailto:${property.verwaltung.kontaktEmail}?subject=Anfrage: ${unit.einheitNummer} in ${property.name}`}>
                    Anfrage senden
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
