import { BlogPost } from '@/types/blog'

export interface IBlogService {
  getAll(): Promise<BlogPost[]>
  getBySlug(slug: string): Promise<BlogPost | null>
  getPublished(): Promise<BlogPost[]>
}
