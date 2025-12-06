import { BlogEditor } from '@/components/admin/BlogEditor'
import { SupabaseBlogService } from '@/lib/services/supabase/SupabaseBlogService'

export default async function NeuerArtikelPage() {
  const blogService = new SupabaseBlogService()
  const categories = await blogService.getCategories()

  return <BlogEditor categories={categories} />
}
