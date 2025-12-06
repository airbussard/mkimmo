-- ============================================
-- Benutzerverwaltung
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'mitarbeiter' CHECK (role IN ('admin', 'manager', 'mitarbeiter')),
  status TEXT NOT NULL DEFAULT 'aktiv' CHECK (status IN ('aktiv', 'inaktiv')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Authentifizierte Benutzer können alle User sehen
CREATE POLICY "Users can view all users" ON users
  FOR SELECT TO authenticated USING (true);

-- Policy: Service-Role (Admin-Client) kann User verwalten
CREATE POLICY "Service role can manage users" ON users
  FOR ALL TO service_role USING (true);

-- Trigger für updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
