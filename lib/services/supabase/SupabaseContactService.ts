import { createClient } from '@/lib/supabase/client'
import {
  ContactRequest,
  ContactRequestType,
  ContactRequestStatus,
} from '@/types/contact'

interface ContactRequestRow {
  id: string
  type: string
  name: string
  email: string
  phone: string | null
  message: string | null
  metadata: Record<string, unknown> | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

function mapRowToRequest(row: ContactRequestRow): ContactRequest {
  return {
    id: row.id,
    type: row.type as ContactRequestType,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    message: row.message || undefined,
    metadata: row.metadata || undefined,
    status: (row.status || 'neu') as ContactRequestStatus,
    notes: row.notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SupabaseContactService {
  private getSupabase() {
    return createClient()
  }

  // ============================================
  // Read
  // ============================================

  async getAll(): Promise<ContactRequest[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact requests:', error)
      return []
    }

    return (data || []).map(mapRowToRequest)
  }

  async getById(id: string): Promise<ContactRequest | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching contact request:', error)
      return null
    }

    return mapRowToRequest(data)
  }

  async getByStatus(status: ContactRequestStatus): Promise<ContactRequest[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact requests by status:', error)
      return []
    }

    return (data || []).map(mapRowToRequest)
  }

  async getByType(type: ContactRequestType): Promise<ContactRequest[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact requests by type:', error)
      return []
    }

    return (data || []).map(mapRowToRequest)
  }

  async getNewCount(): Promise<number> {
    const supabase = this.getSupabase()
    const { count, error } = await supabase
      .from('contact_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'neu')

    if (error) {
      console.error('Error counting new requests:', error)
      return 0
    }

    return count || 0
  }

  // ============================================
  // Create (for form submissions)
  // ============================================

  async create(request: {
    type: ContactRequestType
    name: string
    email: string
    phone?: string
    message?: string
    metadata?: Record<string, unknown>
  }): Promise<ContactRequest | null> {
    const supabase = this.getSupabase()

    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        type: request.type,
        name: request.name,
        email: request.email,
        phone: request.phone || null,
        message: request.message || null,
        metadata: request.metadata || null,
        status: 'neu',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating contact request:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToRequest(data) : null
  }

  // ============================================
  // Update (for admin)
  // ============================================

  async updateStatus(id: string, status: ContactRequestStatus): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase
      .from('contact_requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating status:', error)
      return false
    }

    return true
  }

  async updateNotes(id: string, notes: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase
      .from('contact_requests')
      .update({ notes })
      .eq('id', id)

    if (error) {
      console.error('Error updating notes:', error)
      return false
    }

    return true
  }

  // ============================================
  // Delete
  // ============================================

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('contact_requests').delete().eq('id', id)

    if (error) {
      console.error('Error deleting contact request:', error)
      return false
    }

    return true
  }
}
