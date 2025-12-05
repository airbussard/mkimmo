import { IManagedPropertyService } from '../interfaces/IManagedPropertyService'
import { ManagedProperty } from '@/types/managed-property'
import managedPropertiesData from '@/data/managed-properties.json'

export class JsonManagedPropertyService implements IManagedPropertyService {
  private properties: ManagedProperty[]

  constructor() {
    this.properties = managedPropertiesData as ManagedProperty[]
  }

  async getAll(): Promise<ManagedProperty[]> {
    return this.properties
  }

  async getById(id: string): Promise<ManagedProperty | null> {
    return this.properties.find((p) => p.id === id) || null
  }

  async getBySlug(slug: string): Promise<ManagedProperty | null> {
    return this.properties.find((p) => p.slug === slug) || null
  }

  async search(query: string): Promise<ManagedProperty[]> {
    const lowerQuery = query.toLowerCase()
    return this.properties.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.beschreibung.toLowerCase().includes(lowerQuery) ||
        p.adresse.ort.toLowerCase().includes(lowerQuery) ||
        p.adresse.strasse.toLowerCase().includes(lowerQuery)
    )
  }
}
