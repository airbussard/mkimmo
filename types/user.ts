export type UserRole = 'admin' | 'manager' | 'mitarbeiter'
export type UserStatus = 'aktiv' | 'inaktiv'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  email: string
  password: string
  fullName: string
  role: UserRole
}

export interface UpdateUserInput {
  fullName?: string
  role?: UserRole
  status?: UserStatus
}

export const USER_ROLE_NAMEN: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  mitarbeiter: 'Mitarbeiter',
}

export const USER_STATUS_NAMEN: Record<UserStatus, string> = {
  aktiv: 'Aktiv',
  inaktiv: 'Inaktiv',
}

export const USER_ROLES: UserRole[] = ['admin', 'manager', 'mitarbeiter']
export const USER_STATUSES: UserStatus[] = ['aktiv', 'inaktiv']
