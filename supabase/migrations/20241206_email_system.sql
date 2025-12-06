-- E-Mail-System Migration für MKImmo
-- Erstellt: 2024-12-06

-- ============================================
-- 1. email_settings (Konfiguration über Admin-UI)
-- ============================================
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER DEFAULT 465,
  smtp_user TEXT NOT NULL,
  smtp_password TEXT NOT NULL,
  imap_host TEXT NOT NULL,
  imap_port INTEGER DEFAULT 993,
  imap_user TEXT NOT NULL,
  imap_password TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT DEFAULT 'MK Immobilien',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial-Eintrag für Strato (Passwörter müssen manuell eingetragen werden)
INSERT INTO email_settings (
  smtp_host, smtp_port, smtp_user, smtp_password,
  imap_host, imap_port, imap_user, imap_password,
  from_email, from_name
)
VALUES (
  'smtp.strato.de', 465, 'mail@moellerknabe.de', '',
  'imap.strato.de', 993, 'mail@moellerknabe.de', '',
  'mail@moellerknabe.de', 'MK Immobilien'
);

-- ============================================
-- 2. email_queue (Warteschlange für ausgehende E-Mails)
-- ============================================
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_request_id UUID REFERENCES contact_requests(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  type TEXT DEFAULT 'reply' CHECK (type IN ('reply', 'confirmation', 'notification')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_attempt_at TIMESTAMPTZ,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für effiziente Abfragen
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_contact_request ON email_queue(contact_request_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at);

-- ============================================
-- 3. email_messages (Konversationsverlauf)
-- ============================================
CREATE TABLE IF NOT EXISTS email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_request_id UUID REFERENCES contact_requests(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,
  content_html TEXT,
  content_text TEXT,
  message_id TEXT,
  in_reply_to TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für effiziente Abfragen
CREATE INDEX IF NOT EXISTS idx_email_messages_contact_request ON email_messages(contact_request_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_message_id ON email_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_created_at ON email_messages(created_at);

-- ============================================
-- 4. RLS Policies (Row Level Security)
-- ============================================

-- email_settings: Nur über Service-Role zugänglich
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- email_queue: Nur über Service-Role zugänglich
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- email_messages: Nur über Service-Role zugänglich
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Updated_at Trigger für email_settings
-- ============================================
CREATE OR REPLACE FUNCTION update_email_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_settings_updated_at
  BEFORE UPDATE ON email_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_email_settings_updated_at();
