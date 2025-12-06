-- ============================================
-- Ticket-Nummern für Kontaktanfragen
-- ============================================

-- Fortlaufende Ticket-Nummer hinzufügen
ALTER TABLE contact_requests
ADD COLUMN ticket_number SERIAL;

-- Unique Index für schnelle Lookups
CREATE UNIQUE INDEX idx_contact_requests_ticket_number
ON contact_requests(ticket_number);
