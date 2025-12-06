export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { BlogEditor } from '@/components/admin/BlogEditor'
import { SupabaseBlogService } from '@/lib/services/supabase/SupabaseBlogService'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BearbeiteArtikelPage({ params }: PageProps) {
  const { id } = await params
  const blogService = new SupabaseBlogService()
  const [post, categories] = await Promise.all([
    blogService.getById(id),
    blogService.getCategories(),
  ])

  if (!post) {
    notFound()
  }

  return <BlogEditor post={post} categories={categories} isEditing />
}
