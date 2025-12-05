import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide'
}

export function ImagePlaceholder({ className, aspectRatio = 'video' }: ImagePlaceholderProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  }

  return (
    <div
      className={cn(
        'bg-secondary-100 flex items-center justify-center rounded-lg',
        aspectClasses[aspectRatio],
        className
      )}
    >
      <div className="text-center text-secondary-400">
        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
        <span className="text-sm">Bild</span>
      </div>
    </div>
  )
}
