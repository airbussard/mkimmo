'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'
import {
  ContactRequestStatus,
  CONTACT_REQUEST_STATUS_NAMEN,
} from '@/types/contact'

interface ContactStatusSelectProps {
  requestId: string
  currentStatus: ContactRequestStatus
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'neu':
      return 'border-blue-300 bg-blue-50 text-blue-800'
    case 'in_bearbeitung':
      return 'border-yellow-300 bg-yellow-50 text-yellow-800'
    case 'erledigt':
      return 'border-green-300 bg-green-50 text-green-800'
    default:
      return ''
  }
}

export function ContactStatusSelect({
  requestId,
  currentStatus,
}: ContactStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = async (newStatus: ContactRequestStatus) => {
    if (newStatus === status) return

    setLoading(true)
    try {
      const contactService = new SupabaseContactService()
      const success = await contactService.updateStatus(requestId, newStatus)

      if (success) {
        setStatus(newStatus)
        router.refresh()
      }
    } catch (error) {
      console.error('Status update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select
      value={status}
      onValueChange={(v) => handleChange(v as ContactRequestStatus)}
      disabled={loading}
    >
      <SelectTrigger className={`w-[140px] text-xs ${getStatusColor(status)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CONTACT_REQUEST_STATUS_NAMEN).map(([value, label]) => (
          <SelectItem key={value} value={value} className="text-sm">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
