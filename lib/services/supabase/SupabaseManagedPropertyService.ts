import { createAdminClient } from '@/lib/supabase/admin'
import {
  ManagedProperty,
  ManagedPropertyAddress,
  BuildingInfo,
  ManagementInfo,
} from '@/types/managed-property'
import { PropertyImage, Bundesland, HeatingType } from '@/types/property'
import { IManagedPropertyService } from '../interfaces/IManagedPropertyService'

interface ManagedPropertyRow {
  id: string
  name: string
  slug: string
  type: string
  address: {
    street?: string
    houseNumber?: string
    zip?: string
    city?: string
    bundesland?: string
    coordinates?: { lat: number; lng: number }
  } | null
  building_data: {
    yearBuilt?: number
    totalUnits?: number
    floors?: number
    totalArea?: number
    parkingSpaces?: number
    elevator?: boolean
    heating?: string
  } | null
  management_info: {
    managedSince?: string
    manager?: string
    contactEmail?: string
    contactPhone?: string
  } | null
  description: string | null
  image: string | null
  created_at: string
  updated_at: string
}

function mapRowToManagedProperty(row: ManagedPropertyRow): ManagedProperty {
  const address = row.address || {}
  const building = row.building_data || {}
  const management = row.management_info || {}

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    typ: (row.type || 'wohngebaeude') as ManagedProperty['typ'],
    adresse: {
      strasse: address.street || '',
      hausnummer: address.houseNumber || '',
      plz: address.zip || '',
      ort: address.city || '',
      bundesland: (address.bundesland || 'nordrhein-westfalen') as Bundesland,
      koordinaten: address.coordinates,
    },
    gebaeude: {
      baujahr: building.yearBuilt || 0,
      anzahlEinheiten: building.totalUnits || 0,
      etagen: building.floors || 0,
      gesamtflaeche: building.totalArea || 0,
      stellplaetze: building.parkingSpaces || 0,
      aufzug: building.elevator || false,
      heizung: (building.heating || 'gas') as HeatingType,
    },
    verwaltung: {
      verwaltetSeit: management.managedSince || '',
      verwalter: management.manager || '',
      kontaktEmail: management.contactEmail || '',
      kontaktTelefon: management.contactPhone || '',
    },
    einheitenIds: [],
    bilder: row.image ? [{ url: row.image, alt: row.name, isPrimary: true }] : [],
    beschreibung: row.description || '',
    ausstattung: [],
    erstelltAm: row.created_at,
    aktualisiertAm: row.updated_at,
  }
}

function mapManagedPropertyToRow(property: Partial<ManagedProperty>): Record<string, unknown> {
  const row: Record<string, unknown> = {}

  if (property.name !== undefined) row.name = property.name
  if (property.slug !== undefined) row.slug = property.slug
  if (property.typ !== undefined) row.type = property.typ
  if (property.beschreibung !== undefined) row.description = property.beschreibung
  if (property.bilder?.[0]?.url !== undefined) row.image = property.bilder[0].url

  if (property.adresse) {
    row.address = {
      street: property.adresse.strasse,
      houseNumber: property.adresse.hausnummer,
      zip: property.adresse.plz,
      city: property.adresse.ort,
      bundesland: property.adresse.bundesland,
      coordinates: property.adresse.koordinaten,
    }
  }

  if (property.gebaeude) {
    row.building_data = {
      yearBuilt: property.gebaeude.baujahr,
      totalUnits: property.gebaeude.anzahlEinheiten,
      floors: property.gebaeude.etagen,
      totalArea: property.gebaeude.gesamtflaeche,
      parkingSpaces: property.gebaeude.stellplaetze,
      elevator: property.gebaeude.aufzug,
      heating: property.gebaeude.heizung,
    }
  }

  if (property.verwaltung) {
    row.management_info = {
      managedSince: property.verwaltung.verwaltetSeit,
      manager: property.verwaltung.verwalter,
      contactEmail: property.verwaltung.kontaktEmail,
      contactPhone: property.verwaltung.kontaktTelefon,
    }
  }

  return row
}

export class SupabaseManagedPropertyService implements IManagedPropertyService {
  private getSupabase() {
    return createAdminClient()
  }

  async getAll(): Promise<ManagedProperty[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('managed_properties')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching managed properties:', error)
      return []
    }

    return (data || []).map(mapRowToManagedProperty)
  }

  async getById(id: string): Promise<ManagedProperty | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('managed_properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching managed property:', error)
      return null
    }

    return mapRowToManagedProperty(data)
  }

  async getBySlug(slug: string): Promise<ManagedProperty | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('managed_properties')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('Error fetching managed property by slug:', error)
      return null
    }

    return mapRowToManagedProperty(data)
  }

  async search(query: string): Promise<ManagedProperty[]> {
    const supabase = this.getSupabase()
    const searchTerm = `%${query}%`

    const { data, error } = await supabase
      .from('managed_properties')
      .select('*')
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order('name')

    if (error) {
      console.error('Error searching managed properties:', error)
      return []
    }

    return (data || []).map(mapRowToManagedProperty)
  }

  // ============================================
  // CRUD Methods for Admin
  // ============================================

  async create(property: Omit<ManagedProperty, 'id' | 'erstelltAm' | 'aktualisiertAm' | 'einheitenIds'>): Promise<ManagedProperty | null> {
    const supabase = this.getSupabase()
    const row = mapManagedPropertyToRow(property as Partial<ManagedProperty>)

    const { data, error } = await supabase
      .from('managed_properties')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error creating managed property:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToManagedProperty(data) : null
  }

  async update(id: string, property: Partial<ManagedProperty>): Promise<ManagedProperty | null> {
    const supabase = this.getSupabase()
    const row = mapManagedPropertyToRow(property)

    const { data, error } = await supabase
      .from('managed_properties')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating managed property:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToManagedProperty(data) : null
  }

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('managed_properties').delete().eq('id', id)

    if (error) {
      console.error('Error deleting managed property:', error)
      return false
    }

    return true
  }
}
