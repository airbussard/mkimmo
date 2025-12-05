export type ConsentValue = 'granted' | 'denied'

export interface ConsentState {
  hasInteracted: boolean
  analytics_storage: ConsentValue
  ad_storage: ConsentValue
  ad_user_data: ConsentValue
  ad_personalization: ConsentValue
  functionality_storage: ConsentValue
  personalization_storage: ConsentValue
  security_storage: ConsentValue
}

export interface ConsentCategory {
  id: keyof Omit<ConsentState, 'hasInteracted'>
  name: string
  beschreibung: string
  erforderlich: boolean
}

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'security_storage',
    name: 'Notwendig',
    beschreibung: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
    erforderlich: true,
  },
  {
    id: 'functionality_storage',
    name: 'Funktional',
    beschreibung: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
    erforderlich: false,
  },
  {
    id: 'analytics_storage',
    name: 'Analytik',
    beschreibung: 'Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen.',
    erforderlich: false,
  },
  {
    id: 'ad_storage',
    name: 'Marketing',
    beschreibung: 'Diese Cookies werden verwendet, um Werbung relevanter zu gestalten.',
    erforderlich: false,
  },
]
