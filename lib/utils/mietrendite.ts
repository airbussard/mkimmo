/**
 * Mietrendite- und Profitabilitätsrechner
 *
 * Berechnet Brutto-/Nettomietrendite, Cashflow, ROE und Tilgungspläne
 * für Kapitalanlage-Immobilien.
 */

// ==================== INTERFACES ====================

export interface MietrenditeEingaben {
  // Objektdaten
  kaufpreis: number
  kaufnebenkosten: number
  kaufnebenkostenModus: 'prozent' | 'absolut'
  sanierungskosten: number
  instandhaltungskostenJaehrlich: number
  instandhaltungModus: 'prozent' | 'absolut' // % der Jahresmiete oder absolut

  // Mieteinnahmen
  kaltmieteMonat: number
  leerstandsquote: number // in %
  mietausfallwagnis: number // in %
  verwaltungskosten: number
  verwaltungskostenModus: 'prozent' | 'absolut' // % der Jahresmiete oder absolut

  // Finanzierung
  eigenkapital: number
  kredithoehe: number
  zinssatz: number
  tilgungssatz: number

  // Steuern
  grundsteuerJaehrlich: number
  afaSatz: number // Standard 2%
  persoenlichSteuersatz: number
}

export interface MietrenditeErgebnis {
  // Investition
  totalInvestment: number
  kaufnebenkostenAbsolut: number

  // Renditen
  bruttomietrendite: number
  nettomietrendite: number
  eigenkapitalrendite: number // ROE

  // Mieteinnahmen
  jahresMieteinnahmenBrutto: number
  jahresMieteinnahmenNetto: number // nach Leerstand/Ausfall
  effektiverMietausfall: number

  // Kosten
  instandhaltungAbsolut: number
  verwaltungAbsolut: number
  jaehrlicheKostenGesamt: number

  // Cashflow
  cashflowVorKapitaldienst: number
  kapitaldienstJaehrlich: number
  cashflowNachKapitaldienst: number
  cashflowMonatlich: number

  // Finanzierung
  monatlicheRate: number
  restschuld10Jahre: number
  restschuld20Jahre: number
  restschuld30Jahre: number

  // Steuer (optional)
  afaBetrag: number
  steuerersparnis: number
  cashflowNachSteuern: number
}

export interface TilgungsplanZeile {
  jahr: number
  restschuldBeginn: number
  zinsenJahr: number
  tilgungJahr: number
  rateJahr: number
  restschuldEnde: number
}

export interface CashflowPlanZeile {
  jahr: number
  mieteinnahmenBrutto: number
  mieteinnahmenNetto: number
  betriebskosten: number
  kapitaldienst: number
  cashflowVorSteuern: number
  afaAbzug: number
  steuereffekt: number
  cashflowNachSteuern: number
}

// ==================== BERECHNUNGSFUNKTIONEN ====================

/**
 * Berechnet die monatliche Annuität
 */
function berechneMonatlicheRate(
  kredithoehe: number,
  zinssatz: number,
  tilgungssatz: number
): number {
  if (kredithoehe <= 0) return 0
  const jahresannuitaet = kredithoehe * (zinssatz + tilgungssatz) / 100
  return jahresannuitaet / 12
}

/**
 * Berechnet die Restschuld nach n Jahren
 */
function berechneRestschuld(
  kredithoehe: number,
  zinssatz: number,
  monatlicheRate: number,
  jahre: number
): number {
  if (kredithoehe <= 0 || monatlicheRate <= 0) return 0

  const monatszins = zinssatz / 100 / 12
  let restschuld = kredithoehe

  for (let monat = 0; monat < jahre * 12; monat++) {
    const zinsanteil = restschuld * monatszins
    const tilgungsanteil = monatlicheRate - zinsanteil

    if (tilgungsanteil <= 0) break

    restschuld = Math.max(0, restschuld - tilgungsanteil)

    if (restschuld <= 0) break
  }

  return restschuld
}

/**
 * Hauptfunktion: Berechnet alle Mietrendite-Ergebnisse
 */
export function berechneMietrendite(eingaben: MietrenditeEingaben): MietrenditeErgebnis {
  const {
    kaufpreis,
    kaufnebenkosten,
    kaufnebenkostenModus,
    sanierungskosten,
    instandhaltungskostenJaehrlich,
    instandhaltungModus,
    kaltmieteMonat,
    leerstandsquote,
    mietausfallwagnis,
    verwaltungskosten,
    verwaltungskostenModus,
    eigenkapital,
    kredithoehe,
    zinssatz,
    tilgungssatz,
    grundsteuerJaehrlich,
    afaSatz,
    persoenlichSteuersatz,
  } = eingaben

  // === Investition ===
  const kaufnebenkostenAbsolut = kaufnebenkostenModus === 'prozent'
    ? kaufpreis * kaufnebenkosten / 100
    : kaufnebenkosten

  const totalInvestment = kaufpreis + kaufnebenkostenAbsolut + sanierungskosten

  // === Mieteinnahmen ===
  const jahresMieteinnahmenBrutto = kaltmieteMonat * 12
  const leerstandAbzug = jahresMieteinnahmenBrutto * leerstandsquote / 100
  const mietausfallAbzug = jahresMieteinnahmenBrutto * mietausfallwagnis / 100
  const effektiverMietausfall = leerstandAbzug + mietausfallAbzug
  const jahresMieteinnahmenNetto = jahresMieteinnahmenBrutto - effektiverMietausfall

  // === Kosten ===
  const instandhaltungAbsolut = instandhaltungModus === 'prozent'
    ? jahresMieteinnahmenBrutto * instandhaltungskostenJaehrlich / 100
    : instandhaltungskostenJaehrlich

  const verwaltungAbsolut = verwaltungskostenModus === 'prozent'
    ? jahresMieteinnahmenBrutto * verwaltungskosten / 100
    : verwaltungskosten

  const jaehrlicheKostenGesamt = instandhaltungAbsolut + verwaltungAbsolut + grundsteuerJaehrlich

  // === Cashflow vor Kapitaldienst ===
  const cashflowVorKapitaldienst = jahresMieteinnahmenNetto - jaehrlicheKostenGesamt

  // === Finanzierung ===
  const monatlicheRate = berechneMonatlicheRate(kredithoehe, zinssatz, tilgungssatz)
  const kapitaldienstJaehrlich = monatlicheRate * 12

  // === Cashflow nach Kapitaldienst ===
  const cashflowNachKapitaldienst = cashflowVorKapitaldienst - kapitaldienstJaehrlich
  const cashflowMonatlich = cashflowNachKapitaldienst / 12

  // === Restschulden ===
  const restschuld10Jahre = berechneRestschuld(kredithoehe, zinssatz, monatlicheRate, 10)
  const restschuld20Jahre = berechneRestschuld(kredithoehe, zinssatz, monatlicheRate, 20)
  const restschuld30Jahre = berechneRestschuld(kredithoehe, zinssatz, monatlicheRate, 30)

  // === Renditen ===
  const bruttomietrendite = kaufpreis > 0
    ? (jahresMieteinnahmenBrutto / kaufpreis) * 100
    : 0

  const nettomietrendite = totalInvestment > 0
    ? (cashflowVorKapitaldienst / totalInvestment) * 100
    : 0

  const eigenkapitalrendite = eigenkapital > 0
    ? (cashflowNachKapitaldienst / eigenkapital) * 100
    : 0

  // === Steuer ===
  // AfA nur auf Gebäudewert (vereinfacht: 80% des Kaufpreises)
  const gebaeudeanteil = kaufpreis * 0.8
  const afaBetrag = gebaeudeanteil * afaSatz / 100

  // Zinsen sind abzugsfähig
  const zinsenJahr = kredithoehe > 0 ? kredithoehe * zinssatz / 100 : 0

  // Zu versteuerndes Einkommen aus Vermietung
  const zuVersteuerndesEinkommen = jahresMieteinnahmenNetto - jaehrlicheKostenGesamt - zinsenJahr - afaBetrag

  // Steuereffekt (negativ = Ersparnis, positiv = Steuerlast)
  const steuereffekt = zuVersteuerndesEinkommen * persoenlichSteuersatz / 100
  const steuerersparnis = steuereffekt < 0 ? Math.abs(steuereffekt) : 0

  const cashflowNachSteuern = cashflowNachKapitaldienst - steuereffekt

  return {
    totalInvestment,
    kaufnebenkostenAbsolut,
    bruttomietrendite,
    nettomietrendite,
    eigenkapitalrendite,
    jahresMieteinnahmenBrutto,
    jahresMieteinnahmenNetto,
    effektiverMietausfall,
    instandhaltungAbsolut,
    verwaltungAbsolut,
    jaehrlicheKostenGesamt,
    cashflowVorKapitaldienst,
    kapitaldienstJaehrlich,
    cashflowNachKapitaldienst,
    cashflowMonatlich,
    monatlicheRate,
    restschuld10Jahre,
    restschuld20Jahre,
    restschuld30Jahre,
    afaBetrag,
    steuerersparnis,
    cashflowNachSteuern,
  }
}

/**
 * Erstellt einen jährlichen Tilgungsplan
 */
export function berechneTilgungsplan(
  kredithoehe: number,
  zinssatz: number,
  tilgungssatz: number,
  maxJahre: number = 30
): TilgungsplanZeile[] {
  if (kredithoehe <= 0) return []

  const plan: TilgungsplanZeile[] = []
  const monatlicheRate = berechneMonatlicheRate(kredithoehe, zinssatz, tilgungssatz)
  const monatszins = zinssatz / 100 / 12
  let restschuld = kredithoehe

  for (let jahr = 1; jahr <= maxJahre && restschuld > 0; jahr++) {
    const restschuldBeginn = restschuld
    let zinsenJahr = 0
    let tilgungJahr = 0

    for (let monat = 0; monat < 12 && restschuld > 0; monat++) {
      const zinsanteil = restschuld * monatszins
      const tilgungsanteil = Math.min(monatlicheRate - zinsanteil, restschuld)

      zinsenJahr += zinsanteil
      tilgungJahr += tilgungsanteil
      restschuld = Math.max(0, restschuld - tilgungsanteil)
    }

    plan.push({
      jahr,
      restschuldBeginn,
      zinsenJahr,
      tilgungJahr,
      rateJahr: monatlicheRate * 12,
      restschuldEnde: restschuld,
    })

    if (restschuld <= 0) break
  }

  return plan
}

/**
 * Erstellt einen jährlichen Cashflow-Plan
 */
export function berechneCashflowPlan(
  eingaben: MietrenditeEingaben,
  maxJahre: number = 30
): CashflowPlanZeile[] {
  const ergebnis = berechneMietrendite(eingaben)
  const tilgungsplan = berechneTilgungsplan(
    eingaben.kredithoehe,
    eingaben.zinssatz,
    eingaben.tilgungssatz,
    maxJahre
  )

  const plan: CashflowPlanZeile[] = []
  const gebaeudeanteil = eingaben.kaufpreis * 0.8
  const afaJaehrlich = gebaeudeanteil * eingaben.afaSatz / 100

  for (let jahr = 1; jahr <= maxJahre; jahr++) {
    const tilgungszeile = tilgungsplan.find(t => t.jahr === jahr)
    const kapitaldienst = tilgungszeile ? tilgungszeile.rateJahr : 0
    const zinsenJahr = tilgungszeile ? tilgungszeile.zinsenJahr : 0

    const betriebskosten = ergebnis.jaehrlicheKostenGesamt
    const cashflowVorSteuern = ergebnis.jahresMieteinnahmenNetto - betriebskosten - kapitaldienst

    // Steuerberechnung
    const zuVersteuern = ergebnis.jahresMieteinnahmenNetto - betriebskosten - zinsenJahr - afaJaehrlich
    const steuereffekt = zuVersteuern * eingaben.persoenlichSteuersatz / 100

    plan.push({
      jahr,
      mieteinnahmenBrutto: ergebnis.jahresMieteinnahmenBrutto,
      mieteinnahmenNetto: ergebnis.jahresMieteinnahmenNetto,
      betriebskosten,
      kapitaldienst,
      cashflowVorSteuern,
      afaAbzug: afaJaehrlich,
      steuereffekt,
      cashflowNachSteuern: cashflowVorSteuern - steuereffekt,
    })
  }

  return plan
}

// ==================== HILFSFUNKTIONEN ====================

/**
 * Formatiert einen Betrag als EUR-Währung
 */
export function formatWaehrung(betrag: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(betrag)
}

/**
 * Formatiert einen Betrag als EUR-Währung mit Dezimalstellen
 */
export function formatWaehrungGenau(betrag: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(betrag)
}

/**
 * Formatiert einen Prozentsatz
 */
export function formatProzent(wert: number, nachkommastellen: number = 2): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: nachkommastellen,
    maximumFractionDigits: nachkommastellen,
  }).format(wert) + ' %'
}

// ==================== STANDARDWERTE ====================

export const DEFAULT_MIETRENDITE_EINGABEN: MietrenditeEingaben = {
  // Objektdaten
  kaufpreis: 250000,
  kaufnebenkosten: 12,
  kaufnebenkostenModus: 'prozent',
  sanierungskosten: 0,
  instandhaltungskostenJaehrlich: 1,
  instandhaltungModus: 'prozent',

  // Mieteinnahmen
  kaltmieteMonat: 800,
  leerstandsquote: 3,
  mietausfallwagnis: 2,
  verwaltungskosten: 25,
  verwaltungskostenModus: 'absolut',

  // Finanzierung
  eigenkapital: 60000,
  kredithoehe: 220000,
  zinssatz: 3.5,
  tilgungssatz: 2,

  // Steuern
  grundsteuerJaehrlich: 400,
  afaSatz: 2,
  persoenlichSteuersatz: 42,
}
