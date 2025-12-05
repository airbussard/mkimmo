import Link from 'next/link'
import { MapPin, Building2, Users, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { ManagedProperty, MANAGED_PROPERTY_TYPE_NAMEN } from '@/types/managed-property'
import { formatArea } from '@/lib/utils'

interface ManagedPropertyCardProps {
  property: ManagedProperty
}

export function ManagedPropertyCard({ property }: ManagedPropertyCardProps) {
  return (
    <Link href={`/hausverwaltung/${property.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
          <ImagePlaceholder aspectRatio="video" />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary">{MANAGED_PROPERTY_TYPE_NAMEN[property.typ]}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.name}</h3>

          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {property.adresse.strasse} {property.adresse.hausnummer}, {property.adresse.ort}
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm text-secondary-600 mb-4">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-1 text-primary-600" />
              {property.gebaeude.etagen} Etagen
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-primary-600" />
              {property.gebaeude.anzahlEinheiten} Einh.
            </div>
            <div className="flex items-center">
              <Layers className="w-4 h-4 mr-1 text-primary-600" />
              {formatArea(property.gebaeude.gesamtflaeche)}
            </div>
          </div>

          <div className="pt-3 border-t text-sm text-muted-foreground">
            Verwaltet seit {new Date(property.verwaltung.verwaltetSeit).getFullYear()}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
