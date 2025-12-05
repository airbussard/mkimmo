import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { BlogPost } from '@/types/blog'

interface BlogContentProps {
  post: BlogPost
  backLink: string // '/makler/blog' oder '/hausverwaltung/blog'
}

export function BlogContent({ post, backLink }: BlogContentProps) {
  const formattedDate = new Date(post.erstelltAm).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Einfache Markdown-ähnliche Formatierung für Überschriften
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold text-secondary-900 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        )
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-secondary-900 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        )
      }
      if (line.trim() === '') {
        return <br key={index} />
      }
      return (
        <p key={index} className="text-secondary-700 leading-relaxed mb-4">
          {line}
        </p>
      )
    })
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        href={backLink}
        className="inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      {post.bild && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.bild}
            alt={post.titel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">{post.titel}</h1>
        <div className="flex items-center gap-4 text-sm text-secondary-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.autor}
          </span>
        </div>
      </header>

      <div className="prose prose-secondary max-w-none">{formatContent(post.inhalt)}</div>

      <footer className="mt-12 pt-8 border-t border-secondary-200">
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Weitere Artikel lesen
        </Link>
      </footer>
    </article>
  )
}
