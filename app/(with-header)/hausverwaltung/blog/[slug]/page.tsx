import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogContent } from '@/components/blog/BlogContent'
import { serviceFactory } from '@/lib/services/ServiceFactory'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blogService = serviceFactory.getBlogService()
  const post = await blogService.getBySlug(params.slug)

  if (!post) {
    return { title: 'Beitrag nicht gefunden' }
  }

  return {
    title: post.titel,
    description: post.kurzBeschreibung,
  }
}

export default async function HausverwaltungBlogPostPage({ params }: BlogPostPageProps) {
  const blogService = serviceFactory.getBlogService()
  const post = await blogService.getBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogContent post={post} backLink="/hausverwaltung/blog" />
    </div>
  )
}
