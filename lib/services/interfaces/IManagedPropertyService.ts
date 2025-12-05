import { ManagedProperty } from '@/types/managed-property'

export interface IManagedPropertyService {
  getAll(): Promise<ManagedProperty[]>
  getById(id: string): Promise<ManagedProperty | null>
  getBySlug(slug: string): Promise<ManagedProperty | null>
  search(query: string): Promise<ManagedProperty[]>
}
