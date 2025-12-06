import { createAdminClient } from '@/lib/supabase/admin'
import {
  Property,
  PropertyFilters,
  PropertyType,
  PropertyStatus,
  PropertyAddress,
  PropertyDetails,
  PropertyImage,
  Bundesland,
  HeatingType,
} from '@/types/property'
import {
  IPropertyService,
  PaginationParams,
  PaginatedResult,
} from '../interfaces/IPropertyService'

// Supabase DB Row Type
interface PropertyRow {
  id: string
  title: string
  slug: string
  type: string
  status: string
  price: number | null
  currency: string
  address: {
    street?: string
    houseNumber?: string
    zip?: string
    city?: string
    district?: string
    bundesland?: string
    coordinates?: { lat: number; lng: number }
  } | null
  details: {
    livingArea?: number
    plotArea?: number
    rooms?: number
    bedrooms?: number
    bathrooms?: number
    floor?: number
    floors?: number
    yearBuilt?: number
    lastRenovation?: number
    heating?: string
    energyCertificate?: string
    parkingSpaces?: number
    balcony?: boolean
    terrace?: boolean
    garden?: boolean
    elevator?: boolean
    basement?: boolean
    furnished?: boolean
    priceType?: 'kauf' | 'miete'
    shortDescription?: string
  } | null
  description: string | null
  features: string[] | null
  images: PropertyImage[] | null
  featured: boolean
  created_at: string
  updated_at: string
}

// Map Supabase row to Frontend Property
function mapRowToProperty(row: PropertyRow): Property {
  const address = row.address || {}
  const details = row.details || {}

  return {
    id: row.id,
    titel: row.title,
    slug: row.slug,
    typ: (row.type || 'wohnung') as PropertyType,
    status: (row.status || 'verfuegbar') as PropertyStatus,
    preis: row.price || 0,
    preistyp: (details.priceType || 'kauf') as 'kauf' | 'miete',
    adresse: {
      strasse: address.street || '',
      hausnummer: address.houseNumber || '',
      plz: address.zip || '',
      ort: address.city || '',
      bundesland: (address.bundesland || 'nordrhein-westfalen') as Bundesland,
      koordinaten: address.coordinates,
    },
    details: {
      wohnflaeche: details.livingArea || 0,
      grundstuecksflaeche: details.plotArea,
      zimmer: details.rooms || 0,
      schlafzimmer: details.bedrooms || 0,
      badezimmer: details.bathrooms || 0,
      etage: details.floor,
      etagen: details.floors,
      baujahr: details.yearBuilt,
      letzteSanierung: details.lastRenovation,
      heizung: (details.heating || 'gas') as HeatingType,
      energieausweis: details.energyCertificate,
      stellplaetze: details.parkingSpaces,
      balkon: details.balcony || false,
      terrasse: details.terrace || false,
      garten: details.garden || false,
      aufzug: details.elevator || false,
      keller: details.basement || false,
      moebliert: details.furnished || false,
    },
    bilder: row.images || [],
    beschreibung: row.description || '',
    kurzBeschreibung: details.shortDescription || '',
    merkmale: row.features || [],
    erstelltAm: row.created_at,
    aktualisiertAm: row.updated_at,
    hervorgehoben: row.featured,
  }
}

// Map Frontend Property to Supabase row (for create/update)
function mapPropertyToRow(property: Partial<Property>): Partial<PropertyRow> {
  const row: Partial<PropertyRow> = {}

  if (property.titel !== undefined) row.title = property.titel
  if (property.slug !== undefined) row.slug = property.slug
  if (property.typ !== undefined) row.type = property.typ
  if (property.status !== undefined) row.status = property.status
  if (property.preis !== undefined) row.price = property.preis
  if (property.hervorgehoben !== undefined) row.featured = property.hervorgehoben
  if (property.beschreibung !== undefined) row.description = property.beschreibung
  if (property.merkmale !== undefined) row.features = property.merkmale
  if (property.bilder !== undefined) row.images = property.bilder

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

  if (property.details || property.preistyp || property.kurzBeschreibung) {
    row.details = {
      livingArea: property.details?.wohnflaeche,
      plotArea: property.details?.grundstuecksflaeche,
      rooms: property.details?.zimmer,
      bedrooms: property.details?.schlafzimmer,
      bathrooms: property.details?.badezimmer,
      floor: property.details?.etage,
      floors: property.details?.etagen,
      yearBuilt: property.details?.baujahr,
      lastRenovation: property.details?.letzteSanierung,
      heating: property.details?.heizung,
      energyCertificate: property.details?.energieausweis,
      parkingSpaces: property.details?.stellplaetze,
      balcony: property.details?.balkon,
      terrace: property.details?.terrasse,
      garden: property.details?.garten,
      elevator: property.details?.aufzug,
      basement: property.details?.keller,
      furnished: property.details?.moebliert,
      priceType: property.preistyp,
      shortDescription: property.kurzBeschreibung,
    }
  }

  return row
}

export class SupabasePropertyService implements IPropertyService {
  private getSupabase() {
    return createAdminClient()
  }

  async getAll(): Promise<Property[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }

    return (data || []).map(mapRowToProperty)
  }

  async getById(id: string): Promise<Property | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching property by id:', error)
      return null
    }

    return mapRowToProperty(data)
  }

  async getBySlug(slug: string): Promise<Property | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('Error fetching property by slug:', error)
      return null
    }

    return mapRowToProperty(data)
  }

  async search(query: string): Promise<Property[]> {
    const supabase = this.getSupabase()
    const searchTerm = `%${query}%`

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching properties:', error)
      return []
    }

    return (data || []).map(mapRowToProperty)
  }

  async filter(filters: PropertyFilters): Promise<Property[]> {
    const supabase = this.getSupabase()
    let query = supabase.from('properties').select('*')

    if (filters.typ) {
      query = query.eq('type', filters.typ)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.preisMin !== undefined) {
      query = query.gte('price', filters.preisMin)
    }
    if (filters.preisMax !== undefined) {
      query = query.lte('price', filters.preisMax)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error filtering properties:', error)
      return []
    }

    let results = (data || []).map(mapRowToProperty)

    // Client-side filtering for JSONB fields
    if (filters.ort) {
      results = results.filter((p) =>
        p.adresse.ort.toLowerCase().includes(filters.ort!.toLowerCase())
      )
    }
    if (filters.bundesland) {
      results = results.filter((p) => p.adresse.bundesland === filters.bundesland)
    }
    if (filters.zimmerMin !== undefined) {
      results = results.filter((p) => p.details.zimmer >= filters.zimmerMin!)
    }
    if (filters.flaecheMin !== undefined) {
      results = results.filter((p) => p.details.wohnflaeche >= filters.flaecheMin!)
    }

    return results
  }

  async getPaginated(
    params: PaginationParams,
    filters?: PropertyFilters
  ): Promise<PaginatedResult<Property>> {
    const allProperties = filters
      ? await this.filter(filters)
      : await this.getAll()

    const total = allProperties.length
    const totalPages = Math.ceil(total / params.limit)
    const start = (params.page - 1) * params.limit
    const data = allProperties.slice(start, start + params.limit)

    return {
      data,
      total,
      page: params.page,
      totalPages,
    }
  }

  async getFeatured(limit: number = 3): Promise<Property[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured properties:', error)
      return []
    }

    return (data || []).map(mapRowToProperty)
  }

  // ============================================
  // CRUD Methods for Admin
  // ============================================

  async create(property: Omit<Property, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<Property | null> {
    const supabase = this.getSupabase()
    const row = mapPropertyToRow(property as Partial<Property>)

    const { data, error } = await supabase
      .from('properties')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Error creating property:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToProperty(data) : null
  }

  async update(id: string, property: Partial<Property>): Promise<Property | null> {
    const supabase = this.getSupabase()
    const row = mapPropertyToRow(property)

    const { data, error } = await supabase
      .from('properties')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating property:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToProperty(data) : null
  }

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) {
      console.error('Error deleting property:', error)
      return false
    }

    return true
  }
}
