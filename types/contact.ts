export type ContactRequestType =
  | 'makler_kontakt'
  | 'makler_verkauf'
  | 'makler_anfrage'
  | 'makler_ersteinschaetzung'
  | 'hv_kontakt'
  | 'hv_anfrage'
  | 'allgemein'

export const CONTACT_REQUEST_TYPE_NAMEN: Record<ContactRequestType, string> = {
  makler_kontakt: 'Makler - Kontakt',
  makler_verkauf: 'Makler - Verkaufsanfrage',
  makler_anfrage: 'Makler - Immobilienanfrage',
  makler_ersteinschaetzung: 'Makler - Ersteinschätzung',
  hv_kontakt: 'Hausverwaltung - Kontakt',
  hv_anfrage: 'Hausverwaltung - Anfrage',
  allgemein: 'Allgemeine Anfrage',
}

export type ContactRequestStatus = 'neu' | 'in_bearbeitung' | 'erledigt'

export const CONTACT_REQUEST_STATUS_NAMEN: Record<ContactRequestStatus, string> = {
  neu: 'Neu',
  in_bearbeitung: 'In Bearbeitung',
  erledigt: 'Erledigt',
}

export interface ContactRequest {
  id: string
  ticketNumber: number
  type: ContactRequestType
  name: string
  email: string
  phone?: string
  message?: string
  metadata?: Record<string, unknown>
  status: ContactRequestStatus
  notes?: string
  createdAt: string
  updatedAt: string
}
