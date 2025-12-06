import { NextResponse } from 'next/server'
import { SupabaseBlogService } from '@/lib/services/supabase/SupabaseBlogService'
import { BlogPost } from '@/types/blog'

export async function GET() {
  const blogService = new SupabaseBlogService()

  let allPosts: BlogPost[] = []
  let publishedPosts: BlogPost[] = []
  let error: string | null = null

  try {
    allPosts = await blogService.getAll()
    publishedPosts = await blogService.getPublished()
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      NEXT_PUBLIC_DATA_PROVIDER: process.env.NEXT_PUBLIC_DATA_PROVIDER || 'NOT SET',
    },
    blog: {
      allPostsCount: allPosts.length,
      publishedPostsCount: publishedPosts.length,
      allPosts: allPosts.map(p => ({ id: p.id, titel: p.titel, status: p.status })),
      publishedPosts: publishedPosts.map(p => ({ id: p.id, titel: p.titel, status: p.status })),
    },
    error,
  })
}
