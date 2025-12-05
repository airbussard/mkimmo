# MKImmo - Immobilien & Hausverwaltung

Website für Möller & Knabe GbR - Immobilienmakler und Hausverwaltung in Eschweiler.

## Technologie-Stack

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: TailwindCSS
- **UI-Komponenten**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Karten**: Leaflet / OpenStreetMap
- **Daten**: JSON (Supabase-ready)

## Projektstruktur

```
mkimmo/
├── app/                    # Next.js App Router Seiten
│   ├── (legal)/           # Rechtliche Seiten (Impressum, Datenschutz, etc.)
│   ├── makler/            # Makler-Bereich
│   ├── hausverwaltung/    # Hausverwaltung-Bereich
│   └── page.tsx           # Landingpage
├── components/            # React-Komponenten
│   ├── ui/               # shadcn/ui Basis-Komponenten
│   ├── layout/           # Header, Footer, Navigation
│   ├── makler/           # Makler-spezifische Komponenten
│   ├── hausverwaltung/   # Hausverwaltung-Komponenten
│   └── consent/          # Cookie-Consent
├── data/                  # JSON Dummy-Daten
├── lib/                   # Utilities und Services
│   ├── services/         # Service-Layer (JSON/Supabase-ready)
│   └── utils/            # Hilfsfunktionen
├── store/                 # Zustand Stores
├── types/                 # TypeScript Typdefinitionen
└── config/               # Konfigurationsdateien
```

## Features

### Makler-Bereich
- Immobilien-Übersicht mit Filtern (Preis, Objektart, Ort, Zimmer)
- Detailseiten mit Bildergalerie und Kartenansicht
- Kaufnebenkosten-Rechner (alle 16 Bundesländer)
- Über-uns Seite

### Hausverwaltung
- Verwaltete Objekte Übersicht
- Objekt-Detailseiten mit Einheitenliste
- Wohnungs-Detailseiten mit Mieterinformationen

### Allgemein
- Responsives Design (Mobile-First)
- DSGVO-konformes Cookie-Consent (Google Consent Mode v2)
- SEO-optimierte Meta-Tags
- OpenStreetMap Integration

## Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Production Build
npm run build

# Production Server starten
npm start
```

## Deployment (CapRover)

Das Projekt ist für CapRover Deployment vorbereitet:

1. Repository auf GitHub pushen
2. In CapRover neue App erstellen
3. Deployment-Methode: GitHub Repository
4. Build wird automatisch durch `captain-definition` gesteuert

### Docker lokal testen

```bash
# Docker Image bauen und starten
docker-compose up --build

# Oder manuell
docker build -t mkimmo .
docker run -p 3000:3000 mkimmo
```

## Umgebungsvariablen

```env
# Datenquelle (json oder supabase)
NEXT_PUBLIC_DATA_PROVIDER=json
```

## Supabase-Migration

Das Projekt ist für eine spätere Supabase-Integration vorbereitet:

1. Supabase-Services in `lib/services/supabase/` implementieren
2. `NEXT_PUBLIC_DATA_PROVIDER=supabase` setzen
3. Die ServiceFactory wechselt automatisch die Datenquelle

## Kontakt

Möller & Knabe GbR
Franz-Liszt Str 11
52249 Eschweiler
