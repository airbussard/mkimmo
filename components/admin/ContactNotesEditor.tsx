'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SupabaseContactService } from '@/lib/services/supabase/SupabaseContactService'

interface ContactNotesEditorProps {
  requestId: string
  currentNotes: string
}

export function ContactNotesEditor({
  requestId,
  currentNotes,
}: ContactNotesEditorProps) {
  const [notes, setNotes] = useState(currentNotes)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)

    try {
      const contactService = new SupabaseContactService()
      const success = await contactService.updateNotes(requestId, notes)

      if (success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Save notes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = notes !== currentNotes

  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full min-h-[150px] px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Interne Notizen zu dieser Anfrage..."
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-500">
          Nur für interne Zwecke sichtbar
        </p>
        <Button
          onClick={handleSave}
          disabled={loading || !hasChanges}
          size="sm"
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : saved ? (
            'Gespeichert!'
          ) : (
            <>
              <Save className="h-4 w-4" />
              Speichern
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
