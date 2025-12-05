import { Bundesland } from '@/types/property'

// Grunderwerbsteuer nach Bundesland (Stand 2025)
export const GRUNDERWERBSTEUER: Record<Bundesland, number> = {
  'baden-wuerttemberg': 5.0,
  'bayern': 3.5,
  'berlin': 6.0,
  'brandenburg': 6.5,
  'bremen': 5.0,
  'hamburg': 5.5,
  'hessen': 6.0,
  'mecklenburg-vorpommern': 6.0,
  'niedersachsen': 5.0,
  'nordrhein-westfalen': 6.5,
  'rheinland-pfalz': 5.0,
  'saarland': 6.5,
  'sachsen': 3.5,
  'sachsen-anhalt': 5.0,
  'schleswig-holstein': 6.5,
  'thueringen': 5.0,
}

// Notarkosten (typisch 1,0% - 1,5%)
export const NOTARKOSTEN = {
  min: 1.0,
  max: 1.5,
  standard: 1.5,
}

// Grundbuchkosten (typisch 0,3% - 0,5%)
export const GRUNDBUCHKOSTEN = {
  min: 0.3,
  max: 0.5,
  standard: 0.5,
}

// Maklerprovision (Käuferanteil, typisch 3,57% inkl. MwSt.)
export const MAKLERPROVISION = {
  min: 0,
  max: 7.14,
  standard: 3.57,
}
