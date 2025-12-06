import { BlogPost, BlogCategory } from '@/types/blog'

export interface IBlogService {
  // Posts
  getAll(): Promise<BlogPost[]>
  getById(id: string): Promise<BlogPost | null>
  getBySlug(slug: string): Promise<BlogPost | null>
  getPublished(): Promise<BlogPost[]>

  // Categories
  getCategories(): Promise<BlogCategory[]>
}
