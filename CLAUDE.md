# MKImmo - Projektdokumentation

## Projektübersicht

**MKImmo** ist eine Immobilien-Website für **Möller & Knabe GbR** in Eschweiler. Die Website bietet sowohl Makler-Services (Immobilienvermittlung) als auch Hausverwaltungs-Services.

### Technologie-Stack

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui Komponenten
- **State Management**: Zustand
- **Karten**: Leaflet / React-Leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **UI-Primitives**: Radix UI

### Deployment

- **Plattform**: CapRover (Docker)
- **URL**: https://moellerknabe.de
- **Dashboard**: https://captain.immogear.de

**WICHTIG: Nach JEDER Änderung (commit + push) automatisch deployen:**

```bash
# Build triggern nach Änderungen
curl -X POST "https://captain.immogear.de/api/v2/user/apps/webhooks/triggerbuild?namespace=captain&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InRva2VuVmVyc2lvbiI6ImFkYjlmMDNmLTM5ZWYtNDU0MS05NjEyLWQ5MDQxODEyZWQ0YiIsImFwcE5hbWUiOiJta2ltbW8iLCJuYW1lc3BhY2UiOiJjYXB0YWluIn0sImlhdCI6MTc2NDkyNzMxOH0.yZz3O-rvoXjs1ae7-o6L6nScK5BKHtLhz4-qao1N2wE"
```

**Workflow nach Änderungen:**
1. `git add -A && git commit -m "..."`
2. `git push origin main`
3. CapRover Build triggern (curl oben)

---

## Projektstruktur

```
mkimmo/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root Layout (ohne Header)
│   ├── page.tsx                 # Landing Page (Kacheln)
│   ├── globals.css              # Globale Styles
│   ├── not-found.tsx            # 404 Seite
│   └── (with-header)/           # Route Group mit Header
│       ├── layout.tsx           # Layout mit Header-Komponente
│       ├── makler/              # Makler-Bereich
│       │   ├── page.tsx         # Makler Landing
│       │   ├── immobilien/      # Immobilien-Übersicht
│       │   ├── [id]/            # Immobilien-Details (dynamisch)
│       │   ├── kaufnebenkosten-rechner/
│       │   ├── darlehensrechner/  # Annuitätenrechner
│       │   └── ueber-uns/
│       ├── hausverwaltung/      # Hausverwaltungs-Bereich
│       │   ├── page.tsx         # HV Landing
│       │   ├── anfrage/         # Anfrage-Formular
│       │   ├── [propertyId]/    # Objekt-Details
│       │   └── [propertyId]/[unitId]/  # Einheiten-Details
│       └── (legal)/             # Rechtliche Seiten
│           ├── impressum/
│           ├── datenschutz/
│           ├── kontakt/
│           └── ueber-uns/
├── components/
│   ├── ui/                      # shadcn/ui Basis-Komponenten
│   ├── layout/                  # Header, Footer
│   ├── landing/                 # Landing-Page Komponenten
│   ├── makler/                  # Makler-spezifische Komponenten
│   ├── hausverwaltung/          # HV-spezifische Komponenten
│   ├── shared/                  # Gemeinsame Komponenten
│   └── consent/                 # Cookie-Consent
├── config/
│   ├── navigation.ts            # Navigation & Firmendaten
│   └── tax-rates.ts             # Bundesländer-Steuersätze
├── data/                        # JSON-Dummy-Daten
│   ├── properties.json          # Makler-Immobilien
│   ├── managed-properties.json  # Verwaltete Objekte
│   ├── units.json               # Wohneinheiten
│   └── tenants.json             # Mieter
├── lib/
│   ├── utils.ts                 # Utility-Funktionen (cn)
│   ├── utils/
│   │   ├── calc.ts              # Kaufnebenkosten-Berechnungen
│   │   └── annuitaet.ts         # Annuitätendarlehen-Logik
│   └── services/                # Service Layer
│       ├── interfaces/          # Service-Interfaces
│       ├── json/                # JSON-Implementierungen
│       └── ServiceFactory.ts    # Factory für Services
├── store/                       # Zustand Stores
│   ├── consentStore.ts          # Cookie-Consent State
│   └── filterStore.ts           # Immobilien-Filter State
├── types/                       # TypeScript Types
│   ├── property.ts              # Immobilien-Types
│   ├── managed-property.ts      # Verwaltungs-Types
│   ├── unit.ts                  # Einheiten-Types
│   ├── tenant.ts                # Mieter-Types
│   └── consent.ts               # Consent-Types
└── public/
    └── images/                  # Statische Bilder
        └── logomk.png           # Firmenlogo
```

---

## Seitenstruktur

### Öffentliche Seiten

| Route | Beschreibung |
|-------|--------------|
| `/` | Landing Page mit Kacheln (Makler/Hausverwaltung) |
| `/makler` | Makler Landing Page |
| `/makler/immobilien` | Immobilien-Übersicht mit Filtern |
| `/makler/immobilien/[id]` | Immobilien-Detailseite |
| `/makler/kaufnebenkosten-rechner` | Kaufnebenkosten-Rechner |
| `/makler/darlehensrechner` | Annuitätendarlehen-Rechner |
| `/makler/ueber-uns` | Team-Seite Makler |
| `/hausverwaltung` | Hausverwaltung Landing Page |
| `/hausverwaltung/anfrage` | Anfrage-Formular für HV |
| `/hausverwaltung/[propertyId]` | Verwaltungsobjekt-Details |
| `/hausverwaltung/[propertyId]/[unitId]` | Einheiten-Details |
| `/kontakt` | Kontaktseite |
| `/impressum` | Impressum |
| `/datenschutz` | Datenschutzerklärung |
| `/ueber-uns` | Allgemeine Über-uns Seite |

---

## Komponenten

### UI-Komponenten (shadcn/ui)

Basiskomponenten in `/components/ui/`:
- `button.tsx` - Button mit Varianten
- `card.tsx` - Card, CardHeader, CardContent, CardFooter
- `input.tsx` - Formular-Input
- `label.tsx` - Formular-Label
- `select.tsx` - Dropdown-Select
- `switch.tsx` - Toggle-Switch
- `dialog.tsx` - Modal-Dialog
- `badge.tsx` - Status-Badges

### Makler-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| `PropertyCard` | `/components/makler/PropertyCard.tsx` | Immobilien-Karte für Übersicht |
| `PropertyGrid` | `/components/makler/PropertyGrid.tsx` | Grid-Layout für Immobilien |
| `PropertyFilters` | `/components/makler/PropertyFilters.tsx` | Filter-Sidebar |
| `PropertyGallery` | `/components/makler/PropertyGallery.tsx` | Bilder-Galerie |
| `KaufnebenkostenRechner` | `/components/makler/KaufnebenkostenRechner.tsx` | Nebenkosten-Rechner |
| `AnnuitaetenRechner` | `/components/makler/AnnuitaetenRechner.tsx` | Darlehensrechner |

### Hausverwaltungs-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| `ManagedPropertyCard` | `/components/hausverwaltung/ManagedPropertyCard.tsx` | Objekt-Karte |
| `UnitCard` | `/components/hausverwaltung/UnitCard.tsx` | Einheiten-Karte |

### Shared-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| `ImagePlaceholder` | `/components/shared/ImagePlaceholder.tsx` | Platzhalter für Bilder |
| `PropertyMap` | `/components/shared/PropertyMap.tsx` | OpenStreetMap-Karte |

---

## Services (Data Layer)

### Service Factory Pattern

Die Anwendung nutzt ein Factory Pattern für Services, um später einfach von JSON auf Supabase umstellen zu können:

```typescript
// lib/services/ServiceFactory.ts
export const ServiceFactory = {
  getPropertyService: () => new JsonPropertyService(),
  getManagedPropertyService: () => new JsonManagedPropertyService(),
  getUnitService: () => new JsonUnitService(),
}
```

### Interfaces

- `IPropertyService` - Makler-Immobilien CRUD
- `IManagedPropertyService` - Verwaltungsobjekte CRUD
- `IUnitService` - Wohneinheiten CRUD

### JSON-Implementierungen

Aktuelle Implementierung liest aus `/data/*.json`:
- `JsonPropertyService`
- `JsonManagedPropertyService`
- `JsonUnitService`

---

## Berechnungslogik

### Kaufnebenkosten (`/lib/utils/calc.ts`)

Berechnet Nebenkosten basierend auf:
- Kaufpreis
- Bundesland (unterschiedliche Grunderwerbsteuer)
- Maklerprovision
- Notarkosten
- Grundbuchkosten

### Annuitätendarlehen (`/lib/utils/annuitaet.ts`)

Umfassende Darlehensberechnung:

**Eingaben:**
- Darlehenssumme
- Sollzins (% p.a.)
- Tilgungssatz (% p.a.) oder Wunschrate
- Sondertilgung (jährlich)
- Zinsbindungsdauer

**Ausgaben:**
- Monatliche Rate
- Zins-/Tilgungsaufteilung
- Gesamtbelastung
- Restschuld nach Zinsbindung
- Geschätzte Laufzeit
- Detaillierter Tilgungsplan (monatlich/jährlich)

**Hauptfunktionen:**
```typescript
berechneAnnuitaet(eingaben: AnnuitaetEingaben): AnnuitaetErgebnis
berechneTilgungsplan(eingaben: AnnuitaetEingaben): TilgungsplanZeile[]
berechneJahresZusammenfassung(plan: TilgungsplanZeile[]): JahresZusammenfassung[]
```

---

## State Management

### Zustand Stores

**consentStore** (`/store/consentStore.ts`)
- Cookie-Consent-Status
- Google Consent Mode v2 Integration
- Persistierung in localStorage

**filterStore** (`/store/filterStore.ts`)
- Immobilien-Filter (Preis, Fläche, Zimmer, etc.)
- Sortierung

---

## Konfiguration

### Navigation (`/config/navigation.ts`)

```typescript
// Firmendaten
export const COMPANY_INFO = {
  name: 'Möller & Knabe GbR',
  strasse: 'Franz-Liszt Str 11',
  plz: '52249',
  ort: 'Eschweiler',
  email: 'info@moellerknabe.de',
  telefon: '+49 (0) 2403 12345',
  koordinaten: { lat: 50.8178, lng: 6.2631 },
}

// Hauptnavigation
export const MAIN_NAVIGATION: NavItem[]

// Footer-Navigation
export const FOOTER_NAVIGATION
```

### Steuersätze (`/config/tax-rates.ts`)

Grunderwerbsteuer nach Bundesland für Kaufnebenkosten-Rechner.

---

## Styling

### TailwindCSS Konfiguration

Farben:
- `primary-*` - Hauptfarbe
- `secondary-*` - Sekundärfarbe
- Standard Tailwind-Palette

### CSS-Klassen

Utility-Funktion für bedingte Klassen:
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Team

### Makler-Team (Stand: Dezember 2024)

| Name | Position | Erfahrung |
|------|----------|-----------|
| Aaron Möller | Geschäftsführer & Immobilienmakler | 6 Jahre |
| Oscar Knabe | Immobilienmakler | 6 Jahre |

---

## Development

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build erstellen
npm run build

# Production Server
npm start

# Linting
npm run lint
```

### Umgebungsvariablen

Aktuell keine erforderlich (JSON-basiert). Für Supabase-Integration später:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Wichtige Hinweise

### Header-Logik

Die Landing Page (`/`) zeigt keinen Header. Alle anderen Seiten unter `(with-header)` haben den Header.

### DSGVO / Cookie-Consent

- Banner erscheint beim ersten Besuch
- Google Consent Mode v2 Integration
- Consent wird in localStorage gespeichert
- Analytik nur bei expliziter Zustimmung

### Responsive Design

- Mobile-First Ansatz
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Mobile Navigation mit Hamburger-Menü

### OpenStreetMap

Leaflet wird client-side geladen wegen SSR-Kompatibilität:
```typescript
'use client'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./PropertyMap'), { ssr: false })
```

---

## Geplante Features / TODOs

- [ ] Supabase-Integration für echte Daten
- [ ] Bild-Upload für Immobilien
- [ ] Kontaktformular mit E-Mail-Versand
- [ ] Admin-Bereich für Objektverwaltung
- [ ] Favoritenliste für Besucher
- [ ] PDF-Export für Exposés
