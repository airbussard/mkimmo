'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Percent,
  Euro,
  Building2,
  Wallet,
  PiggyBank,
  Calendar,
  Home,
  FileText,
  Download,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  berechneMietrendite,
  berechneTilgungsplan,
  berechneCashflowPlan,
  formatWaehrung,
  formatProzent,
  DEFAULT_MIETRENDITE_EINGABEN,
  type MietrenditeEingaben,
} from '@/lib/utils/mietrendite'
import { exportRechnerToPDF, formatWaehrungFuerPDF, formatProzentFuerPDF } from '@/lib/utils/pdf-export'

// Chart Farben
const CHART_COLORS = {
  primary: '#1e3a5f',
  secondary: '#2563eb',
  tertiary: '#3b82f6',
  quaternary: '#60a5fa',
  positive: '#22c55e',
  negative: '#ef4444',
}

// ==================== HELPER COMPONENTS ====================

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

interface ResultCardProps {
  titel: string
  wert: string
  beschreibung?: string
  icon: React.ReactNode
  highlight?: boolean
  positiv?: boolean
  negativ?: boolean
}

function ResultCard({ titel, wert, beschreibung, icon, highlight, positiv, negativ }: ResultCardProps) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? 'bg-primary-50 border-primary-200'
          : positiv
          ? 'bg-green-50 border-green-200'
          : negativ
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-secondary-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`p-2 rounded-lg ${
            highlight
              ? 'bg-primary-100 text-primary-600'
              : positiv
              ? 'bg-green-100 text-green-600'
              : negativ
              ? 'bg-red-100 text-red-600'
              : 'bg-secondary-100 text-secondary-600'
          }`}
        >
          {icon}
        </div>
        <span className="text-sm text-secondary-600">{titel}</span>
      </div>
      <div
        className={`text-xl font-bold ${
          positiv ? 'text-green-700' : negativ ? 'text-red-700' : 'text-secondary-900'
        }`}
      >
        {wert}
      </div>
      {beschreibung && <div className="text-xs text-secondary-500 mt-1">{beschreibung}</div>}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

// Hilfsfunktion: String → Number (mit Komma als Dezimaltrennzeichen)
const parseDecimal = (value: string): number => {
  const num = parseFloat(value.replace(',', '.'))
  return isNaN(num) ? 0 : num
}

export function MietrenditeRechner() {
  // State für alle Eingaben - Ganzzahlen als number, Dezimalzahlen als string
  const [kaufpreis, setKaufpreis] = useState(DEFAULT_MIETRENDITE_EINGABEN.kaufpreis)
  const [kaufnebenkosten, setKaufnebenkosten] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.kaufnebenkosten).replace('.', ','))
  const [kaufnebenkostenModus, setKaufnebenkostenModus] = useState<'prozent' | 'absolut'>(
    DEFAULT_MIETRENDITE_EINGABEN.kaufnebenkostenModus
  )
  const [sanierungskosten, setSanierungskosten] = useState(DEFAULT_MIETRENDITE_EINGABEN.sanierungskosten)
  const [instandhaltung, setInstandhaltung] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.instandhaltungskostenJaehrlich).replace('.', ','))
  const [instandhaltungModus, setInstandhaltungModus] = useState<'prozent' | 'absolut'>(
    DEFAULT_MIETRENDITE_EINGABEN.instandhaltungModus
  )

  const [kaltmiete, setKaltmiete] = useState(DEFAULT_MIETRENDITE_EINGABEN.kaltmieteMonat)
  const [leerstandsquote, setLeerstandsquote] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.leerstandsquote).replace('.', ','))
  const [mietausfallwagnis, setMietausfallwagnis] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.mietausfallwagnis).replace('.', ','))
  const [verwaltungskosten, setVerwaltungskosten] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.verwaltungskosten).replace('.', ','))
  const [verwaltungskostenModus, setVerwaltungskostenModus] = useState<'prozent' | 'absolut'>(
    DEFAULT_MIETRENDITE_EINGABEN.verwaltungskostenModus
  )

  const [eigenkapital, setEigenkapital] = useState(DEFAULT_MIETRENDITE_EINGABEN.eigenkapital)
  const [kredithoehe, setKredithoehe] = useState(DEFAULT_MIETRENDITE_EINGABEN.kredithoehe)
  const [zinssatz, setZinssatz] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.zinssatz).replace('.', ','))
  const [tilgungssatz, setTilgungssatz] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.tilgungssatz).replace('.', ','))

  const [grundsteuer, setGrundsteuer] = useState(DEFAULT_MIETRENDITE_EINGABEN.grundsteuerJaehrlich)
  const [afaSatz, setAfaSatz] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.afaSatz).replace('.', ','))
  const [steuersatz, setSteuersatz] = useState(String(DEFAULT_MIETRENDITE_EINGABEN.persoenlichSteuersatz).replace('.', ','))

  // UI State
  const [zeigeTilgungsplan, setZeigeTilgungsplan] = useState(false)
  const [zeigeCashflowPlan, setZeigeCashflowPlan] = useState(false)

  // Refs für Charts
  const chartRef = useRef<HTMLDivElement>(null)

  // Eingaben zusammenstellen - String-Werte zu Number konvertieren
  const eingaben: MietrenditeEingaben = useMemo(
    () => ({
      kaufpreis,
      kaufnebenkosten: parseDecimal(kaufnebenkosten),
      kaufnebenkostenModus,
      sanierungskosten,
      instandhaltungskostenJaehrlich: parseDecimal(instandhaltung),
      instandhaltungModus,
      kaltmieteMonat: kaltmiete,
      leerstandsquote: parseDecimal(leerstandsquote),
      mietausfallwagnis: parseDecimal(mietausfallwagnis),
      verwaltungskosten: parseDecimal(verwaltungskosten),
      verwaltungskostenModus,
      eigenkapital,
      kredithoehe,
      zinssatz: parseDecimal(zinssatz),
      tilgungssatz: parseDecimal(tilgungssatz),
      grundsteuerJaehrlich: grundsteuer,
      afaSatz: parseDecimal(afaSatz),
      persoenlichSteuersatz: parseDecimal(steuersatz),
    }),
    [
      kaufpreis, kaufnebenkosten, kaufnebenkostenModus, sanierungskosten,
      instandhaltung, instandhaltungModus, kaltmiete, leerstandsquote,
      mietausfallwagnis, verwaltungskosten, verwaltungskostenModus,
      eigenkapital, kredithoehe, zinssatz, tilgungssatz,
      grundsteuer, afaSatz, steuersatz,
    ]
  )

  // Berechnungen
  const ergebnis = useMemo(() => berechneMietrendite(eingaben), [eingaben])
  const tilgungsplan = useMemo(
    () => (zeigeTilgungsplan ? berechneTilgungsplan(kredithoehe, parseDecimal(zinssatz), parseDecimal(tilgungssatz), 30) : []),
    [zeigeTilgungsplan, kredithoehe, zinssatz, tilgungssatz]
  )
  const cashflowPlan = useMemo(
    () => (zeigeCashflowPlan ? berechneCashflowPlan(eingaben, 30) : []),
    [zeigeCashflowPlan, eingaben]
  )

  // Chart-Daten für Cashflow-Verlauf (immer berechnen für PDF)
  const cashflowChartData = useMemo(() => {
    const plan = berechneCashflowPlan(eingaben, 30)
    return plan.map((zeile) => ({
      jahr: `Jahr ${zeile.jahr}`,
      cashflow: Math.round(zeile.cashflowNachSteuern),
      mieteinnahmen: Math.round(zeile.mieteinnahmenNetto),
      kosten: Math.round(zeile.betriebskosten + zeile.kapitaldienst),
    }))
  }, [eingaben])

  // Chart-Daten für Kostenverteilung (Pie)
  const kostenPieData = useMemo(() => {
    return [
      { name: 'Instandhaltung', value: ergebnis.instandhaltungAbsolut },
      { name: 'Verwaltung', value: ergebnis.verwaltungAbsolut },
      { name: 'Grundsteuer', value: grundsteuer },
      { name: 'Leerstand/Ausfall', value: ergebnis.effektiverMietausfall },
    ].filter((item) => item.value > 0)
  }, [ergebnis, grundsteuer])

  // Chart-Daten für Einnahmen vs Ausgaben (Bar)
  const einnahmenAusgabenData = useMemo(() => {
    return [
      {
        name: 'Jährlich',
        einnahmen: Math.round(ergebnis.jahresMieteinnahmenNetto),
        ausgaben: Math.round(ergebnis.jaehrlicheKostenGesamt + ergebnis.kapitaldienstJaehrlich),
      },
    ]
  }, [ergebnis])

  // PDF Export Handler
  const handleExportPDF = async () => {
    const eingabenPDF = [
      { label: 'Kaufpreis', wert: formatWaehrungFuerPDF(kaufpreis) },
      { label: 'Kaufnebenkosten', wert: kaufnebenkostenModus === 'prozent' ? `${kaufnebenkosten} %` : formatWaehrungFuerPDF(parseDecimal(kaufnebenkosten)) },
      { label: 'Sanierungskosten', wert: formatWaehrungFuerPDF(sanierungskosten) },
      { label: 'Kaltmiete/Monat', wert: formatWaehrungFuerPDF(kaltmiete) },
      { label: 'Eigenkapital', wert: formatWaehrungFuerPDF(eigenkapital) },
      { label: 'Kredithöhe', wert: formatWaehrungFuerPDF(kredithoehe) },
      { label: 'Zinssatz', wert: `${zinssatz} %` },
      { label: 'Tilgungssatz', wert: `${tilgungssatz} %` },
    ]

    const ergebnissePDF = [
      { label: 'Bruttomietrendite', wert: formatProzentFuerPDF(ergebnis.bruttomietrendite) },
      { label: 'Nettomietrendite', wert: formatProzentFuerPDF(ergebnis.nettomietrendite), hervorgehoben: true },
      { label: 'Eigenkapitalrendite', wert: formatProzentFuerPDF(ergebnis.eigenkapitalrendite), hervorgehoben: true },
      { label: 'Cashflow/Monat', wert: formatWaehrungFuerPDF(ergebnis.cashflowMonatlich), hervorgehoben: true },
      { label: 'Cashflow/Jahr', wert: formatWaehrungFuerPDF(ergebnis.cashflowNachKapitaldienst) },
      { label: 'Gesamtinvestition', wert: formatWaehrungFuerPDF(ergebnis.totalInvestment) },
      { label: 'Kapitaldienst/Jahr', wert: formatWaehrungFuerPDF(ergebnis.kapitaldienstJaehrlich) },
      { label: 'Restschuld 10 Jahre', wert: formatWaehrungFuerPDF(ergebnis.restschuld10Jahre) },
      { label: 'Restschuld 20 Jahre', wert: formatWaehrungFuerPDF(ergebnis.restschuld20Jahre) },
    ]

    await exportRechnerToPDF({
      titel: 'Mietrendite-Rechner',
      untertitel: 'Rendite, Cashflow und Profitabilität',
      eingaben: eingabenPDF,
      ergebnisse: ergebnissePDF,
      chartElement: chartRef.current,
    })
  }

  // Input Handler für Ganzzahlen (z.B. Kaufpreis, Eigenkapital)
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

  // Input Handler für Dezimalzahlen (z.B. Zinssatz, Prozente)
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
      {/* Eingabebereich */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Objektdaten */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              Objektdaten
            </CardTitle>
            <CardDescription>Kaufpreis und Nebenkosten der Immobilie</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Kaufpreis
                <InfoTooltip text="Der Kaufpreis der Immobilie ohne Nebenkosten." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={kaufpreis.toLocaleString('de-DE')}
                  onChange={(e) => handleNumericInput(e.target.value, setKaufpreis)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Kaufnebenkosten
                <InfoTooltip text="Grunderwerbsteuer, Notar, Makler. In NRW ca. 10-12% des Kaufpreises." />
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={kaufnebenkosten}
                    onChange={(e) => handleDecimalInput(e.target.value, setKaufnebenkosten)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    {kaufnebenkostenModus === 'prozent' ? '%' : '€'}
                  </span>
                </div>
                <Select value={kaufnebenkostenModus} onValueChange={(v) => setKaufnebenkostenModus(v as 'prozent' | 'absolut')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prozent">%</SelectItem>
                    <SelectItem value="absolut">€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Sanierungskosten
                <InfoTooltip text="Einmalige Kosten für Renovierung oder Modernisierung." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={sanierungskosten > 0 ? sanierungskosten.toLocaleString('de-DE') : ''}
                  onChange={(e) => handleNumericInput(e.target.value, setSanierungskosten)}
                  placeholder="0"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Instandhaltungskosten (jährlich)
                <InfoTooltip text="Laufende Kosten für Reparaturen und Instandhaltung. Faustregel: 1-2% der Jahresmiete oder ca. 10€/m²." />
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={instandhaltung}
                    onChange={(e) => handleDecimalInput(e.target.value, setInstandhaltung)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    {instandhaltungModus === 'prozent' ? '%' : '€'}
                  </span>
                </div>
                <Select value={instandhaltungModus} onValueChange={(v) => setInstandhaltungModus(v as 'prozent' | 'absolut')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prozent">% Miete</SelectItem>
                    <SelectItem value="absolut">€/Jahr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mieteinnahmen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary-600" />
              Mieteinnahmen
            </CardTitle>
            <CardDescription>Erwartete Mieteinnahmen und Abzüge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Kaltmiete pro Monat
                <InfoTooltip text="Die monatliche Nettokaltmiete ohne Nebenkosten." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={kaltmiete.toLocaleString('de-DE')}
                  onChange={(e) => handleNumericInput(e.target.value, setKaltmiete)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Leerstandsquote
                <InfoTooltip text="Erwarteter Leerstand bei Mieterwechsel. Üblich: 2-5%." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={leerstandsquote}
                  onChange={(e) => handleDecimalInput(e.target.value, setLeerstandsquote)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Mietausfallwagnis
                <InfoTooltip text="Rücklage für Mietausfälle. Üblich: 2-4%." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={mietausfallwagnis}
                  onChange={(e) => handleDecimalInput(e.target.value, setMietausfallwagnis)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Verwaltungskosten
                <InfoTooltip text="Kosten für Hausverwaltung. Üblich: 20-35€/Einheit/Monat oder 5-8% der Miete." />
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={verwaltungskosten}
                    onChange={(e) => handleDecimalInput(e.target.value, setVerwaltungskosten)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    {verwaltungskostenModus === 'prozent' ? '%' : '€'}
                  </span>
                </div>
                <Select value={verwaltungskostenModus} onValueChange={(v) => setVerwaltungskostenModus(v as 'prozent' | 'absolut')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prozent">% Miete</SelectItem>
                    <SelectItem value="absolut">€/Monat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finanzierung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary-600" />
              Finanzierung
            </CardTitle>
            <CardDescription>Eigenkapital und Kreditkonditionen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Eigenkapital
                <InfoTooltip text="Ihr eingesetztes Eigenkapital inkl. Kaufnebenkosten." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={eigenkapital.toLocaleString('de-DE')}
                  onChange={(e) => handleNumericInput(e.target.value, setEigenkapital)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Kredithöhe
                <InfoTooltip text="Der aufgenommene Darlehensbetrag." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={kredithoehe.toLocaleString('de-DE')}
                  onChange={(e) => handleNumericInput(e.target.value, setKredithoehe)}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Zinssatz
                  <InfoTooltip text="Der Sollzinssatz Ihres Darlehens." />
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={zinssatz}
                    onChange={(e) => handleDecimalInput(e.target.value, setZinssatz)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Tilgungssatz
                  <InfoTooltip text="Der anfängliche Tilgungssatz. Üblich: 1-3% p.a." />
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={tilgungssatz}
                    onChange={(e) => handleDecimalInput(e.target.value, setTilgungssatz)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steuern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Steuern
            </CardTitle>
            <CardDescription>Steuerliche Aspekte der Investition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Grundsteuer (jährlich)
                <InfoTooltip text="Die jährliche Grundsteuer für das Objekt." />
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={grundsteuer > 0 ? grundsteuer.toLocaleString('de-DE') : ''}
                  onChange={(e) => handleNumericInput(e.target.value, setGrundsteuer)}
                  placeholder="0"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">€</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  AfA-Satz
                  <InfoTooltip text="Absetzung für Abnutzung. Standard: 2% für Gebäude ab 1925, 2,5% für ältere." />
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={afaSatz}
                    onChange={(e) => handleDecimalInput(e.target.value, setAfaSatz)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Persönlicher Steuersatz
                  <InfoTooltip text="Ihr persönlicher Einkommensteuersatz (Grenzsteuersatz)." />
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={steuersatz}
                    onChange={(e) => handleDecimalInput(e.target.value, setSteuersatz)}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ergebnisse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary-600" />
            Ergebnisse
          </CardTitle>
          <CardDescription>Rendite, Cashflow und Profitabilität Ihrer Investition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultCard
              titel="Bruttomietrendite"
              wert={formatProzent(ergebnis.bruttomietrendite)}
              beschreibung="Jahresmiete / Kaufpreis"
              icon={<Percent className="h-4 w-4" />}
            />
            <ResultCard
              titel="Nettomietrendite"
              wert={formatProzent(ergebnis.nettomietrendite)}
              beschreibung="Nach allen Kosten"
              icon={<TrendingUp className="h-4 w-4" />}
              highlight
            />
            <ResultCard
              titel="Eigenkapitalrendite"
              wert={formatProzent(ergebnis.eigenkapitalrendite)}
              beschreibung="Return on Equity"
              icon={<PiggyBank className="h-4 w-4" />}
              positiv={ergebnis.eigenkapitalrendite > 0}
              negativ={ergebnis.eigenkapitalrendite < 0}
            />
            <ResultCard
              titel="Cashflow / Monat"
              wert={formatWaehrung(ergebnis.cashflowMonatlich)}
              beschreibung="Nach Kapitaldienst"
              icon={<Euro className="h-4 w-4" />}
              positiv={ergebnis.cashflowMonatlich > 0}
              negativ={ergebnis.cashflowMonatlich < 0}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <ResultCard
              titel="Gesamtinvestition"
              wert={formatWaehrung(ergebnis.totalInvestment)}
              beschreibung="Kaufpreis + NK + Sanierung"
              icon={<Building2 className="h-4 w-4" />}
            />
            <ResultCard
              titel="Kapitaldienst / Jahr"
              wert={formatWaehrung(ergebnis.kapitaldienstJaehrlich)}
              beschreibung={`${formatWaehrung(ergebnis.monatlicheRate)} / Monat`}
              icon={<Wallet className="h-4 w-4" />}
            />
            <ResultCard
              titel="Restschuld 10 Jahre"
              wert={formatWaehrung(ergebnis.restschuld10Jahre)}
              icon={<Calendar className="h-4 w-4" />}
            />
            <ResultCard
              titel="Restschuld 20 Jahre"
              wert={formatWaehrung(ergebnis.restschuld20Jahre)}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>

          {/* Detailansicht */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <h4 className="font-semibold text-secondary-900 mb-4">Detailübersicht</h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h5 className="font-medium text-secondary-700 mb-2">Einnahmen</h5>
                <div className="space-y-1 text-secondary-600">
                  <div className="flex justify-between">
                    <span>Jahresmiete (brutto)</span>
                    <span>{formatWaehrung(ergebnis.jahresMieteinnahmenBrutto)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>./. Leerstand & Ausfall</span>
                    <span>-{formatWaehrung(ergebnis.effektiverMietausfall)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-secondary-900 pt-1 border-t">
                    <span>Jahresmiete (netto)</span>
                    <span>{formatWaehrung(ergebnis.jahresMieteinnahmenNetto)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-secondary-700 mb-2">Kosten</h5>
                <div className="space-y-1 text-secondary-600">
                  <div className="flex justify-between">
                    <span>Instandhaltung</span>
                    <span>{formatWaehrung(ergebnis.instandhaltungAbsolut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verwaltung</span>
                    <span>{formatWaehrung(ergebnis.verwaltungAbsolut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grundsteuer</span>
                    <span>{formatWaehrung(grundsteuer)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-secondary-900 pt-1 border-t">
                    <span>Kosten gesamt</span>
                    <span>{formatWaehrung(ergebnis.jaehrlicheKostenGesamt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-secondary-700 mb-2">Cashflow</h5>
                <div className="space-y-1 text-secondary-600">
                  <div className="flex justify-between">
                    <span>Vor Kapitaldienst</span>
                    <span>{formatWaehrung(ergebnis.cashflowVorKapitaldienst)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>./. Kapitaldienst</span>
                    <span>-{formatWaehrung(ergebnis.kapitaldienstJaehrlich)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-secondary-900 pt-1 border-t">
                    <span>Nach Kapitaldienst</span>
                    <span className={ergebnis.cashflowNachKapitaldienst >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatWaehrung(ergebnis.cashflowNachKapitaldienst)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tilgungsplan */}
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
              <CardDescription>Jährliche Übersicht der Kreditrückzahlung</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              {zeigeTilgungsplan ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        {zeigeTilgungsplan && tilgungsplan.length > 0 && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-2 font-medium text-secondary-600">Jahr</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Zinsen</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Tilgung</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Rate</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Restschuld</th>
                  </tr>
                </thead>
                <tbody>
                  {tilgungsplan.slice(0, 30).map((zeile) => (
                    <tr key={zeile.jahr} className="border-b border-secondary-100">
                      <td className="py-2 px-2">{zeile.jahr}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.zinsenJahr)}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.tilgungJahr)}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.rateJahr)}</td>
                      <td className="py-2 px-2 text-right font-medium">{formatWaehrung(zeile.restschuldEnde)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Cashflow-Plan */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-secondary-50 transition-colors"
          onClick={() => setZeigeCashflowPlan(!zeigeCashflowPlan)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Cashflow-Plan
              </CardTitle>
              <CardDescription>Jährliche Entwicklung des Cashflows</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              {zeigeCashflowPlan ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        {zeigeCashflowPlan && cashflowPlan.length > 0 && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-2 font-medium text-secondary-600">Jahr</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Miete (netto)</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Kosten</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Kapitaldienst</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Cashflow</th>
                    <th className="text-right py-3 px-2 font-medium text-secondary-600">Nach Steuern</th>
                  </tr>
                </thead>
                <tbody>
                  {cashflowPlan.slice(0, 30).map((zeile) => (
                    <tr key={zeile.jahr} className="border-b border-secondary-100">
                      <td className="py-2 px-2">{zeile.jahr}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.mieteinnahmenNetto)}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.betriebskosten)}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.kapitaldienst)}</td>
                      <td className="py-2 px-2 text-right">{formatWaehrung(zeile.cashflowVorSteuern)}</td>
                      <td
                        className={`py-2 px-2 text-right font-medium ${
                          zeile.cashflowNachSteuern >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatWaehrung(zeile.cashflowNachSteuern)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Charts & PDF Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                Grafische Auswertung
              </CardTitle>
              <CardDescription>Visualisierung der Rendite und Cashflow-Entwicklung</CardDescription>
            </div>
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Als PDF speichern
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="space-y-8">
            {/* Cashflow-Verlauf über 30 Jahre */}
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">Cashflow-Entwicklung (30 Jahre)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflowChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="jahr"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => value.replace('Jahr ', '')}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value),
                        name === 'cashflow' ? 'Cashflow' : name === 'mieteinnahmen' ? 'Mieteinnahmen' : 'Kosten',
                      ]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend
                      formatter={(value) =>
                        value === 'cashflow' ? 'Cashflow' : value === 'mieteinnahmen' ? 'Mieteinnahmen' : 'Kosten'
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="mieteinnahmen"
                      stackId="1"
                      stroke={CHART_COLORS.positive}
                      fill={CHART_COLORS.positive}
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="cashflow"
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Kostenverteilung & Einnahmen/Ausgaben */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Kostenverteilung Pie Chart */}
              <div>
                <h4 className="font-medium text-secondary-900 mb-4">Jährliche Kostenverteilung</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kostenPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {kostenPieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary][index % 4]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
                        }
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Einnahmen vs Ausgaben Bar Chart */}
              <div>
                <h4 className="font-medium text-secondary-900 mb-4">Einnahmen vs. Ausgaben (jährlich)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={einnahmenAusgabenData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`}
                      />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value),
                          name === 'einnahmen' ? 'Einnahmen' : 'Ausgaben',
                        ]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Legend formatter={(value) => (value === 'einnahmen' ? 'Einnahmen' : 'Ausgaben')} />
                      <Bar dataKey="einnahmen" fill={CHART_COLORS.positive} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="ausgaben" fill={CHART_COLORS.negative} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hinweis */}
      <div className="flex items-start gap-3 p-4 bg-secondary-50 rounded-lg">
        <Info className="h-5 w-5 text-secondary-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-secondary-600">
          <p className="font-medium mb-1">Hinweis</p>
          <p>
            Diese Berechnung dient nur zur Orientierung. Die tatsächlichen Werte können je nach
            individueller Situation, Marktentwicklung und steuerlichen Gegebenheiten abweichen.
            Für eine verbindliche Beratung wenden Sie sich bitte an einen Steuerberater oder
            Finanzexperten.
          </p>
        </div>
      </div>
    </div>
  )
}
