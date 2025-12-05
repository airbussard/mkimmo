export type Bundesland =
  | 'baden-wuerttemberg'
  | 'bayern'
  | 'berlin'
  | 'brandenburg'
  | 'bremen'
  | 'hamburg'
  | 'hessen'
  | 'mecklenburg-vorpommern'
  | 'niedersachsen'
  | 'nordrhein-westfalen'
  | 'rheinland-pfalz'
  | 'saarland'
  | 'sachsen'
  | 'sachsen-anhalt'
  | 'schleswig-holstein'
  | 'thueringen'

export const BUNDESLAND_NAMEN: Record<Bundesland, string> = {
  'baden-wuerttemberg': 'Baden-Württemberg',
  'bayern': 'Bayern',
  'berlin': 'Berlin',
  'brandenburg': 'Brandenburg',
  'bremen': 'Bremen',
  'hamburg': 'Hamburg',
  'hessen': 'Hessen',
  'mecklenburg-vorpommern': 'Mecklenburg-Vorpommern',
  'niedersachsen': 'Niedersachsen',
  'nordrhein-westfalen': 'Nordrhein-Westfalen',
  'rheinland-pfalz': 'Rheinland-Pfalz',
  'saarland': 'Saarland',
  'sachsen': 'Sachsen',
  'sachsen-anhalt': 'Sachsen-Anhalt',
  'schleswig-holstein': 'Schleswig-Holstein',
  'thueringen': 'Thüringen',
}

export type PropertyType = 'wohnung' | 'haus' | 'grundstueck' | 'gewerbe'

export const PROPERTY_TYPE_NAMEN: Record<PropertyType, string> = {
  wohnung: 'Wohnung',
  haus: 'Haus',
  grundstueck: 'Grundstück',
  gewerbe: 'Gewerbe',
}

export type PropertyStatus = 'verfuegbar' | 'reserviert' | 'verkauft'

export const PROPERTY_STATUS_NAMEN: Record<PropertyStatus, string> = {
  verfuegbar: 'Verfügbar',
  reserviert: 'Reserviert',
  verkauft: 'Verkauft',
}

export type HeatingType = 'gas' | 'oel' | 'fernwaerme' | 'waermepumpe' | 'elektro' | 'pellet'

export const HEATING_TYPE_NAMEN: Record<HeatingType, string> = {
  gas: 'Gasheizung',
  oel: 'Ölheizung',
  fernwaerme: 'Fernwärme',
  waermepumpe: 'Wärmepumpe',
  elektro: 'Elektroheizung',
  pellet: 'Pelletheizung',
}

export interface PropertyImage {
  url: string
  alt: string
  isPrimary: boolean
}

export interface PropertyAddress {
  strasse: string
  hausnummer: string
  plz: string
  ort: string
  bundesland: Bundesland
  koordinaten?: {
    lat: number
    lng: number
  }
}

export interface PropertyDetails {
  wohnflaeche: number
  grundstuecksflaeche?: number
  zimmer: number
  schlafzimmer: number
  badezimmer: number
  etage?: number
  etagen?: number
  baujahr?: number
  letzteSanierung?: number
  heizung: HeatingType
  energieausweis?: string
  stellplaetze?: number
  balkon: boolean
  terrasse: boolean
  garten: boolean
  aufzug: boolean
  keller: boolean
  moebliert: boolean
}

export interface Property {
  id: string
  titel: string
  slug: string
  typ: PropertyType
  status: PropertyStatus
  preis: number
  preistyp: 'kauf' | 'miete'
  adresse: PropertyAddress
  details: PropertyDetails
  bilder: PropertyImage[]
  beschreibung: string
  kurzBeschreibung: string
  merkmale: string[]
  erstelltAm: string
  aktualisiertAm: string
  hervorgehoben: boolean
}

export interface PropertyFilters {
  typ?: PropertyType
  preisMin?: number
  preisMax?: number
  ort?: string
  bundesland?: Bundesland
  zimmerMin?: number
  flaecheMin?: number
  status?: PropertyStatus
}
