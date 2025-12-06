import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// Check if user is authenticated
async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Artikel' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const user = await checkAuth()
  if (!user) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { titel, slug, inhalt, kurzBeschreibung, autor, bild, kategorieId, status } = body

    if (!titel || !slug) {
      return NextResponse.json(
        { error: 'Titel und Slug sind erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const insertData: Record<string, unknown> = {
      title: titel,
      slug: slug,
      content: inhalt || null,
      excerpt: kurzBeschreibung || null,
      author: autor || null,
      image: bild || null,
      category_id: kategorieId || null,
      status: status || 'draft',
    }

    // Set published_at if status is published
    if (status === 'published') {
      insertData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select('*, blog_categories(*)')
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json(
        { error: error.message || 'Fehler beim Erstellen' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Serverfehler' },
      { status: 500 }
    )
  }
}
