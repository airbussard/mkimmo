import { IUnitService, ITenantService } from '../interfaces/IUnitService'
import { Unit } from '@/types/unit'
import { Tenant } from '@/types/tenant'
import unitsData from '@/data/units.json'
import tenantsData from '@/data/tenants.json'

export class JsonUnitService implements IUnitService {
  private units: Unit[]

  constructor() {
    this.units = unitsData as Unit[]
  }

  async getAll(): Promise<Unit[]> {
    return this.units
  }

  async getById(id: string): Promise<Unit | null> {
    return this.units.find((u) => u.id === id) || null
  }

  async getByPropertyId(propertyId: string): Promise<Unit[]> {
    return this.units.filter((u) => u.objektId === propertyId)
  }

  async getVacant(): Promise<Unit[]> {
    return this.units.filter((u) => u.status === 'leer')
  }
}

export class JsonTenantService implements ITenantService {
  private tenants: Tenant[]

  constructor() {
    this.tenants = tenantsData as Tenant[]
  }

  async getById(id: string): Promise<Tenant | null> {
    return this.tenants.find((t) => t.id === id) || null
  }

  async getByUnitId(unitId: string): Promise<Tenant | null> {
    return this.tenants.find((t) => t.einheitId === unitId) || null
  }
}
