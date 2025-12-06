'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { SupabaseManagedPropertyService } from '@/lib/services/supabase/SupabaseManagedPropertyService'

interface DeleteManagedPropertyButtonProps {
  propertyId: string
  propertyName: string
  onDeleted: () => void
}

export function DeleteManagedPropertyButton({
  propertyId,
  propertyName,
  onDeleted,
}: DeleteManagedPropertyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const service = new SupabaseManagedPropertyService()
      const success = await service.delete(propertyId)

      if (success) {
        setOpen(false)
        onDeleted()
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Objekt löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Möchten Sie das Objekt &quot;{propertyName}&quot; wirklich löschen?
            Diese Aktion kann nicht rückgängig gemacht werden.
            <br /><br />
            <strong className="text-red-600">Achtung:</strong> Alle zugehörigen Einheiten
            und Mieter werden ebenfalls gelöscht!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Löschen...
              </>
            ) : (
              'Löschen'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
