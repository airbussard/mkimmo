'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ManagedPropertyForm } from '@/components/admin/ManagedPropertyForm'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'
import { ManagedProperty } from '@/types/managed-property'

export default function ObjektBearbeitenPage() {
  const params = useParams()
  const [property, setProperty] = useState<ManagedProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const service = new SupabaseManagedPropertyService()
        const data = await service.getById(params.id as string)

        if (!data) {
          setError('Objekt nicht gefunden')
          return
        }

        setProperty(data)
      } catch (err) {
        console.error('Load error:', err)
        setError('Fehler beim Laden')
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Objekt nicht gefunden'}</p>
      </div>
    )
  }

  return <ManagedPropertyForm property={property} isEdit />
}
