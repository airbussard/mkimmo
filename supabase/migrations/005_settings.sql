-- ============================================
-- PHASE 6: Einstellungen & Konfiguration
-- ============================================

-- Firmendaten
CREATE TABLE company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  address JSONB, -- { street, houseNumber, zip, city }
  contact JSONB, -- { phone, email, fax }
  opening_hours JSONB, -- { monday, tuesday, ... }
  social_media JSONB, -- { facebook, instagram, linkedin }
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Steuersätze für Kaufnebenkosten-Rechner
CREATE TABLE tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundesland TEXT UNIQUE NOT NULL,
  grunderwerbsteuer DECIMAL NOT NULL, -- z.B. 6.5 für 6,5%
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger für updated_at
CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON company_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_rates_updated_at
  BEFORE UPDATE ON tax_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;

-- Öffentlich lesbar
CREATE POLICY "Firmendaten sind öffentlich lesbar"
  ON company_info FOR SELECT
  USING (true);

CREATE POLICY "Steuersätze sind öffentlich lesbar"
  ON tax_rates FOR SELECT
  USING (true);

-- Nur authentifizierte können bearbeiten
CREATE POLICY "Authentifizierte können Firmendaten bearbeiten"
  ON company_info FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte können Steuersätze bearbeiten"
  ON tax_rates FOR ALL
  TO authenticated
  USING (true);

-- ============================================
-- Initiale Daten: Steuersätze 2024
-- ============================================
INSERT INTO tax_rates (bundesland, grunderwerbsteuer) VALUES
  ('Baden-Württemberg', 5.0),
  ('Bayern', 3.5),
  ('Berlin', 6.0),
  ('Brandenburg', 6.5),
  ('Bremen', 5.0),
  ('Hamburg', 5.5),
  ('Hessen', 6.0),
  ('Mecklenburg-Vorpommern', 6.0),
  ('Niedersachsen', 5.0),
  ('Nordrhein-Westfalen', 6.5),
  ('Rheinland-Pfalz', 5.0),
  ('Saarland', 6.5),
  ('Sachsen', 5.5),
  ('Sachsen-Anhalt', 5.0),
  ('Schleswig-Holstein', 6.5),
  ('Thüringen', 5.0);

-- ============================================
-- Initiale Firmendaten (Platzhalter)
-- ============================================
INSERT INTO company_info (name, address, contact, opening_hours) VALUES (
  'Möller & Knabe GbR',
  '{"street": "Musterstraße", "houseNumber": "1", "zip": "12345", "city": "Musterstadt"}',
  '{"phone": "+49 123 456789", "email": "info@mkimmo.de"}',
  '{"monday": "09:00 - 18:00", "tuesday": "09:00 - 18:00", "wednesday": "09:00 - 18:00", "thursday": "09:00 - 18:00", "friday": "09:00 - 16:00"}'
);
