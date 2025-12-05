/**
 * Annuitätendarlehen-Berechnungslogik
 *
 * Berechnet monatliche Raten, Gesamtkosten und Tilgungspläne
 * für Immobiliendarlehen.
 */

// ==================== INTERFACES ====================

export interface AnnuitaetEingaben {
  darlehenssumme: number      // Kreditsumme in EUR
  sollzins: number            // Sollzins in % p.a.
  tilgungssatz: number        // Anfänglicher Tilgungssatz in % p.a.
  laufzeitJahre?: number      // Optionale Laufzeit (wird berechnet wenn nicht angegeben)
  sondertilgung: number       // Jährliche Sondertilgung in EUR
  zinsbindungJahre: number    // Zinsbindungsdauer in Jahren
  berechnungsModus: 'tilgung' | 'wunschrate'
  wunschrate?: number         // Gewünschte monatliche Rate (nur bei Modus 'wunschrate')
}

export interface AnnuitaetErgebnis {
  monatlicheRate: number
  anfaenglicheZinsrate: number
  anfaenglicheTilgungsrate: number
  gesamtbelastung: number
  summeZinsen: number
  summeTilgung: number
  restschuldNachZinsbindung: number
  effektiverTilgungssatz: number
  geschaetzteLaufzeitJahre: number
  geschaetzteLaufzeitMonate: number
}

export interface TilgungsplanZeile {
  monat: number
  jahr: number
  restschuldBeginn: number
  zinsanteil: number
  tilgungsanteil: number
  rate: number
  sondertilgung: number
  restschuldEnde: number
}

export interface JahresZusammenfassung {
  jahr: number
  zinsenGesamt: number
  tilgungGesamt: number
  sondertilgungGesamt: number
  restschuldEnde: number
}

// ==================== BERECHNUNGSFUNKTIONEN ====================

/**
 * Berechnet die monatliche Annuität basierend auf Zins und Tilgungssatz
 */
export function berechneMonatlicheRate(
  darlehenssumme: number,
  sollzins: number,
  tilgungssatz: number
): number {
  const jahresannuitaet = darlehenssumme * (sollzins + tilgungssatz) / 100
  return jahresannuitaet / 12
}

/**
 * Berechnet den effektiven Tilgungssatz bei gegebener Wunschrate
 */
export function berechneTilgungssatzAusWunschrate(
  darlehenssumme: number,
  sollzins: number,
  wunschrate: number
): number {
  const jahresrate = wunschrate * 12
  const tilgungssatz = (jahresrate / darlehenssumme * 100) - sollzins
  return Math.max(0, tilgungssatz)
}

/**
 * Berechnet die geschätzte Laufzeit bis zur vollständigen Tilgung
 */
export function berechneLaufzeit(
  darlehenssumme: number,
  sollzins: number,
  monatlicheRate: number,
  sondertilgungJaehrlich: number = 0
): { jahre: number; monate: number } {
  if (monatlicheRate <= 0 || darlehenssumme <= 0) {
    return { jahre: 0, monate: 0 }
  }

  const monatszins = sollzins / 100 / 12
  let restschuld = darlehenssumme
  let monate = 0
  const maxMonate = 600 // Max 50 Jahre

  while (restschuld > 0 && monate < maxMonate) {
    const zinsanteil = restschuld * monatszins
    const tilgungsanteil = monatlicheRate - zinsanteil

    if (tilgungsanteil <= 0) {
      // Rate deckt nicht einmal die Zinsen
      return { jahre: 999, monate: 0 }
    }

    restschuld -= tilgungsanteil
    monate++

    // Sondertilgung am Jahresende
    if (monate % 12 === 0 && sondertilgungJaehrlich > 0) {
      restschuld = Math.max(0, restschuld - sondertilgungJaehrlich)
    }
  }

  return {
    jahre: Math.floor(monate / 12),
    monate: monate % 12
  }
}

/**
 * Hauptfunktion: Berechnet alle Ergebniswerte
 */
export function berechneAnnuitaet(eingaben: AnnuitaetEingaben): AnnuitaetErgebnis {
  const {
    darlehenssumme,
    sollzins,
    tilgungssatz,
    sondertilgung,
    zinsbindungJahre,
    berechnungsModus,
    wunschrate
  } = eingaben

  // Monatliche Rate berechnen
  let monatlicheRate: number
  let effektiverTilgungssatz: number

  if (berechnungsModus === 'wunschrate' && wunschrate && wunschrate > 0) {
    monatlicheRate = wunschrate
    effektiverTilgungssatz = berechneTilgungssatzAusWunschrate(darlehenssumme, sollzins, wunschrate)
  } else {
    monatlicheRate = berechneMonatlicheRate(darlehenssumme, sollzins, tilgungssatz)
    effektiverTilgungssatz = tilgungssatz
  }

  // Anfängliche Aufteilung
  const monatszins = sollzins / 100 / 12
  const anfaenglicheZinsrate = darlehenssumme * monatszins
  const anfaenglicheTilgungsrate = monatlicheRate - anfaenglicheZinsrate

  // Laufzeit berechnen
  const laufzeit = berechneLaufzeit(darlehenssumme, sollzins, monatlicheRate, sondertilgung)

  // Tilgungsplan für Gesamtberechnungen erstellen
  const tilgungsplan = berechneTilgungsplan({
    ...eingaben,
    tilgungssatz: effektiverTilgungssatz
  })

  // Restschuld nach Zinsbindung
  const zinsbindungMonate = zinsbindungJahre * 12
  const zeileNachZinsbindung = tilgungsplan.find(z => z.monat === zinsbindungMonate)
  const restschuldNachZinsbindung = zeileNachZinsbindung?.restschuldEnde ?? darlehenssumme

  // Summen berechnen
  let summeZinsen = 0
  let summeTilgung = 0
  let gesamtbelastung = 0

  for (const zeile of tilgungsplan) {
    summeZinsen += zeile.zinsanteil
    summeTilgung += zeile.tilgungsanteil + zeile.sondertilgung
    gesamtbelastung += zeile.rate + zeile.sondertilgung
  }

  return {
    monatlicheRate,
    anfaenglicheZinsrate,
    anfaenglicheTilgungsrate,
    gesamtbelastung,
    summeZinsen,
    summeTilgung,
    restschuldNachZinsbindung,
    effektiverTilgungssatz,
    geschaetzteLaufzeitJahre: laufzeit.jahre,
    geschaetzteLaufzeitMonate: laufzeit.monate
  }
}

/**
 * Erstellt einen detaillierten monatlichen Tilgungsplan
 */
export function berechneTilgungsplan(eingaben: AnnuitaetEingaben): TilgungsplanZeile[] {
  const {
    darlehenssumme,
    sollzins,
    tilgungssatz,
    sondertilgung,
    berechnungsModus,
    wunschrate
  } = eingaben

  const plan: TilgungsplanZeile[] = []
  const monatszins = sollzins / 100 / 12

  // Monatliche Rate berechnen
  let monatlicheRate: number
  if (berechnungsModus === 'wunschrate' && wunschrate && wunschrate > 0) {
    monatlicheRate = wunschrate
  } else {
    monatlicheRate = berechneMonatlicheRate(darlehenssumme, sollzins, tilgungssatz)
  }

  let restschuld = darlehenssumme
  let monat = 0
  const maxMonate = 600 // Max 50 Jahre

  while (restschuld > 0.01 && monat < maxMonate) {
    monat++
    const jahr = Math.ceil(monat / 12)
    const restschuldBeginn = restschuld

    // Zins- und Tilgungsanteil berechnen
    const zinsanteil = restschuld * monatszins
    let tilgungsanteil = monatlicheRate - zinsanteil

    // Sicherstellen, dass Tilgung nicht negativ wird
    tilgungsanteil = Math.max(0, tilgungsanteil)

    // Restschuld nach regulärer Tilgung
    restschuld = Math.max(0, restschuld - tilgungsanteil)

    // Sondertilgung am Jahresende (Monat 12, 24, 36, ...)
    let sondertilgungDiesenMonat = 0
    if (monat % 12 === 0 && sondertilgung > 0 && restschuld > 0) {
      sondertilgungDiesenMonat = Math.min(sondertilgung, restschuld)
      restschuld = Math.max(0, restschuld - sondertilgungDiesenMonat)
    }

    plan.push({
      monat,
      jahr,
      restschuldBeginn,
      zinsanteil,
      tilgungsanteil,
      rate: monatlicheRate,
      sondertilgung: sondertilgungDiesenMonat,
      restschuldEnde: restschuld
    })
  }

  return plan
}

/**
 * Erstellt eine jährliche Zusammenfassung des Tilgungsplans
 */
export function berechneJahresZusammenfassung(
  tilgungsplan: TilgungsplanZeile[]
): JahresZusammenfassung[] {
  const jahresMap = new Map<number, JahresZusammenfassung>()

  for (const zeile of tilgungsplan) {
    const existing = jahresMap.get(zeile.jahr)

    if (existing) {
      existing.zinsenGesamt += zeile.zinsanteil
      existing.tilgungGesamt += zeile.tilgungsanteil
      existing.sondertilgungGesamt += zeile.sondertilgung
      existing.restschuldEnde = zeile.restschuldEnde
    } else {
      jahresMap.set(zeile.jahr, {
        jahr: zeile.jahr,
        zinsenGesamt: zeile.zinsanteil,
        tilgungGesamt: zeile.tilgungsanteil,
        sondertilgungGesamt: zeile.sondertilgung,
        restschuldEnde: zeile.restschuldEnde
      })
    }
  }

  return Array.from(jahresMap.values())
}

// ==================== HILFSFUNKTIONEN ====================

/**
 * Formatiert einen Betrag als EUR-Währung
 */
export function formatWaehrung(betrag: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(betrag)
}

/**
 * Formatiert einen Prozentsatz
 */
export function formatProzent(wert: number, nachkommastellen: number = 2): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: nachkommastellen,
    maximumFractionDigits: nachkommastellen
  }).format(wert / 100)
}

/**
 * Formatiert die Laufzeit
 */
export function formatLaufzeit(jahre: number, monate: number): string {
  if (jahre >= 999) {
    return 'Rate zu niedrig'
  }

  const jahrText = jahre === 1 ? 'Jahr' : 'Jahre'
  const monatText = monate === 1 ? 'Monat' : 'Monate'

  if (monate === 0) {
    return `${jahre} ${jahrText}`
  }

  return `${jahre} ${jahrText}, ${monate} ${monatText}`
}

// ==================== VALIDIERUNG ====================

export interface ValidationError {
  field: string
  message: string
}

export function validateEingaben(eingaben: Partial<AnnuitaetEingaben>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!eingaben.darlehenssumme || eingaben.darlehenssumme <= 0) {
    errors.push({ field: 'darlehenssumme', message: 'Bitte geben Sie eine gültige Darlehenssumme ein' })
  }

  if (eingaben.sollzins === undefined || eingaben.sollzins < 0 || eingaben.sollzins > 20) {
    errors.push({ field: 'sollzins', message: 'Bitte geben Sie einen Sollzins zwischen 0% und 20% ein' })
  }

  if (eingaben.berechnungsModus === 'tilgung') {
    if (eingaben.tilgungssatz === undefined || eingaben.tilgungssatz < 0 || eingaben.tilgungssatz > 20) {
      errors.push({ field: 'tilgungssatz', message: 'Bitte geben Sie einen Tilgungssatz zwischen 0% und 20% ein' })
    }
  }

  if (eingaben.berechnungsModus === 'wunschrate') {
    if (!eingaben.wunschrate || eingaben.wunschrate <= 0) {
      errors.push({ field: 'wunschrate', message: 'Bitte geben Sie eine gültige Wunschrate ein' })
    }
  }

  if (eingaben.zinsbindungJahre === undefined || eingaben.zinsbindungJahre < 1 || eingaben.zinsbindungJahre > 30) {
    errors.push({ field: 'zinsbindungJahre', message: 'Bitte geben Sie eine Zinsbindung zwischen 1 und 30 Jahren ein' })
  }

  if (eingaben.sondertilgung !== undefined && eingaben.sondertilgung < 0) {
    errors.push({ field: 'sondertilgung', message: 'Sondertilgung darf nicht negativ sein' })
  }

  return errors
}

// ==================== STANDARDWERTE ====================

export const DEFAULT_EINGABEN: AnnuitaetEingaben = {
  darlehenssumme: 300000,
  sollzins: 3.5,
  tilgungssatz: 2.0,
  sondertilgung: 0,
  zinsbindungJahre: 10,
  berechnungsModus: 'tilgung'
}
