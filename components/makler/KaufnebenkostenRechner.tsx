'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calculator, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bundesland, BUNDESLAND_NAMEN } from '@/types/property'
import { berechneKaufnebenkosten, formatProzent } from '@/lib/utils/calc'
import { GRUNDERWERBSTEUER } from '@/config/tax-rates'
import { formatCurrency } from '@/lib/utils'

export function KaufnebenkostenRechner() {
  const searchParams = useSearchParams()
  const initialPreis = searchParams.get('preis')
  const initialBundesland = searchParams.get('bundesland')

  const [kaufpreis, setKaufpreis] = useState<number>(initialPreis ? parseInt(initialPreis) : 0)
  const [bundesland, setBundesland] = useState<Bundesland>(
    (initialBundesland as Bundesland) || 'nordrhein-westfalen'
  )
  const [mitMakler, setMitMakler] = useState(true)

  const ergebnis = useMemo(() => {
    if (kaufpreis <= 0) return null
    return berechneKaufnebenkosten({
      kaufpreis,
      bundesland,
      mitMakler,
    })
  }, [kaufpreis, bundesland, mitMakler])

  const handleKaufpreisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setKaufpreis(value ? parseInt(value) : 0)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Eingaben */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Eingaben
          </CardTitle>
          <CardDescription>
            Geben Sie die Daten für die Berechnung ein
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Kaufpreis */}
          <div className="space-y-2">
            <Label htmlFor="kaufpreis">Kaufpreis (EUR)</Label>
            <Input
              id="kaufpreis"
              type="text"
              inputMode="numeric"
              value={kaufpreis > 0 ? kaufpreis.toLocaleString('de-DE') : ''}
              onChange={handleKaufpreisChange}
              placeholder="z.B. 350.000"
              className="text-lg"
            />
          </div>

          {/* Bundesland */}
          <div className="space-y-2">
            <Label htmlFor="bundesland">Bundesland</Label>
            <Select value={bundesland} onValueChange={(v) => setBundesland(v as Bundesland)}>
              <SelectTrigger id="bundesland">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BUNDESLAND_NAMEN)
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map(([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name} ({GRUNDERWERBSTEUER[key as Bundesland]}%)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Die Grunderwerbsteuer variiert je nach Bundesland zwischen 3,5% und 6,5%.
            </p>
          </div>

          {/* Maklerprovision */}
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <Label htmlFor="makler" className="font-medium">
                Maklerprovision einrechnen
              </Label>
              <p className="text-sm text-muted-foreground">
                Käuferanteil: 3,57% (inkl. MwSt.)
              </p>
            </div>
            <Switch id="makler" checked={mitMakler} onCheckedChange={setMitMakler} />
          </div>
        </CardContent>
      </Card>

      {/* Ergebnis */}
      <Card>
        <CardHeader>
          <CardTitle>Kaufnebenkosten</CardTitle>
          <CardDescription>Übersicht aller anfallenden Kosten</CardDescription>
        </CardHeader>
        <CardContent>
          {ergebnis ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Grunderwerbsteuer</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatProzent(ergebnis.grunderwerbsteuerProzent)})
                    </span>
                  </div>
                  <span className="font-semibold">{formatCurrency(ergebnis.grunderwerbsteuer)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Notarkosten</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatProzent(ergebnis.notarkostenProzent)})
                    </span>
                  </div>
                  <span className="font-semibold">{formatCurrency(ergebnis.notarkosten)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">Grundbuchkosten</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatProzent(ergebnis.grundbuchkostenProzent)})
                    </span>
                  </div>
                  <span className="font-semibold">{formatCurrency(ergebnis.grundbuchkosten)}</span>
                </div>

                {mitMakler && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <span className="font-medium">Maklerprovision</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({formatProzent(ergebnis.maklerprovisionProzent)})
                      </span>
                    </div>
                    <span className="font-semibold">{formatCurrency(ergebnis.maklerprovision)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-2 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Kaufpreis</span>
                  <span className="font-semibold">{formatCurrency(kaufpreis)}</span>
                </div>
                <div className="flex justify-between items-center text-primary-600">
                  <div>
                    <span className="font-semibold">Kaufnebenkosten gesamt</span>
                    <span className="text-sm ml-2">({formatProzent(ergebnis.nebenkostenProzent)})</span>
                  </div>
                  <span className="font-bold text-lg">{formatCurrency(ergebnis.nebenkosten)}</span>
                </div>
                <div className="flex justify-between items-center bg-primary-50 p-4 rounded-lg">
                  <span className="font-bold text-lg">Gesamtkosten</span>
                  <span className="font-bold text-2xl text-primary-600">
                    {formatCurrency(ergebnis.gesamtKaufpreis)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Geben Sie einen Kaufpreis ein, um die Nebenkosten zu berechnen.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hinweis */}
      <div className="lg:col-span-2">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Hinweis zur Berechnung</p>
            <p>
              Die angezeigten Werte sind Richtwerte und können im Einzelfall abweichen. Die
              tatsächlichen Notar- und Grundbuchkosten richten sich nach dem Gerichts- und
              Notarkostengesetz (GNotKG) und können je nach Komplexität des Kaufvertrags variieren.
              Für eine verbindliche Auskunft wenden Sie sich bitte an uns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
