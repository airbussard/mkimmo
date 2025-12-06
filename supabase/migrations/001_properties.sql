-- ============================================
-- PHASE 2: Immobilien (Properties)
-- ============================================

-- Immobilien-Tabelle
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- haus, wohnung, grundstueck, gewerbe
  status TEXT DEFAULT 'verfuegbar', -- verfuegbar, reserviert, verkauft, vermietet
  price DECIMAL,
  currency TEXT DEFAULT 'EUR',
  address JSONB, -- { street, houseNumber, zip, city, district }
  details JSONB, -- { livingArea, plotArea, rooms, bedrooms, bathrooms, floors, yearBuilt, ... }
  description TEXT,
  features TEXT[], -- ['Balkon', 'Garage', 'Garten', ...]
  images JSONB, -- [{ url, alt, isPrimary }, ...]
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelle Suche
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Alle können lesen
CREATE POLICY "Properties sind öffentlich lesbar"
  ON properties FOR SELECT
  USING (true);

-- Nur authentifizierte Benutzer können bearbeiten
CREATE POLICY "Authentifizierte Benutzer können Properties erstellen"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authentifizierte Benutzer können Properties aktualisieren"
  ON properties FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Properties löschen"
  ON properties FOR DELETE
  TO authenticated
  USING (true);
