import Link from 'next/link'
import { MapPin, BedDouble, Maximize, Home } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { Property, PROPERTY_TYPE_NAMEN, PROPERTY_STATUS_NAMEN } from '@/types/property'
import { formatCurrency, formatArea } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusVariant =
    property.status === 'verfuegbar'
      ? 'success'
      : property.status === 'reserviert'
        ? 'warning'
        : 'secondary'

  return (
    <Link href={`/makler/${property.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
          <ImagePlaceholder aspectRatio="video" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={statusVariant}>{PROPERTY_STATUS_NAMEN[property.status]}</Badge>
            {property.hervorgehoben && <Badge variant="default">Empfohlen</Badge>}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {PROPERTY_TYPE_NAMEN[property.typ]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {property.preistyp === 'miete' ? 'Miete' : 'Kauf'}
            </span>
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.titel}</h3>

          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {property.adresse.ort}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{property.kurzBeschreibung}</p>

          <div className="flex items-center gap-4 text-sm text-secondary-600 mb-4">
            {property.details.zimmer > 0 && (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                {property.details.zimmer} Zi.
              </div>
            )}
            {property.details.wohnflaeche > 0 && (
              <div className="flex items-center">
                <Maximize className="w-4 h-4 mr-1" />
                {formatArea(property.details.wohnflaeche)}
              </div>
            )}
            {property.details.schlafzimmer > 0 && (
              <div className="flex items-center">
                <BedDouble className="w-4 h-4 mr-1" />
                {property.details.schlafzimmer} SZ
              </div>
            )}
          </div>

          <div className="pt-3 border-t">
            <p className="text-xl font-bold text-primary-600">
              {formatCurrency(property.preis)}
              {property.preistyp === 'miete' && <span className="text-sm font-normal"> /Monat</span>}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
