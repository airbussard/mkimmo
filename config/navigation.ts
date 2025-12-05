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
    titel: 'Kaufen',
    href: '/makler/kaufen',
  },
  {
    titel: 'Mieten',
    href: '/makler/mieten',
  },
  {
    titel: 'Verkaufen',
    href: '/makler/verkaufen',
  },
  {
    titel: 'Rechner',
    href: '#',
    children: [
      {
        titel: 'Kaufnebenkosten-Rechner',
        href: '/makler/kaufnebenkosten-rechner',
        beschreibung: 'Berechnen Sie alle Nebenkosten beim Immobilienkauf',
      },
      {
        titel: 'Darlehensrechner',
        href: '/makler/darlehensrechner',
        beschreibung: 'Planen Sie Ihre Finanzierung mit unserem Annuitätenrechner',
      },
    ],
  },
  {
    titel: 'Blog',
    href: '/makler/blog',
  },
  {
    titel: 'Kontakt',
    href: '/makler/kontakt',
  },
]

// Navigation im Hausverwaltungs-Bereich
export const HAUSVERWALTUNG_NAVIGATION: NavItem[] = [
  {
    titel: 'Startseite',
    href: '/',
  },
  {
    titel: 'Objekte',
    href: '/hausverwaltung/objekte',
  },
  {
    titel: 'Anfrage',
    href: '/hausverwaltung/anfrage',
  },
  {
    titel: 'Blog',
    href: '/hausverwaltung/blog',
  },
  {
    titel: 'Kontakt',
    href: '/hausverwaltung/kontakt',
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
  strasse: 'Gräserstr. 6',
  plz: '52249',
  ort: 'Eschweiler',
  email: 'info@moellerknabe.de',
  telefon: '+49 (0) 2403 12345',
  koordinaten: {
    lat: 50.8178,
    lng: 6.2631,
  },
}
