import { IPropertyService } from './interfaces/IPropertyService'
import { IManagedPropertyService } from './interfaces/IManagedPropertyService'
import { IUnitService, ITenantService } from './interfaces/IUnitService'
import { JsonPropertyService } from './json/JsonPropertyService'
import { JsonManagedPropertyService } from './json/JsonManagedPropertyService'
import { JsonUnitService, JsonTenantService } from './json/JsonUnitService'

type ServiceProvider = 'json' | 'supabase'

class ServiceFactory {
  private provider: ServiceProvider

  constructor() {
    this.provider = (process.env.NEXT_PUBLIC_DATA_PROVIDER as ServiceProvider) || 'json'
  }

  getPropertyService(): IPropertyService {
    switch (this.provider) {
      case 'supabase':
        // Zukünftige Supabase-Implementierung
        throw new Error('Supabase noch nicht implementiert')
      case 'json':
      default:
        return new JsonPropertyService()
    }
  }

  getManagedPropertyService(): IManagedPropertyService {
    switch (this.provider) {
      case 'supabase':
        throw new Error('Supabase noch nicht implementiert')
      case 'json':
      default:
        return new JsonManagedPropertyService()
    }
  }

  getUnitService(): IUnitService {
    switch (this.provider) {
      case 'supabase':
        throw new Error('Supabase noch nicht implementiert')
      case 'json':
      default:
        return new JsonUnitService()
    }
  }

  getTenantService(): ITenantService {
    switch (this.provider) {
      case 'supabase':
        throw new Error('Supabase noch nicht implementiert')
      case 'json':
      default:
        return new JsonTenantService()
    }
  }
}

export const serviceFactory = new ServiceFactory()
