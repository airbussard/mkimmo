export type BlogPostStatus = 'draft' | 'published'

export const BLOG_POST_STATUS_NAMEN: Record<BlogPostStatus, string> = {
  draft: 'Entwurf',
  published: 'Veröffentlicht',
}

export interface BlogPost {
  id: string
  titel: string
  slug: string
  inhalt: string
  kurzBeschreibung: string
  autor: string
  bild?: string
  status: BlogPostStatus
  erstelltAm: string
  veroeffentlichtAm?: string
}
