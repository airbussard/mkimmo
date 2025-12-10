export interface ErsteinschaetzungData {
  // Schritt 1: Basisdaten
  immobilientyp: string
  plz: string
  ort: string
  baujahr: string
  zustand: string

  // Schritt 2: Flächen
  wohnflaeche: string
  grundstuecksflaeche: string
  anzahlZimmer: string
  besonderheiten: string[]

  // Schritt 3: Nutzung
  nutzung: string
  jahresnettokaltmiete: string

  // Schritt 4: Lage
  mikrolage: string
  makrolage: string
  infrastruktur: string[]

  // Schritt 5: Kontakt
  vorname: string
  nachname: string
  email: string
  telefon: string
  nachricht: string
  datenschutz: boolean
}

export const initialFormData: ErsteinschaetzungData = {
  immobilientyp: '',
  plz: '',
  ort: '',
  baujahr: '',
  zustand: '',
  wohnflaeche: '',
  grundstuecksflaeche: '',
  anzahlZimmer: '',
  besonderheiten: [],
  nutzung: '',
  jahresnettokaltmiete: '',
  mikrolage: '',
  makrolage: '',
  infrastruktur: [],
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  nachricht: '',
  datenschutz: false,
}

export const IMMOBILIENTYPEN = [
  { value: 'wohnung', label: 'Wohnung' },
  { value: 'einfamilienhaus', label: 'Einfamilienhaus' },
  { value: 'mehrfamilienhaus', label: 'Mehrfamilienhaus' },
  { value: 'grundstueck', label: 'Grundstück' },
  { value: 'gewerbe', label: 'Gewerbeimmobilie' },
]

export const ZUSTAENDE = [
  { value: 'sehr_gut', label: 'Sehr gut' },
  { value: 'gut', label: 'Gut' },
  { value: 'renovierungsbeduerftig', label: 'Renovierungsbedürftig' },
  { value: 'sanierungsbeduerftig', label: 'Sanierungsbedürftig' },
]

export const BESONDERHEITEN = [
  { value: 'balkon', label: 'Balkon/Terrasse' },
  { value: 'einbaukueche', label: 'Einbauküche' },
  { value: 'garten', label: 'Garten' },
  { value: 'garage', label: 'Garage/Stellplatz' },
  { value: 'keller', label: 'Keller' },
  { value: 'dachboden', label: 'Dachboden' },
  { value: 'aufzug', label: 'Aufzug' },
  { value: 'barrierefrei', label: 'Barrierefrei' },
]

export const NUTZUNGSARTEN = [
  { value: 'selbst_genutzt', label: 'Selbst genutzt' },
  { value: 'vermietet', label: 'Vermietet' },
  { value: 'leerstand', label: 'Leerstand' },
]

export const MIKROLAGEN = [
  { value: 'sehr_gut', label: 'Sehr gut' },
  { value: 'gut', label: 'Gut' },
  { value: 'mittel', label: 'Mittel' },
  { value: 'schwach', label: 'Einfach' },
]

export const INFRASTRUKTUR = [
  { value: 'schulen', label: 'Schulen in der Nähe' },
  { value: 'nahverkehr', label: 'Gute ÖPNV-Anbindung' },
  { value: 'einkaufen', label: 'Einkaufsmöglichkeiten' },
  { value: 'aerzte', label: 'Ärzte/Apotheken' },
  { value: 'autobahn', label: 'Autobahnanbindung' },
  { value: 'gruenflaechen', label: 'Parks/Grünflächen' },
]
