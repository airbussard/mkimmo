'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Star, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { PropertyImage } from '@/types/property'

interface ImageUploadProps {
  images: PropertyImage[]
  onImagesChange: (images: PropertyImage[]) => void
  propertyId?: string
}

export function ImageUpload({ images, onImagesChange, propertyId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const supabase = createClient()

  const uploadFile = async (file: File): Promise<PropertyImage | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = propertyId ? `${propertyId}/${fileName}` : `temp/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      isPrimary: images.length === 0, // First image is primary by default
    }
  }

  const handleUpload = async (files: FileList | File[]) => {
    setUploading(true)
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) =>
      file.type.startsWith('image/')
    )

    try {
      const uploadPromises = validFiles.map(uploadFile)
      const results = await Promise.all(uploadPromises)
      const newImages = results.filter((img): img is PropertyImage => img !== null)

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files)
      }
    },
    [images]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files)
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]

    // Try to delete from storage
    try {
      const url = new URL(imageToRemove.url)
      const pathParts = url.pathname.split('/storage/v1/object/public/property-images/')
      if (pathParts.length > 1) {
        await supabase.storage
          .from('property-images')
          .remove([pathParts[1]])
      }
    } catch (e) {
      console.error('Error deleting image from storage:', e)
    }

    const newImages = images.filter((_, i) => i !== index)

    // If we removed the primary image, make the first one primary
    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isPrimary: true }
    }

    onImagesChange(newImages)
  }

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }))
    onImagesChange(newImages)
  }

  const updateAlt = (index: number, alt: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], alt }
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-secondary-400'}
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
              <p className="text-secondary-600">Bilder werden hochgeladen...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-secondary-400" />
              <p className="text-secondary-600">
                Bilder hierher ziehen oder klicken zum Auswählen
              </p>
              <p className="text-sm text-secondary-400">
                JPG, PNG, WebP (max. 10 MB pro Bild)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? 'border-primary-500' : 'border-secondary-200'
              }`}
            >
              <div className="aspect-[4/3] relative bg-secondary-100">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-secondary-300" />
                  </div>
                )}
              </div>

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Hauptbild
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className="p-1.5 bg-white rounded-full shadow hover:bg-secondary-50"
                    title="Als Hauptbild festlegen"
                  >
                    <Star className="h-4 w-4 text-secondary-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-white rounded-full shadow hover:bg-red-50"
                  title="Bild entfernen"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>

              {/* Alt Text Input */}
              <div className="p-2 bg-white">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Bildbeschreibung"
                  className="w-full text-xs px-2 py-1 border border-secondary-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-center text-secondary-400 text-sm">
          Noch keine Bilder hochgeladen
        </p>
      )}
    </div>
  )
}
