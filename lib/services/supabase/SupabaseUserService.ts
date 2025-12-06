import { createAdminClient } from '@/lib/supabase/admin'
import {
  User,
  UserRole,
  UserStatus,
  CreateUserInput,
  UpdateUserInput,
} from '@/types/user'

interface UserRow {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
  updated_at: string
}

function mapToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SupabaseUserService {
  private getClient() {
    return createAdminClient()
  }

  async getAll(): Promise<User[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      throw new Error('Fehler beim Laden der Benutzer')
    }

    return (data || []).map(mapToUser)
  }

  async getById(id: string): Promise<User | null> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Error fetching user:', error)
      throw new Error('Fehler beim Laden des Benutzers')
    }

    return data ? mapToUser(data) : null
  }

  async create(input: CreateUserInput): Promise<User> {
    const supabase = this.getClient()

    // 1. Create auth user (without email confirmation)
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true, // Skip email confirmation
      })

    if (authError) {
      console.error('Error creating auth user:', authError)
      if (authError.message.includes('already been registered')) {
        throw new Error('Diese E-Mail-Adresse ist bereits registriert')
      }
      throw new Error('Fehler beim Erstellen des Benutzers: ' + authError.message)
    }

    if (!authData.user) {
      throw new Error('Benutzer konnte nicht erstellt werden')
    }

    // 2. Create user profile in users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: input.email,
        full_name: input.fullName,
        role: input.role,
        status: 'aktiv',
      })
      .select()
      .single()

    if (error) {
      // Rollback: Delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      console.error('Error creating user profile:', error)
      throw new Error('Fehler beim Erstellen des Benutzerprofils')
    }

    return mapToUser(data)
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const supabase = this.getClient()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.fullName !== undefined) {
      updateData.full_name = input.fullName
    }
    if (input.role !== undefined) {
      updateData.role = input.role
    }
    if (input.status !== undefined) {
      updateData.status = input.status
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw new Error('Fehler beim Aktualisieren des Benutzers')
    }

    return mapToUser(data)
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const supabase = this.getClient()

    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: newPassword,
    })

    if (error) {
      console.error('Error updating password:', error)
      throw new Error('Fehler beim Ändern des Passworts')
    }
  }

  async delete(id: string): Promise<void> {
    const supabase = this.getClient()

    // Delete from users table first (CASCADE should handle this, but let's be explicit)
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (profileError) {
      console.error('Error deleting user profile:', profileError)
      throw new Error('Fehler beim Löschen des Benutzerprofils')
    }

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(id)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      throw new Error('Fehler beim Löschen des Benutzers')
    }
  }
}
