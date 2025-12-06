'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { SupabaseBlogService } from '@/lib/services/supabase/SupabaseBlogService'

interface DeleteBlogPostButtonProps {
  postId: string
  postTitle: string
}

export function DeleteBlogPostButton({
  postId,
  postTitle,
}: DeleteBlogPostButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const blogService = new SupabaseBlogService()
      const success = await blogService.delete(postId)

      if (success) {
        setOpen(false)
        router.refresh()
      } else {
        alert('Fehler beim Löschen des Artikels')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Fehler beim Löschen des Artikels')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Löschen"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Artikel löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Möchten Sie den Artikel &quot;{postTitle}&quot; wirklich löschen?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Abbrechen</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird gelöscht...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
