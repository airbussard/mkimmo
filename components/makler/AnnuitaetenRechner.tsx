'use client'

import { useState, useMemo } from 'react'
import { Calculator, Info, ChevronDown, ChevronUp, TrendingDown, Percent, Euro, Calendar, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
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

// Hilfsfunktion: String → Number (mit Komma als Dezimaltrennzeichen)
const parseDecimal = (value: string): number => {
  const num = parseFloat(value.replace(',', '.'))
  return isNaN(num) ? 0 : num
}

export function AnnuitaetenRechner() {
  // State für Eingabefelder - Dezimalzahlen als String für korrekte Komma-Eingabe
  const [darlehenssumme, setDarlehenssumme] = useState(DEFAULT_EINGABEN.darlehenssumme)
  const [sollzins, setSollzins] = useState(String(DEFAULT_EINGABEN.sollzins).replace('.', ','))
  const [tilgungssatz, setTilgungssatz] = useState(String(DEFAULT_EINGABEN.tilgungssatz).replace('.', ','))
  const [sondertilgung, setSondertilgung] = useState(DEFAULT_EINGABEN.sondertilgung)
  const [zinsbindungJahre, setZinsbindungJahre] = useState(DEFAULT_EINGABEN.zinsbindungJahre)
  const [berechnungsModus, setBerechnungsModus] = useState<'tilgung' | 'wunschrate'>('tilgung')
  const [wunschrate, setWunschrate] = useState(1500)

  // State für UI
  const [zeigeTilgungsplan, setZeigeTilgungsplan] = useState(false)
  const [ansichtModus, setAnsichtModus] = useState<'monatlich' | 'jaehrlich'>('jaehrlich')

  // Berechnungen - String-Werte zu Number konvertieren
  const eingaben: AnnuitaetEingaben = useMemo(() => ({
    darlehenssumme,
    sollzins: parseDecimal(sollzins),
    tilgungssatz: parseDecimal(tilgungssatz),
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
    if (darlehenssumme <= 0) return []
    try {
      return berechneTilgungsplan(eingaben)
    } catch {
      return []
    }
  }, [eingaben, darlehenssumme])

  const jahresZusammenfassung: JahresZusammenfassung[] = useMemo(() => {
    if (tilgungsplan.length === 0) return []
    return berechneJahresZusammenfassung(tilgungsplan)
  }, [tilgungsplan])

  // Daten für den Chart
  const chartData = useMemo(() => {
    if (jahresZusammenfassung.length === 0) return []
    return jahresZusammenfassung.slice(0, 40).map((zeile) => ({
      jahr: `Jahr ${zeile.jahr}`,
      zinsen: Math.round(zeile.zinsenGesamt),
      tilgung: Math.round(zeile.tilgungGesamt),
      restschuld: Math.round(zeile.restschuldEnde),
    }))
  }, [jahresZusammenfassung])

  // Handler für Ganzzahlen (z.B. Darlehenssumme, Sondertilgung)
  const handleNumericInput = (
    value: string,
    setter: (val: number) => void
  ) => {
    // Entferne alle Zeichen außer Ziffern
    let cleanValue = value.replace(/[^\d.,]/g, '')
    // Entferne Tausender-Punkte (deutsche Formatierung)
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.')
    const numValue = parseInt(cleanValue, 10)
    if (!isNaN(numValue)) {
      setter(numValue)
    } else if (cleanValue === '') {
      setter(0)
    }
  }

  // Handler für Dezimalzahlen (z.B. Zinssatz, Tilgungssatz)
  const handleDecimalInput = (
    value: string,
    setter: (val: string) => void
  ) => {
    // Nur Ziffern und ein Komma erlauben
    let cleanValue = value.replace(/[^\d,]/g, '')
    // Maximal ein Komma
    const parts = cleanValue.split(',')
    if (parts.length > 2) {
      cleanValue = parts[0] + ',' + parts.slice(1).join('')
    }
    setter(cleanValue)
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
                  onChange={(e) => handleDecimalInput(e.target.value, setSollzins)}
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
                    onChange={(e) => handleDecimalInput(e.target.value, setTilgungssatz)}
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

      {/* Grafische Darstellung */}
      {ergebnis && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Tilgungsverlauf
            </CardTitle>
            <CardDescription>
              Entwicklung von Zins- und Tilgungsanteil über die Laufzeit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="jahr"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#9ca3af' }}
                    interval={Math.ceil(chartData.length / 8)}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#9ca3af' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatWaehrung(value),
                      name === 'zinsen' ? 'Zinsen' : name === 'tilgung' ? 'Tilgung' : 'Restschuld'
                    ]}
                    labelStyle={{ fontWeight: 'bold' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend
                    formatter={(value) =>
                      value === 'zinsen' ? 'Zinsen' : value === 'tilgung' ? 'Tilgung' : 'Restschuld'
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="zinsen"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#fca5a5"
                    name="zinsen"
                  />
                  <Area
                    type="monotone"
                    dataKey="tilgung"
                    stackId="1"
                    stroke="#0f1a2e"
                    fill="#1e3a5f"
                    name="tilgung"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-secondary-500 mt-4 text-center">
              Der Chart zeigt, wie sich der Anteil der Zinsen (rot) im Laufe der Zeit verringert,
              während der Tilgungsanteil (blau) steigt. Die Summe beider ergibt Ihre jährliche Zahlung.
            </p>
          </CardContent>
        </Card>
      )}

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
