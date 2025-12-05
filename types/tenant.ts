export type TenantStatus = 'aktiv' | 'gekuendigt' | 'ausstehend'

export const TENANT_STATUS_NAMEN: Record<TenantStatus, string> = {
  aktiv: 'Aktiv',
  gekuendigt: 'Gekündigt',
  ausstehend: 'Ausstehend',
}

export interface LeaseInfo {
  beginn: string
  ende?: string
  typ: 'unbefristet' | 'befristet'
  kuendigungsfrist: number // in Monaten
}

export interface Tenant {
  id: string
  einheitId: string
  name: string
  email: string
  telefon: string
  mietvertrag: LeaseInfo
  bewohner: number
  status: TenantStatus
  erstelltAm: string
  aktualisiertAm: string
}
