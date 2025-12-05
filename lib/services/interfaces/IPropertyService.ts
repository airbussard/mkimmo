import { Property, PropertyFilters } from '@/types/property'

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export interface IPropertyService {
  getAll(): Promise<Property[]>
  getById(id: string): Promise<Property | null>
  getBySlug(slug: string): Promise<Property | null>
  search(query: string): Promise<Property[]>
  filter(filters: PropertyFilters): Promise<Property[]>
  getPaginated(params: PaginationParams, filters?: PropertyFilters): Promise<PaginatedResult<Property>>
  getFeatured(limit?: number): Promise<Property[]>
}
