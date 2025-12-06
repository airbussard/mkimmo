'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { TenantForm } from '@/components/admin/TenantForm'
import { SupabaseTenantService } from '@/lib/services/supabase/SupabaseUnitService'
import { Tenant } from '@/types/tenant'

export default function MieterBearbeitenPage() {
  const params = useParams()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const service = new SupabaseTenantService()
        const data = await service.getById(params.id as string)

        if (!data) {
          setError('Mieter nicht gefunden')
          return
        }

        setTenant(data)
      } catch (err) {
        console.error('Load error:', err)
        setError('Fehler beim Laden')
      } finally {
        setLoading(false)
      }
    }

    loadTenant()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Mieter nicht gefunden'}</p>
      </div>
    )
  }

  return <TenantForm tenant={tenant} isEdit />
}
