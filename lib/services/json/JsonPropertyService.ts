import { IPropertyService, PaginationParams, PaginatedResult } from '../interfaces/IPropertyService'
import { Property, PropertyFilters } from '@/types/property'
import propertiesData from '@/data/properties.json'

export class JsonPropertyService implements IPropertyService {
  private properties: Property[]

  constructor() {
    this.properties = propertiesData as Property[]
  }

  async getAll(): Promise<Property[]> {
    return this.properties
  }

  async getById(id: string): Promise<Property | null> {
    return this.properties.find((p) => p.id === id) || null
  }

  async getBySlug(slug: string): Promise<Property | null> {
    return this.properties.find((p) => p.slug === slug) || null
  }

  async search(query: string): Promise<Property[]> {
    const lowerQuery = query.toLowerCase()
    return this.properties.filter(
      (p) =>
        p.titel.toLowerCase().includes(lowerQuery) ||
        p.beschreibung.toLowerCase().includes(lowerQuery) ||
        p.adresse.ort.toLowerCase().includes(lowerQuery)
    )
  }

  async filter(filters: PropertyFilters): Promise<Property[]> {
    return this.properties.filter((p) => {
      if (filters.typ && p.typ !== filters.typ) return false
      if (filters.preisMin && p.preis < filters.preisMin) return false
      if (filters.preisMax && p.preis > filters.preisMax) return false
      if (filters.ort && !p.adresse.ort.toLowerCase().includes(filters.ort.toLowerCase())) return false
      if (filters.bundesland && p.adresse.bundesland !== filters.bundesland) return false
      if (filters.zimmerMin && p.details.zimmer < filters.zimmerMin) return false
      if (filters.flaecheMin && p.details.wohnflaeche < filters.flaecheMin) return false
      if (filters.status && p.status !== filters.status) return false
      return true
    })
  }

  async getPaginated(
    params: PaginationParams,
    filters?: PropertyFilters
  ): Promise<PaginatedResult<Property>> {
    const filtered = filters ? await this.filter(filters) : this.properties
    const total = filtered.length
    const totalPages = Math.ceil(total / params.limit)
    const start = (params.page - 1) * params.limit
    const data = filtered.slice(start, start + params.limit)

    return {
      data,
      total,
      page: params.page,
      totalPages,
    }
  }

  async getFeatured(limit: number = 6): Promise<Property[]> {
    return this.properties.filter((p) => p.hervorgehoben).slice(0, limit)
  }
}
