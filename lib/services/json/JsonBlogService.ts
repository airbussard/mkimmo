import { IBlogService } from '../interfaces/IBlogService'
import { BlogPost } from '@/types/blog'
import blogData from '@/data/blog.json'

export class JsonBlogService implements IBlogService {
  private posts: BlogPost[]

  constructor() {
    this.posts = blogData as BlogPost[]
  }

  async getAll(): Promise<BlogPost[]> {
    return this.posts
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return this.posts.find((p) => p.slug === slug) || null
  }

  async getPublished(): Promise<BlogPost[]> {
    return this.posts
      .filter((p) => p.status === 'published')
      .sort((a, b) => new Date(b.erstelltAm).getTime() - new Date(a.erstelltAm).getTime())
  }
}
