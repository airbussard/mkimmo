export interface NavItem {
  titel: string
  href: string
  beschreibung?: string
  children?: NavItem[]
}

export const MAIN_NAVIGATION: NavItem[] = [
  {
    titel: 'Startseite',
    href: '/',
  },
  {
    titel: 'Makler',
    href: '/makler',
    beschreibung: 'Immobilien kaufen und verkaufen',
    children: [
      {
        titel: 'Immobilien',
        href: '/makler/immobilien',
        beschreibung: 'Alle verfügbaren Objekte',
      },
      {
        titel: 'Kaufnebenkosten-Rechner',
        href: '/makler/kaufnebenkosten-rechner',
        beschreibung: 'Nebenkosten berechnen',
      },
      {
        titel: 'Annuitätendarlehen-Rechner',
        href: '/makler/darlehensrechner',
        beschreibung: 'Finanzierung berechnen',
      },
      {
        titel: 'Über uns',
        href: '/makler/ueber-uns',
        beschreibung: 'Unser Makler-Team',
      },
    ],
  },
  {
    titel: 'Hausverwaltung',
    href: '/hausverwaltung',
    beschreibung: 'Professionelle Immobilienverwaltung',
  },
  {
    titel: 'Kontakt',
    href: '/kontakt',
  },
]

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
