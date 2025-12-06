-- ============================================
-- PHASE 4: Kontaktanfragen
-- ============================================

CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- makler_kontakt, makler_verkauf, hv_kontakt, hv_anfrage
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  metadata JSONB, -- zusätzliche Felder je nach Typ (property_id, subject, etc.)
  status TEXT DEFAULT 'neu', -- neu, in_bearbeitung, erledigt
  notes TEXT, -- interne Notizen
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes
CREATE INDEX idx_contact_requests_type ON contact_requests(type);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- Trigger für updated_at
CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Anfragen können von jedem erstellt werden (anonym)
CREATE POLICY "Jeder kann Kontaktanfragen erstellen"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

-- Nur authentifizierte Benutzer können Anfragen lesen und verwalten
CREATE POLICY "Authentifizierte Benutzer können Anfragen lesen"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Anfragen aktualisieren"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Anfragen löschen"
  ON contact_requests FOR DELETE
  TO authenticated
  USING (true);
