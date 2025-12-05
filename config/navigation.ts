export interface NavItem {
  titel: string
  href: string
  beschreibung?: string
  children?: NavItem[]
}

// Standard-Navigation (Homepage, Legal-Seiten)
export const DEFAULT_NAVIGATION: NavItem[] = [
  {
    titel: 'Startseite',
    href: '/',
  },
  {
    titel: 'Makler',
    href: '/makler',
  },
  {
    titel: 'Hausverwaltung',
    href: '/hausverwaltung',
  },
  {
    titel: 'Kontakt',
    href: '/kontakt',
  },
]

// Navigation im Makler-Bereich
export const MAKLER_NAVIGATION: NavItem[] = [
  {
    titel: 'Startseite',
    href: '/',
  },
  {
    titel: 'Immobilien',
    href: '/makler/immobilien',
  },
  {
    titel: 'Kaufnebenkosten-Rechner',
    href: '/makler/kaufnebenkosten-rechner',
  },
  {
    titel: 'Darlehensrechner',
    href: '/makler/darlehensrechner',
  },
  {
    titel: 'Über uns',
    href: '/makler/ueber-uns',
  },
  {
    titel: 'Kontakt',
    href: '/kontakt',
  },
]

// Navigation im Hausverwaltungs-Bereich
export const HAUSVERWALTUNG_NAVIGATION: NavItem[] = [
  {
    titel: 'Startseite',
    href: '/',
  },
  {
    titel: 'Verwaltete Objekte',
    href: '/hausverwaltung',
  },
  {
    titel: 'Anfrage stellen',
    href: '/hausverwaltung/anfrage',
  },
  {
    titel: 'Kontakt',
    href: '/kontakt',
  },
]

// Legacy export für Abwärtskompatibilität
export const MAIN_NAVIGATION = DEFAULT_NAVIGATION

export const FOOTER_NAVIGATION = {
  unternehmen: [
    { titel: 'Über uns', href: '/ueber-uns' },
    { titel: 'Kontakt', href: '/kontakt' },
  ],
  services: [
    { titel: 'Makler', href: '/makler' },
    { titel: 'Hausverwaltung', href: '/hausverwaltung' },
    { titel: 'Kaufnebenkosten-Rechner', href: '/makler/kaufnebenkosten-rechner' },
    { titel: 'Darlehensrechner', href: '/makler/darlehensrechner' },
  ],
  rechtliches: [
    { titel: 'Impressum', href: '/impressum' },
    { titel: 'Datenschutz', href: '/datenschutz' },
  ],
}

export const COMPANY_INFO = {
  name: 'Möller & Knabe GbR',
  strasse: 'Franz-Liszt Str 11',
  plz: '52249',
  ort: 'Eschweiler',
  email: 'info@moellerknabe.de',
  telefon: '+49 (0) 2403 12345',
  koordinaten: {
    lat: 50.8178,
    lng: 6.2631,
  },
}
