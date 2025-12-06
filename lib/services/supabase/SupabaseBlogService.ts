import { createClient } from '@/lib/supabase/client'
import { BlogPost, BlogCategory, BlogPostStatus } from '@/types/blog'
import { IBlogService } from '../interfaces/IBlogService'

// Supabase DB Row Types
interface BlogPostRow {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  author: string | null
  image: string | null
  category_id: string | null
  status: string
  created_at: string
  published_at: string | null
  updated_at: string
  // Joined category
  blog_categories?: {
    id: string
    name: string
    slug: string
  } | null
}

interface BlogCategoryRow {
  id: string
  name: string
  slug: string
  created_at: string
}

// Mapping functions
function mapRowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    titel: row.title,
    slug: row.slug,
    inhalt: row.content || '',
    kurzBeschreibung: row.excerpt || '',
    autor: row.author || '',
    bild: row.image || undefined,
    kategorieId: row.category_id || undefined,
    kategorie: row.blog_categories
      ? {
          id: row.blog_categories.id,
          name: row.blog_categories.name,
          slug: row.blog_categories.slug,
        }
      : undefined,
    status: (row.status || 'draft') as BlogPostStatus,
    erstelltAm: row.created_at,
    veroeffentlichtAm: row.published_at || undefined,
    aktualisiertAm: row.updated_at,
  }
}

function mapRowToCategory(row: BlogCategoryRow): BlogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  }
}

function mapPostToRow(post: Partial<BlogPost>): Record<string, unknown> {
  const row: Record<string, unknown> = {}

  if (post.titel !== undefined) row.title = post.titel
  if (post.slug !== undefined) row.slug = post.slug
  if (post.inhalt !== undefined) row.content = post.inhalt
  if (post.kurzBeschreibung !== undefined) row.excerpt = post.kurzBeschreibung
  if (post.autor !== undefined) row.author = post.autor
  if (post.bild !== undefined) row.image = post.bild
  if (post.kategorieId !== undefined) row.category_id = post.kategorieId || null
  if (post.status !== undefined) row.status = post.status
  if (post.veroeffentlichtAm !== undefined) row.published_at = post.veroeffentlichtAm

  return row
}

export class SupabaseBlogService implements IBlogService {
  private getSupabase() {
    return createClient()
  }

  // ============================================
  // Posts - Read
  // ============================================

  async getAll(): Promise<BlogPost[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }

    return (data || []).map(mapRowToPost)
  }

  async getById(id: string): Promise<BlogPost | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching blog post by id:', error)
      return null
    }

    return mapRowToPost(data)
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('Error fetching blog post by slug:', error)
      return null
    }

    return mapRowToPost(data)
  }

  async getPublished(): Promise<BlogPost[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching published blog posts:', error)
      return []
    }

    return (data || []).map(mapRowToPost)
  }

  // ============================================
  // Categories
  // ============================================

  async getCategories(): Promise<BlogCategory[]> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching blog categories:', error)
      return []
    }

    return (data || []).map(mapRowToCategory)
  }

  // ============================================
  // CRUD Methods for Admin
  // ============================================

  async create(post: Omit<BlogPost, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<BlogPost | null> {
    const supabase = this.getSupabase()
    const row = mapPostToRow(post as Partial<BlogPost>)

    // Set published_at if status is published
    if (post.status === 'published' && !row.published_at) {
      row.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(row)
      .select('*, blog_categories(*)')
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToPost(data) : null
  }

  async update(id: string, post: Partial<BlogPost>): Promise<BlogPost | null> {
    const supabase = this.getSupabase()
    const row = mapPostToRow(post)

    // Set published_at if changing to published
    if (post.status === 'published') {
      const existing = await this.getById(id)
      if (existing && existing.status !== 'published') {
        row.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(row)
      .eq('id', id)
      .select('*, blog_categories(*)')
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToPost(data) : null
  }

  async delete(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return false
    }

    return true
  }

  // ============================================
  // Category CRUD
  // ============================================

  async createCategory(category: Omit<BlogCategory, 'id'>): Promise<BlogCategory | null> {
    const supabase = this.getSupabase()
    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name: category.name, slug: category.slug })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToCategory(data) : null
  }

  async updateCategory(id: string, category: Partial<BlogCategory>): Promise<BlogCategory | null> {
    const supabase = this.getSupabase()
    const row: Record<string, unknown> = {}
    if (category.name !== undefined) row.name = category.name
    if (category.slug !== undefined) row.slug = category.slug

    const { data, error } = await supabase
      .from('blog_categories')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      throw new Error(error.message)
    }

    return data ? mapRowToCategory(data) : null
  }

  async deleteCategory(id: string): Promise<boolean> {
    const supabase = this.getSupabase()
    const { error } = await supabase.from('blog_categories').delete().eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return false
    }

    return true
  }
}
