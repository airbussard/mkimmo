import { IPropertyService } from './interfaces/IPropertyService'
import { IManagedPropertyService } from './interfaces/IManagedPropertyService'
import { IUnitService, ITenantService } from './interfaces/IUnitService'
import { IBlogService } from './interfaces/IBlogService'
import { JsonPropertyService } from './json/JsonPropertyService'
import { JsonManagedPropertyService } from './json/JsonManagedPropertyService'
import { JsonUnitService, JsonTenantService } from './json/JsonUnitService'
import { JsonBlogService } from './json/JsonBlogService'
import { SupabasePropertyService } from './supabase/SupabasePropertyService'
import { SupabaseBlogService } from './supabase/SupabaseBlogService'
import { SupabaseManagedPropertyService } from './supabase/SupabaseManagedPropertyService'
import { SupabaseUnitService, SupabaseTenantService } from './supabase/SupabaseUnitService'

type ServiceProvider = 'json' | 'supabase'

class ServiceFactory {
  private provider: ServiceProvider

  constructor() {
    this.provider = (process.env.NEXT_PUBLIC_DATA_PROVIDER as ServiceProvider) || 'json'
  }

  getPropertyService(): IPropertyService {
    switch (this.provider) {
      case 'supabase':
        return new SupabasePropertyService()
      case 'json':
      default:
        return new JsonPropertyService()
    }
  }

  getManagedPropertyService(): IManagedPropertyService {
    switch (this.provider) {
      case 'supabase':
        return new SupabaseManagedPropertyService()
      case 'json':
      default:
        return new JsonManagedPropertyService()
    }
  }

  getUnitService(): IUnitService {
    switch (this.provider) {
      case 'supabase':
        return new SupabaseUnitService()
      case 'json':
      default:
        return new JsonUnitService()
    }
  }

  getTenantService(): ITenantService {
    switch (this.provider) {
      case 'supabase':
        return new SupabaseTenantService()
      case 'json':
      default:
        return new JsonTenantService()
    }
  }

  getBlogService(): IBlogService {
    switch (this.provider) {
      case 'supabase':
        return new SupabaseBlogService()
      case 'json':
      default:
        return new JsonBlogService()
    }
  }
}

export const serviceFactory = new ServiceFactory()
