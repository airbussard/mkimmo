# Supabase Migrationen

## Reihenfolge der Ausführung

Führe die SQL-Dateien in dieser Reihenfolge im Supabase SQL-Editor aus:

1. **001_properties.sql** - Immobilien-Tabelle (Phase 2)
2. **002_blog.sql** - Blog-Kategorien und Posts (Phase 3)
3. **003_contact_requests.sql** - Kontaktanfragen (Phase 4)
4. **004_hausverwaltung.sql** - Verwaltungsobjekte, Einheiten, Mieter (Phase 5)
5. **005_settings.sql** - Firmendaten und Steuersätze (Phase 6)
6. **006_storage.sql** - Storage Buckets für Bilder/Dokumente

## Hinweise

- Die Dateien bauen aufeinander auf (z.B. wird `update_updated_at_column()` in 001 erstellt)
- RLS (Row Level Security) ist aktiviert
- Authentifizierte Benutzer = Admin-User im Supabase Auth

## Admin-User erstellen

1. Gehe zu: Supabase Dashboard → Authentication → Users
2. Klicke auf "Add User"
3. E-Mail und Passwort eingeben
4. User kann sich dann unter `/admin/login` anmelden

## Ausführung im SQL-Editor

1. Öffne: https://supabase.com/dashboard/project/zclwucqqivxshxkojrww/sql
2. Kopiere den Inhalt einer Datei
3. Klicke "Run" oder Cmd/Ctrl + Enter
4. Wiederhole für alle Dateien
