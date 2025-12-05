import { Unit } from '@/types/unit'
import { Tenant } from '@/types/tenant'

export interface IUnitService {
  getAll(): Promise<Unit[]>
  getById(id: string): Promise<Unit | null>
  getByPropertyId(propertyId: string): Promise<Unit[]>
  getVacant(): Promise<Unit[]>
}

export interface ITenantService {
  getById(id: string): Promise<Tenant | null>
  getByUnitId(unitId: string): Promise<Tenant | null>
}
