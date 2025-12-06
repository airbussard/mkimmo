'use client'

import { useEffect, useState, use } from 'react'
import { Loader2 } from 'lucide-react'
import { UserForm } from '@/components/admin/UserForm'
import { User } from '@/types/user'
import { notFound } from 'next/navigation'

interface BenutzerBearbeitenPageProps {
  params: Promise<{ id: string }>
}

export default function BenutzerBearbeitenPage({
  params,
}: BenutzerBearbeitenPageProps) {
  const { id } = use(params)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError(true)
            return
          }
          throw new Error('Fehler beim Laden')
        }
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error('Error loading user:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !user) {
    notFound()
  }

  return <UserForm user={user} isEditing />
}
