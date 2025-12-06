'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { PropertyImage } from '@/types/property'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  bilder: PropertyImage[]
  titel: string
}

export function PropertyGallery({ bilder, titel }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? bilder.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === bilder.length - 1 ? 0 : prev + 1))
  }

  if (bilder.length === 0) {
    return <ImagePlaceholder aspectRatio="video" className="w-full" />
  }

  const currentImage = bilder[currentIndex]

  return (
    <div className="space-y-4">
      {/* Hauptbild */}
      <div className="relative aspect-video bg-secondary-100 rounded-lg overflow-hidden">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || `${titel} - Bild ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />

        {bilder.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={goToPrevious}
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={goToNext}
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Bild-Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {bilder.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {bilder.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {bilder.map((bild, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative',
                currentIndex === index ? 'border-primary-600' : 'border-transparent hover:border-secondary-300'
              )}
              aria-label={`Bild ${index + 1} anzeigen`}
            >
              <Image
                src={bild.url}
                alt={bild.alt || `${titel} - Bild ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
