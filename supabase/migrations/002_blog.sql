-- ============================================
-- PHASE 3: Blog
-- ============================================

-- Blog-Kategorien
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog-Artikel
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  author TEXT,
  image TEXT, -- URL zum Bild
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- draft, published
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- Trigger für updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Kategorien: Alle können lesen
CREATE POLICY "Blog-Kategorien sind öffentlich lesbar"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Kategorien verwalten"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true);

-- Posts: Nur veröffentlichte sind öffentlich
CREATE POLICY "Veröffentlichte Blog-Posts sind öffentlich lesbar"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authentifizierte Benutzer können Posts erstellen"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authentifizierte Benutzer können Posts aktualisieren"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Posts löschen"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);
