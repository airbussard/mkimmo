import { createClient } from '@/lib/supabase/client'

// ============================================
// Company Info Types
// ============================================

export interface CompanyInfo {
  id: string
  name: string
  address: {
    street: string
    houseNumber: string
    zip: string
    city: string
  }
  contact: {
    phone: string
    email: string
    fax?: string
  }
  openingHours: {
    weekdays: string
    saturday?: string
  }
  updatedAt: string
}

interface CompanyInfoRow {
  id: string
  name: string | null
  address: {
    street?: string
    houseNumber?: string
    zip?: string
    city?: string
  } | null
  contact: {
    phone?: string
    email?: string
    fax?: string
  } | null
  opening_hours: {
    weekdays?: string
    saturday?: string
  } | null
  updated_at: string
}

function mapRowToCompanyInfo(row: CompanyInfoRow): CompanyInfo {
  const address = row.address || {}
  const contact = row.contact || {}
  const openingHours = row.opening_hours || {}

  return {
    id: row.id,
    name: row.name || '',
    address: {
      street: address.street || '',
      houseNumber: address.houseNumber || '',
      zip: address.zip || '',
      city: address.city || '',
    },
    contact: {
      phone: contact.phone || '',
      email: contact.email || '',
      fax: contact.fax,
    },
    openingHours: {
      weekdays: openingHours.weekdays || '',
      saturday: openingHours.saturday,
    },
    updatedAt: row.updated_at,
  }
}

// ============================================
// Tax Rate Types
// ============================================

export interface TaxRate {
  id: string
  bundesland: string
  rate: number
  updatedAt: string
}

interface TaxRateRow {
  id: string
  bundesland: string
  rate: number
  updated_at: string
}

function mapRowToTaxRate(row: TaxRateRow): TaxRate {
  return {
    id: row.id,
    bundesland: row.bundesland,
    rate: row.rate,
    updatedAt: row.updated_at,
  }
}

// ============================================
// SupabaseCompanyService
// ============================================

export class SupabaseCompanyService {
  private getSupabase() {
    return createClient()
  }

  async get(): Promise<CompanyInfo | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .single()

    if (error || !data) {
      console.error('Error fetching company info:', error)
      return null
    }

    return mapRowToCompanyInfo(data)
  }

  async update(info: Partial<CompanyInfo>): Promise<CompanyInfo | null> {
    const supabase = this.getSupabase()

    const row: Record<string, unknown> = {}

    if (info.name !== undefined) row.name = info.name
    if (info.address) {
      row.address = {
        street: info.address.street,
        houseNumber: info.address.houseNumber,
        zip: info.address.zip,
        city: info.address.city,
      }
    }
    if (info.contact) {
      row.contact = {
        phone: info.contact.phone,
        email: info.contact.email,
        fax: info.contact.fax,
      }
    }
    if (info.openingHours) {
      row.opening_hours = {
        weekdays: info.openingHours.weekdays,
        saturday: info.openingHours.saturday,
      }
    }

    // First check if record exists
    const existing = await this.get()

    if (existing) {
      const { data, error } = await supabase
        .from('company_info')
        .update(row)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating company info:', error)
        throw new Error(error.message)
      }

      return data ? mapRowToCompanyInfo(data) : null
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('company_info')
        .insert(row)
        .select()
        .single()

      if (error) {
        console.error('Error creating company info:', error)
        throw new Error(error.message)
      }

      return data ? mapRowToCompanyInfo(data) : null
    }
  }
}

// ============================================
// SupabaseTaxRateService
// ============================================

export class SupabaseTaxRateService {
  private getSupabase() {
    return createClient()
  }

  async getAll(): Promise<TaxRate[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('tax_rates')
      .select('*')
      .order('bundesland')

    if (error) {
      console.error('Error fetching tax rates:', error)
      return []
    }

    return (data || []).map(mapRowToTaxRate)
  }

  async getByBundesland(bundesland: string): Promise<TaxRate | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('tax_rates')
      .select('*')
      .eq('bundesland', bundesland)
      .single()

    if (error || !data) {
      return null
    }

    return mapRowToTaxRate(data)
  }

  async update(id: string, rate: number): Promise<TaxRate | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('tax_rates')
      .update({ rate })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tax rate:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToTaxRate(data) : null
  }

  async upsert(bundesland: string, rate: number): Promise<TaxRate | null> {
    const supabase = this.getSupabase()

    // Check if exists
    const existing = await this.getByBundesland(bundesland)

    if (existing) {
      return this.update(existing.id, rate)
    }

    // Insert new
    const { data, error } = await supabase
      .from('tax_rates')
      .insert({ bundesland, rate })
      .select()
      .single()

    if (error) {
      console.error('Error creating tax rate:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToTaxRate(data) : null
  }
}
