import { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { BlogCard } from '@/components/blog/BlogCard'
import { serviceFactory } from '@/lib/services/ServiceFactory'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog - Immobilien-Ratgeber',
  description:
    'Tipps und Ratgeber rund um Immobilien: Kauf, Verkauf, Finanzierung und mehr.',
}

export default async function MaklerBlogPage() {
  const blogService = serviceFactory.getBlogService()
  const posts = await blogService.getPublished()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-secondary-900">Blog</h1>
        </div>
        <p className="text-secondary-600">
          Tipps, Ratgeber und Neuigkeiten rund um Immobilien in Eschweiler und der Region.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} basePath="/makler/blog" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-secondary-500">
            Aktuell sind keine Blog-Beiträge verfügbar. Schauen Sie bald wieder vorbei!
          </p>
        </div>
      )}
    </div>
  )
}
