import { Bundesland, HeatingType, PropertyImage } from './property'

export interface ManagedPropertyAddress {
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

export interface BuildingInfo {
  baujahr: number
  anzahlEinheiten: number
  etagen: number
  gesamtflaeche: number
  stellplaetze: number
  aufzug: boolean
  heizung: HeatingType
}

export interface ManagementInfo {
  verwaltetSeit: string
  verwalter: string
  kontaktEmail: string
  kontaktTelefon: string
}

export interface ManagedProperty {
  id: string
  name: string
  slug: string
  typ: 'wohngebaeude' | 'gewerbe' | 'gemischt'
  adresse: ManagedPropertyAddress
  gebaeude: BuildingInfo
  verwaltung: ManagementInfo
  einheitenIds: string[]
  bilder: PropertyImage[]
  beschreibung: string
  ausstattung: string[]
  erstelltAm: string
  aktualisiertAm: string
}

export const MANAGED_PROPERTY_TYPE_NAMEN: Record<ManagedProperty['typ'], string> = {
  wohngebaeude: 'Wohngebäude',
  gewerbe: 'Gewerbeimmobilie',
  gemischt: 'Gemischt genutzt',
}
