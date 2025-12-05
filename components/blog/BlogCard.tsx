import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
  basePath: string // '/makler/blog' oder '/hausverwaltung/blog'
}

export function BlogCard({ post, basePath }: BlogCardProps) {
  const formattedDate = new Date(post.erstelltAm).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.bild && (
        <div className="relative h-48 bg-secondary-100">
          <Image
            src={post.bild}
            alt={post.titel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {!post.bild && (
        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <span className="text-6xl text-primary-300">MK</span>
        </div>
      )}
      <CardHeader className="pb-2">
        <Link
          href={`${basePath}/${post.slug}`}
          className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2"
        >
          {post.titel}
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary-600 text-sm line-clamp-3">{post.kurzBeschreibung}</p>
        <div className="flex items-center justify-between text-xs text-secondary-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {post.autor}
            </span>
          </div>
        </div>
        <Link
          href={`${basePath}/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Weiterlesen
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
