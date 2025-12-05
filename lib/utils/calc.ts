import { Bundesland } from '@/types/property'
import { GRUNDERWERBSTEUER, NOTARKOSTEN, GRUNDBUCHKOSTEN, MAKLERPROVISION } from '@/config/tax-rates'

export interface Kaufnebenkosten {
  grunderwerbsteuer: number
  grunderwerbsteuerProzent: number
  notarkosten: number
  notarkostenProzent: number
  grundbuchkosten: number
  grundbuchkostenProzent: number
  maklerprovision: number
  maklerprovisionProzent: number
  nebenkosten: number
  nebenkostenProzent: number
  gesamtKaufpreis: number
}

export interface BerechnungsOptionen {
  kaufpreis: number
  bundesland: Bundesland
  mitMakler?: boolean
  maklerprovisionProzent?: number
  notarkostenProzent?: number
  grundbuchkostenProzent?: number
}

export function berechneKaufnebenkosten(optionen: BerechnungsOptionen): Kaufnebenkosten {
  const {
    kaufpreis,
    bundesland,
    mitMakler = true,
    maklerprovisionProzent = MAKLERPROVISION.standard,
    notarkostenProzent = NOTARKOSTEN.standard,
    grundbuchkostenProzent = GRUNDBUCHKOSTEN.standard,
  } = optionen

  const grunderwerbsteuerProzent = GRUNDERWERBSTEUER[bundesland]
  const grunderwerbsteuer = kaufpreis * (grunderwerbsteuerProzent / 100)

  const notarkosten = kaufpreis * (notarkostenProzent / 100)
  const grundbuchkosten = kaufpreis * (grundbuchkostenProzent / 100)

  const maklerprovision = mitMakler ? kaufpreis * (maklerprovisionProzent / 100) : 0
  const effektiveMaklerprovisionProzent = mitMakler ? maklerprovisionProzent : 0

  const nebenkosten = grunderwerbsteuer + notarkosten + grundbuchkosten + maklerprovision
  const nebenkostenProzent = kaufpreis > 0 ? (nebenkosten / kaufpreis) * 100 : 0

  return {
    grunderwerbsteuer,
    grunderwerbsteuerProzent,
    notarkosten,
    notarkostenProzent,
    grundbuchkosten,
    grundbuchkostenProzent,
    maklerprovision,
    maklerprovisionProzent: effektiveMaklerprovisionProzent,
    nebenkosten,
    nebenkostenProzent,
    gesamtKaufpreis: kaufpreis + nebenkosten,
  }
}

export function formatProzent(wert: number): string {
  return `${wert.toFixed(2).replace('.', ',')} %`
}
