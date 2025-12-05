'use client'

import { useState, useMemo } from 'react'
import { Calculator, Info, ChevronDown, ChevronUp, TrendingDown, Percent, Euro, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  berechneAnnuitaet,
  berechneTilgungsplan,
  berechneJahresZusammenfassung,
  formatWaehrung,
  formatProzent,
  formatLaufzeit,
  DEFAULT_EINGABEN,
  type AnnuitaetEingaben,
  type AnnuitaetErgebnis,
  type JahresZusammenfassung,
} from '@/lib/utils/annuitaet'

// ==================== INFO-TOOLTIP COMPONENT ====================

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-block ml-1">
      <Info className="h-4 w-4 text-secondary-400 hover:text-primary-600 cursor-help inline" />
      <span className="invisible group-hover:visible absolute z-50 w-64 p-2 text-xs text-white bg-secondary-800 rounded-md shadow-lg -top-2 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
        {text}
      </span>
    </span>
  )
}

// ==================== ERGEBNIS-ZEILE COMPONENT ====================

interface ErgebnisZeileProps {
  label: string
  wert: string
  hervorgehoben?: boolean
  icon?: React.ReactNode
}

function ErgebnisZeile({ label, wert, hervorgehoben = false, icon }: ErgebnisZeileProps) {
  return (
    <div className={`flex justify-between items-center py-2 ${hervorgehoben ? 'border-t border-secondary-200 pt-4 mt-2' : ''}`}>
      <span className="text-secondary-600 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className={`font-semibold ${hervorgehoben ? 'text-lg text-primary-600' : 'text-secondary-900'}`}>
        {wert}
      </span>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

export function AnnuitaetenRechner() {
  // State für Eingabefelder
  const [darlehenssumme, setDarlehenssumme] = useState(DEFAULT_EINGABEN.darlehenssumme)
  const [sollzins, setSollzins] = useState(DEFAULT_EINGABEN.sollzins)
  const [tilgungssatz, setTilgungssatz] = useState(DEFAULT_EINGABEN.tilgungssatz)
  const [sondertilgung, setSondertilgung] = useState(DEFAULT_EINGABEN.sondertilgung)
  const [zinsbindungJahre, setZinsbindungJahre] = useState(DEFAULT_EINGABEN.zinsbindungJahre)
  const [berechnungsModus, setBerechnungsModus] = useState<'tilgung' | 'wunschrate'>('tilgung')
  const [wunschrate, setWunschrate] = useState(1500)

  // State für UI
  const [zeigeTilgungsplan, setZeigeTilgungsplan] = useState(false)
  const [ansichtModus, setAnsichtModus] = useState<'monatlich' | 'jaehrlich'>('jaehrlich')

  // Berechnungen
  const eingaben: AnnuitaetEingaben = useMemo(() => ({
    darlehenssumme,
    sollzins,
    tilgungssatz,
    sondertilgung,
    zinsbindungJahre,
    berechnungsModus,
    wunschrate: berechnungsModus === 'wunschrate' ? wunschrate : undefined
  }), [darlehenssumme, sollzins, tilgungssatz, sondertilgung, zinsbindungJahre, berechnungsModus, wunschrate])

  const ergebnis: AnnuitaetErgebnis | null = useMemo(() => {
    if (darlehenssumme <= 0) return null
    try {
      return berechneAnnuitaet(eingaben)
    } catch {
      return null
    }
  }, [eingaben, darlehenssumme])

  const tilgungsplan = useMemo(() => {
    if (!zeigeTilgungsplan || darlehenssumme <= 0) return []
    try {
      return berechneTilgungsplan(eingaben)
    } catch {
      return []
    }
  }, [eingaben, zeigeTilgungsplan, darlehenssumme])

  const jahresZusammenfassung: JahresZusammenfassung[] = useMemo(() => {
    if (tilgungsplan.length === 0) return []
    return berechneJahresZusammenfassung(tilgungsplan)
  }, [tilgungsplan])

  // Handler für numerische Eingaben
  const handleNumericInput = (
    value: string,
    setter: (val: number) => void,
    allowDecimal: boolean = false
  ) => {
    const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.')
    const numValue = allowDecimal ? parseFloat(cleanValue) : parseInt(cleanValue, 10)
    if (!isNaN(numValue)) {
      setter(numValue)
    } else if (cleanValue === '' || cleanValue === '.') {
      setter(0)
    }
  }

  return (
    <div className="space-y-8">
      {/* Eingabe und Ergebnis Cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Eingabe Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary-600" />
              Darlehensdetails
            </CardTitle>
            <CardDescription>
              Geben Sie die Details Ihres Immobiliendarlehens ein
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Darlehenssumme */}
            <div className="space-y-2">
              <Label htmlFor="darlehenssumme">
                Darlehenssumme
                <InfoTooltip text="Der Betrag, den Sie von der Bank leihen möchten." />
              </Label>
              <div className="relative">
                <Input
                  id="darlehenssumme"
                  type="text"
                  inputMode="numeric"
                  value={darlehenssumme.toLocaleString('de-DE')}
                  onChange={(e) => handleNumericInput(e.target.value, setDarlehenssumme)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            {/* Berechnungsmodus */}
            <div className="space-y-2">
              <Label htmlFor="modus">Berechnungsmodus</Label>
              <Select value={berechnungsModus} onValueChange={(v) => setBerechnungsModus(v as 'tilgung' | 'wunschrate')}>
                <SelectTrigger id="modus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tilgung">Annuität nach Zins + Tilgung</SelectItem>
                  <SelectItem value="wunschrate">Annuität nach Wunschrate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sollzins */}
            <div className="space-y-2">
              <Label htmlFor="sollzins">
                Sollzins (% p.a.)
                <InfoTooltip text="Der jährliche Zinssatz, den die Bank für das Darlehen berechnet." />
              </Label>
              <div className="relative">
                <Input
                  id="sollzins"
                  type="text"
                  inputMode="decimal"
                  value={sollzins}
                  onChange={(e) => handleNumericInput(e.target.value, setSollzins, true)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
              </div>
            </div>

            {/* Tilgungssatz oder Wunschrate */}
            {berechnungsModus === 'tilgung' ? (
              <div className="space-y-2">
                <Label htmlFor="tilgungssatz">
                  Anfänglicher Tilgungssatz (% p.a.)
                  <InfoTooltip text="Der Prozentsatz des Darlehens, der jährlich zurückgezahlt wird. Höhere Tilgung = kürzere Laufzeit." />
                </Label>
                <div className="relative">
                  <Input
                    id="tilgungssatz"
                    type="text"
                    inputMode="decimal"
                    value={tilgungssatz}
                    onChange={(e) => handleNumericInput(e.target.value, setTilgungssatz, true)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="wunschrate">
                  Gewünschte monatliche Rate
                  <InfoTooltip text="Die monatliche Rate, die Sie zahlen möchten. Der Tilgungssatz wird automatisch berechnet." />
                </Label>
                <div className="relative">
                  <Input
                    id="wunschrate"
                    type="text"
                    inputMode="numeric"
                    value={wunschrate.toLocaleString('de-DE')}
                    onChange={(e) => handleNumericInput(e.target.value, setWunschrate)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
                </div>
              </div>
            )}

            {/* Zinsbindung */}
            <div className="space-y-2">
              <Label htmlFor="zinsbindung">
                Zinsbindung (Jahre)
                <InfoTooltip text="Der Zeitraum, für den der Zinssatz garantiert festgeschrieben ist." />
              </Label>
              <Select value={zinsbindungJahre.toString()} onValueChange={(v) => setZinsbindungJahre(parseInt(v))}>
                <SelectTrigger id="zinsbindung">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30].map((jahre) => (
                    <SelectItem key={jahre} value={jahre.toString()}>
                      {jahre} Jahre
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sondertilgung */}
            <div className="space-y-2">
              <Label htmlFor="sondertilgung">
                Jährliche Sondertilgung (optional)
                <InfoTooltip text="Zusätzliche jährliche Zahlung zur schnelleren Tilgung des Darlehens." />
              </Label>
              <div className="relative">
                <Input
                  id="sondertilgung"
                  type="text"
                  inputMode="numeric"
                  value={sondertilgung > 0 ? sondertilgung.toLocaleString('de-DE') : ''}
                  onChange={(e) => handleNumericInput(e.target.value, setSondertilgung)}
                  placeholder="0"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ergebnis Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary-600" />
              Ihre Finanzierung
            </CardTitle>
            <CardDescription>
              Übersicht Ihrer monatlichen Belastung und Gesamtkosten
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ergebnis ? (
              <div className="space-y-1">
                <ErgebnisZeile
                  label="Monatliche Rate"
                  wert={formatWaehrung(ergebnis.monatlicheRate)}
                  hervorgehoben
                  icon={<Euro className="h-4 w-4" />}
                />

                <div className="pt-4 pb-2">
                  <p className="text-sm font-medium text-secondary-500 mb-2">Anfängliche Aufteilung der Rate:</p>
                </div>

                <ErgebnisZeile
                  label="davon Zinsanteil"
                  wert={formatWaehrung(ergebnis.anfaenglicheZinsrate)}
                  icon={<Percent className="h-4 w-4" />}
                />

                <ErgebnisZeile
                  label="davon Tilgungsanteil"
                  wert={formatWaehrung(ergebnis.anfaenglicheTilgungsrate)}
                  icon={<TrendingDown className="h-4 w-4" />}
                />

                {berechnungsModus === 'wunschrate' && (
                  <ErgebnisZeile
                    label="Effektiver Tilgungssatz"
                    wert={formatProzent(ergebnis.effektiverTilgungssatz)}
                  />
                )}

                <div className="border-t border-secondary-200 mt-4 pt-4">
                  <p className="text-sm font-medium text-secondary-500 mb-2">Über die gesamte Laufzeit:</p>
                </div>

                <ErgebnisZeile
                  label="Gesamtbelastung"
                  wert={formatWaehrung(ergebnis.gesamtbelastung)}
                />

                <ErgebnisZeile
                  label="Summe Zinsen"
                  wert={formatWaehrung(ergebnis.summeZinsen)}
                />

                <ErgebnisZeile
                  label="Geschätzte Laufzeit"
                  wert={formatLaufzeit(ergebnis.geschaetzteLaufzeitJahre, ergebnis.geschaetzteLaufzeitMonate)}
                  icon={<Calendar className="h-4 w-4" />}
                />

                <div className="border-t border-secondary-200 mt-4 pt-4">
                  <ErgebnisZeile
                    label={`Restschuld nach ${zinsbindungJahre} Jahren`}
                    wert={formatWaehrung(ergebnis.restschuldNachZinsbindung)}
                    hervorgehoben
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                Bitte geben Sie eine gültige Darlehenssumme ein.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tilgungsplan Toggle */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-secondary-50 transition-colors"
          onClick={() => setZeigeTilgungsplan(!zeigeTilgungsplan)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                Tilgungsplan
              </CardTitle>
              <CardDescription>
                Detaillierte Übersicht der Tilgung über die gesamte Laufzeit
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              {zeigeTilgungsplan ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardHeader>

        {zeigeTilgungsplan && ergebnis && (
          <CardContent>
            {/* Ansicht-Toggle */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-secondary-600">Ansicht:</span>
              <div className="flex gap-2">
                <Button
                  variant={ansichtModus === 'jaehrlich' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAnsichtModus('jaehrlich')}
                >
                  Jährlich
                </Button>
                <Button
                  variant={ansichtModus === 'monatlich' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAnsichtModus('monatlich')}
                >
                  Monatlich
                </Button>
              </div>
            </div>

            {/* Tabelle */}
            <div className="overflow-x-auto">
              {ansichtModus === 'jaehrlich' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-2 font-medium text-secondary-600">Jahr</th>
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Zinsen</th>
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Tilgung</th>
                      {sondertilgung > 0 && (
                        <th className="text-right py-3 px-2 font-medium text-secondary-600">Sondertilg.</th>
                      )}
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Restschuld</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jahresZusammenfassung.slice(0, 50).map((zeile) => (
                      <tr
                        key={zeile.jahr}
                        className={`border-b border-secondary-100 ${zeile.jahr === zinsbindungJahre ? 'bg-primary-50' : ''}`}
                      >
                        <td className="py-2 px-2">{zeile.jahr}</td>
                        <td className="py-2 px-2 text-right">{formatWaehrung(zeile.zinsenGesamt)}</td>
                        <td className="py-2 px-2 text-right">{formatWaehrung(zeile.tilgungGesamt)}</td>
                        {sondertilgung > 0 && (
                          <td className="py-2 px-2 text-right">{formatWaehrung(zeile.sondertilgungGesamt)}</td>
                        )}
                        <td className="py-2 px-2 text-right font-medium">{formatWaehrung(zeile.restschuldEnde)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-2 font-medium text-secondary-600">Monat</th>
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Restschuld</th>
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Zinsen</th>
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Tilgung</th>
                      <th className="text-right py-3 px-2 font-medium text-secondary-600">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tilgungsplan.slice(0, 120).map((zeile) => (
                      <tr
                        key={zeile.monat}
                        className={`border-b border-secondary-100 ${zeile.monat === zinsbindungJahre * 12 ? 'bg-primary-50' : ''}`}
                      >
                        <td className="py-2 px-2">
                          {zeile.monat} <span className="text-secondary-400">(Jahr {zeile.jahr})</span>
                        </td>
                        <td className="py-2 px-2 text-right">{formatWaehrung(zeile.restschuldBeginn)}</td>
                        <td className="py-2 px-2 text-right">{formatWaehrung(zeile.zinsanteil)}</td>
                        <td className="py-2 px-2 text-right">{formatWaehrung(zeile.tilgungsanteil)}</td>
                        <td className="py-2 px-2 text-right font-medium">{formatWaehrung(zeile.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {((ansichtModus === 'monatlich' && tilgungsplan.length > 120) ||
                (ansichtModus === 'jaehrlich' && jahresZusammenfassung.length > 50)) && (
                <p className="text-sm text-secondary-500 mt-4 text-center">
                  Zeige die ersten {ansichtModus === 'monatlich' ? '120 Monate' : '50 Jahre'}.
                  Die vollständige Tilgung dauert {formatLaufzeit(ergebnis.geschaetzteLaufzeitJahre, ergebnis.geschaetzteLaufzeitMonate)}.
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Hinweis */}
      <div className="flex items-start gap-3 p-4 bg-secondary-50 rounded-lg">
        <Info className="h-5 w-5 text-secondary-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-secondary-600">
          <p className="font-medium mb-1">Hinweis</p>
          <p>
            Diese Berechnung dient nur zur Orientierung. Die tatsächlichen Konditionen können je nach
            Bank und Ihrer persönlichen Bonität abweichen. Für eine verbindliche Finanzierungsberatung
            wenden Sie sich bitte an einen Finanzberater oder eine Bank.
          </p>
        </div>
      </div>
    </div>
  )
}
