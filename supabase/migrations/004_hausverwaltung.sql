-- ============================================
-- PHASE 5: Hausverwaltung
-- ============================================

-- Verwaltungsobjekte (Gebäude)
CREATE TABLE managed_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- mehrfamilienhaus, wohnanlage, gewerbe
  address JSONB, -- { street, houseNumber, zip, city }
  building_data JSONB, -- { yearBuilt, totalUnits, floors, heatingType, ... }
  management_info JSONB, -- { managedSince, hausmeister, ... }
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wohneinheiten
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES managed_properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  location TEXT, -- z.B. "links", "rechts", "mitte"
  type TEXT, -- wohnung, gewerbe, stellplatz, keller
  details JSONB, -- { rooms, livingArea, features, ... }
  rent JSONB, -- { coldRent, utilities, totalRent, depositMonths }
  status TEXT DEFAULT 'leer', -- vermietet, leer, renovierung
  documents JSONB, -- [{ name, url, type }, ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mieter
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  contact JSONB, -- { email, phone, emergencyContact }
  lease JSONB, -- { startDate, endDate, depositPaid, specialTerms }
  resident_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'aktiv', -- aktiv, gekuendigt, ausgezogen
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes
CREATE INDEX idx_managed_properties_slug ON managed_properties(slug);
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_tenants_unit_id ON tenants(unit_id);
CREATE INDEX idx_tenants_status ON tenants(status);

-- Trigger für updated_at
CREATE TRIGGER update_managed_properties_updated_at
  BEFORE UPDATE ON managed_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE managed_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Managed Properties: Öffentlich lesbar
CREATE POLICY "Verwaltungsobjekte sind öffentlich lesbar"
  ON managed_properties FOR SELECT
  USING (true);

CREATE POLICY "Authentifizierte können Verwaltungsobjekte verwalten"
  ON managed_properties FOR ALL
  TO authenticated
  USING (true);

-- Units: Öffentlich lesbar
CREATE POLICY "Einheiten sind öffentlich lesbar"
  ON units FOR SELECT
  USING (true);

CREATE POLICY "Authentifizierte können Einheiten verwalten"
  ON units FOR ALL
  TO authenticated
  USING (true);

-- Tenants: NUR für authentifizierte Benutzer (Datenschutz!)
CREATE POLICY "Nur Authentifizierte können Mieter sehen"
  ON tenants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte können Mieter verwalten"
  ON tenants FOR ALL
  TO authenticated
  USING (true);
