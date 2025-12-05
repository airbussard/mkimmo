import Link from 'next/link'
import { Home, Maximize, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Unit, UNIT_TYPE_NAMEN, UNIT_STATUS_NAMEN, UNIT_LAGE_NAMEN } from '@/types/unit'
import { formatCurrency, formatArea } from '@/lib/utils'

interface UnitCardProps {
  unit: Unit
  propertyId: string
}

export function UnitCard({ unit, propertyId }: UnitCardProps) {
  const statusVariant =
    unit.status === 'vermietet'
      ? 'success'
      : unit.status === 'leer'
        ? 'outline'
        : 'warning'

  return (
    <Link href={`/hausverwaltung/${propertyId}/${unit.id}`}>
      <Card className="transition-all duration-300 hover:shadow-md hover:border-primary-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{unit.einheitNummer}</span>
              <Badge variant="outline" className="text-xs">
                {UNIT_TYPE_NAMEN[unit.typ]}
              </Badge>
            </div>
            <Badge variant={statusVariant}>{UNIT_STATUS_NAMEN[unit.status]}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <p className="text-muted-foreground">Etage</p>
              <p className="font-medium">{unit.etage}. OG {UNIT_LAGE_NAMEN[unit.lage]}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fläche</p>
              <p className="font-medium">{formatArea(unit.details.flaeche)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Zimmer</p>
              <p className="font-medium">{unit.details.zimmer}</p>
            </div>
          </div>

          <div className="pt-3 border-t flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Warmmiete</p>
              <p className="font-semibold text-primary-600">{formatCurrency(unit.miete.warmmiete)}</p>
            </div>
            {unit.status === 'vermietet' && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Kaltmiete</p>
                <p className="font-medium">{formatCurrency(unit.miete.kaltmiete)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
