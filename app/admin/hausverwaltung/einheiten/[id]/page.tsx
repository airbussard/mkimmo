'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { UnitForm } from '@/components/admin/UnitForm'
import { SupabaseUnitService } from '@/lib/services/supabase/SupabaseUnitService'
import { Unit } from '@/types/unit'

export default function EinheitBearbeitenPage() {
  const params = useParams()
  const [unit, setUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUnit = async () => {
      try {
        const service = new SupabaseUnitService()
        const data = await service.getById(params.id as string)

        if (!data) {
          setError('Einheit nicht gefunden')
          return
        }

        setUnit(data)
      } catch (err) {
        console.error('Load error:', err)
        setError('Fehler beim Laden')
      } finally {
        setLoading(false)
      }
    }

    loadUnit()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !unit) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Einheit nicht gefunden'}</p>
      </div>
    )
  }

  return <UnitForm unit={unit} isEdit />
}
