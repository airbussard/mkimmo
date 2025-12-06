import { createClient } from '@/lib/supabase/client'
import {
  Unit,
  UnitType,
  UnitStatus,
  UnitDetails,
  RentalInfo,
  UnitDocument,
} from '@/types/unit'
import { Tenant, TenantStatus, LeaseInfo } from '@/types/tenant'
import { IUnitService, ITenantService } from '../interfaces/IUnitService'

// ============================================
// Unit Types & Mapping
// ============================================

interface UnitRow {
  id: string
  property_id: string
  unit_number: string
  floor: number | null
  location: string | null
  type: string | null
  details: {
    area?: number
    rooms?: number
    bedrooms?: number
    bathrooms?: number
    balcony?: boolean
    balconyArea?: number
    basement?: boolean
    basementArea?: number
  } | null
  rent: {
    coldRent?: number
    utilities?: number
    totalRent?: number
    deposit?: number
  } | null
  status: string
  documents: UnitDocument[] | null
  created_at: string
  updated_at: string
}

function mapRowToUnit(row: UnitRow): Unit {
  const details = row.details || {}
  const rent = row.rent || {}

  return {
    id: row.id,
    objektId: row.property_id,
    einheitNummer: row.unit_number,
    etage: row.floor || 0,
    lage: (row.location || 'mitte') as Unit['lage'],
    typ: (row.type || 'wohnung') as UnitType,
    details: {
      flaeche: details.area || 0,
      zimmer: details.rooms || 0,
      schlafzimmer: details.bedrooms,
      badezimmer: details.bathrooms,
      balkon: details.balcony || false,
      balkonFlaeche: details.balconyArea,
      keller: details.basement || false,
      kellerFlaeche: details.basementArea,
    },
    miete: {
      kaltmiete: rent.coldRent || 0,
      nebenkosten: rent.utilities || 0,
      warmmiete: rent.totalRent || 0,
      kaution: rent.deposit || 0,
    },
    status: (row.status || 'leer') as UnitStatus,
    mieterId: undefined,
    dokumente: row.documents || [],
    erstelltAm: row.created_at,
    aktualisiertAm: row.updated_at,
  }
}

function mapUnitToRow(unit: Partial<Unit>): Record<string, unknown> {
  const row: Record<string, unknown> = {}

  if (unit.objektId !== undefined) row.property_id = unit.objektId
  if (unit.einheitNummer !== undefined) row.unit_number = unit.einheitNummer
  if (unit.etage !== undefined) row.floor = unit.etage
  if (unit.lage !== undefined) row.location = unit.lage
  if (unit.typ !== undefined) row.type = unit.typ
  if (unit.status !== undefined) row.status = unit.status
  if (unit.dokumente !== undefined) row.documents = unit.dokumente

  if (unit.details) {
    row.details = {
      area: unit.details.flaeche,
      rooms: unit.details.zimmer,
      bedrooms: unit.details.schlafzimmer,
      bathrooms: unit.details.badezimmer,
      balcony: unit.details.balkon,
      balconyArea: unit.details.balkonFlaeche,
      basement: unit.details.keller,
      basementArea: unit.details.kellerFlaeche,
    }
  }

  if (unit.miete) {
    row.rent = {
      coldRent: unit.miete.kaltmiete,
      utilities: unit.miete.nebenkosten,
      totalRent: unit.miete.warmmiete,
      deposit: unit.miete.kaution,
    }
  }

  return row
}

// ============================================
// Tenant Types & Mapping
// ============================================

interface TenantRow {
  id: string
  unit_id: string
  name: string
  contact: {
    email?: string
    phone?: string
  } | null
  lease: {
    startDate?: string
    endDate?: string
    type?: string
    noticePeriod?: number
  } | null
  resident_count: number | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

function mapRowToTenant(row: TenantRow): Tenant {
  const contact = row.contact || {}
  const lease = row.lease || {}

  return {
    id: row.id,
    einheitId: row.unit_id,
    name: row.name,
    email: contact.email || '',
    telefon: contact.phone || '',
    mietvertrag: {
      beginn: lease.startDate || '',
      ende: lease.endDate,
      typ: (lease.type || 'unbefristet') as LeaseInfo['typ'],
      kuendigungsfrist: lease.noticePeriod || 3,
    },
    bewohner: row.resident_count || 1,
    status: (row.status || 'aktiv') as TenantStatus,
    erstelltAm: row.created_at,
    aktualisiertAm: row.updated_at,
  }
}

function mapTenantToRow(tenant: Partial<Tenant>): Record<string, unknown> {
  const row: Record<string, unknown> = {}

  if (tenant.einheitId !== undefined) row.unit_id = tenant.einheitId
  if (tenant.name !== undefined) row.name = tenant.name
  if (tenant.bewohner !== undefined) row.resident_count = tenant.bewohner
  if (tenant.status !== undefined) row.status = tenant.status

  if (tenant.email !== undefined || tenant.telefon !== undefined) {
    row.contact = {
      email: tenant.email,
      phone: tenant.telefon,
    }
  }

  if (tenant.mietvertrag) {
    row.lease = {
      startDate: tenant.mietvertrag.beginn,
      endDate: tenant.mietvertrag.ende,
      type: tenant.mietvertrag.typ,
      noticePeriod: tenant.mietvertrag.kuendigungsfrist,
    }
  }

  return row
}

// ============================================
// SupabaseUnitService
// ============================================

export class SupabaseUnitService implements IUnitService {
  private getSupabase() {
    return createClient()
  }

  async getAll(): Promise<Unit[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('unit_number')

    if (error) {
      console.error('Error fetching units:', error)
      return []
    }

    return (data || []).map(mapRowToUnit)
  }

  async getById(id: string): Promise<Unit | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching unit:', error)
      return null
    }

    return mapRowToUnit(data)
  }

  async getByPropertyId(propertyId: string): Promise<Unit[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('property_id', propertyId)
      .order('floor')
      .order('unit_number')

    if (error) {
      console.error('Error fetching units by property:', error)
      return []
    }

    return (data || []).map(mapRowToUnit)
  }

  async getVacant(): Promise<Unit[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('status', 'leer')
      .order('unit_number')

    if (error) {
      console.error('Error fetching vacant units:', error)
      return []
    }

    return (data || []).map(mapRowToUnit)
  }

  // ============================================
  // CRUD Methods for Admin
  // ============================================

  async create(unit: Omit<Unit, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<Unit | null> {
    const supabase = this.getSupabase()
    const row = mapUnitToRow(unit as Partial<Unit>)

    const { data, error } = await supabase
      .from('units')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error creating unit:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToUnit(data) : null
  }

  async update(id: string, unit: Partial<Unit>): Promise<Unit | null> {
    const supabase = this.getSupabase()
    const row = mapUnitToRow(unit)

    const { data, error } = await supabase
      .from('units')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating unit:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToUnit(data) : null
  }

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('units').delete().eq('id', id)

    if (error) {
      console.error('Error deleting unit:', error)
      return false
    }

    return true
  }
}

// ============================================
// SupabaseTenantService
// ============================================

export class SupabaseTenantService implements ITenantService {
  private getSupabase() {
    return createClient()
  }

  async getById(id: string): Promise<Tenant | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching tenant:', error)
      return null
    }

    return mapRowToTenant(data)
  }

  async getByUnitId(unitId: string): Promise<Tenant | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('unit_id', unitId)
      .eq('status', 'aktiv')
      .single()

    if (error || !data) {
      return null
    }

    return mapRowToTenant(data)
  }

  async getAll(): Promise<Tenant[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching tenants:', error)
      return []
    }

    return (data || []).map(mapRowToTenant)
  }

  // ============================================
  // CRUD Methods for Admin
  // ============================================

  async create(tenant: Omit<Tenant, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<Tenant | null> {
    const supabase = this.getSupabase()
    const row = mapTenantToRow(tenant as Partial<Tenant>)

    const { data, error } = await supabase
      .from('tenants')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error creating tenant:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToTenant(data) : null
  }

  async update(id: string, tenant: Partial<Tenant>): Promise<Tenant | null> {
    const supabase = this.getSupabase()
    const row = mapTenantToRow(tenant)

    const { data, error } = await supabase
      .from('tenants')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tenant:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToTenant(data) : null
  }

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('tenants').delete().eq('id', id)

    if (error) {
      console.error('Error deleting tenant:', error)
      return false
    }

    return true
  }
}
