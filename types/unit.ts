export type UnitType = 'wohnung' | 'gewerbe' | 'lager' | 'stellplatz'

export const UNIT_TYPE_NAMEN: Record<UnitType, string> = {
  wohnung: 'Wohnung',
  gewerbe: 'Gewerbeeinheit',
  lager: 'Lagerraum',
  stellplatz: 'Stellplatz',
}

export type UnitStatus = 'vermietet' | 'leer' | 'renovierung'

export const UNIT_STATUS_NAMEN: Record<UnitStatus, string> = {
  vermietet: 'Vermietet',
  leer: 'Leer',
  renovierung: 'In Renovierung',
}

export interface UnitDetails {
  flaeche: number
  zimmer: number
  schlafzimmer?: number
  badezimmer?: number
  balkon: boolean
  balkonFlaeche?: number
  keller: boolean
  kellerFlaeche?: number
}

export interface RentalInfo {
  kaltmiete: number
  nebenkosten: number
  warmmiete: number
  kaution: number
}

export interface UnitDocument {
  id: string
  name: string
  typ: 'mietvertrag' | 'protokoll' | 'rechnung' | 'korrespondenz' | 'sonstiges'
  hochgeladenAm: string
  url: string
}

export const DOCUMENT_TYPE_NAMEN: Record<UnitDocument['typ'], string> = {
  mietvertrag: 'Mietvertrag',
  protokoll: 'Übergabeprotokoll',
  rechnung: 'Rechnung',
  korrespondenz: 'Korrespondenz',
  sonstiges: 'Sonstiges',
}

export interface Unit {
  id: string
  objektId: string
  einheitNummer: string
  etage: number
  lage: 'links' | 'rechts' | 'mitte' | 'hinten'
  typ: UnitType
  details: UnitDetails
  miete: RentalInfo
  status: UnitStatus
  mieterId?: string
  dokumente: UnitDocument[]
  erstelltAm: string
  aktualisiertAm: string
}

export const UNIT_LAGE_NAMEN: Record<Unit['lage'], string> = {
  links: 'Links',
  rechts: 'Rechts',
  mitte: 'Mitte',
  hinten: 'Hinten',
}
