-- ============================================
-- Supabase Storage Buckets
-- ============================================
-- HINWEIS: Diese Befehle müssen im Supabase Dashboard
-- unter Storage ausgeführt werden, NICHT im SQL-Editor!
--
-- Alternativ über die Supabase API oder CLI.

-- Bucket für Immobilien-Bilder erstellen:
-- Name: property-images
-- Public: true

-- Bucket für Blog-Bilder erstellen:
-- Name: blog-images
-- Public: true

-- Bucket für Dokumente (Hausverwaltung) erstellen:
-- Name: documents
-- Public: false (nur für authentifizierte Benutzer)

-- ============================================
-- Storage Policies (im SQL-Editor ausführbar)
-- ============================================

-- Property Images: Öffentlich lesbar, nur Auth kann hochladen
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Property-Bilder sind öffentlich lesbar"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Authentifizierte können Property-Bilder hochladen"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authentifizierte können Property-Bilder löschen"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');

-- Blog Images: Öffentlich lesbar, nur Auth kann hochladen
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Blog-Bilder sind öffentlich lesbar"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authentifizierte können Blog-Bilder hochladen"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authentifizierte können Blog-Bilder löschen"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Documents: Nur für authentifizierte Benutzer
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Nur Authentifizierte können Dokumente lesen"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Authentifizierte können Dokumente hochladen"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authentifizierte können Dokumente löschen"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');
