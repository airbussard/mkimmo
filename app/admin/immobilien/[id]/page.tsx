export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { SupabasePropertyService } from '@/lib/services/supabase/SupabasePropertyService'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BearbeiteImmobiliePage({ params }: PageProps) {
  const { id } = await params
  const propertyService = new SupabasePropertyService()
  const property = await propertyService.getById(id)

  if (!property) {
    notFound()
  }

  return <PropertyForm property={property} isEditing />
}
