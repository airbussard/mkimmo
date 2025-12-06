'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Save, Loader2, ArrowLeft, Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import {
  BlogPost,
  BlogCategory,
  BlogPostStatus,
  BLOG_POST_STATUS_NAMEN,
} from '@/types/blog'

interface BlogEditorProps {
  post?: BlogPost
  categories: BlogCategory[]
  isEditing?: boolean
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const defaultPost: Omit<BlogPost, 'id' | 'erstelltAm' | 'aktualisiertAm'> = {
  titel: '',
  slug: '',
  inhalt: '',
  kurzBeschreibung: '',
  autor: '',
  bild: undefined,
  kategorieId: undefined,
  status: 'draft',
}

export function BlogEditor({ post, categories, isEditing = false }: BlogEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'erstelltAm' | 'aktualisiertAm'>>(
    post
      ? {
          titel: post.titel,
          slug: post.slug,
          inhalt: post.inhalt,
          kurzBeschreibung: post.kurzBeschreibung,
          autor: post.autor,
          bild: post.bild,
          kategorieId: post.kategorieId,
          status: post.status,
          veroeffentlichtAm: post.veroeffentlichtAm,
        }
      : defaultPost
  )

  const supabase = createClient()

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTitleChange = (title: string) => {
    updateField('titel', title)
    if (!isEditing) {
      updateField('slug', generateSlug(title))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      updateField('bild', publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Fehler beim Hochladen des Bildes')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = async () => {
    if (formData.bild) {
      try {
        const url = new URL(formData.bild)
        const pathParts = url.pathname.split('/storage/v1/object/public/blog-images/')
        if (pathParts.length > 1) {
          await supabase.storage.from('blog-images').remove([pathParts[1]])
        }
      } catch (e) {
        console.error('Error deleting image:', e)
      }
    }
    updateField('bild', undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing && post
        ? `/api/admin/blog/${post.id}`
        : '/api/admin/blog'

      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Speichern')
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {isEditing ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h1>
            {isEditing && post && (
              <p className="text-secondary-600">{post.titel}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Speichern
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basis-Informationen */}
          <Card>
            <CardHeader>
              <CardTitle>Artikel-Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titel">Titel *</Label>
                <Input
                  id="titel"
                  value={formData.titel}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Artikeltitel eingeben..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="artikel-titel"
                />
              </div>
              <div>
                <Label htmlFor="kurzBeschreibung">Kurzbeschreibung</Label>
                <textarea
                  id="kurzBeschreibung"
                  value={formData.kurzBeschreibung}
                  onChange={(e) => updateField('kurzBeschreibung', e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Kurze Beschreibung für die Vorschau..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Inhalt */}
          <Card>
            <CardHeader>
              <CardTitle>Inhalt</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                id="inhalt"
                value={formData.inhalt}
                onChange={(e) => updateField('inhalt', e.target.value)}
                className="w-full min-h-[400px] px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder="Artikelinhalt (Markdown wird unterstützt)..."
              />
              <p className="text-xs text-secondary-500 mt-2">
                Tipp: Markdown-Formatierung wird unterstützt.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Veröffentlichung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => updateField('status', v as BlogPostStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BLOG_POST_STATUS_NAMEN).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  value={formData.autor}
                  onChange={(e) => updateField('autor', e.target.value)}
                  placeholder="Name des Autors"
                />
              </div>
              <div>
                <Label htmlFor="kategorie">Kategorie</Label>
                <Select
                  value={formData.kategorieId || 'none'}
                  onValueChange={(v) => updateField('kategorieId', v === 'none' ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Keine Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine Kategorie</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Beitragsbild */}
          <Card>
            <CardHeader>
              <CardTitle>Beitragsbild</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.bild ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary-100">
                  <Image
                    src={formData.bild}
                    alt="Beitragsbild"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:bg-red-50"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center transition-colors
                      ${uploadingImage ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-secondary-400'}
                    `}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-8 w-8 text-primary-500 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-secondary-600">Wird hochgeladen...</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                        <p className="text-sm text-secondary-600">Bild hochladen</p>
                      </>
                    )}
                  </div>
                </label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
