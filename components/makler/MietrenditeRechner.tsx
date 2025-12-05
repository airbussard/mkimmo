'use client'

import { useState, useMemo } from 'react'
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
  berechneMietrendite,
  berechneTilgungsplan,
  berechneCashflowPlan,
  formatWaehrung,
  formatProzent,
  DEFAULT_MIETRENDITE_EINGABEN,
  type MietrenditeEingaben,
} from '@/lib/utils/mietrendite'

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

export function MietrenditeRechner() {
  // State für alle Eingaben
  const [kaufpreis, setKaufpreis] = useState(DEFAULT_MIETRENDITE_EINGABEN.kaufpreis)
  const [kaufnebenkosten, setKaufnebenkosten] = useState(DEFAULT_MIETRENDITE_EINGABEN.kaufnebenkosten)
  const [kaufnebenkostenModus, setKaufnebenkostenModus] = useState<'prozent' | 'absolut'>(
    DEFAULT_MIETRENDITE_EINGABEN.kaufnebenkostenModus
  )
  const [sanierungskosten, setSanierungskosten] = useState(DEFAULT_MIETRENDITE_EINGABEN.sanierungskosten)
  const [instandhaltung, setInstandhaltung] = useState(DEFAULT_MIETRENDITE_EINGABEN.instandhaltungskostenJaehrlich)
  const [instandhaltungModus, setInstandhaltungModus] = useState<'prozent' | 'absolut'>(
    DEFAULT_MIETRENDITE_EINGABEN.instandhaltungModus
  )

  const [kaltmiete, setKaltmiete] = useState(DEFAULT_MIETRENDITE_EINGABEN.kaltmieteMonat)
  const [leerstandsquote, setLeerstandsquote] = useState(DEFAULT_MIETRENDITE_EINGABEN.leerstandsquote)
  const [mietausfallwagnis, setMietausfallwagnis] = useState(DEFAULT_MIETRENDITE_EINGABEN.mietausfallwagnis)
  const [verwaltungskosten, setVerwaltungskosten] = useState(DEFAULT_MIETRENDITE_EINGABEN.verwaltungskosten)
  const [verwaltungskostenModus, setVerwaltungskostenModus] = useState<'prozent' | 'absolut'>(
    DEFAULT_MIETRENDITE_EINGABEN.verwaltungskostenModus
  )

  const [eigenkapital, setEigenkapital] = useState(DEFAULT_MIETRENDITE_EINGABEN.eigenkapital)
  const [kredithoehe, setKredithoehe] = useState(DEFAULT_MIETRENDITE_EINGABEN.kredithoehe)
  const [zinssatz, setZinssatz] = useState(DEFAULT_MIETRENDITE_EINGABEN.zinssatz)
  const [tilgungssatz, setTilgungssatz] = useState(DEFAULT_MIETRENDITE_EINGABEN.tilgungssatz)

  const [grundsteuer, setGrundsteuer] = useState(DEFAULT_MIETRENDITE_EINGABEN.grundsteuerJaehrlich)
  const [afaSatz, setAfaSatz] = useState(DEFAULT_MIETRENDITE_EINGABEN.afaSatz)
  const [steuersatz, setSteuersatz] = useState(DEFAULT_MIETRENDITE_EINGABEN.persoenlichSteuersatz)

  // UI State
  const [zeigeTilgungsplan, setZeigeTilgungsplan] = useState(false)
  const [zeigeCashflowPlan, setZeigeCashflowPlan] = useState(false)

  // Eingaben zusammenstellen
  const eingaben: MietrenditeEingaben = useMemo(
    () => ({
      kaufpreis,
      kaufnebenkosten,
      kaufnebenkostenModus,
      sanierungskosten,
      instandhaltungskostenJaehrlich: instandhaltung,
      instandhaltungModus,
      kaltmieteMonat: kaltmiete,
      leerstandsquote,
      mietausfallwagnis,
      verwaltungskosten,
      verwaltungskostenModus,
      eigenkapital,
      kredithoehe,
      zinssatz,
      tilgungssatz,
      grundsteuerJaehrlich: grundsteuer,
      afaSatz,
      persoenlichSteuersatz: steuersatz,
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
    () => (zeigeTilgungsplan ? berechneTilgungsplan(kredithoehe, zinssatz, tilgungssatz, 30) : []),
    [zeigeTilgungsplan, kredithoehe, zinssatz, tilgungssatz]
  )
  const cashflowPlan = useMemo(
    () => (zeigeCashflowPlan ? berechneCashflowPlan(eingaben, 30) : []),
    [zeigeCashflowPlan, eingaben]
  )

  // Input Handler
  const handleNumericInput = (
    value: string,
    setter: (val: number) => void,
    allowDecimal: boolean = false
  ) => {
    let cleanValue = value.replace(/[^\d.,]/g, '')
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.')
    const numValue = allowDecimal ? parseFloat(cleanValue) : parseInt(cleanValue, 10)
    if (!isNaN(numValue)) {
      setter(numValue)
    } else if (cleanValue === '' || cleanValue === '.') {
      setter(0)
    }
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
                    onChange={(e) => handleNumericInput(e.target.value, setKaufnebenkosten, true)}
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
                    onChange={(e) => handleNumericInput(e.target.value, setInstandhaltung, true)}
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
                  onChange={(e) => handleNumericInput(e.target.value, setLeerstandsquote, true)}
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
                  onChange={(e) => handleNumericInput(e.target.value, setMietausfallwagnis, true)}
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
                    onChange={(e) => handleNumericInput(e.target.value, setVerwaltungskosten, true)}
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
                    onChange={(e) => handleNumericInput(e.target.value, setZinssatz, true)}
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
                    onChange={(e) => handleNumericInput(e.target.value, setTilgungssatz, true)}
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
                    onChange={(e) => handleNumericInput(e.target.value, setAfaSatz, true)}
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
                    onChange={(e) => handleNumericInput(e.target.value, setSteuersatz, true)}
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
